import { ArrowRight, Copy, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { protocolTemplates } from '../../lib/templates/protocolTemplates'
import { useAppStore } from '../../state/useAppStore'
import { computeProtocolTotalSeconds } from '../../utils/protocols'
import { formatDurationLabel, getCategoryLabel } from '../../utils/format'

export function TemplatesPage() {
  const navigate = useNavigate()
  const createFromTemplate = useAppStore((state) => state.createFromTemplate)

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Modelos prontos</p>
            <h2>Entre treinando</h2>
            <p>
              Templates pensados para reduzir a friccao do primeiro uso. Copie, ajuste e rode.
            </p>
          </div>
        </div>
      </Card>

      <section className="template-grid">
        {protocolTemplates.map((template) => {
          const totalSeconds = computeProtocolTotalSeconds(template)

          return (
            <Card key={template.builtInSourceId} className="template-card">
              <div className="template-card__top">
                <div>
                  <div className="chip-row">
                    <span className="chip">{getCategoryLabel(template.category)}</span>
                    <span className="chip">{template.steps.length} etapas</span>
                  </div>
                  <h3>{template.name}</h3>
                  <p className="muted">{template.description}</p>
                </div>
                <ArrowRight size={18} />
              </div>

              <div className="protocol-stat-grid">
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Duracao</span>
                  <strong>{formatDurationLabel(totalSeconds)}</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Etapas</span>
                  <strong>{template.steps.length}</strong>
                </div>
                <div className="protocol-stat">
                  <span className="protocol-stat__label">Estilo</span>
                  <strong>{template.audioEnabled ? 'Com audio' : 'Silencioso'}</strong>
                </div>
              </div>

              <div className="template-card__footer">
                <Button
                  onClick={() => {
                    const protocol = createFromTemplate(template.builtInSourceId ?? '')

                    if (protocol) {
                      navigate(`/protocol/${protocol.id}/run`)
                    }
                  }}
                >
                  <Play size={16} />
                  Usar agora
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const protocol = createFromTemplate(template.builtInSourceId ?? '')

                    if (protocol) {
                      navigate(`/protocol/${protocol.id}/edit`)
                    }
                  }}
                >
                  <Copy size={16} />
                  Duplicar e editar
                </Button>
              </div>
            </Card>
          )
        })}
      </section>
    </>
  )
}
