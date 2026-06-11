import { FolderClock, LayoutTemplate, Mic2, Settings } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { APP_VERSION } from '../../app/meta'
import { useAppStore } from '../../state/useAppStore'
import jhLogo from '../../../logo_jh_bjj.jpeg'

const navigationItems = [
  { to: '/', label: 'Biblioteca', icon: FolderClock },
  { to: '/templates', label: 'Modelos', icon: LayoutTemplate },
  { to: '/voices', label: 'Vozes', icon: Mic2 },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function ShellLayout() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const branding = useAppStore((state) => state.settings.branding)
  const quickLaunchProtocol = useMemo(() => {
    const ordered = [...protocols].sort((left, right) => {
      if (left.isFavorite !== right.isFavorite) {
        return left.isFavorite ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })

    return ordered[0] ?? null
  }, [protocols])

  return (
    <div className="shell">
      <header className="shell__header">
        <div className="brand-lockup">
          <div className="brand-mark">
            <img
              src={branding.logoDataUrl ?? jhLogo}
              alt={`Logo ${branding.title}`}
            />
          </div>
          <div>
            <p className="eyebrow">{branding.eyebrow}</p>
            <h1 className="shell__title">{branding.title}</h1>
            <p className="brand-subtitle">{branding.subtitle}</p>
            <p className="version-pill">BJJ Timer {APP_VERSION}</p>
          </div>
        </div>
      </header>

      <main className="shell__content">
        <Outlet />
      </main>

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
          <small>{quickLaunchProtocol ? 'Iniciar agora' : 'Escolher modelo'}</small>
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
