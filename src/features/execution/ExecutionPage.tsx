import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { audioService } from '../../services/audio/audioService'
import { useAppStore } from '../../state/useAppStore'
import type {
  AppSettings,
  AudioEventType,
  ExecutionHistory,
  Protocol,
  Step,
} from '../../types/domain'
import { formatClock, formatDurationLabel } from '../../utils/format'
import { computeProtocolTotalSeconds, createId, resolveAudioMessage } from '../../utils/protocols'

type RunStatus = 'preparing' | 'running' | 'paused' | 'finished'

interface WakeLockCapable {
  wakeLock?: {
    request: (type: 'screen') => Promise<{ release: () => Promise<void> }>
  }
}

export function ExecutionPage() {
  const navigate = useNavigate()
  const { protocolId } = useParams()
  const protocols = useAppStore((state) => state.protocols)
  const settings = useAppStore((state) => state.settings)
  const addHistory = useAppStore((state) => state.addHistory)
  const protocol = useMemo(
    () => protocols.find((item) => item.id === protocolId) ?? null,
    [protocolId, protocols],
  )

  if (!protocol) {
    return (
      <div className="execution-screen">
        <div className="execution-shell">
          <div className="execution-card empty-state">
            <h2>Protocolo nao encontrado</h2>
            <Button onClick={() => navigate('/')}>Voltar para biblioteca</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ExecutionRunner
      key={protocol.id}
      addHistory={addHistory}
      navigateTo={navigate}
      protocol={protocol}
      settings={settings}
    />
  )
}

interface ExecutionRunnerProps {
  addHistory: (entry: ExecutionHistory) => void
  navigateTo: ReturnType<typeof useNavigate>
  protocol: Protocol
  settings: AppSettings
}

function ExecutionRunner({
  addHistory,
  navigateTo,
  protocol,
  settings,
}: ExecutionRunnerProps) {
  const totalProtocolSeconds = computeProtocolTotalSeconds(protocol)
  const [status, setStatus] = useState<RunStatus>('preparing')
  const [prepCount, setPrepCount] = useState(3)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(
    protocol.steps[0]?.durationSeconds ? protocol.steps[0].durationSeconds * 1000 : 0,
  )
  const [finishedMessage, setFinishedMessage] = useState('Treino finalizado.')
  const [sessionStartedAt, setSessionStartedAt] = useState(() => new Date().toISOString())
  const lastTickRef = useRef<number | null>(null)
  const spokenKeysRef = useRef<Set<string>>(new Set())
  const historyWrittenRef = useRef(false)
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)
  const currentStep = protocol.steps[currentStepIndex]

  const elapsedProtocolSeconds =
    protocol.steps
      .slice(0, currentStepIndex)
      .reduce((sum, step) => sum + step.durationSeconds, 0) +
    Math.floor((currentStep.durationSeconds * 1000 - remainingMs) / 1000)

  const protocolProgress =
    totalProtocolSeconds === 0
      ? 0
      : Math.min(100, (elapsedProtocolSeconds / totalProtocolSeconds) * 100)
  const stepProgress =
    currentStep.durationSeconds === 0
      ? 0
      : Math.min(
          100,
          ((currentStep.durationSeconds * 1000 - remainingMs) /
            (currentStep.durationSeconds * 1000)) *
            100,
        )
  const ringStyle = {
    '--progress': `${status === 'preparing' ? 0 : stepProgress}`,
  } as CSSProperties & { '--progress': string }

  const playProtocolEvent = useCallback(
    (
      eventType: AudioEventType,
      step: Step,
      replacements: Record<string, string | number>,
    ) => {
      const event = protocol.audioEvents.find((item) => item.eventType === eventType)

      if (!event || !event.enabled || !protocol.audioEnabled) {
        return
      }

      const message = resolveAudioMessage(protocol, eventType, replacements)

      audioService.play({
        message,
        soundType: event.soundType,
        volume: settings.defaultVolume,
        vibrate: step.vibrationEnabled,
        customAudioDataUrl: event.customAudioDataUrl,
        voicePreset: protocol.voicePack,
      })
    },
    [protocol, settings.defaultVolume],
  )

  const writeHistory = useCallback(
    (statusValue: 'completed' | 'interrupted', interruptedAtStep?: string) => {
      if (historyWrittenRef.current) {
        return
      }

      historyWrittenRef.current = true

      addHistory({
        id: createId(),
        protocolId: protocol.id,
        protocolName: protocol.name,
        startedAt: sessionStartedAt,
        finishedAt: new Date().toISOString(),
        status: statusValue,
        totalDurationSeconds: Math.max(1, elapsedProtocolSeconds),
        completedSteps:
          statusValue === 'completed'
            ? protocol.steps.length
            : Math.min(currentStepIndex, protocol.steps.length),
        interruptedAtStep,
      })
    },
    [
      addHistory,
      currentStepIndex,
      elapsedProtocolSeconds,
      protocol.id,
      protocol.name,
      protocol.steps.length,
      sessionStartedAt,
    ],
  )

  const startStep = useCallback(
    (stepIndex: number) => {
      const nextStep = protocol.steps[stepIndex]

      if (!nextStep) {
        return
      }

      setCurrentStepIndex(stepIndex)
      setRemainingMs(nextStep.durationSeconds * 1000)
      setStatus('running')
      lastTickRef.current = Date.now()
      spokenKeysRef.current = new Set()

      const eventType =
        nextStep.type === 'pause' || nextStep.type === 'rest'
          ? 'REST_START'
          : nextStep.type === 'roll'
            ? stepIndex === protocol.steps.length - 1
              ? 'LAST_ROUND_START'
              : 'ROUND_START'
            : 'STEP_START'

      playProtocolEvent(eventType, nextStep, {
        etapa_atual: nextStep.name,
        proxima_etapa: protocol.steps[stepIndex + 1]?.name ?? 'Final do treino',
        tempo_restante: nextStep.durationSeconds,
        round_atual: stepIndex + 1,
        total_rounds: protocol.steps.length,
      })
    },
    [playProtocolEvent, protocol],
  )

  const advanceToNextStep = useCallback(() => {
    const nextStepIndex = currentStepIndex + 1

    if (nextStepIndex >= protocol.steps.length) {
      setFinishedMessage('Boa. Treino finalizado.')
      setStatus('finished')
      playProtocolEvent('PROTOCOL_END', currentStep, {})
      writeHistory('completed')
      return
    }

    playProtocolEvent('STEP_TRANSITION', currentStep, {
      etapa_atual: currentStep.name,
      proxima_etapa: protocol.steps[nextStepIndex]?.name ?? 'Final do treino',
    })

    window.setTimeout(() => startStep(nextStepIndex), 160)
  }, [currentStep, currentStepIndex, playProtocolEvent, protocol.steps, startStep, writeHistory])

  useEffect(() => {
    const preStartEvent = protocol.audioEvents.find((event) => event.eventType === 'PROTOCOL_PRE_START')
    const preStartMessage = resolveAudioMessage(protocol, 'PROTOCOL_PRE_START', {})

    audioService.play({
      message: preStartMessage,
      soundType: preStartEvent?.soundType ?? 'none',
      volume: settings.defaultVolume,
      customAudioDataUrl: preStartEvent?.customAudioDataUrl,
      voicePreset: protocol.voicePack,
    })

    const intervalId = window.setInterval(() => {
      setPrepCount((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(intervalId)
          startStep(0)
          return 0
        }

        return currentValue - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
      audioService.stop()
    }
  }, [protocol, settings.defaultVolume, startStep])

  useEffect(() => {
    const canKeepScreenOn = protocol.keepScreenOn || settings.keepScreenOn

    if (!canKeepScreenOn) {
      return
    }

    const wakeLockApi = (navigator as Navigator & WakeLockCapable).wakeLock

    if (!wakeLockApi) {
      return
    }

    void wakeLockApi
      .request('screen')
      .then((lock) => {
        wakeLockRef.current = lock
      })
      .catch(() => {
        wakeLockRef.current = null
      })

    return () => {
      void wakeLockRef.current?.release()
    }
  }, [protocol.keepScreenOn, settings.keepScreenOn])

  useEffect(() => {
    if (status !== 'running') {
      return
    }

    lastTickRef.current = Date.now()

    const intervalId = window.setInterval(() => {
      const now = Date.now()
      const previousTick = lastTickRef.current ?? now
      const delta = now - previousTick
      lastTickRef.current = now

      setRemainingMs((currentValue) => {
        const nextValue = Math.max(0, currentValue - delta)

        if (nextValue > 0) {
          return nextValue
        }

        window.clearInterval(intervalId)

        playProtocolEvent('STEP_END', currentStep, {
          etapa_atual: currentStep.name,
          proxima_etapa: protocol.steps[currentStepIndex + 1]?.name ?? 'Final do treino',
          tempo_restante: 0,
          round_atual: currentStepIndex + 1,
          total_rounds: protocol.steps.length,
        })

        if (!currentStep.autoNext) {
          setStatus('paused')
          return 0
        }

        advanceToNextStep()
        return 0
      })
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [
    advanceToNextStep,
    currentStep,
    currentStep.autoNext,
    currentStepIndex,
    playProtocolEvent,
    protocol.steps,
    status,
  ])

  useEffect(() => {
    if (status !== 'running') {
      return
    }

    const secondsRemaining = Math.ceil(remainingMs / 1000)
    const stepPrefix = `${currentStep.id}-${currentStepIndex}`
    const audioEventMap: Array<[number, AudioEventType]> = [
      [
        10,
        currentStep.type === 'pause' || currentStep.type === 'rest'
          ? 'REST_WARNING'
          : 'STEP_WARNING_10',
      ],
      [5, 'STEP_WARNING_5'],
      [3, 'STEP_COUNTDOWN_3'],
      [2, 'STEP_COUNTDOWN_2'],
      [1, 'STEP_COUNTDOWN_1'],
    ]

    audioEventMap.forEach(([threshold, eventType]) => {
      const eventKey = `${stepPrefix}-${eventType}`

      if (secondsRemaining !== threshold || spokenKeysRef.current.has(eventKey)) {
        return
      }

      spokenKeysRef.current.add(eventKey)
      playProtocolEvent(eventType, currentStep, {
        etapa_atual: currentStep.name,
        tempo_restante: secondsRemaining,
        proxima_etapa: protocol.steps[currentStepIndex + 1]?.name ?? 'Final do treino',
        round_atual: currentStepIndex + 1,
        total_rounds: protocol.steps.length,
      })
    })
  }, [currentStep, currentStepIndex, playProtocolEvent, protocol.steps, remainingMs, status])

  function pauseOrResume() {
    if (status === 'running') {
      setStatus('paused')
      audioService.stop()
      return
    }

    if (status === 'paused') {
      lastTickRef.current = Date.now()
      setStatus('running')
    }
  }

  function goToPreviousStep() {
    const previousStepIndex = Math.max(0, currentStepIndex - 1)
    startStep(previousStepIndex)
  }

  function restartProtocol() {
    historyWrittenRef.current = false
    spokenKeysRef.current = new Set()
    setSessionStartedAt(new Date().toISOString())
    setFinishedMessage('Treino reiniciado.')
    setPrepCount(3)
    startStep(0)
  }

  function finishProtocol() {
    setFinishedMessage('Treino encerrado manualmente.')
    setStatus('finished')
    playProtocolEvent('PROTOCOL_CANCELLED', currentStep, {})
    writeHistory('interrupted', currentStep.name)
  }

  return (
    <div className="execution-screen">
      <div className="execution-shell">
        <header className="execution-card execution-stage execution-stage--top">
          <div>
            <p className="eyebrow">Modo tatame</p>
            <h1 className="execution-step-name">{protocol.name}</h1>
            <p className="muted execution-next-step">
              Proxima etapa: {protocol.steps[currentStepIndex + 1]?.name ?? 'Final do protocolo'}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigateTo('/')}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
        </header>

        {status === 'finished' ? (
          <div className="execution-card execution-finish">
            <p className="eyebrow">Sessao encerrada</p>
            <h2 className="execution-step-name">{finishedMessage}</h2>
            <p style={{ color: 'rgba(239, 246, 255, 0.72)' }}>
              Tempo executado: {formatDurationLabel(elapsedProtocolSeconds)}
            </p>
            <div className="grid-actions">
              <Button onClick={restartProtocol}>
                <RotateCcw size={16} />
                Reiniciar
              </Button>
              <Button variant="ghost" onClick={() => navigateTo('/')}>
                Biblioteca
              </Button>
            </div>
          </div>
        ) : (
          <>
            <section className="execution-card execution-highlight">
              <div className="execution-stage">
                <div>
                  <p className="eyebrow">
                    {status === 'preparing'
                      ? 'Preparando'
                      : status === 'paused'
                        ? 'Pausado'
                        : currentStep.type === 'pause' || currentStep.type === 'rest'
                          ? 'Pausa'
                          : 'Valendo'}
                  </p>
                  <h2 className="execution-step-name">{currentStep.name}</h2>
                </div>
                <div className="chip-row">
                  <span className="chip execution-chip">
                    <Volume2 size={14} />
                    {protocol.audioEnabled ? 'Audio ativo' : 'Sem audio'}
                  </span>
                </div>
              </div>

              <div className="execution-ring" style={ringStyle}>
                <div className="execution-ring__inner">
                  <p className="execution-ring__label">
                    {status === 'preparing' ? 'Comecando em' : 'Tempo restante'}
                  </p>
                  <div className="execution-clock">
                    {status === 'preparing' ? prepCount : formatClock(Math.ceil(remainingMs / 1000))}
                  </div>
                  <p className="execution-ring__cta">
                    {status === 'paused'
                      ? 'Toque em continuar para retomar'
                      : `Etapa de ${formatDurationLabel(currentStep.durationSeconds)}`}
                  </p>
                </div>
              </div>

              <div className="execution-meta-grid">
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Etapa</span>
                  <strong>{Math.round(stepProgress)}%</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Treino</span>
                  <strong>{Math.round(protocolProgress)}%</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Restante</span>
                  <strong>{formatClock(Math.max(0, totalProtocolSeconds - elapsedProtocolSeconds))}</strong>
                </div>
              </div>
            </section>

            <section className="execution-card">
              <div className="execution-controls execution-controls--round">
                <Button variant="secondary" onClick={pauseOrResume}>
                  {status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
                  {status === 'paused' ? 'Continuar' : 'Pausar'}
                </Button>
                <Button variant="ghost" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
                  <ArrowLeft size={16} />
                  Voltar
                </Button>
                <Button variant="ghost" onClick={advanceToNextStep}>
                  <ArrowRight size={16} />
                  Proxima
                </Button>
                <Button variant="ghost" onClick={restartProtocol}>
                  <RotateCcw size={16} />
                  Reiniciar
                </Button>
                <Button variant="danger" onClick={finishProtocol}>
                  <Square size={16} />
                  Finalizar
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
