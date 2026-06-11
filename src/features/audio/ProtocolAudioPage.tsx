import { PlayCircle, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { audioService } from '../../services/audio/audioService'
import { useAppStore } from '../../state/useAppStore'
import type { AudioEventSetting, Protocol } from '../../types/domain'

const editableEvents = [
  'PROTOCOL_PRE_START',
  'PROTOCOL_START',
  'STEP_START',
  'STEP_WARNING_10',
  'STEP_COUNTDOWN_3',
  'STEP_COUNTDOWN_2',
  'STEP_COUNTDOWN_1',
  'STEP_TRANSITION',
  'REST_START',
  'LAST_ROUND_START',
  'PROTOCOL_END',
] as const

export function ProtocolAudioPage() {
  const navigate = useNavigate()
  const { protocolId } = useParams()
  const protocols = useAppStore((state) => state.protocols)
  const settings = useAppStore((state) => state.settings)
  const protocol = useMemo(
    () => protocols.find((item) => item.id === protocolId) ?? null,
    [protocolId, protocols],
  )

  if (!protocol) {
    return (
      <Card className="empty-state">
        <h3>Salve o protocolo antes de editar o audio.</h3>
        <Button onClick={() => navigate('/')}>Voltar para biblioteca</Button>
      </Card>
    )
  }

  return (
    <ProtocolAudioForm
      key={protocol.id}
      navigateTo={navigate}
      protocol={protocol}
      defaultVolume={settings.defaultVolume}
    />
  )
}

interface ProtocolAudioFormProps {
  defaultVolume: number
  navigateTo: ReturnType<typeof useNavigate>
  protocol: Protocol
}

function ProtocolAudioForm({
  defaultVolume,
  navigateTo,
  protocol,
}: ProtocolAudioFormProps) {
  const saveAudioEvents = useAppStore((state) => state.saveAudioEvents)
  const [events, setEvents] = useState<AudioEventSetting[]>(protocol.audioEvents)
  const [voicePack, setVoicePack] = useState<Protocol['voicePack']>(protocol.voicePack)
  const [soundProfile, setSoundProfile] = useState<Protocol['soundProfile']>(protocol.soundProfile)

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Audio e falas</p>
            <h2>{protocol.name}</h2>
            <p>
              Ajuste as frases curtas do tatame. Prioridade aqui e clareza, ritmo e pouca
              sobreposicao.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="field-grid">
          <label className="field">
            <span>Pacote de voz</span>
            <select
              value={voicePack}
              onChange={(event) => setVoicePack(event.target.value as Protocol['voicePack'])}
            >
              <option value="coach">Professor motivador</option>
              <option value="neutral">Professor neutro</option>
              <option value="competition">Competicao</option>
            </select>
          </label>
          <label className="field">
            <span>Perfil sonoro</span>
            <select
              value={soundProfile}
              onChange={(event) =>
                setSoundProfile(event.target.value as Protocol['soundProfile'])
              }
            >
              <option value="arena">Arena</option>
              <option value="clean">Clean</option>
              <option value="minimal">Minimal</option>
            </select>
          </label>
        </div>
      </Card>

      <section className="audio-events-grid">
        {events
          .filter((event) => editableEvents.includes(event.eventType as (typeof editableEvents)[number]))
          .map((audioEvent) => (
            <Card key={audioEvent.id} className="audio-row">
              <div className="step-card__title">
                <div>
                  <span className="step-chip">{audioEvent.eventType}</span>
                  <h3>{eventLabel(audioEvent.eventType)}</h3>
                </div>
              </div>

              <label className="field">
                <span>Frase</span>
                <input
                  value={audioEvent.messageText}
                  onChange={(event) =>
                    setEvents((currentEvents) =>
                      currentEvents.map((item) =>
                        item.id === audioEvent.id
                          ? { ...item, messageText: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </label>

              <div className="settings-grid">
                <label className="field field--inline">
                  <span>Evento ativo</span>
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={audioEvent.enabled}
                    onChange={(event) =>
                      setEvents((currentEvents) =>
                        currentEvents.map((item) =>
                          item.id === audioEvent.id
                            ? { ...item, enabled: event.target.checked }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="field">
                  <span>Som</span>
                  <select
                    value={audioEvent.soundType}
                    onChange={(event) =>
                      setEvents((currentEvents) =>
                        currentEvents.map((item) =>
                          item.id === audioEvent.id
                            ? {
                                ...item,
                                soundType: event.target.value as AudioEventSetting['soundType'],
                              }
                            : item,
                        ),
                      )
                    }
                  >
                    <option value="bell">Bell</option>
                    <option value="beep">Beep</option>
                    <option value="gong">Gongo</option>
                    <option value="whistle">Apito</option>
                    <option value="none">Sem som</option>
                  </select>
                </label>
              </div>

              <div className="audio-row__footer">
                <Button
                  variant="ghost"
                  onClick={() =>
                    audioService.play({
                      message: audioEvent.messageText,
                      soundType: audioEvent.soundType,
                      volume: defaultVolume,
                    })
                  }
                >
                  <PlayCircle size={16} />
                  Testar evento
                </Button>
              </div>
            </Card>
          ))}
      </section>

      <Card>
        <div className="grid-actions">
          <Button
            onClick={() => {
              saveAudioEvents(protocol.id, events, voicePack, soundProfile)
              navigateTo(`/protocol/${protocol.id}/edit`)
            }}
          >
            <Save size={16} />
            Salvar audio
          </Button>
          <Button variant="ghost" onClick={() => navigateTo(`/protocol/${protocol.id}/edit`)}>
            Voltar ao protocolo
          </Button>
        </div>
      </Card>
    </>
  )
}

function eventLabel(eventType: AudioEventSetting['eventType']) {
  const labels: Record<AudioEventSetting['eventType'], string> = {
    PROTOCOL_PRE_START: 'Antes de iniciar',
    PROTOCOL_START: 'Inicio do protocolo',
    PROTOCOL_END: 'Fim do protocolo',
    PROTOCOL_CANCELLED: 'Cancelamento',
    STEP_START: 'Inicio da etapa',
    STEP_HALF_TIME: 'Metade da etapa',
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
    REST_END: 'Fim da pausa',
    ROUND_START: 'Inicio de round',
    ROUND_WARNING: 'Aviso de round',
    ROUND_END: 'Fim de round',
    LAST_ROUND_START: 'Ultimo round',
  }

  return labels[eventType]
}
