import type {
  AppSettings,
  AudioEventSetting,
  AudioEventType,
  Protocol,
  ProtocolCategory,
  Step,
  StepType,
  VoicePhrase,
  VoiceProfile,
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
    theme: 'dark',
    language: 'pt-BR',
    customTheme: {
      primary: '#f25d6e',
      secondary: '#ff8f8d',
      background: '#0f141c',
      panel: '#171d28',
      text: '#f6f1f2',
    },
    branding: {
      eyebrow: 'JH BJJ',
      title: 'Centro de Treinamento de Jiu-Jitsu',
      subtitle: 'Timer oficial de treino',
      logoDataUrl: null,
    },
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
    baseEvent('STEP_WARNING_30', 'Faltam so 30 segundos!', 'whistle', false, 30),
    baseEvent('STEP_WARNING_20', 'Faltam so 20 segundos!', 'whistle', false, 20),
    baseEvent('STEP_WARNING_10', 'So mais 10!', 'whistle', true, 10),
    baseEvent('STEP_WARNING_5', 'Ultimos 5!', 'beep', true, 5),
    baseEvent('STEP_COUNTDOWN_3', '3', 'beep', true, 3),
    baseEvent('STEP_COUNTDOWN_2', '2', 'beep', true, 2),
    baseEvent('STEP_COUNTDOWN_1', '1', 'beep', true, 1),
    baseEvent('STEP_END', 'Acabou!', 'gong'),
    baseEvent('STEP_TRANSITION', 'Troca!', 'gong'),
    baseEvent('REST_START', 'Descanso.', 'bell'),
    baseEvent('REST_WARNING', 'Faltam so 10 segundos de descanso!', 'beep', false, 10),
    baseEvent('ROUND_START', 'Round valendo!', 'gong'),
    baseEvent('LAST_ROUND_START', 'Ultimo round!', 'whistle'),
  ]
}

export function createStep(
  partial?: Partial<Step>,
  settings?: AppSettings,
): Step {
  return {
    id: partial?.id ?? createId(),
    name: partial?.name ?? 'Nova etapa',
    type: partial?.type ?? 'action',
    durationSeconds: partial?.durationSeconds ?? 30,
    color: partial?.color ?? '#F25D6E',
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
    color: '#F25D6E',
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
          color: '#F25D6E',
        },
        settings,
      ),
    ],
    audioEvents: createDefaultAudioEvents(),
  }
}

export function createVoicePhrase(
  partial?: Partial<VoicePhrase>,
): VoicePhrase {
  const now = new Date().toISOString()

  return {
    id: createId(),
    eventType: partial?.eventType ?? 'STEP_START',
    label: partial?.label ?? 'Nova frase',
    messageText: partial?.messageText ?? 'Valendo!',
    audioDataUrl: partial?.audioDataUrl ?? null,
    audioName: partial?.audioName ?? null,
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
  }
}

export function createVoiceProfile(
  partial?: Partial<VoiceProfile>,
): VoiceProfile {
  const now = new Date().toISOString()

  return {
    id: partial?.id ?? createId(),
    name: partial?.name ?? 'Nova voz',
    description: partial?.description ?? '',
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
    phrases: partial?.phrases?.map((phrase) => createVoicePhrase(phrase)) ?? [],
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
          color: '#F25D6E',
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
            color: '#FF9B85',
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
          color: '#E64A61',
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
            color: '#FF9B85',
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

export function resolveVoiceProfileId(voicePack: string) {
  if (!voicePack.startsWith('profile:')) {
    return null
  }

  return voicePack.replace('profile:', '')
}

export function pickVoiceProfilePhrase(
  voiceProfiles: VoiceProfile[],
  voicePack: string,
  eventType: AudioEventType,
) {
  const profileId = resolveVoiceProfileId(voicePack)

  if (!profileId) {
    return null
  }

  const profile = voiceProfiles.find((item) => item.id === profileId)

  if (!profile) {
    return null
  }

  const matchingPhrases = profile.phrases.filter((phrase) => phrase.eventType === eventType)

  if (matchingPhrases.length === 0) {
    return null
  }

  return matchingPhrases[Math.floor(Math.random() * matchingPhrases.length)] ?? null
}
