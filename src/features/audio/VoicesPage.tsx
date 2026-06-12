import { Mic, PlayCircle, Plus, Save, Square, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { audioService } from '../../services/audio/audioService'
import { useAppStore } from '../../state/useAppStore'
import type { AudioEventType, VoicePhrase, VoiceProfile } from '../../types/domain'
import { readFileAsDataUrl } from '../../utils/file'
import { getAudioEventLabel } from '../../utils/format'
import { createVoicePhrase, createVoiceProfile } from '../../utils/protocols'

const suggestedPhrases: Array<{
  eventType: AudioEventType
  label: string
  messageText: string
}> = [
  {
    eventType: 'STEP_START',
    label: 'Vamos aquecer',
    messageText: 'Vamos aquecer.',
  },
  {
    eventType: 'STEP_START',
    label: 'Sem moleza',
    messageText: 'Vamos la! Sem moleza!',
  },
  {
    eventType: 'STEP_WARNING_30',
    label: 'Aviso 30 segundos',
    messageText: 'Faltam so 30 segundos.',
  },
  {
    eventType: 'STEP_WARNING_5',
    label: 'Aviso 5 segundos',
    messageText: '5 segundos!',
  },
  {
    eventType: 'STEP_END',
    label: 'Acabou',
    messageText: 'Acabou!',
  },
]

const voicePhraseBundles: Array<{
  id: string
  title: string
  description: string
  phrases: Array<{
    eventType: AudioEventType
    label: string
    messageText: string
  }>
}> = [
  {
    id: 'warmup',
    title: 'Aquecimento',
    description: 'Entrada forte, ritmo inicial e chamada para comecar.',
    phrases: [
      { eventType: 'STEP_START', label: 'Vamos aquecer', messageText: 'Vamos aquecer.' },
      {
        eventType: 'STEP_START',
        label: 'Movimenta',
        messageText: 'Vamos la! Corpo ativo, sem moleza!',
      },
      {
        eventType: 'STEP_WARNING_30',
        label: 'Aquecimento 30',
        messageText: 'Faltam so 30 segundos.',
      },
      { eventType: 'STEP_END', label: 'Troca aquecimento', messageText: 'Acabou!' },
    ],
  },
  {
    id: 'pressure',
    title: 'Pressao',
    description: 'Frases para drill forte, intensidade e cobranca tecnica.',
    phrases: [
      { eventType: 'STEP_START', label: 'Pressiona', messageText: 'Vamos la! Sem moleza!' },
      { eventType: 'STEP_WARNING_20', label: 'Mantem pressao', messageText: 'Mantem a pressao!' },
      { eventType: 'STEP_WARNING_5', label: 'Fechando', messageText: '5 segundos!' },
      { eventType: 'STEP_END', label: 'Acabou pressao', messageText: 'Acabou!' },
    ],
  },
  {
    id: 'rest',
    title: 'Descanso',
    description: 'Pausa guiada para recuperar e preparar a proxima etapa.',
    phrases: [
      { eventType: 'REST_START', label: 'Respira', messageText: 'Respira. Recupera.' },
      {
        eventType: 'REST_WARNING',
        label: 'Volta ja',
        messageText: 'Faltam so 10 segundos de descanso.',
      },
      { eventType: 'STEP_COUNTDOWN_3', label: 'Descanso 3', messageText: '3' },
      { eventType: 'STEP_COUNTDOWN_2', label: 'Descanso 2', messageText: '2' },
      { eventType: 'STEP_COUNTDOWN_1', label: 'Descanso 1', messageText: '1' },
    ],
  },
  {
    id: 'finish',
    title: 'Encerramento',
    description: 'Chamadas de fim, troca e fechamento do treino.',
    phrases: [
      { eventType: 'STEP_TRANSITION', label: 'Troca', messageText: 'Troca!' },
      { eventType: 'PROTOCOL_END', label: 'Fim do treino', messageText: 'Acabou! Boa!' },
      {
        eventType: 'PROTOCOL_CANCELLED',
        label: 'Encerrado manualmente',
        messageText: 'Treino encerrado.',
      },
    ],
  },
]

const voiceStyleAssistants: Array<{
  id: string
  title: string
  description: string
  profileName: string
  profileDescription: string
  phrases: Array<{
    eventType: AudioEventType
    label: string
    messageText: string
  }>
}> = [
  {
    id: 'technical-coach',
    title: 'Professor tecnico',
    description: 'Falas objetivas, claras e focadas na execucao correta.',
    profileName: 'Professor tecnico',
    profileDescription: 'Perfil com linguagem direta e orientacao tecnica.',
    phrases: [
      { eventType: 'STEP_START', label: 'Inicio tecnico', messageText: 'Vamos ajustar a tecnica.' },
      { eventType: 'STEP_START', label: 'Detalhe fino', messageText: 'Executa com precisao.' },
      { eventType: 'STEP_WARNING_30', label: 'Revisao 30', messageText: 'Faltam 30 segundos. Capricha no detalhe.' },
      { eventType: 'STEP_WARNING_10', label: 'Fechamento tecnico', messageText: 'So mais 10. Mantem o controle.' },
      { eventType: 'STEP_END', label: 'Fim tecnico', messageText: 'Acabou. Troca com controle.' },
      { eventType: 'REST_START', label: 'Respira tecnico', messageText: 'Respira e revisa o movimento.' },
    ],
  },
  {
    id: 'motivator-coach',
    title: 'Professor motivador',
    description: 'Mais energia, cobranca e presenca para puxar o treino.',
    profileName: 'Professor motivador',
    profileDescription: 'Perfil forte para ritmo alto e incentivo constante.',
    phrases: [
      { eventType: 'STEP_START', label: 'Comeca forte', messageText: 'Vamos la! Sem moleza!' },
      { eventType: 'STEP_START', label: 'Presenca', messageText: 'Bora! Quero intensidade agora!' },
      { eventType: 'STEP_WARNING_30', label: 'Aviso 30 motivador', messageText: 'Faltam 30 segundos. Nao para!' },
      { eventType: 'STEP_WARNING_5', label: 'Ultimos 5 motivador', messageText: '5 segundos! Fecha forte!' },
      { eventType: 'STEP_END', label: 'Acabou motivador', messageText: 'Acabou! Boa!' },
      { eventType: 'PROTOCOL_END', label: 'Fim motivador', messageText: 'Boa! Treino concluido!' },
    ],
  },
  {
    id: 'kids-coach',
    title: 'Infantil',
    description: 'Tonalidade simples, amigavel e facil para turma infantil.',
    profileName: 'Turma infantil',
    profileDescription: 'Perfil leve e claro para criancas.',
    phrases: [
      { eventType: 'STEP_START', label: 'Vamos brincar e treinar', messageText: 'Vamos comecar! Todo mundo atento!' },
      { eventType: 'STEP_START', label: 'Aquecimento kids', messageText: 'Vamos aquecer com energia!' },
      { eventType: 'STEP_WARNING_30', label: 'Kids 30', messageText: 'Faltam 30 segundos, pessoal!' },
      { eventType: 'STEP_WARNING_5', label: 'Kids 5', messageText: '5 segundos! Ja esta acabando!' },
      { eventType: 'STEP_END', label: 'Fim kids', messageText: 'Acabou! Muito bem!' },
      { eventType: 'REST_START', label: 'Descanso kids', messageText: 'Agora respira e se prepara.' },
    ],
  },
  {
    id: 'competition-coach',
    title: 'Competicao',
    description: 'Comandos curtos e duros para treino de intensidade e foco.',
    profileName: 'Competicao',
    profileDescription: 'Perfil seco e rapido para clima de luta.',
    phrases: [
      { eventType: 'STEP_START', label: 'Valendo competicao', messageText: 'Valendo!' },
      { eventType: 'STEP_START', label: 'Pressao competicao', messageText: 'Pressiona! Nao entrega!' },
      { eventType: 'STEP_WARNING_20', label: 'Competicao 20', messageText: '20 segundos! Mantem a pressao!' },
      { eventType: 'STEP_WARNING_5', label: 'Competicao 5', messageText: '5 segundos! Fecha agora!' },
      { eventType: 'STEP_END', label: 'Fim competicao', messageText: 'Tempo!' },
      { eventType: 'LAST_ROUND_START', label: 'Ultimo round competicao', messageText: 'Ultimo round! Tudo agora!' },
    ],
  },
]

export function VoicesPage() {
  const voiceProfiles = useAppStore((state) => state.voiceProfiles)
  const defaultVolume = useAppStore((state) => state.settings.defaultVolume)
  const upsertVoiceProfile = useAppStore((state) => state.upsertVoiceProfile)
  const deleteVoiceProfile = useAppStore((state) => state.deleteVoiceProfile)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    voiceProfiles[0]?.id ?? null,
  )
  const [draft, setDraft] = useState<VoiceProfile>(() =>
    voiceProfiles[0] ? structuredClone(voiceProfiles[0]) : createVoiceProfile(),
  )
  const [activeRecordingPhraseId, setActiveRecordingPhraseId] = useState<string | null>(null)
  const [recorderError, setRecorderError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop()
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function openProfile(profile: VoiceProfile) {
    setSelectedProfileId(profile.id)
    setDraft(structuredClone(profile))
  }

  function createNewProfile() {
    const profile = createVoiceProfile({
      name: `Nova voz ${voiceProfiles.length + 1}`,
      description: 'Ex: Ludmila - Faixa Preta',
    })

    setSelectedProfileId(profile.id)
    setDraft(profile)
  }

  function saveProfile() {
    const savedProfile = upsertVoiceProfile({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    setSelectedProfileId(savedProfile.id)
    setDraft(structuredClone(savedProfile))
  }

  function addPhrase(partial?: Partial<VoicePhrase>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      phrases: [...currentDraft.phrases, createVoicePhrase(partial)],
    }))
  }

  function addBundle(bundleId: string) {
    const bundle = voicePhraseBundles.find((item) => item.id === bundleId)

    if (!bundle) {
      return
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      phrases: [
        ...currentDraft.phrases,
        ...bundle.phrases.map((phrase) =>
          createVoicePhrase({
            ...phrase,
          }),
        ),
      ],
    }))
  }

  function createProfileFromAssistant(assistantId: string) {
    const assistant = voiceStyleAssistants.find((item) => item.id === assistantId)

    if (!assistant) {
      return
    }

    const profile = createVoiceProfile({
      name: assistant.profileName,
      description: assistant.profileDescription,
      phrases: assistant.phrases.map((phrase) =>
        createVoicePhrase({
          ...phrase,
        }),
      ),
    })

    setSelectedProfileId(profile.id)
    setDraft(profile)
  }

  function updatePhrase(phraseId: string, patch: Partial<VoicePhrase>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      phrases: currentDraft.phrases.map((phrase) =>
        phrase.id === phraseId
          ? {
              ...phrase,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : phrase,
      ),
    }))
  }

  async function startRecording(phraseId: string) {
    if (!('MediaRecorder' in window) || !navigator.mediaDevices?.getUserMedia) {
      setRecorderError('Gravacao direta nao suportada neste dispositivo.')
      return
    }

    setRecorderError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaStreamRef.current = stream
      mediaRecorderRef.current = recorder
      setActiveRecordingPhraseId(phraseId)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const reader = new FileReader()

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            updatePhrase(phraseId, {
              audioDataUrl: reader.result,
              audioName: `gravacao-${Date.now()}.webm`,
            })
          }
        }

        reader.readAsDataURL(blob)
        stream.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
        mediaRecorderRef.current = null
        setActiveRecordingPhraseId(null)
      }

      recorder.start()
    } catch (error) {
      setRecorderError(
        error instanceof Error ? error.message : 'Nao foi possivel iniciar a gravacao.',
      )
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
      mediaRecorderRef.current = null
      setActiveRecordingPhraseId(null)
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
  }

  return (
    <>
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Biblioteca de vozes</p>
            <h2>Grave e nomeie cada voz</h2>
            <p>
              Crie perfis como `Ludmila - Faixa Preta`, grave as palavras direto no app e use
              varias frases para o mesmo gatilho. Quando houver mais de uma, o sistema sorteia
              automaticamente na execucao.
            </p>
          </div>
          <Button variant="secondary" onClick={createNewProfile}>
            <Plus size={16} />
            Nova voz
          </Button>
        </div>
      </Card>

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Assistentes de estilo</p>
            <h2>Crie uma voz-base em um toque</h2>
            <p>
              Escolha um estilo de professor e eu monto um perfil completo com frases base para
              aquecimento, avisos, descanso e encerramento.
            </p>
          </div>
        </div>
        <div className="voice-style-grid">
          {voiceStyleAssistants.map((assistant) => (
            <button
              key={assistant.id}
              className="voice-style-card"
              onClick={() => createProfileFromAssistant(assistant.id)}
            >
              <strong>{assistant.title}</strong>
              <span>{assistant.description}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="chip-row">
          {voiceProfiles.map((profile) => (
            <button
              key={profile.id}
              className={[
                'button',
                selectedProfileId === profile.id ? 'button--secondary' : 'button--ghost',
                'button--sm',
              ].join(' ')}
              onClick={() => openProfile(profile)}
            >
              {profile.name}
            </button>
          ))}
          {!voiceProfiles.length ? (
            <span className="muted">Nenhuma voz salva ainda. Crie a primeira.</span>
          ) : null}
        </div>
      </Card>

      <Card className="settings-card">
        <div className="field-grid">
          <label className="field">
            <span>Nome da voz</span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))
              }
              placeholder="Ex: Ludmila - Faixa Preta"
            />
          </label>
          <label className="field">
            <span>Descricao</span>
            <input
              value={draft.description}
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value,
                }))
              }
              placeholder="Ex: voz oficial do aquecimento"
            />
          </label>
        </div>

        <div className="chip-row">
          {suggestedPhrases.map((phrase) => (
            <button
              key={`${phrase.eventType}-${phrase.label}`}
              className="button button--ghost button--sm"
              onClick={() => addPhrase(phrase)}
            >
              {phrase.label}
            </button>
          ))}
        </div>

        <div className="voice-template-grid">
          {voicePhraseBundles.map((bundle) => (
            <button
              key={bundle.id}
              className="voice-template-card"
              onClick={() => addBundle(bundle.id)}
            >
              <strong>{bundle.title}</strong>
              <span>{bundle.description}</span>
            </button>
          ))}
        </div>

        <div className="card-actions">
          <Button onClick={saveProfile}>
            <Save size={16} />
            Salvar voz
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              addPhrase({
                label: `Nova frase ${draft.phrases.length + 1}`,
                messageText: 'Nova chamada',
              })
            }
          >
            <Plus size={16} />
            Adicionar frase
          </Button>
          {selectedProfileId ? (
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm(`Excluir a voz ${draft.name}?`)) {
                  const remainingProfiles = voiceProfiles.filter(
                    (profile) => profile.id !== selectedProfileId,
                  )

                  deleteVoiceProfile(selectedProfileId)

                  if (remainingProfiles[0]) {
                    openProfile(remainingProfiles[0])
                    return
                  }

                  setSelectedProfileId(null)
                  setDraft(
                    createVoiceProfile({
                      name: 'Nova voz',
                      description: 'Ex: Ludmila - Faixa Preta',
                    }),
                  )
                }
              }}
            >
              <Trash2 size={16} />
              Excluir voz
            </Button>
          ) : null}
        </div>

        {recorderError ? <p className="muted">{recorderError}</p> : null}
      </Card>

      <section className="audio-events-grid">
        {draft.phrases.map((phrase) => (
          <Card key={phrase.id} className="audio-row">
            <div className="step-card__title">
              <div>
                <span className="step-chip">{getAudioEventLabel(phrase.eventType)}</span>
                <h3>{phrase.label}</h3>
                <div className="voice-cue-row">
                  <span className="voice-cue">{getVoiceCueLabel(phrase.eventType)}</span>
                  {draft.phrases.filter((item) => item.eventType === phrase.eventType).length > 1 ? (
                    <span className="voice-cue">Aleatorio</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Nome da frase</span>
                <input
                  value={phrase.label}
                  onChange={(event) => updatePhrase(phrase.id, { label: event.target.value })}
                />
              </label>
              <label className="field">
                <span>Usar em</span>
                <select
                  value={phrase.eventType}
                  onChange={(event) =>
                    updatePhrase(phrase.id, {
                      eventType: event.target.value as AudioEventType,
                    })
                  }
                >
                  {suggestedEventTypes.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {getAudioEventLabel(eventType)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Texto base</span>
              <input
                value={phrase.messageText}
                onChange={(event) =>
                  updatePhrase(phrase.id, { messageText: event.target.value })
                }
                placeholder="Ex: Faltam so 30 segundos."
              />
              <small>
                Se voce gravar o audio, o texto vira apenas uma referencia visual.
              </small>
            </label>

            <div className="audio-upload-row">
              {activeRecordingPhraseId === phrase.id ? (
                <Button variant="danger" onClick={stopRecording}>
                  <Square size={16} />
                  Parar gravacao
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => void startRecording(phrase.id)}>
                  <Mic size={16} />
                  Gravar no app
                </Button>
              )}

              <label className="button button--ghost button--md audio-upload-button">
                <Upload size={16} />
                Enviar audio
                <input
                  accept="audio/*"
                  className="sr-only"
                  type="file"
                  onChange={async (event) => {
                    const file = event.target.files?.[0]

                    if (!file) {
                      return
                    }

                    if (file.size > 2 * 1024 * 1024) {
                      window.alert('O arquivo de áudio excede o limite máximo de 2MB.')
                      return
                    }

                    updatePhrase(phrase.id, {
                      audioDataUrl: await readFileAsDataUrl(file),
                      audioName: file.name,
                    })
                  }}
                />
              </label>

              <Button
                variant="ghost"
                onClick={() =>
                  audioService.play({
                    message: phrase.messageText,
                    customAudioDataUrl: phrase.audioDataUrl,
                    volume: defaultVolume,
                  })
                }
              >
                <PlayCircle size={16} />
                Testar
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    phrases: currentDraft.phrases.filter((item) => item.id !== phrase.id),
                  }))
                }
              >
                <Trash2 size={16} />
                Remover frase
              </Button>
            </div>

            <small>
              {phrase.audioName
                ? `Audio atual: ${phrase.audioName}`
                : 'Nenhuma gravacao ainda. Pode usar gravacao direta ou enviar arquivo.'}
            </small>
          </Card>
        ))}
      </section>
    </>
  )
}

const suggestedEventTypes: AudioEventType[] = [
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
]

function getVoiceCueLabel(eventType: AudioEventType) {
  if (
    eventType === 'PROTOCOL_PRE_START' ||
    eventType === 'PROTOCOL_START' ||
    eventType === 'STEP_START' ||
    eventType === 'REST_START' ||
    eventType === 'ROUND_START' ||
    eventType === 'LAST_ROUND_START'
  ) {
    return 'No inicio'
  }

  if (
    eventType === 'STEP_END' ||
    eventType === 'PROTOCOL_END' ||
    eventType === 'PROTOCOL_CANCELLED'
  ) {
    return 'No fim'
  }

  if (
    eventType === 'STEP_WARNING_30' ||
    eventType === 'STEP_WARNING_20' ||
    eventType === 'STEP_WARNING_10' ||
    eventType === 'STEP_WARNING_5' ||
    eventType === 'REST_WARNING'
  ) {
    return 'Em X segundos'
  }

  if (
    eventType === 'STEP_COUNTDOWN_3' ||
    eventType === 'STEP_COUNTDOWN_2' ||
    eventType === 'STEP_COUNTDOWN_1'
  ) {
    return 'Contagem final'
  }

  return 'Troca de etapa'
}


