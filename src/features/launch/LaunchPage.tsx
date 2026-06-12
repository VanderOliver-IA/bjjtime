import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { useAppStore } from '../../state/useAppStore'

export function LaunchPage() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const history = useAppStore((state) => state.history)
  const createFromTemplate = useAppStore((state) => state.createFromTemplate)
  const didRedirectRef = useRef(false)

  const fallbackProtocol = useMemo(() => {
    if (protocols.length === 0) {
      return null
    }

    return [...protocols].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })[0] ?? null
  }, [protocols])

  useEffect(() => {
    if (didRedirectRef.current) {
      return
    }

    const lastExecution = history[0]
    const lastProtocol = lastExecution
      ? protocols.find((protocol) => protocol.id === lastExecution.protocolId) ?? null
      : null

    if (lastProtocol) {
      didRedirectRef.current = true
      navigate(`/protocol/${lastProtocol.id}/run`, { replace: true })
      return
    }

    if (fallbackProtocol) {
      didRedirectRef.current = true
      navigate(`/protocol/${fallbackProtocol.id}/run`, { replace: true })
      return
    }

    const warmupProtocol = createFromTemplate('template-warmup-10')

    if (warmupProtocol) {
      didRedirectRef.current = true
      navigate(`/protocol/${warmupProtocol.id}/run`, { replace: true })
      return
    }

    didRedirectRef.current = true
    navigate('/library', { replace: true })
  }, [createFromTemplate, fallbackProtocol, history, navigate, protocols])

  return (
    <div className="app-loading-shell">
      <div className="pulse-ring">
        <img
          className="pulse-ring__logo"
          src={defaultBrandLogo}
          alt="Logo Timer BJJ"
        />
      </div>
      <div>
        <p className="eyebrow">Timer BJJ</p>
        <h1>Abrindo timer</h1>
        <p>Carregando o ultimo protocolo ou o aquecimento padrao.</p>
      </div>
    </div>
  )
}
