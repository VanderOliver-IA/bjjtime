import {
  Dumbbell,
  FolderClock,
  History,
  LayoutTemplate,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { APP_VERSION } from '../../app/meta'

const navigationItems = [
  { to: '/', label: 'Biblioteca', icon: FolderClock },
  { to: '/templates', label: 'Modelos', icon: LayoutTemplate },
  { to: '/history', label: 'Historico', icon: History },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function ShellLayout() {
  return (
    <div className="shell">
      <header className="shell__header">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Dumbbell size={20} strokeWidth={2.3} />
          </div>
          <div>
            <p className="eyebrow">BJJ Timer</p>
            <h1 className="shell__title">Treino no ritmo do tatame</h1>
            <p className="version-pill">{APP_VERSION}</p>
          </div>
        </div>
      </header>

      <main className="shell__content">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="Navegacao principal">
        {navigationItems.map(({ to, label, icon: Icon }) => (
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
