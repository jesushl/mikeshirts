import { Link, NavLink } from 'react-router-dom'
import { useStaffAuth } from '../../hooks/useStaffAuth'

interface Props {
  mobileOpen: boolean
  onClose: () => void
}

const NAV_ITEMS: { to: string; label: string; icon: string; roles: string[] }[] = [
  { to: '/gestion', label: 'Dashboard', icon: '📊', roles: [] },
  { to: '/gestion/ventas', label: 'Ventas', icon: '💰', roles: ['ventas'] },
  { to: '/gestion/produccion', label: 'Producción', icon: '🏭', roles: ['produccion'] },
  { to: '/gestion/envios', label: 'Envíos', icon: '📦', roles: ['envios'] },
  { to: '/gestion/analytics', label: 'Analítica', icon: '📈', roles: [] },
]

export default function AdminSidebar({ mobileOpen, onClose }: Props) {
  const { user, hasRole, isAdmin } = useStaffAuth()

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.length === 0 || isAdmin || item.roles.some((r) => hasRole(r)),
  )

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-brand border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="px-5 py-5 border-b border-border">
          <Link to="/gestion" className="flex items-center gap-2" onClick={onClose}>
            <img src="/logo.png" alt="" className="w-8 h-8" />
            <div>
              <p className="text-sm font-bold leading-none">MIKE SHIRTS</p>
              <p className="text-[10px] text-text-muted">Gestión</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/gestion'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-brand-lighter'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border space-y-3">
          <Link
            to="/"
            onClick={onClose}
            className="block text-xs text-text-muted hover:text-accent transition-colors"
          >
            ← Volver a la tienda
          </Link>
          {user && (
            <p className="text-xs text-text-muted truncate">{user.first_name} {user.last_name}</p>
          )}
        </div>
      </aside>
    </>
  )
}
