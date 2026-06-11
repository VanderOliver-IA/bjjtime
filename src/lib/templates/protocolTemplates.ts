import type { Protocol } from '../../types/domain'
import {
  buildQuickDrillProtocol,
  buildQuickRolaProtocol,
  cloneProtocol,
  createDefaultSettings,
  createId,
  createStep,
} from '../../utils/protocols'

const settings = createDefaultSettings()

const decreasingDrill = buildQuickDrillProtocol(
  'Drill Decrescente',
  60,
  0,
  1,
  settings,
)

decreasingDrill.steps = [60, 50, 40, 30, 20].map((duration, index) =>
  createStep(
    {
      name: `Drill ${index + 1}`,
      type: 'drill',
      durationSeconds: duration,
      color: '#3B82F6',
    },
    settings,
  ),
)

const classicRoll = buildQuickRolaProtocol(5, 5 * 60, 60, settings)

export const protocolTemplates: Protocol[] = [
  {
    ...decreasingDrill,
    id: createId(),
    builtInSourceId: 'template-decreasing-drill',
    name: 'Drill Decrescente',
    description: 'Sequencia 60 / 50 / 40 / 30 / 20 para subir o ritmo.',
  },
  {
    ...buildQuickDrillProtocol('Drill 30/5', 30, 5, 10, settings),
    id: createId(),
    builtInSourceId: 'template-drill-30-5',
    description: 'Modelo pronto para drills curtos com troca rapida.',
  },
  {
    ...classicRoll,
    id: createId(),
    builtInSourceId: 'template-classic-roll',
    description: 'Cinco rounds de rola com descanso entre rounds.',
  },
  {
    ...buildQuickRolaProtocol(1, 5 * 60, 0, settings),
    id: createId(),
    builtInSourceId: 'template-competition-adult',
    name: 'Competicao Adulto',
    category: 'competition',
    description: 'Round unico de competicao com avisos basicos.',
  },
  {
    ...buildQuickRolaProtocol(1, 3 * 60, 0, settings),
    id: createId(),
    builtInSourceId: 'template-competition-kids',
    name: 'Competicao Infantil',
    category: 'kids',
    description: 'Round curto com contagem final para categorias kids.',
  },
  {
    ...cloneProtocol(decreasingDrill),
    id: createId(),
    builtInSourceId: 'template-warmup-10',
    name: 'Aquecimento 10 Minutos',
    category: 'warmup',
    description: 'Mobilidade, corrida, sprawl, ponte e camarao.',
    steps: [
      createStep({ name: 'Mobilidade', durationSeconds: 120, type: 'action' }),
      createStep({ name: 'Corrida leve', durationSeconds: 120, type: 'action' }),
      createStep({ name: 'Sprawl', durationSeconds: 90, type: 'action' }),
      createStep({ name: 'Ponte', durationSeconds: 90, type: 'action' }),
      createStep({ name: 'Camarao', durationSeconds: 120, type: 'action' }),
      createStep({
        name: 'Pausa curta',
        durationSeconds: 60,
        type: 'pause',
        color: '#F97316',
      }),
    ],
  },
  {
    ...buildQuickDrillProtocol('Tabata BJJ', 20, 10, 8, settings),
    id: createId(),
    builtInSourceId: 'template-tabata',
    category: 'conditioning',
    description: 'Tabata classico adaptado para o tatame.',
  },
]
