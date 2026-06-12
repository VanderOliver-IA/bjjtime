import { FolderClock, LayoutTemplate, Mic2, Settings } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { defaultBrandLogo } from '../../app/brandAssets'
import { APP_VERSION } from '../../app/meta'
import { useAppStore } from '../../state/useAppStore'

const navigationItems = [
  { to: '/library', label: 'Biblioteca', icon: FolderClock },
  { to: '/templates', label: 'Modelos', icon: LayoutTemplate },
  { to: '/voices', label: 'Vozes', icon: Mic2 },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function ShellLayout() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const history = useAppStore((state) => state.history)
  const branding = useAppStore((state) => state.settings.branding)
  const quickLaunchProtocol = useMemo(() => {
    const lastExecution = history[0]

    if (lastExecution) {
      const lastProtocol = protocols.find((protocol) => protocol.id === lastExecution.protocolId)

      if (lastProtocol) {
        return lastProtocol
      }
    }

    const ordered = [...protocols].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })

    return ordered[0] ?? null
  }, [history, protocols])

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

      <nav className="bottom-nav" aria-label="Navegacao principal">
        {navigationItems.slice(0, 2).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['bottom-nav__item', isActive ? 'bottom-nav__item--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          className="bottom-nav__cta"
          onClick={() => {
            if (quickLaunchProtocol) {
              navigate(`/protocol/${quickLaunchProtocol.id}/run`)
              return
            }

            navigate('/templates')
          }}
        >
          <span>VAI!</span>
        </button>

        {navigationItems.slice(2).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['bottom-nav__item', isActive ? 'bottom-nav__item--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
