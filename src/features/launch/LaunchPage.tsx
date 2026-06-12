import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { usePrimaryProtocol } from '../../hooks/usePrimaryProtocol'
import { useAppStore } from '../../state/useAppStore'

export function LaunchPage() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const createFromTemplate = useAppStore((state) => state.createFromTemplate)
  const didRedirectRef = useRef(false)
  const primaryProtocol = usePrimaryProtocol()

  useEffect(() => {
    if (didRedirectRef.current) {
      return
    }

    didRedirectRef.current = true

    if (primaryProtocol) {
      navigate(`/protocol/${primaryProtocol.id}/run`, { replace: true })
      return
    }

    const existingWarmup = protocols.find(
      (protocol) => protocol.builtInSourceId === 'template-warmup-10',
    )

    if (existingWarmup) {
      navigate(`/protocol/${existingWarmup.id}/run`, { replace: true })
      return
    }

    const warmupProtocol = createFromTemplate('template-warmup-10')

    if (warmupProtocol) {
      navigate(`/protocol/${warmupProtocol.id}/run`, { replace: true })
      return
    }

    navigate('/library', { replace: true })
  }, [createFromTemplate, navigate, primaryProtocol, protocols])

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
