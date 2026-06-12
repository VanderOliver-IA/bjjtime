import { Download, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { APK_DOWNLOAD_URL, APK_VERSION } from '../../app/meta'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useReleaseInfo } from '../../hooks/useReleaseInfo'
import { audioService } from '../../services/audio/audioService'
import { useAppStore } from '../../state/useAppStore'

export function SettingsPage() {
  const navigate = useNavigate()
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const clearHistory = useAppStore((state) => state.clearHistory)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const { hasUpdate, isChecking, isInstalledApp, releaseInfo, updateUrl } = useReleaseInfo()

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
            <p className="eyebrow">Configuracoes</p>
            <h2>Ajustes globais</h2>
            <p>
              Preferencias que servem como padrao para novos protocolos e para a experiencia
              de execucao.
            </p>
          </div>
          <div className="brand-mark">
            <SlidersHorizontal size={20} />
          </div>
        </div>
      </Card>

      <Card className="settings-card">
        <div className="field-grid">
          <label className="field">
            <span>Nome principal</span>
            <input
              value={settings.branding.title}
              onChange={(event) =>
                updateSettings({
                  branding: {
                    ...settings.branding,
                    title: event.target.value,
                  },
                })
              }
            />
          </label>

          <label className="field">
            <span>Etiqueta superior</span>
            <input
              value={settings.branding.eyebrow}
              onChange={(event) =>
                updateSettings({
                  branding: {
                    ...settings.branding,
                    eyebrow: event.target.value,
                  },
                })
              }
            />
          </label>

          <label className="field">
            <span>Subtitulo</span>
            <input
              value={settings.branding.subtitle}
              onChange={(event) =>
                updateSettings({
                  branding: {
                    ...settings.branding,
                    subtitle: event.target.value,
                  },
                })
              }
            />
          </label>

          <label className="field">
            <span>Logo local</span>
            <div className="settings-logo-panel">
              <img
                className="settings-logo-preview"
                src={settings.branding.logoDataUrl ?? defaultBrandLogo}
                alt={`Logo ${settings.branding.title}`}
              />
              <div className="audio-upload-row">
                <label className="button button--ghost button--md audio-upload-button">
                  Enviar logo
                  <input
                    accept="image/*"
                    className="sr-only"
                    type="file"
                    onChange={async (event) => {
                      const file = event.target.files?.[0]

                      if (!file) {
                        return
                      }

                      updateSettings({
                        branding: {
                          ...settings.branding,
                          logoDataUrl: await readFileAsDataUrl(file),
                        },
                      })
                    }}
                  />
                </label>
                {settings.branding.logoDataUrl ? (
                  <Button
                    variant="danger"
                    onClick={() =>
                      updateSettings({
                        branding: {
                          ...settings.branding,
                          logoDataUrl: null,
                        },
                      })
                    }
                  >
                    Remover logo
                  </Button>
                ) : null}
              </div>
              <small>A logo enviada fica salva localmente no proprio aparelho.</small>
            </div>
          </label>

          <label className="field">
            <span>Volume padrao</span>
            <input
              min={0}
              max={1}
              step={0.05}
              type="range"
              value={settings.defaultVolume}
              onChange={(event) =>
                updateSettings({ defaultVolume: Number(event.target.value) })
              }
            />
            <small>{Math.round(settings.defaultVolume * 100)}%</small>
          </label>

          <label className="field">
            <span>Voz padrao</span>
            <select
              value={settings.defaultVoice}
              onChange={(event) =>
                updateSettings({
                  defaultVoice: event.target.value as typeof settings.defaultVoice,
                })
              }
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
            </select>
            <small>
              Para frases personalizadas e audios enviados, use o gerenciador de vozes dentro de
              cada protocolo.
            </small>
          </label>

          <label className="field">
            <span>Beep padrao</span>
            <select
              value={settings.defaultBeep}
              onChange={(event) =>
                updateSettings({
                  defaultBeep: event.target.value as typeof settings.defaultBeep,
                })
              }
            >
              <option value="bell">Bell</option>
              <option value="beep">Beep</option>
              <option value="gong">Gongo</option>
              <option value="whistle">Apito</option>
              <option value="none">Sem som</option>
            </select>
          </label>

          <label className="field">
            <span>Tema</span>
            <select
              value={settings.theme === 'system' ? 'dark' : settings.theme}
              onChange={(event) =>
                updateSettings({
                  theme: event.target.value as typeof settings.theme,
                })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Claro</option>
              <option value="glass">Glass verde</option>
              <option value="custom">Personalizado</option>
            </select>
          </label>

          {settings.theme === 'custom' ? (
            <>
              <label className="field">
                <span>Cor principal</span>
                <input
                  type="color"
                  value={settings.customTheme.primary}
                  onChange={(event) =>
                    updateSettings({
                      customTheme: {
                        ...settings.customTheme,
                        primary: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Cor secundaria</span>
                <input
                  type="color"
                  value={settings.customTheme.secondary}
                  onChange={(event) =>
                    updateSettings({
                      customTheme: {
                        ...settings.customTheme,
                        secondary: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Fundo</span>
                <input
                  type="color"
                  value={settings.customTheme.background}
                  onChange={(event) =>
                    updateSettings({
                      customTheme: {
                        ...settings.customTheme,
                        background: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Painel</span>
                <input
                  type="color"
                  value={settings.customTheme.panel}
                  onChange={(event) =>
                    updateSettings({
                      customTheme: {
                        ...settings.customTheme,
                        panel: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Texto</span>
                <input
                  type="color"
                  value={settings.customTheme.text}
                  onChange={(event) =>
                    updateSettings({
                      customTheme: {
                        ...settings.customTheme,
                        text: event.target.value,
                      },
                    })
                  }
                />
              </label>
            </>
          ) : null}

          <label className="field field--inline">
            <span>Vibracao ligada</span>
            <input
              className="toggle"
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={(event) =>
                updateSettings({ vibrationEnabled: event.target.checked })
              }
            />
          </label>

          <label className="field field--inline">
            <span>Manter tela ligada</span>
            <input
              className="toggle"
              type="checkbox"
              checked={settings.keepScreenOn}
              onChange={(event) =>
                updateSettings({ keepScreenOn: event.target.checked })
              }
            />
          </label>
        </div>
      </Card>

      <Card id="voices-library">
        <div className="page-header">
          <div>
            <p className="eyebrow">Menu de vozes</p>
            <h2>Biblioteca separada para gravacao</h2>
            <p>
              Grave vozes como `Ludmila - Faixa Preta`, crie varias frases por gatilho e depois
              selecione esse perfil dentro de cada protocolo.
            </p>
          </div>
        </div>
        <div className="card-actions">
          <Button onClick={() => navigate('/voices')}>Abrir biblioteca de vozes</Button>
        </div>
      </Card>

      <Card id="offline-mode">
        <div className="page-header">
          <div>
            <p className="eyebrow">Instalacao Android</p>
            <h2>APK direto no telefone</h2>
            <p>
              {`Baixe a versao v${APK_VERSION} diretamente do servidor e instale no Android para usar o timer offline com configuracoes locais.`}
            </p>
          </div>
        </div>
        <div className="card-actions">
          <a className="button button--primary button--md" href={APK_DOWNLOAD_URL}>
            <Download size={16} />
            Instalar APK
          </a>
        </div>
      </Card>

      {isInstalledApp && !isChecking ? (
        <Card>
          <div className="page-header">
            <div>
              <p className="eyebrow">Atualizacao automatica</p>
              <h2>{hasUpdate ? 'Atualizacao encontrada' : 'Versao atualizada'}</h2>
              <p>
                {hasUpdate && releaseInfo
                  ? `A release ${releaseInfo.appVersion} foi detectada no servidor. Toque para baixar e iniciar a atualizacao do aplicativo.`
                  : 'Nenhuma versao mais nova foi encontrada agora.'}
              </p>
            </div>
          </div>
          {hasUpdate ? (
            <div className="card-actions">
              <Button onClick={() => window.location.assign(updateUrl)}>
                <Download size={16} />
                Atualizar app
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Dados locais</p>
            <h2>Operacoes seguras</h2>
            <p>O app e offline-first. As alteracoes aqui afetam apenas este dispositivo.</p>
          </div>
        </div>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Limpar todo o historico de execucoes locais?')) {
              clearHistory()
            }
          }}
        >
          <Trash2 size={16} />
          Limpar historico
        </Button>
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

      reject(new Error('Falha ao carregar arquivo.'))
    }

    reader.onerror = () => reject(reader.error ?? new Error('Falha ao carregar arquivo.'))
    reader.readAsDataURL(file)
  })
}
