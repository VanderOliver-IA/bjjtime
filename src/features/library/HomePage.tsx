import {
  ArrowUpRight,
  Download,
  Bolt,
  Copy,
  FolderPlus,
  Heart,
  Play,
  Search,
  Trash2,
  Swords,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APK_DOWNLOAD_URL } from '../../app/meta'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useReleaseInfo } from '../../hooks/useReleaseInfo'
import { useAppStore } from '../../state/useAppStore'
import { formatDateShort, formatDurationLabel, getCategoryLabel } from '../../utils/format'
import { computeProtocolTotalSeconds } from '../../utils/protocols'

export function HomePage() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const history = useAppStore((state) => state.history)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const duplicateProtocol = useAppStore((state) => state.duplicateProtocol)
  const deleteProtocol = useAppStore((state) => state.deleteProtocol)
  const [search, setSearch] = useState(() => window.sessionStorage.getItem('home-search') ?? '')
  const deferredSearch = useDeferredValue(search)
  const { hasUpdate, isChecking, isInstalledApp, updateUrl } = useReleaseInfo()

  useEffect(() => {
    window.sessionStorage.setItem('home-search', search)
  }, [search])

  const orderedProtocols = useMemo(() => {
    return [...protocols].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })
  }, [protocols])

  const filteredProtocols = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase()

    if (!normalizedQuery) {
      return orderedProtocols
    }

    return orderedProtocols.filter((protocol) => {
      const haystack = `${protocol.name} ${protocol.description} ${protocol.category}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [deferredSearch, orderedProtocols])

  const primaryProtocol = useMemo(() => {
    const lastExecution = history[0]

    if (lastExecution) {
      const matchedProtocol = protocols.find((protocol) => protocol.id === lastExecution.protocolId)

      if (matchedProtocol) {
        return matchedProtocol
      }
    }

    return orderedProtocols[0] ?? null
  }, [history, orderedProtocols, protocols])

  const favoriteProtocols = useMemo(
    () => orderedProtocols.filter((protocol) => protocol.isFavorite).slice(0, 5),
    [orderedProtocols],
  )

  const lastExecution = history[0] ?? null
  const primaryProtocolTotal = primaryProtocol ? computeProtocolTotalSeconds(primaryProtocol) : 0

  return (
    <>
      <div className="home-toolbar">
        <a className="button button--ghost button--md" href={APK_DOWNLOAD_URL}>
          <Download size={16} />
          Instalar app
        </a>
        {hasUpdate && isInstalledApp && !isChecking ? (
          <Button onClick={() => window.location.assign(updateUrl)}>
            <ArrowUpRight size={16} />
            Atualizar
          </Button>
        ) : null}
      </div>

      <Card className="hero-card train-launch-card">
        <p className="eyebrow">
          {lastExecution && primaryProtocol?.id === lastExecution.protocolId
            ? 'Ultimo treino'
            : 'Pronto para o treino?'}
        </p>
        {primaryProtocol ? (
          <>
            <h2 className="train-launch__title">{primaryProtocol.name}</h2>
            <p className="train-launch__summary">
              {primaryProtocol.description || 'Timer pronto para iniciar sem navegar por configuracoes.'}
            </p>
            <div className="train-launch__stats">
              <div className="train-launch__stat">
                <span>Duracao total</span>
                <strong>{formatDurationLabel(primaryProtocolTotal)}</strong>
              </div>
              <div className="train-launch__stat">
                <span>Etapas</span>
                <strong>{primaryProtocol.steps.length}</strong>
              </div>
              <div className="train-launch__stat">
                <span>Categoria</span>
                <strong>{getCategoryLabel(primaryProtocol.category)}</strong>
              </div>
            </div>
            {lastExecution && primaryProtocol.id === lastExecution.protocolId ? (
              <p className="train-launch__caption">
                Ultimo uso em {formatDateShort(lastExecution.finishedAt)}.
              </p>
            ) : null}
            <div className="train-launch__actions">
              <Button
                className="train-launch__button"
                size="lg"
                onClick={() => navigate(`/protocol/${primaryProtocol.id}/run`)}
              >
                <Play size={18} />
                Iniciar treino
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate(`/protocol/${primaryProtocol.id}/edit`)}
              >
                Editar protocolo
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="train-launch__title">Qual treino vamos iniciar agora?</h2>
            <p className="train-launch__summary">
              Crie um protocolo ou copie um modelo pronto para transformar a home em painel de treino.
            </p>
            <div className="train-launch__actions">
              <Button className="train-launch__button" size="lg" onClick={() => navigate('/templates')}>
                <Play size={18} />
                Escolher modelo
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/protocol/new')}>
                <FolderPlus size={18} />
                Novo protocolo
              </Button>
            </div>
          </>
        )}
      </Card>

      <section className="quick-actions-grid quick-actions-grid--home" aria-label="Acoes rapidas">
        <button className="quick-action" onClick={() => navigate('/quick/rola')}>
          <span className="quick-action__icon">
            <Swords size={20} />
          </span>
          <div>
            <strong>Rola rapido</strong>
            <p className="muted">Rounds prontos para treino de luta.</p>
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
        <button className="quick-action" onClick={() => navigate('/protocol/new')}>
          <span className="quick-action__icon">
            <FolderPlus size={20} />
          </span>
          <div>
            <strong>Novo protocolo</strong>
            <p className="muted">Criar do zero com etapas livres.</p>
          </div>
        </button>
      </section>

      {favoriteProtocols.length > 0 ? (
        <Card>
          <div className="page-header">
            <div>
              <p className="eyebrow">Favoritos</p>
              <h2>Protocolos a um toque</h2>
              <p>Use esta area para deixar no topo o que entra no tatame toda semana.</p>
            </div>
          </div>
          <section className="favorites-grid" aria-label="Protocolos favoritos">
            {favoriteProtocols.map((protocol) => (
              <article key={protocol.id} className="favorite-protocol">
                <div>
                  <span className="chip">{getCategoryLabel(protocol.category)}</span>
                  <h3>{protocol.name}</h3>
                  <p className="muted">{formatDurationLabel(computeProtocolTotalSeconds(protocol))}</p>
                </div>
                <div className="favorite-protocol__footer">
                  <Button size="sm" onClick={() => navigate(`/protocol/${protocol.id}/run`)}>
                    <Play size={14} />
                    Iniciar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/protocol/${protocol.id}/edit`)}
                  >
                    Editar
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </Card>
      ) : null}

      {isInstalledApp && !isChecking && hasUpdate ? (
        <Card>
          <div className="page-header">
            <div>
              <p className="eyebrow">Atualizacao</p>
              <h2>Nova versao do app instalada no servidor</h2>
              <p>Baixe o APK atualizado para manter o aplicativo local alinhado com a release publicada.</p>
            </div>
          </div>
          <div className="card-actions">
            <Button onClick={() => window.location.assign(updateUrl)}>
              <Download size={16} />
              Atualizar app
            </Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Biblioteca</p>
            <h2>Protocolos salvos</h2>
            <p>Home para iniciar. Biblioteca para buscar, editar, duplicar e organizar.</p>
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
    </>
  )
}
