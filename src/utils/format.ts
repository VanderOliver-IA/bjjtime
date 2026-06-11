import type { ProtocolCategory, StepType } from '../types/domain'

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
