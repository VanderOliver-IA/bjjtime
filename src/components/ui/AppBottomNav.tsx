import { FolderClock, History, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../state/useAppStore'

const primaryItems = [
  { to: '/library', label: 'Biblioteca', icon: FolderClock },
  { to: '/history', label: 'Historico', icon: History },
]

const menuItems = [
  { label: 'Ajustes Globais', path: '/settings' },
  { label: 'Vozes', path: '/voices' },
  { label: 'Modelos', path: '/templates' },
  { label: 'Modo Offline', path: '/settings#offline-mode' },
]

export function AppBottomNav() {
  const navigate = useNavigate()
  const protocols = useAppStore((state) => state.protocols)
  const history = useAppStore((state) => state.history)
  const [menuOpen, setMenuOpen] = useState(false)

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
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {primaryItems.map(({ to, label, icon: Icon }) => (
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

      <div className="bottom-nav__menu">
        {menuOpen ? (
          <div className="bottom-nav__popup" role="menu" aria-label="Atalhos de ajustes">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="bottom-nav__popup-item"
                onClick={() => {
                  navigate(item.path)
                  setMenuOpen(false)
                }}
                role="menuitem"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
        <button
          className={[
            'bottom-nav__item',
            'bottom-nav__menu-trigger',
            menuOpen ? 'bottom-nav__item--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Abrir atalhos de ajustes"
        >
          <Settings2 size={18} />
          <span>Ajustes</span>
        </button>
      </div>
    </nav>
  )
}
