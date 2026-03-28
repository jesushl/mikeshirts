import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const cart = useCartStore((s) => s.cart)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const [mobileOpen, setMobileOpen] = useState(false)

  const itemCount = cart?.item_count ?? 0

  return (
    <header className="sticky top-0 z-50 bg-brand/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Mike Shirts" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            MIKE <span className="text-accent">SHIRTS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/catalogo" className="hover:text-accent transition-colors">
            Catálogo
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative p-2 hover:text-accent transition-colors"
            aria-label="Carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <Link
              to="/cuenta"
              className="hidden sm:flex items-center gap-2 text-sm hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user.first_name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-sm font-medium px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-brand px-4 py-4 space-y-3">
          <Link to="/catalogo" className="block text-sm font-medium hover:text-accent" onClick={() => setMobileOpen(false)}>
            Catálogo
          </Link>
          {user ? (
            <Link to="/cuenta" className="block text-sm font-medium hover:text-accent" onClick={() => setMobileOpen(false)}>
              Mi Cuenta
            </Link>
          ) : (
            <Link to="/login" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>
              Entrar
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
