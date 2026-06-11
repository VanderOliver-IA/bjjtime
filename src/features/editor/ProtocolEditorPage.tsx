import { Plus, Save, TimerReset, Volume2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DurationInput } from '../../components/ui/DurationInput'
import { useAppStore } from '../../state/useAppStore'
import type { Protocol, Step } from '../../types/domain'
import { formatDurationLabel, getStepTypeLabel } from '../../utils/format'
import {
  categoryOptions,
  cloneProtocol,
  computeProtocolTotalSeconds,
  createBlankProtocol,
  createStep,
  moveItem,
  stepTypeOptions,
} from '../../utils/protocols'

export function ProtocolEditorPage() {
  const navigate = useNavigate()
  const { protocolId } = useParams()
  const protocols = useAppStore((state) => state.protocols)
  const settings = useAppStore((state) => state.settings)
  const sourceProtocol = useMemo(
    () => protocols.find((protocol) => protocol.id === protocolId) ?? null,
    [protocolId, protocols],
  )

  return (
    <ProtocolEditorForm
      key={sourceProtocol?.id ?? 'new'}
      sourceProtocol={sourceProtocol}
      settings={settings}
      protocolId={protocolId}
      navigateTo={navigate}
    />
  )
}

interface ProtocolEditorFormProps {
  navigateTo: ReturnType<typeof useNavigate>
  protocolId?: string
  settings: ReturnType<typeof useAppStore.getState>['settings']
  sourceProtocol: Protocol | null
}

function ProtocolEditorForm({
  navigateTo,
  protocolId,
  settings,
  sourceProtocol,
}: ProtocolEditorFormProps) {
  const upsertProtocol = useAppStore((state) => state.upsertProtocol)
  const [draft, setDraft] = useState<Protocol>(() =>
    sourceProtocol ? cloneProtocol(sourceProtocol) : createBlankProtocol(settings),
  )

  const totalSeconds = computeProtocolTotalSeconds(draft)

  function updateStep(stepId: string, patch: Partial<Step>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      steps: currentDraft.steps.map((step) =>
        step.id === stepId ? { ...step, ...patch } : step,
      ),
    }))
  }

  function addStep(stepType: Step['type']) {
    const baseName = stepType === 'pause' ? 'Pausa' : `Etapa ${draft.steps.length + 1}`

    setDraft((currentDraft) => ({
      ...currentDraft,
      steps: [
        ...currentDraft.steps,
        createStep(
          {
            name: baseName,
            type: stepType,
            durationSeconds: stepType === 'pause' ? 10 : 30,
            color: stepType === 'pause' ? '#F97316' : currentDraft.color,
          },
          settings,
        ),
      ],
    }))
  }

  function saveProtocol(nextAction?: 'audio' | 'run') {
    if (!draft.name.trim()) {
      window.alert('Dê um nome ao protocolo antes de salvar.')
      return
    }

    if (draft.steps.length === 0) {
      window.alert('Adicione pelo menos uma etapa antes de salvar.')
      return
    }

    if (draft.steps.some((step) => step.durationSeconds < 1)) {
      window.alert('Toda etapa precisa ter pelo menos 1 segundo.')
      return
    }

    const savedProtocol = upsertProtocol({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    setDraft(savedProtocol)

    if (nextAction === 'audio') {
      navigateTo(`/protocol/${savedProtocol.id}/audio`)
      return
    }

    if (nextAction === 'run') {
      navigateTo(`/protocol/${savedProtocol.id}/run`)
      return
    }

    navigateTo('/')
  }

  return (
    <>
      <Card className="editor-header-card">
        <div className="page-header">
          <div>
            <p className="eyebrow">{protocolId ? 'Editar protocolo' : 'Criar protocolo'}</p>
            <h2>{draft.name}</h2>
            <p>
              Construa a sequencia completa de treino com etapas independentes, pausa e
              comportamento de audio.
            </p>
          </div>
        </div>

        <div className="protocol-stat-grid">
          <div className="protocol-stat">
            <span className="protocol-stat__label">Duracao total</span>
            <strong>{formatDurationLabel(totalSeconds)}</strong>
          </div>
          <div className="protocol-stat">
            <span className="protocol-stat__label">Etapas</span>
            <strong>{draft.steps.length}</strong>
          </div>
          <div className="protocol-stat">
            <span className="protocol-stat__label">Audio</span>
            <strong>{draft.audioEnabled ? 'Ligado' : 'Desligado'}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <div className="field-grid">
          <label className="field">
            <span>Nome do protocolo</span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Descricao</span>
            <textarea
              value={draft.description}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value,
                }))
              }
              placeholder="Ex: drill de passagem com pausa curta para troca de dupla."
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Categoria</span>
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    category: event.target.value as Protocol['category'],
                  }))
                }
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Cor do protocolo</span>
              <input
                className="color-picker"
                type="color"
                value={draft.color}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    color: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <div className="settings-grid">
            <label className="field field--inline">
              <span>Audio ativo</span>
              <input
                className="toggle"
                type="checkbox"
                checked={draft.audioEnabled}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    audioEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="field field--inline">
              <span>Contagem regressiva</span>
              <input
                className="toggle"
                type="checkbox"
                checked={draft.countdownEnabled}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    countdownEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="field field--inline">
              <span>Manter tela ligada</span>
              <input
                className="toggle"
                type="checkbox"
                checked={draft.keepScreenOn}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    keepScreenOn: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="field field--inline">
              <span>Vibracao</span>
              <input
                className="toggle"
                type="checkbox"
                checked={draft.vibrationEnabled}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    vibrationEnabled: event.target.checked,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Editor de etapas</p>
            <h2>Sequencia detalhada</h2>
            <p>
              Toda etapa vira um bloco autonomo de tempo, com cor, tipo, falas e comportamento.
            </p>
          </div>
          <div className="inline-actions">
            <Button variant="secondary" onClick={() => addStep('action')}>
              <Plus size={16} />
              Adicionar etapa
            </Button>
            <Button variant="ghost" onClick={() => addStep('pause')}>
              <TimerReset size={16} />
              Adicionar pausa
            </Button>
          </div>
        </div>
      </Card>

      <section className="step-list">
        {draft.steps.map((step, stepIndex) => (
          <Card key={step.id} className="step-card">
            <div className="step-card__title">
              <div>
                <div className="chip-row">
                  <span className="step-chip">{getStepTypeLabel(step.type)}</span>
                  <span className="step-chip">{formatDurationLabel(step.durationSeconds)}</span>
                </div>
                <h3>{step.name}</h3>
              </div>
              <div className="inline-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={stepIndex === 0}
                  onClick={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      steps: moveItem(currentDraft.steps, stepIndex, stepIndex - 1),
                    }))
                  }
                >
                  Subir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={stepIndex === draft.steps.length - 1}
                  onClick={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      steps: moveItem(currentDraft.steps, stepIndex, stepIndex + 1),
                    }))
                  }
                >
                  Descer
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      steps: currentDraft.steps.filter((item) => item.id !== step.id),
                    }))
                  }
                >
                  Remover
                </Button>
              </div>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Nome</span>
                <input
                  value={step.name}
                  onChange={(event) => updateStep(step.id, { name: event.target.value })}
                />
              </label>

              <label className="field">
                <span>Tipo</span>
                <select
                  value={step.type}
                  onChange={(event) =>
                    updateStep(step.id, { type: event.target.value as Step['type'] })
                  }
                >
                  {stepTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Duracao</span>
                <DurationInput
                  minSeconds={1}
                  valueSeconds={step.durationSeconds}
                  onChangeSeconds={(durationSeconds) =>
                    updateStep(step.id, {
                      durationSeconds,
                    })
                  }
                />
              </label>

              <label className="field">
                <span>Cor</span>
                <input
                  className="color-picker"
                  type="color"
                  value={step.color}
                  onChange={(event) => updateStep(step.id, { color: event.target.value })}
                />
              </label>

              <label className="field">
                <span>Fala de inicio</span>
                <input
                  value={step.startMessage}
                  onChange={(event) =>
                    updateStep(step.id, { startMessage: event.target.value })
                  }
                />
              </label>

              <label className="field">
                <span>Fala de aviso</span>
                <input
                  value={step.warningMessage}
                  onChange={(event) =>
                    updateStep(step.id, { warningMessage: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="settings-grid">
              <label className="field field--inline">
                <span>Avancar automaticamente</span>
                <input
                  className="toggle"
                  type="checkbox"
                  checked={step.autoNext}
                  onChange={(event) => updateStep(step.id, { autoNext: event.target.checked })}
                />
              </label>
              <label className="field field--inline">
                <span>Audio da etapa</span>
                <input
                  className="toggle"
                  type="checkbox"
                  checked={step.audioEnabled}
                  onChange={(event) => updateStep(step.id, { audioEnabled: event.target.checked })}
                />
              </label>
              <label className="field field--inline">
                <span>Contagem final</span>
                <input
                  className="toggle"
                  type="checkbox"
                  checked={step.countdownEnabled}
                  onChange={(event) =>
                    updateStep(step.id, { countdownEnabled: event.target.checked })
                  }
                />
              </label>
              <label className="field field--inline">
                <span>Vibracao</span>
                <input
                  className="toggle"
                  type="checkbox"
                  checked={step.vibrationEnabled}
                  onChange={(event) =>
                    updateStep(step.id, { vibrationEnabled: event.target.checked })
                  }
                />
              </label>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <div className="grid-actions">
          <Button onClick={() => saveProtocol()}>
            <Save size={16} />
            Salvar protocolo
          </Button>
          <Button variant="secondary" onClick={() => saveProtocol('run')}>
            Iniciar agora
          </Button>
          <Button variant="ghost" onClick={() => saveProtocol('audio')}>
            <Volume2 size={16} />
            Ajustar audio e falas
          </Button>
        </div>
      </Card>
    </>
  )
}
