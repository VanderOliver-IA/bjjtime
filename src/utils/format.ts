import type { AudioEventType, ProtocolCategory, StepType } from '../types/domain'

const protocolCategoryLabels: Record<ProtocolCategory, string> = {
  warmup: 'Aquecimento',
  drill: 'Drill',
  roll: 'Rola',
  conditioning: 'Preparacao fisica',
  stretching: 'Alongamento',
  competition: 'Competicao',
  kids: 'Infantil',
  custom: 'Personalizado',
}

const stepTypeLabels: Record<StepType, string> = {
  action: 'Acao',
  pause: 'Pausa',
  roll: 'Rola',
  drill: 'Drill',
  rest: 'Descanso',
  hydration: 'Hidratacao',
  transition: 'Transicao',
  instruction: 'Instrucao',
  custom: 'Personalizado',
}

const audioEventLabels: Record<AudioEventType, string> = {
  PROTOCOL_PRE_START: 'Antes de iniciar',
  PROTOCOL_START: 'Inicio do protocolo',
  PROTOCOL_END: 'Fim do protocolo',
  PROTOCOL_CANCELLED: 'Cancelamento',
  STEP_START: 'Inicio da etapa',
  STEP_WARNING_30: 'Aviso 30 segundos',
  STEP_WARNING_20: 'Aviso 20 segundos',
  STEP_WARNING_10: 'Aviso 10 segundos',
  STEP_WARNING_5: 'Aviso 5 segundos',
  STEP_COUNTDOWN_3: 'Contagem 3',
  STEP_COUNTDOWN_2: 'Contagem 2',
  STEP_COUNTDOWN_1: 'Contagem 1',
  STEP_END: 'Fim da etapa',
  STEP_TRANSITION: 'Troca de etapa',
  REST_START: 'Inicio da pausa',
  REST_WARNING: 'Aviso da pausa',
  ROUND_START: 'Inicio de round',
  LAST_ROUND_START: 'Ultimo round',
}

export function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatDurationLabel(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0 && seconds > 0) {
    return `${minutes}m ${seconds}s`
  }

  if (minutes > 0) {
    return `${minutes}m`
  }

  return `${seconds}s`
}

export function formatDateTime(dateIso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateIso))
}

export function formatDateShort(dateIso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(dateIso))
}

export function getCategoryLabel(category: ProtocolCategory) {
  return protocolCategoryLabels[category]
}

export function getStepTypeLabel(stepType: StepType) {
  return stepTypeLabels[stepType]
}

export function getAudioEventLabel(eventType: AudioEventType) {
  return audioEventLabels[eventType]
}

export function compareVersionLabels(left: string, right: string) {
  const leftParts = left.replace(/[^0-9.]/g, '').split('.').map(Number)
  const rightParts = right.replace(/[^0-9.]/g, '').split('.').map(Number)
  const maxLength = Math.max(leftParts.length, rightParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] ?? 0
    const rightValue = rightParts[index] ?? 0

    if (leftValue === rightValue) {
      continue
    }

    return leftValue > rightValue ? 1 : -1
  }

  return 0
}
