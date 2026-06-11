import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DurationInput } from '../../components/ui/DurationInput'
import { useAppStore } from '../../state/useAppStore'
import type { Protocol } from '../../types/domain'
import { formatDurationLabel } from '../../utils/format'
import {
  buildQuickDrillProtocol,
  buildQuickRolaProtocol,
  computeProtocolTotalSeconds,
} from '../../utils/protocols'

export function QuickBuilderPage() {
  const navigate = useNavigate()
  const { mode } = useParams()
  const settings = useAppStore((state) => state.settings)
  const upsertProtocol = useAppStore((state) => state.upsertProtocol)
  const isDrillMode = mode !== 'rola'
  const [nameBase, setNameBase] = useState(isDrillMode ? 'Passagem de guarda' : 'Rola classico')
  const [actionSeconds, setActionSeconds] = useState(30)
  const [pauseSeconds, setPauseSeconds] = useState(5)
  const [repetitions, setRepetitions] = useState(10)
  const [roundSeconds, setRoundSeconds] = useState(300)
  const [rounds, setRounds] = useState(5)

  const previewProtocol = useMemo<Protocol>(() => {
    if (isDrillMode) {
      return buildQuickDrillProtocol(
        nameBase,
        actionSeconds,
        pauseSeconds,
        repetitions,
        settings,
      )
    }

    const protocol = buildQuickRolaProtocol(rounds, roundSeconds, pauseSeconds, settings)
    protocol.name = nameBase
    return protocol
  }, [
    actionSeconds,
    isDrillMode,
    nameBase,
    pauseSeconds,
    repetitions,
    roundSeconds,
    rounds,
    settings,
  ])

  function saveAnd(nextAction: 'home' | 'run') {
    const protocol = upsertProtocol({
      ...previewProtocol,
      name: nameBase,
      description: isDrillMode
        ? `Gerado em modo Drill Rapido com ${repetitions} repeticoes.`
        : `Gerado em modo Rola Rapido com ${rounds} rounds.`,
    })

    if (nextAction === 'run') {
      navigate(`/protocol/${protocol.id}/run`)
      return
    }

    navigate(`/protocol/${protocol.id}/edit`)
  }

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">{isDrillMode ? 'Drill rapido' : 'Rola rapido'}</p>
            <h2>{isDrillMode ? 'Monte blocos repetidos' : 'Gere rounds sob medida'}</h2>
            <p>
              Preencha poucos campos, revise a sequencia e transforme isso em um protocolo
              reutilizavel.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="field-grid">
          <label className="field">
            <span>Nome base</span>
            <input value={nameBase} onChange={(event) => setNameBase(event.target.value)} />
          </label>

          {isDrillMode ? (
            <>
              <label className="field">
                <span>Tempo de acao</span>
                <DurationInput
                  minSeconds={1}
                  valueSeconds={actionSeconds}
                  onChangeSeconds={setActionSeconds}
                />
              </label>
              <label className="field">
                <span>Tempo de pausa</span>
                <DurationInput valueSeconds={pauseSeconds} onChangeSeconds={setPauseSeconds} />
              </label>
              <label className="field">
                <span>Repeticoes</span>
                <input
                  min={1}
                  type="number"
                  value={repetitions}
                  onChange={(event) => setRepetitions(Math.max(1, Number(event.target.value)))}
                />
              </label>
            </>
          ) : (
            <>
              <label className="field">
                <span>Tempo por round</span>
                <DurationInput
                  minSeconds={30}
                  valueSeconds={roundSeconds}
                  onChangeSeconds={setRoundSeconds}
                />
              </label>
              <label className="field">
                <span>Descanso entre rounds</span>
                <DurationInput valueSeconds={pauseSeconds} onChangeSeconds={setPauseSeconds} />
              </label>
              <label className="field">
                <span>Quantidade de rounds</span>
                <input
                  min={1}
                  type="number"
                  value={rounds}
                  onChange={(event) => setRounds(Math.max(1, Number(event.target.value)))}
                />
              </label>
            </>
          )}
        </div>
      </Card>

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Preview gerado</p>
            <h2>{previewProtocol.name}</h2>
            <p>
              {previewProtocol.steps.length} etapas ·{' '}
              {formatDurationLabel(computeProtocolTotalSeconds(previewProtocol))}
            </p>
          </div>
        </div>

        <section className="step-list">
          {previewProtocol.steps.map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-card__title">
                <h3>{step.name}</h3>
                <span className="step-chip">{formatDurationLabel(step.durationSeconds)}</span>
              </div>
            </div>
          ))}
        </section>
      </Card>

      <Card>
        <div className="grid-actions">
          <Button onClick={() => saveAnd('home')}>Salvar e revisar</Button>
          <Button variant="secondary" onClick={() => saveAnd('run')}>
            Salvar e iniciar
          </Button>
        </div>
      </Card>
    </>
  )
}
