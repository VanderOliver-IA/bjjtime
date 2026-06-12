import { Outlet } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { APP_VERSION } from '../../app/meta'
import { AppBottomNav } from './AppBottomNav'
import { useAppStore } from '../../state/useAppStore'

export function ShellLayout() {
  const branding = useAppStore((state) => state.settings.branding)

  return (
    <div className="shell">
      <header className="shell__header">
        <div className="brand-lockup">
          <div className="brand-mark">
            <img
              src={branding.logoDataUrl ?? defaultBrandLogo}
              alt={`Logo ${branding.title}`}
            />
          </div>
          <div>
            <h1 className="shell__title">Timer BJJ</h1>
          </div>
        </div>
      </header>

      <main className="shell__content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>BJJ Timer {APP_VERSION}</p>
        <p>Desenvolvido por Vanderson Oliveira - VibeDoCode</p>
      </footer>

      <AppBottomNav />
    </div>
  )
}
