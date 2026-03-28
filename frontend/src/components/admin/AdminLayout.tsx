import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useRequireStaff } from '../../hooks/useStaffAuth'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const { isLoading, isStaff } = useRequireStaff()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading || !isStaff) return null

  return (
    <div className="min-h-screen flex">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-brand/95 backdrop-blur border-b border-border px-4 h-14 flex items-center">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-text-muted hover:text-text"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-bold text-sm">Gestión</span>
        </div>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
