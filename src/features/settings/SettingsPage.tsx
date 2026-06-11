import { SlidersHorizontal, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAppStore } from '../../state/useAppStore'

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const clearHistory = useAppStore((state) => state.clearHistory)

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
            </select>
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
              value={settings.theme}
              onChange={(event) =>
                updateSettings({
                  theme: event.target.value as typeof settings.theme,
                })
              }
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </label>

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
