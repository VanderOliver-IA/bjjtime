import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { defaultBrandLogo } from './brandAssets'
import { useAppStore } from '../state/useAppStore'

export function AppProviders({ children }: PropsWithChildren) {
  const hydrated = useAppStore((state) => state.hydrated)
  const hydrate = useAppStore((state) => state.hydrate)
  const theme = useAppStore((state) => state.settings.theme)
  const branding = useAppStore((state) => state.settings.branding)

  useEffect(() => {
    if (!hydrated) {
      void hydrate()
    }
  }, [hydrate, hydrated])

  useEffect(() => {
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    document.documentElement.dataset.theme = resolvedTheme
  }, [theme])

  if (!hydrated) {
    return (
      <div className="app-loading-shell">
        <div className="pulse-ring">
          <img
            className="pulse-ring__logo"
            src={branding.logoDataUrl ?? defaultBrandLogo}
            alt={`Logo ${branding.title}`}
          />
        </div>
        <div>
          <p className="eyebrow">{branding.eyebrow}</p>
          <h1>Carregando o tatame</h1>
          <p>Preparando protocolos, audio e configuracoes locais de {branding.title}.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
