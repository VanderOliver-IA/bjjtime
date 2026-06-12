import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { APP_VERSION } from '../../app/meta'
import { AppBottomNav } from '../../components/ui/AppBottomNav'
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
import {
  computeProtocolTotalSeconds,
  createId,
  pickVoiceProfilePhrase,
  resolveAudioMessage,
} from '../../utils/protocols'

type RunStatus = 'idle' | 'running' | 'paused' | 'finished'

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
  const voiceProfiles = useAppStore((state) => state.voiceProfiles)
  const history = useAppStore((state) => state.history)
  const addHistory = useAppStore((state) => state.addHistory)
  const protocol = useMemo(
    () => protocols.find((item) => item.id === protocolId) ?? null,
    [protocolId, protocols],
  )
  const orderedProtocols = useMemo(() => {
    return [...protocols].sort((left, right) => {
      const leftHistoryIndex = history.findIndex((entry) => entry.protocolId === left.id)
      const rightHistoryIndex = history.findIndex((entry) => entry.protocolId === right.id)

      if (leftHistoryIndex !== rightHistoryIndex) {
        if (leftHistoryIndex === -1) {
          return 1
        }

        if (rightHistoryIndex === -1) {
          return -1
        }

        return leftHistoryIndex - rightHistoryIndex
      }

      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })
  }, [history, protocols])

  if (!protocol) {
    return (
      <div className="execution-screen">
        <div className="execution-shell">
          <div className="execution-card empty-state">
            <h2>Protocolo nao encontrado</h2>
            <Button onClick={() => navigate('/library')}>Voltar para biblioteca</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ExecutionRunner
      key={protocol.id}
      addHistory={addHistory}
      availableProtocols={orderedProtocols}
      navigateTo={navigate}
      protocol={protocol}
      settings={settings}
      voiceProfiles={voiceProfiles}
    />
  )
}

interface ExecutionRunnerProps {
  addHistory: (entry: ExecutionHistory) => void
  availableProtocols: Protocol[]
  navigateTo: ReturnType<typeof useNavigate>
  protocol: Protocol
  settings: AppSettings
  voiceProfiles: ReturnType<typeof useAppStore.getState>['voiceProfiles']
}

function ExecutionRunner({
  addHistory,
  availableProtocols,
  navigateTo,
  protocol,
  settings,
  voiceProfiles,
}: ExecutionRunnerProps) {
  const totalProtocolSeconds = computeProtocolTotalSeconds(protocol)
  const initialStepDurationMs = (protocol.steps[0]?.durationSeconds ?? 0) * 1000
  const [status, setStatus] = useState<RunStatus>('idle')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(initialStepDurationMs)
  const [finishedMessage, setFinishedMessage] = useState('Treino finalizado.')
  const [audioEnabled, setAudioEnabled] = useState(protocol.audioEnabled)
  const sessionStartedAtRef = useRef<string | null>(null)
  const audioEnabledRef = useRef(protocol.audioEnabled)
  const spokenKeysRef = useRef<Set<string>>(new Set())
  const historyWrittenRef = useRef(false)
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)
  const stepDeadlineRef = useRef<number | null>(null)
  const previousMsRef = useRef(initialStepDurationMs)
  const advanceTimeoutRef = useRef<number | null>(null)
  const currentStep = protocol.steps[currentStepIndex]

  const elapsedProtocolSeconds =
    status === 'finished'
      ? totalProtocolSeconds
      : protocol.steps
          .slice(0, currentStepIndex)
          .reduce((sum, step) => sum + step.durationSeconds, 0) +
        Math.max(0, Math.floor((currentStep.durationSeconds * 1000 - remainingMs) / 1000))

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
    '--progress': `${status === 'idle' ? 0 : stepProgress}`,
  } as CSSProperties & { '--progress': string }

  const buildReplacements = useCallback(
    (stepIndex: number, secondsRemaining: number) => ({
      etapa_atual: protocol.steps[stepIndex]?.name ?? 'Etapa atual',
      proxima_etapa: protocol.steps[stepIndex + 1]?.name ?? 'Final do treino',
      tempo_restante: secondsRemaining,
      round_atual: stepIndex + 1,
      total_rounds: protocol.steps.length,
    }),
    [protocol.steps],
  )

  const resolveStepStartEvent = useCallback(
    (step: Step, stepIndex: number): AudioEventType => {
      if (step.type === 'pause' || step.type === 'rest') {
        return 'REST_START'
      }

      if (step.type === 'roll') {
        return stepIndex === protocol.steps.length - 1 ? 'LAST_ROUND_START' : 'ROUND_START'
      }

      return 'STEP_START'
    },
    [protocol.steps.length],
  )

  const playProtocolEvent = useCallback(
    (
      eventType: AudioEventType,
      step: Step,
      replacements: Record<string, string | number>,
    ) => {
      const event = protocol.audioEvents.find((item) => item.eventType === eventType)

      if (!event || !event.enabled || !audioEnabledRef.current) {
        return false
      }

      const profilePhrase = pickVoiceProfilePhrase(voiceProfiles, protocol.voicePack, eventType)
      const message = profilePhrase?.messageText
        ? Object.entries(replacements).reduce((currentMessage, [token, value]) => {
            return currentMessage.replaceAll(`{${token}}`, String(value))
          }, profilePhrase.messageText)
        : resolveAudioMessage(protocol, eventType, replacements)

      audioService.play({
        message,
        soundType: event.soundType,
        volume: settings.defaultVolume,
        vibrate: step.vibrationEnabled,
        customAudioDataUrl: event.customAudioDataUrl ?? profilePhrase?.audioDataUrl ?? null,
        voicePreset: protocol.voicePack.startsWith('profile:')
          ? settings.defaultVoice
          : protocol.voicePack,
      })

      return true
    },
    [protocol, settings.defaultVoice, settings.defaultVolume, voiceProfiles],
  )

  const writeHistory = useCallback(
    (statusValue: 'completed' | 'interrupted', interruptedAtStep?: string) => {
      if (historyWrittenRef.current || !sessionStartedAtRef.current) {
        return
      }

      historyWrittenRef.current = true

      addHistory({
        id: createId(),
        protocolId: protocol.id,
        protocolName: protocol.name,
        startedAt: sessionStartedAtRef.current,
        finishedAt: new Date().toISOString(),
        status: statusValue,
        totalDurationSeconds: Math.max(1, elapsedProtocolSeconds),
        completedSteps:
          statusValue === 'completed'
            ? protocol.steps.length
            : Math.min(currentStepIndex + (remainingMs <= 0 ? 1 : 0), protocol.steps.length),
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
      remainingMs,
    ],
  )

  const triggerStepWarnings = useCallback(
    (previousMs: number, nextMs: number, stepIndex: number) => {
      const step = protocol.steps[stepIndex]

      if (!step || !audioEnabledRef.current) {
        return
      }

      const isRestStep = step.type === 'pause' || step.type === 'rest'
      const timedEvents = protocol.audioEvents.filter((event) => {
        if (!event.enabled || event.triggerSecondsBeforeEnd === undefined) {
          return false
        }

        if (isRestStep) {
          return (
            event.eventType === 'REST_WARNING' ||
            event.eventType === 'STEP_COUNTDOWN_3' ||
            event.eventType === 'STEP_COUNTDOWN_2' ||
            event.eventType === 'STEP_COUNTDOWN_1'
          )
        }

        return (
          event.eventType === 'STEP_WARNING_30' ||
          event.eventType === 'STEP_WARNING_20' ||
          event.eventType === 'STEP_WARNING_10' ||
          event.eventType === 'STEP_WARNING_5' ||
          event.eventType === 'STEP_COUNTDOWN_3' ||
          event.eventType === 'STEP_COUNTDOWN_2' ||
          event.eventType === 'STEP_COUNTDOWN_1'
        )
      })

      timedEvents.forEach((event) => {
        const threshold = event.triggerSecondsBeforeEnd ?? 0
        const leadMs =
          event.eventType === 'STEP_COUNTDOWN_3' ||
          event.eventType === 'STEP_COUNTDOWN_2' ||
          event.eventType === 'STEP_COUNTDOWN_1'
            ? 140
            : 220
        const thresholdMs = threshold * 1000 + leadMs
        const eventKey = `${step.id}-${stepIndex}-${event.eventType}`

        if (spokenKeysRef.current.has(eventKey)) {
          return
        }

        if (previousMs >= thresholdMs && nextMs < thresholdMs) {
          spokenKeysRef.current.add(eventKey)
          playProtocolEvent(
            event.eventType,
            step,
            buildReplacements(stepIndex, Math.max(0, Math.ceil(nextMs / 1000))),
          )
        }
      })
    },
    [buildReplacements, playProtocolEvent, protocol.audioEvents, protocol.steps],
  )

  const previewStep = useCallback(
    (stepIndex: number, nextStatus: 'idle' | 'paused' = 'paused') => {
      const nextStep = protocol.steps[stepIndex]

      if (!nextStep) {
        return
      }

      stepDeadlineRef.current = null
      spokenKeysRef.current = new Set()
      previousMsRef.current = nextStep.durationSeconds * 1000
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = null
      }
      audioService.stop()
      setCurrentStepIndex(stepIndex)
      setRemainingMs(nextStep.durationSeconds * 1000)
      setStatus(nextStatus)
    },
    [protocol.steps],
  )

  const startRunning = useCallback(
    (stepIndex: number, msRemaining: number, options?: { announce?: boolean; protocolStart?: boolean }) => {
      const step = protocol.steps[stepIndex]

      if (!step) {
        return
      }

      const safeRemaining = Math.max(0, msRemaining)

      setCurrentStepIndex(stepIndex)
      setRemainingMs(safeRemaining)
      setStatus('running')
      spokenKeysRef.current = new Set()
      previousMsRef.current = safeRemaining
      stepDeadlineRef.current = performance.now() + safeRemaining
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = null
      }

      if (!options?.announce) {
        return
      }

      const replacements = buildReplacements(stepIndex, Math.ceil(safeRemaining / 1000))

      if (options.protocolStart) {
        const didPlayProtocolStart = playProtocolEvent('PROTOCOL_START', step, replacements)

        if (!didPlayProtocolStart) {
          playProtocolEvent(resolveStepStartEvent(step, stepIndex), step, replacements)
        }

        return
      }

      playProtocolEvent(resolveStepStartEvent(step, stepIndex), step, replacements)
    },
    [buildReplacements, playProtocolEvent, protocol.steps, resolveStepStartEvent],
  )

  const startProtocol = useCallback(() => {
    sessionStartedAtRef.current = new Date().toISOString()
    historyWrittenRef.current = false
    setFinishedMessage('Treino finalizado.')
    startRunning(0, protocol.steps[0]?.durationSeconds ? protocol.steps[0].durationSeconds * 1000 : 0, {
      announce: true,
      protocolStart: true,
    })
  }, [protocol.steps, startRunning])

  const moveToStep = useCallback(
    (stepIndex: number, keepRunning: boolean) => {
      const nextStep = protocol.steps[stepIndex]

      if (!nextStep) {
        return
      }

      const nextRemainingMs = nextStep.durationSeconds * 1000

      if (keepRunning) {
        startRunning(stepIndex, nextRemainingMs, { announce: true })
        return
      }

      previewStep(stepIndex, status === 'idle' ? 'idle' : 'paused')
    },
    [previewStep, protocol.steps, startRunning, status],
  )

  const advanceToNextStep = useCallback(
    (keepRunning: boolean) => {
      const nextStepIndex = currentStepIndex + 1

      if (nextStepIndex >= protocol.steps.length) {
        audioService.stop()
        setFinishedMessage('Boa. Treino finalizado.')
        setStatus('finished')
        playProtocolEvent('PROTOCOL_END', currentStep, {})
        writeHistory('completed')
        return
      }

      moveToStep(nextStepIndex, keepRunning)
    },
    [currentStep, currentStepIndex, moveToStep, playProtocolEvent, protocol.steps.length, writeHistory],
  )

  useEffect(() => {
    audioEnabledRef.current = audioEnabled
  }, [audioEnabled])

  useEffect(() => {
    return () => {
      audioService.stop()
    }
  }, [])

  useEffect(() => {
    const canKeepScreenOn = protocol.keepScreenOn || settings.keepScreenOn
    const wakeLockApi = (navigator as Navigator & WakeLockCapable).wakeLock

    async function requestWakeLock() {
      if (!wakeLockApi || !canKeepScreenOn) return
      try {
        const lock = await wakeLockApi.request('screen')
        wakeLockRef.current = lock
      } catch {
        wakeLockRef.current = null
      }
    }

    if (canKeepScreenOn && wakeLockApi) {
      void requestWakeLock()
    }

    async function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        if (canKeepScreenOn && wakeLockApi && !wakeLockRef.current) {
          await requestWakeLock()
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
          window.speechSynthesis.resume()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void wakeLockRef.current?.release()
    }
  }, [protocol.keepScreenOn, settings.keepScreenOn])

  useEffect(() => {
    if (status !== 'running') {
      return
    }

    const intervalId = window.setInterval(() => {
      const deadline = stepDeadlineRef.current

      if (!deadline) {
        return
      }

      const nextValue = Math.max(0, deadline - performance.now())
      const prevValue = previousMsRef.current
      previousMsRef.current = nextValue

      triggerStepWarnings(prevValue, nextValue, currentStepIndex)
      setRemainingMs(nextValue)

      if (nextValue <= 0) {
        window.clearInterval(intervalId)
        playProtocolEvent('STEP_END', currentStep, buildReplacements(currentStepIndex, 0))

        if (!currentStep.autoNext) {
          stepDeadlineRef.current = null
          setStatus('paused')
          return
        }

        advanceTimeoutRef.current = window.setTimeout(() => {
          advanceTimeoutRef.current = null
          advanceToNextStep(true)
        }, 220)
      }
    }, 100)

    return () => {
      window.clearInterval(intervalId)
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = null
      }
    }
  }, [
    advanceToNextStep,
    buildReplacements,
    currentStep,
    currentStepIndex,
    playProtocolEvent,
    status,
    triggerStepWarnings,
  ])

  function pauseOrResume() {
    if (status === 'idle') {
      startProtocol()
      return
    }

    if (status === 'running') {
      const deadline = stepDeadlineRef.current
      const pausedRemaining = deadline ? Math.max(0, deadline - performance.now()) : remainingMs

      stepDeadlineRef.current = null
      audioService.stop()
      setRemainingMs(pausedRemaining)
      setStatus('paused')
      return
    }

    if (status === 'paused') {
      if (remainingMs <= 0) {
        advanceToNextStep(true)
        return
      }

      startRunning(currentStepIndex, remainingMs, { announce: true })
    }
  }

  function goToPreviousStep() {
    const previousStepIndex = Math.max(0, currentStepIndex - 1)
    moveToStep(previousStepIndex, status === 'running')
  }

  function restartProtocol() {
    audioService.stop()
    sessionStartedAtRef.current = null
    historyWrittenRef.current = false
    setFinishedMessage('Treino reiniciado.')
    previewStep(0, 'idle')
  }

  function toggleAudio() {
    setAudioEnabled((currentValue) => {
      const nextValue = !currentValue
      audioEnabledRef.current = nextValue

      if (!nextValue) {
        audioService.stop()
      }

      return nextValue
    })
  }

  function finishProtocol() {
    audioService.stop()
    stepDeadlineRef.current = null
    setFinishedMessage('Treino encerrado manualmente.')
    setStatus('finished')
    playProtocolEvent('PROTOCOL_CANCELLED', currentStep, {})
    writeHistory('interrupted', currentStep.name)
  }

  return (
    <div className="execution-screen">
      <div className="execution-shell">
        <header className="execution-card execution-stage execution-stage--top">
          <div className="execution-stage__header">
            <div className="execution-brand">
              <div className="execution-brand__mark">
                <img
                  src={settings.branding.logoDataUrl ?? defaultBrandLogo}
                  alt={`Logo ${settings.branding.title}`}
                />
              </div>
              <div>
                <p className="execution-brand__label">Timer BJJ</p>
              </div>
            </div>

            <button
              className={[
                'chip',
                'execution-chip',
                audioEnabled ? '' : 'execution-chip--muted',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={toggleAudio}
              type="button"
            >
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {audioEnabled ? 'Audio ligado' : 'Audio mutado'}
            </button>
          </div>

          <label className="execution-protocol-picker">
            <span>Escolher protocolo</span>
            <select
              value={protocol.id}
              onChange={(event) => navigateTo(`/protocol/${event.target.value}/run`)}
            >
              {availableProtocols.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
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
                Voltar ao inicio
              </Button>
              <Button variant="ghost" onClick={() => navigateTo('/library')}>
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
                    {status === 'idle'
                      ? 'Pronto'
                      : status === 'paused'
                        ? 'Pausado'
                        : currentStep.type === 'pause' || currentStep.type === 'rest'
                          ? 'Pausa'
                          : 'Valendo'}
                  </p>
                  <p className="execution-protocol-name">{protocol.name}</p>
                  <h2 className="execution-step-name">{currentStep.name}</h2>
                </div>
              </div>

              <div className="execution-ring" style={ringStyle}>
                <div className="execution-ring__inner">
                  <p className="execution-ring__label">
                    {status === 'idle' ? 'Pronto para iniciar' : 'Tempo restante'}
                  </p>
                  <div className="execution-clock notranslate" translate="no">
                    {formatClock(Math.ceil(remainingMs / 1000))}
                  </div>
                  <p className="execution-ring__cta">
                    {status === 'idle'
                      ? 'Toque em iniciar ou escolha outro protocolo'
                      : status === 'paused'
                        ? 'Toque em continuar para retomar'
                        : `Etapa de ${formatDurationLabel(currentStep.durationSeconds)}`}
                  </p>
                </div>
              </div>

              <div className="execution-meta-grid">
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Etapa</span>
                  <strong className="notranslate" translate="no">{Math.round(stepProgress)}%</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Treino</span>
                  <strong className="notranslate" translate="no">{Math.round(protocolProgress)}%</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Restante</span>
                  <strong className="notranslate" translate="no">
                    {formatClock(Math.max(0, totalProtocolSeconds - elapsedProtocolSeconds))}
                  </strong>
                </div>
              </div>
            </section>

            <section className="execution-card">
              <div className="execution-controls execution-controls--round">
                <Button variant="secondary" onClick={pauseOrResume}>
                  {status === 'running' ? <Pause size={18} /> : <Play size={18} />}
                  {status === 'idle' ? 'Iniciar' : status === 'running' ? 'Pausar' : 'Continuar'}
                </Button>
                <Button variant="ghost" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
                  <ArrowLeft size={16} />
                  Voltar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => advanceToNextStep(status === 'running')}
                >
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

        <footer className="app-footer app-footer--execution">
          <p>BJJ Timer {APP_VERSION}</p>
          <p>Desenvolvido por Vanderson Oliveira - VibeDoCode</p>
        </footer>

        <AppBottomNav />
      </div>
    </div>
  )
}
