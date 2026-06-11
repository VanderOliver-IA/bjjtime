import { ActivitySquare } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { useAppStore } from '../../state/useAppStore'
import { formatDateTime, formatDurationLabel } from '../../utils/format'

export function HistoryPage() {
  const history = useAppStore((state) => state.history)

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Historico</p>
            <h2>Treinos executados</h2>
            <p>Visibilidade rapida sobre consistencia, duracao e protocolos mais usados.</p>
          </div>
        </div>
      </Card>

      {history.length === 0 ? (
        <Card className="empty-state">
          <div className="empty-state__icon">
            <ActivitySquare size={26} />
          </div>
          <h3>Nenhuma execucao registrada</h3>
          <p className="muted">
            Quando voce concluir ou interromper um treino, o app salva essa sessao aqui.
          </p>
        </Card>
      ) : (
        <section className="history-list">
          {history.map((entry) => (
            <Card key={entry.id} className="history-card">
              <div className="history-card__top">
                <div>
                  <span
                    className={[
                      'status-chip',
                      entry.status === 'completed'
                        ? 'status-chip--completed'
                        : 'status-chip--interrupted',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {entry.status === 'completed' ? 'Concluido' : 'Interrompido'}
                  </span>
                  <h3>{entry.protocolName}</h3>
                  <p className="muted">
                    Inicio {formatDateTime(entry.startedAt)} · fim {formatDateTime(entry.finishedAt)}
                  </p>
                </div>
              </div>

              <div className="protocol-stat-grid">
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Tempo executado</span>
                  <strong>{formatDurationLabel(entry.totalDurationSeconds)}</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Etapas concluidas</span>
                  <strong>{entry.completedSteps}</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Ponto de parada</span>
                  <strong>{entry.interruptedAtStep ?? 'Final completo'}</strong>
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}
    </>
  )
}
