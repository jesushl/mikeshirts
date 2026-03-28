import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatMXN } from '../utils/format'
import CartItemRow from './CartItemRow'

export default function CartDrawer() {
  const { cart, isOpen, isUpdating, isEmpty, closeCart, updateItem, removeItem } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-brand border-l border-border flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-bold text-lg">
            Tu Carrito
            {cart && cart.item_count > 0 && (
              <span className="text-text-muted font-normal text-sm ml-2">
                ({cart.item_count} {cart.item_count === 1 ? 'artículo' : 'artículos'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-text-muted hover:text-text transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-text-muted mb-4">Tu carrito está vacío</p>
              <Link
                to="/catalogo"
                onClick={closeCart}
                className="text-accent hover:text-accent-hover font-medium text-sm"
              >
                Explorar catálogo →
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cart?.items.map((item) => (
                <CartItemRow
                  key={item.variant_id}
                  item={item}
                  onUpdateQuantity={updateItem}
                  onRemove={removeItem}
                  compact
                  disabled={isUpdating}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && cart && (
          <div className="border-t border-border px-5 py-4 space-y-3 shrink-0">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span>{formatMXN(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Envío</span>
              <span>{formatMXN(cart.shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatMXN(cart.total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/carrito"
                onClick={closeCart}
                className="py-2.5 text-center text-sm font-medium border border-border rounded-lg hover:border-text-muted transition-colors"
              >
                Ver Carrito
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="py-2.5 text-center text-sm font-bold bg-accent hover:bg-accent-hover rounded-lg transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
