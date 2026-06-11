export type ProtocolCategory =
  | 'warmup'
  | 'drill'
  | 'roll'
  | 'conditioning'
  | 'stretching'
  | 'competition'
  | 'kids'
  | 'custom'

export type StepType =
  | 'action'
  | 'pause'
  | 'roll'
  | 'drill'
  | 'rest'
  | 'hydration'
  | 'transition'
  | 'instruction'
  | 'custom'

export type AudioEventType =
  | 'PROTOCOL_PRE_START'
  | 'PROTOCOL_START'
  | 'PROTOCOL_END'
  | 'PROTOCOL_CANCELLED'
  | 'STEP_START'
  | 'STEP_HALF_TIME'
  | 'STEP_WARNING_30'
  | 'STEP_WARNING_20'
  | 'STEP_WARNING_10'
  | 'STEP_WARNING_5'
  | 'STEP_COUNTDOWN_3'
  | 'STEP_COUNTDOWN_2'
  | 'STEP_COUNTDOWN_1'
  | 'STEP_END'
  | 'STEP_TRANSITION'
  | 'REST_START'
  | 'REST_WARNING'
  | 'REST_END'
  | 'ROUND_START'
  | 'ROUND_WARNING'
  | 'ROUND_END'
  | 'LAST_ROUND_START'

export interface AudioEventSetting {
  id: string
  eventType: AudioEventType
  messageText: string
  enabled: boolean
  soundType: 'beep' | 'gong' | 'whistle' | 'bell' | 'none'
  triggerSecondsBeforeEnd?: number
  customAudioDataUrl?: string | null
  customAudioName?: string | null
}

export interface Step {
  id: string
  name: string
  type: StepType
  durationSeconds: number
  color: string
  autoNext: boolean
  audioEnabled: boolean
  countdownEnabled: boolean
  beepEnabled: boolean
  vibrationEnabled: boolean
  startMessage: string
  warningMessage: string
  endMessage: string
}

export interface Protocol {
  id: string
  name: string
  description: string
  category: ProtocolCategory
  color: string
  isFavorite: boolean
  audioEnabled: boolean
  vibrationEnabled: boolean
  countdownEnabled: boolean
  keepScreenOn: boolean
  voicePack: string
  soundProfile: 'arena' | 'clean' | 'minimal'
  builtInSourceId?: string
  createdAt: string
  updatedAt: string
  steps: Step[]
  audioEvents: AudioEventSetting[]
}

export interface ExecutionHistory {
  id: string
  protocolId: string
  protocolName: string
  startedAt: string
  finishedAt: string
  status: 'completed' | 'interrupted'
  totalDurationSeconds: number
  completedSteps: number
  interruptedAtStep?: string
}

export interface AppSettings {
  defaultVoice: string
  defaultVolume: number
  defaultBeep: AudioEventSetting['soundType']
  vibrationEnabled: boolean
  keepScreenOn: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'pt-BR' | 'en-US'
}

export interface PersistedAppState {
  protocols: Protocol[]
  settings: AppSettings
  history: ExecutionHistory[]
}
