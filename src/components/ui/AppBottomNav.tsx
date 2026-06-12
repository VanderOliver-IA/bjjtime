import { FolderClock, History, Settings2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { usePrimaryProtocol } from '../../hooks/usePrimaryProtocol'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const quickLaunchProtocol = usePrimaryProtocol()

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

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

      <div ref={menuRef} className="bottom-nav__menu">
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
