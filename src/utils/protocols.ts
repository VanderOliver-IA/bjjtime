import type {
  AppSettings,
  AudioEventSetting,
  AudioEventType,
  Protocol,
  ProtocolCategory,
  Step,
  StepType,
} from '../types/domain'

export const categoryOptions: Array<{
  value: ProtocolCategory
  label: string
}> = [
  { value: 'warmup', label: 'Aquecimento' },
  { value: 'drill', label: 'Drill' },
  { value: 'roll', label: 'Rola' },
  { value: 'conditioning', label: 'Preparacao fisica' },
  { value: 'stretching', label: 'Alongamento' },
  { value: 'competition', label: 'Competicao' },
  { value: 'kids', label: 'Infantil' },
  { value: 'custom', label: 'Personalizado' },
]

export const stepTypeOptions: Array<{ value: StepType; label: string }> = [
  { value: 'action', label: 'Acao' },
  { value: 'pause', label: 'Pausa' },
  { value: 'roll', label: 'Rola' },
  { value: 'drill', label: 'Drill' },
  { value: 'rest', label: 'Descanso' },
  { value: 'hydration', label: 'Hidratacao' },
  { value: 'transition', label: 'Transicao' },
  { value: 'instruction', label: 'Instrucao' },
  { value: 'custom', label: 'Personalizado' },
]

export function createId() {
  return crypto.randomUUID()
}

export function createDefaultSettings(): AppSettings {
  return {
    defaultVoice: 'coach',
    defaultVolume: 0.9,
    defaultBeep: 'bell',
    vibrationEnabled: true,
    keepScreenOn: true,
    theme: 'system',
    language: 'pt-BR',
  }
}

export function createDefaultAudioEvents(): AudioEventSetting[] {
  const baseEvent = (
    eventType: AudioEventType,
    messageText: string,
    soundType: AudioEventSetting['soundType'],
    enabled = true,
    triggerSecondsBeforeEnd?: number,
  ): AudioEventSetting => ({
    id: createId(),
    eventType,
    messageText,
    enabled,
    soundType,
    triggerSecondsBeforeEnd,
  })

  return [
    baseEvent('PROTOCOL_PRE_START', 'Preparar. Comeca em 3, 2, 1.', 'bell'),
    baseEvent('PROTOCOL_START', 'Valendo!', 'gong'),
    baseEvent('PROTOCOL_END', 'Boa. Treino finalizado.', 'gong'),
    baseEvent('PROTOCOL_CANCELLED', 'Treino encerrado.', 'bell'),
    baseEvent('STEP_START', 'Valendo!', 'bell'),
    baseEvent('STEP_WARNING_10', 'So mais 10!', 'whistle', true, 10),
    baseEvent('STEP_WARNING_5', 'Ultimos 5!', 'beep', true, 5),
    baseEvent('STEP_COUNTDOWN_3', '3', 'beep', true, 3),
    baseEvent('STEP_COUNTDOWN_2', '2', 'beep', true, 2),
    baseEvent('STEP_COUNTDOWN_1', '1', 'beep', true, 1),
    baseEvent('STEP_TRANSITION', 'Troca!', 'gong'),
    baseEvent('REST_START', 'Descanso.', 'bell'),
    baseEvent('ROUND_START', 'Round valendo!', 'gong'),
    baseEvent('LAST_ROUND_START', 'Ultimo round!', 'whistle'),
  ]
}

export function createStep(
  partial?: Partial<Step>,
  settings?: AppSettings,
): Step {
  return {
    id: createId(),
    name: partial?.name ?? 'Nova etapa',
    type: partial?.type ?? 'action',
    durationSeconds: partial?.durationSeconds ?? 30,
    color: partial?.color ?? '#3B82F6',
    autoNext: partial?.autoNext ?? true,
    audioEnabled: partial?.audioEnabled ?? true,
    countdownEnabled: partial?.countdownEnabled ?? true,
    beepEnabled: partial?.beepEnabled ?? true,
    vibrationEnabled:
      partial?.vibrationEnabled ?? settings?.vibrationEnabled ?? true,
    startMessage: partial?.startMessage ?? 'Valendo!',
    warningMessage: partial?.warningMessage ?? 'So mais 10!',
    endMessage: partial?.endMessage ?? 'Troca!',
  }
}

export function createBlankProtocol(settings = createDefaultSettings()): Protocol {
  const now = new Date().toISOString()

  return {
    id: createId(),
    name: 'Novo protocolo',
    description: '',
    category: 'drill',
    color: '#3B82F6',
    isFavorite: false,
    audioEnabled: true,
    vibrationEnabled: settings.vibrationEnabled,
    countdownEnabled: true,
    keepScreenOn: settings.keepScreenOn,
    voicePack: settings.defaultVoice,
    soundProfile: 'arena',
    createdAt: now,
    updatedAt: now,
    steps: [
      createStep(
        {
          name: 'Etapa 1',
          type: 'action',
          durationSeconds: 30,
          color: '#3B82F6',
        },
        settings,
      ),
    ],
    audioEvents: createDefaultAudioEvents(),
  }
}

export function cloneProtocol(protocol: Protocol): Protocol {
  return structuredClone(protocol)
}

export function computeProtocolTotalSeconds(protocol: Protocol) {
  return protocol.steps.reduce((total, step) => total + step.durationSeconds, 0)
}

export function duplicateProtocol(protocol: Protocol): Protocol {
  const now = new Date().toISOString()
  const copy = cloneProtocol(protocol)

  return {
    ...copy,
    id: createId(),
    name: `${protocol.name} copia`,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    steps: copy.steps.map((step) => ({ ...step, id: createId() })),
    audioEvents: copy.audioEvents.map((audioEvent) => ({
      ...audioEvent,
      id: createId(),
    })),
  }
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items]
  const [item] = next.splice(fromIndex, 1)

  next.splice(toIndex, 0, item)

  return next
}

export function buildQuickDrillProtocol(
  nameBase: string,
  actionSeconds: number,
  pauseSeconds: number,
  repetitions: number,
  settings: AppSettings,
): Protocol {
  const protocol = createBlankProtocol(settings)
  const steps: Step[] = []

  for (let repetitionIndex = 0; repetitionIndex < repetitions; repetitionIndex += 1) {
    steps.push(
      createStep(
        {
          name: `${nameBase} ${repetitionIndex + 1}`,
          type: 'drill',
          durationSeconds: actionSeconds,
          color: '#3B82F6',
          startMessage: 'Valendo!',
          warningMessage: 'So mais 10!',
          endMessage: 'Troca!',
        },
        settings,
      ),
    )

    if (pauseSeconds > 0) {
      steps.push(
        createStep(
          {
            name: 'Pausa',
            type: 'pause',
            durationSeconds: pauseSeconds,
            color: '#F97316',
            startMessage: 'Descanso.',
            warningMessage: 'Prepara.',
            endMessage: 'Valendo!',
          },
          settings,
        ),
      )
    }
  }

  return {
    ...protocol,
    name: nameBase,
    category: 'drill',
    steps,
  }
}

export function buildQuickRolaProtocol(
  rounds: number,
  roundSeconds: number,
  restSeconds: number,
  settings: AppSettings,
): Protocol {
  const protocol = createBlankProtocol(settings)
  const steps: Step[] = []

  for (let roundIndex = 0; roundIndex < rounds; roundIndex += 1) {
    steps.push(
      createStep(
        {
          name: `Round ${roundIndex + 1}`,
          type: 'roll',
          durationSeconds: roundSeconds,
          color: '#2563EB',
          startMessage:
            roundIndex === rounds - 1 ? 'Ultimo round!' : 'Valendo!',
          warningMessage: 'So mais 10!',
          endMessage: 'Tempo!',
        },
        settings,
      ),
    )

    if (roundIndex < rounds - 1 && restSeconds > 0) {
      steps.push(
        createStep(
          {
            name: `Descanso ${roundIndex + 1}`,
            type: 'rest',
            durationSeconds: restSeconds,
            color: '#F59E0B',
            startMessage: 'Descanso.',
            warningMessage: 'Volta ja.',
            endMessage: 'Valendo!',
          },
          settings,
        ),
      )
    }
  }

  return {
    ...protocol,
    name: `Rola ${rounds}x${Math.round(roundSeconds / 60)}`,
    category: 'roll',
    steps,
  }
}

export function resolveAudioMessage(
  protocol: Protocol,
  eventType: AudioEventType,
  replacements: Record<string, string | number>,
) {
  const event =
    protocol.audioEvents.find((item) => item.eventType === eventType) ?? null

  if (!event || !event.enabled || !protocol.audioEnabled) {
    return null
  }

  return Object.entries(replacements).reduce((message, [token, value]) => {
    return message.replaceAll(`{${token}}`, String(value))
  }, event.messageText)
}
