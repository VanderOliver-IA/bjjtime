import {
  Download,
  Bolt,
  Copy,
  FolderPlus,
  Heart,
  Play,
  Search,
  Swords,
  Trash2,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APK_DOWNLOAD_URL, APK_VERSION } from '../../app/meta'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useReleaseInfo } from '../../hooks/useReleaseInfo'
import { useAppStore } from '../../state/useAppStore'
import { formatDateShort, formatDurationLabel, getCategoryLabel } from '../../utils/format'
import { computeProtocolTotalSeconds } from '../../utils/protocols'

export function HomePage() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const branding = useAppStore((state) => state.settings.branding)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const duplicateProtocol = useAppStore((state) => state.duplicateProtocol)
  const deleteProtocol = useAppStore((state) => state.deleteProtocol)
  const [search, setSearch] = useState(() => window.sessionStorage.getItem('home-search') ?? '')
  const deferredSearch = useDeferredValue(search)
  const { hasUpdate, isChecking, isInstalledApp, releaseInfo, updateUrl } = useReleaseInfo()

  useEffect(() => {
    window.sessionStorage.setItem('home-search', search)
  }, [search])

  const filteredProtocols = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase()
    const orderedProtocols = [...protocols].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })

    if (!normalizedQuery) {
      return orderedProtocols
    }

    return orderedProtocols.filter((protocol) => {
      const haystack = `${protocol.name} ${protocol.description} ${protocol.category}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [deferredSearch, protocols])

  return (
    <>
      <Card className="hero-card">
        <p className="eyebrow">{branding.eyebrow}</p>
        <h2>Instale no Android e rode o timer mesmo sem internet.</h2>
        <p>
          Monte drills, pausas e rounds em poucos toques. O app salva tudo localmente no
          aparelho, incluindo voz, logo, nome e personalizacao do seu centro de treino.
        </p>
        <div className="grid-actions">
          <Button onClick={() => navigate('/protocol/new')}>
            <FolderPlus size={18} />
            Novo protocolo
          </Button>
          <a className="button button--ghost button--md" href={APK_DOWNLOAD_URL}>
            <Download size={18} />
            Instalar APK
          </a>
        </div>
      </Card>

      {isInstalledApp && !isChecking ? (
        <Card>
          <div className="page-header">
            <div>
              <p className="eyebrow">Atualizacao do app</p>
              <h2>{hasUpdate ? 'Nova versao disponivel' : 'App atualizado'}</h2>
              <p>
                {hasUpdate && releaseInfo
                  ? `A versao ${releaseInfo.appVersion} ja esta publicada. Toque abaixo para baixar e atualizar o APK.`
                  : 'Seu aplicativo local esta alinhado com a release atual conhecida.'}
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
            <p className="eyebrow">Android offline</p>
            <h2>APK pronto para baixar no celular</h2>
            <p>
              Toque em instalar para baixar o arquivo `bjjtimer-v{APK_VERSION}.apk` direto
              do servidor e usar o sistema no Android com dados locais.
            </p>
          </div>
        </div>
        <div className="card-actions">
          <a className="button button--primary button--md" href={APK_DOWNLOAD_URL}>
            <Download size={18} />
            Baixar APK Android
          </a>
          <Button variant="ghost" onClick={() => navigate('/voices')}>
            Configurar vozes
          </Button>
        </div>
      </Card>

      <section className="quick-actions-grid" aria-label="Acoes rapidas">
        <button className="quick-action" onClick={() => navigate('/protocol/new')}>
          <span className="quick-action__icon">
            <FolderPlus size={20} />
          </span>
          <div>
            <strong>Novo protocolo</strong>
            <p className="muted">Criar do zero com etapas livres.</p>
          </div>
        </button>
        <button className="quick-action" onClick={() => navigate('/quick/drill')}>
          <span className="quick-action__icon">
            <Bolt size={20} />
          </span>
          <div>
            <strong>Drill rapido</strong>
            <p className="muted">Gera acao + pausa em repeticoes.</p>
          </div>
        </button>
        <button className="quick-action" onClick={() => navigate('/quick/rola')}>
          <span className="quick-action__icon">
            <Swords size={20} />
          </span>
          <div>
            <strong>Rola rapido</strong>
            <p className="muted">Rounds prontos para treino de luta.</p>
          </div>
        </button>
        <button className="quick-action" onClick={() => navigate('/history')}>
          <span className="quick-action__icon">
            <Play size={20} />
          </span>
          <div>
            <strong>Historico</strong>
            <p className="muted">Confira consistencia e protocolos usados.</p>
          </div>
        </button>
      </section>

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Biblioteca</p>
            <h2>Protocolos salvos</h2>
            <p>Favoritos sobem para o topo e ficam a dois toques do treino.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/templates')}>
            Modelos
          </Button>
        </div>

        <div className="search-row">
          <label className="field" htmlFor="search-protocols">
            <span className="section-title">Buscar protocolo</span>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.9rem',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-muted)',
                }}
              />
              <input
                id="search-protocols"
                className="search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex: rola 5x5, drill 30/5, aquecimento"
                style={{ paddingLeft: '2.7rem' }}
              />
            </div>
          </label>
        </div>
      </Card>

      {filteredProtocols.length === 0 ? (
        <Card className="empty-state">
          <div className="empty-state__icon">
            <FolderPlus size={28} />
          </div>
          <h3>Nenhum protocolo salvo ainda</h3>
          <p className="muted">
            Comece do zero ou copie um modelo pronto para ter algo executavel em segundos.
          </p>
          <div className="grid-actions">
            <Button onClick={() => navigate('/protocol/new')}>Criar manualmente</Button>
            <Button variant="ghost" onClick={() => navigate('/templates')}>
              Abrir modelos
            </Button>
          </div>
        </Card>
      ) : (
        <section className="protocol-list">
          {filteredProtocols.map((protocol) => {
            const totalSeconds = computeProtocolTotalSeconds(protocol)

            return (
              <Card key={protocol.id} className="protocol-card">
                <div className="protocol-card__top">
                  <div>
                    <div className="chip-row">
                      <span className="chip">{getCategoryLabel(protocol.category)}</span>
                      {protocol.builtInSourceId ? <span className="chip">Baseado em modelo</span> : null}
                    </div>
                    <h3>{protocol.name}</h3>
                    <p className="muted">{protocol.description || 'Sem descricao'}</p>
                  </div>
                  <button
                    className="button button--ghost button--sm"
                    onClick={() => toggleFavorite(protocol.id)}
                    aria-label={protocol.isFavorite ? 'Desfavoritar protocolo' : 'Favoritar protocolo'}
                  >
                    <Heart
                      size={16}
                      fill={protocol.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <div className="protocol-stat-grid">
                  <div className="protocol-stat">
                    <span className="protocol-stat__label">Duracao</span>
                    <strong>{formatDurationLabel(totalSeconds)}</strong>
                  </div>
                  <div className="protocol-stat">
                    <span className="protocol-stat__label">Etapas</span>
                    <strong>{protocol.steps.length}</strong>
                  </div>
                  <div className="protocol-stat">
                    <span className="protocol-stat__label">Atualizado</span>
                    <strong>{formatDateShort(protocol.updatedAt)}</strong>
                  </div>
                </div>

                <div className="protocol-card__footer">
                  <Button onClick={() => navigate(`/protocol/${protocol.id}/run`)}>
                    <Play size={16} />
                    Iniciar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/protocol/${protocol.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => duplicateProtocol(protocol.id)}
                  >
                    <Copy size={16} />
                    Duplicar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`Excluir ${protocol.name}?`)) {
                        deleteProtocol(protocol.id)
                      }
                    }}
                  >
                    <Trash2 size={16} />
                    Excluir
                  </Button>
                </div>

                <p className="muted">Ultima edicao: {formatDateShort(protocol.updatedAt)}</p>
              </Card>
            )
          })}
        </section>
      )}

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Dica</p>
            <h2>Fluxo mais rapido</h2>
            <p>Favoritou um protocolo? A partir daqui, iniciar o treino vira um gesto de dois toques.</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => navigate('/templates')}>
          Abrir modelos de treino
        </Button>
      </Card>
    </>
  )
}
