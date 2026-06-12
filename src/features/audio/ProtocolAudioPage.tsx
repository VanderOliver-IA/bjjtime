import { PlayCircle, Save, Trash2, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { audioService } from '../../services/audio/audioService'
import { useAppStore } from '../../state/useAppStore'
import type { AudioEventSetting, Protocol } from '../../types/domain'
import { getAudioEventLabel } from '../../utils/format'
import { pickVoiceProfilePhrase } from '../../utils/protocols'

const editableEvents = [
  'PROTOCOL_PRE_START',
  'PROTOCOL_START',
  'STEP_START',
  'STEP_WARNING_30',
  'STEP_WARNING_20',
  'STEP_WARNING_10',
  'STEP_WARNING_5',
  'STEP_COUNTDOWN_3',
  'STEP_COUNTDOWN_2',
  'STEP_COUNTDOWN_1',
  'STEP_END',
  'STEP_TRANSITION',
  'REST_START',
  'REST_WARNING',
  'LAST_ROUND_START',
  'PROTOCOL_END',
  'PROTOCOL_CANCELLED',
] as const

export function ProtocolAudioPage() {
  const navigate = useNavigate()
  const { protocolId } = useParams()
  const protocols = useAppStore((state) => state.protocols)
  const settings = useAppStore((state) => state.settings)
  const voiceProfiles = useAppStore((state) => state.voiceProfiles)
  const protocol = useMemo(
    () => protocols.find((item) => item.id === protocolId) ?? null,
    [protocolId, protocols],
  )

  if (!protocol) {
    return (
      <Card className="empty-state">
        <h3>Salve o protocolo antes de editar o audio.</h3>
        <Button onClick={() => navigate('/library')}>Voltar para biblioteca</Button>
      </Card>
    )
  }

  return (
    <ProtocolAudioForm
      key={protocol.id}
      navigateTo={navigate}
      protocol={protocol}
      defaultVolume={settings.defaultVolume}
      voiceProfiles={voiceProfiles}
    />
  )
}

interface ProtocolAudioFormProps {
  defaultVolume: number
  navigateTo: ReturnType<typeof useNavigate>
  protocol: Protocol
  voiceProfiles: ReturnType<typeof useAppStore.getState>['voiceProfiles']
}

function ProtocolAudioForm({
  defaultVolume,
  navigateTo,
  protocol,
  voiceProfiles,
}: ProtocolAudioFormProps) {
  const saveAudioEvents = useAppStore((state) => state.saveAudioEvents)
  const [events, setEvents] = useState<AudioEventSetting[]>(protocol.audioEvents)
  const [voicePack, setVoicePack] = useState(protocol.voicePack)
  const [soundProfile, setSoundProfile] = useState<Protocol['soundProfile']>(protocol.soundProfile)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      return
    }

    function syncVoices() {
      setAvailableVoices(audioService.getAvailableVoices())
    }

    syncVoices()
    window.speechSynthesis.onvoiceschanged = syncVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Vozes e palavras</p>
            <h2>{protocol.name}</h2>
            <p>
              Escolha a voz, ajuste as frases de mecanica do treino e envie audios reais para
              sobrescrever cada chamada importante.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="field-grid">
          <label className="field">
            <span>Estilo de voz</span>
            <select
              value={voicePack}
              onChange={(event) => setVoicePack(event.target.value)}
            >
              <option value="coach">Professor motivador</option>
              <option value="neutral">Professor neutro</option>
              <option value="competition">Competicao</option>
              {availableVoices.length > 0 ? <option disabled>──────────</option> : null}
              {availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={`voice:${voice.name}`}>
                  Voz do dispositivo: {voice.name}
                </option>
              ))}
              {voiceProfiles.length > 0 ? <option disabled>──────────</option> : null}
              {voiceProfiles.map((profile) => (
                <option key={profile.id} value={`profile:${profile.id}`}>
                  Biblioteca gravada: {profile.name}
                </option>
              ))}
            </select>
            <small>
              Para gravar varias frases com nome proprio, use o menu `Vozes`.
            </small>
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
        <p className="muted">
          Se voce enviar um audio em um evento abaixo, ele substitui a fala sintetizada daquele
          momento especifico.
        </p>
        <div className="card-actions">
          <Button variant="ghost" onClick={() => navigateTo('/voices')}>
            Abrir biblioteca de vozes
          </Button>
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
                  <h3>{getAudioEventLabel(audioEvent.eventType)}</h3>
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

              <label className="field">
                <span>Audio enviado</span>
                <div className="audio-upload-row">
                  <label className="button button--ghost button--md audio-upload-button">
                    <Upload size={16} />
                    Enviar voz
                    <input
                      accept="audio/*"
                      className="sr-only"
                      type="file"
                      onChange={async (event) => {
                        const file = event.target.files?.[0]

                        if (!file) {
                          return
                        }

                        const customAudioDataUrl = await readFileAsDataUrl(file)

                        setEvents((currentEvents) =>
                          currentEvents.map((item) =>
                            item.id === audioEvent.id
                              ? {
                                  ...item,
                                  customAudioDataUrl,
                                  customAudioName: file.name,
                                }
                              : item,
                          ),
                        )
                      }}
                    />
                  </label>
                  {audioEvent.customAudioDataUrl ? (
                    <Button
                      variant="danger"
                      onClick={() =>
                        setEvents((currentEvents) =>
                          currentEvents.map((item) =>
                            item.id === audioEvent.id
                              ? {
                                  ...item,
                                  customAudioDataUrl: null,
                                  customAudioName: null,
                                }
                              : item,
                          ),
                        )
                      }
                    >
                      <Trash2 size={16} />
                      Remover audio
                    </Button>
                  ) : null}
                </div>
                <small>
                  {audioEvent.customAudioName
                    ? `Arquivo atual: ${audioEvent.customAudioName}`
                    : 'Nenhum audio enviado. A frase sintetizada sera usada.'}
                </small>
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
                {audioEvent.triggerSecondsBeforeEnd !== undefined ? (
                  <label className="field">
                    <span>Disparar em X segundos</span>
                    <input
                      min={1}
                      type="number"
                      value={audioEvent.triggerSecondsBeforeEnd}
                      onChange={(event) =>
                        setEvents((currentEvents) =>
                          currentEvents.map((item) =>
                            item.id === audioEvent.id
                              ? {
                                  ...item,
                                  triggerSecondsBeforeEnd: Number(event.target.value),
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </label>
                ) : null}
              </div>

              <div className="audio-row__footer">
                <Button
                  variant="ghost"
                  onClick={() => {
                    const profilePhrase = pickVoiceProfilePhrase(
                      voiceProfiles,
                      voicePack,
                      audioEvent.eventType,
                    )

                    audioService.play({
                      message: profilePhrase?.messageText ?? audioEvent.messageText,
                      soundType: audioEvent.soundType,
                      volume: defaultVolume,
                      customAudioDataUrl:
                        audioEvent.customAudioDataUrl ?? profilePhrase?.audioDataUrl ?? null,
                      voicePreset: voicePack.startsWith('profile:')
                        ? 'coach'
                        : voicePack,
                    })
                  }}
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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Falha ao carregar audio.'))
    }

    reader.onerror = () => reject(reader.error ?? new Error('Falha ao carregar audio.'))
    reader.readAsDataURL(file)
  })
}
