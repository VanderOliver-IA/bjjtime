import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { defaultBrandLogo } from './brandAssets'
import { useAppStore } from '../state/useAppStore'

export function AppProviders({ children }: PropsWithChildren) {
  const hydrated = useAppStore((state) => state.hydrated)
  const hydrate = useAppStore((state) => state.hydrate)
  const theme = useAppStore((state) => state.settings.theme)
  const customTheme = useAppStore((state) => state.settings.customTheme)
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
    const root = document.documentElement

    root.dataset.theme = resolvedTheme

    if (resolvedTheme !== 'custom') {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-secondary')
      root.style.removeProperty('--color-cta')
      root.style.removeProperty('--color-background')
      root.style.removeProperty('--color-panel')
      root.style.removeProperty('--color-panel-strong')
      root.style.removeProperty('--color-surface')
      root.style.removeProperty('--color-border')
      root.style.removeProperty('--color-text')
      root.style.removeProperty('--color-muted')
      root.style.removeProperty('--color-execution-bg')
      root.style.removeProperty('--color-execution-surface')
      return
    }

    root.style.setProperty('--color-primary', customTheme.primary)
    root.style.setProperty('--color-secondary', customTheme.secondary)
    root.style.setProperty('--color-cta', customTheme.secondary)
    root.style.setProperty('--color-background', customTheme.background)
    root.style.setProperty('--color-panel', hexToRgba(customTheme.panel, 0.88))
    root.style.setProperty('--color-panel-strong', hexToRgba(customTheme.panel, 0.98))
    root.style.setProperty('--color-surface', customTheme.panel)
    root.style.setProperty('--color-border', hexToRgba(customTheme.primary, 0.22))
    root.style.setProperty('--color-text', customTheme.text)
    root.style.setProperty('--color-muted', hexToRgba(customTheme.text, 0.68))
    root.style.setProperty('--color-execution-bg', customTheme.background)
    root.style.setProperty('--color-execution-surface', hexToRgba(customTheme.panel, 0.88))
  }, [customTheme, theme])

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

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized
        .split('')
        .map((chunk) => `${chunk}${chunk}`)
        .join('')
    : normalized

  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
