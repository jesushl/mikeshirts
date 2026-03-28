import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatMXN } from '../utils/format'
import CartItemRow from '../components/CartItemRow'

export default function CartPage() {
  const { cart, isEmpty, isUpdating, updateItem, removeItem, clearAll } = useCart()

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg className="w-20 h-20 text-border mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-text-muted mb-6">Agrega productos desde nuestro catálogo.</p>
        <Link
          to="/catalogo"
          className="inline-block px-8 py-3 bg-accent hover:bg-accent-hover rounded-lg font-bold transition-colors"
        >
          Ver Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tu Carrito</h1>
        <button
          onClick={clearAll}
          disabled={isUpdating}
          className="text-sm text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items list */}
        <div className="flex-1 space-y-6">
          {cart?.items.map((item) => (
            <div key={item.variant_id} className="pb-6 border-b border-border last:border-0">
              <CartItemRow
                item={item}
                onUpdateQuantity={updateItem}
                onRemove={removeItem}
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>

        {/* Order summary */}
        {cart && (
          <div className="lg:w-80 shrink-0">
            <div className="bg-surface border border-border rounded-xl p-6 lg:sticky lg:top-24 space-y-4">
              <h2 className="font-bold text-lg">Resumen del pedido</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">
                    Subtotal ({cart.item_count} {cart.item_count === 1 ? 'artículo' : 'artículos'})
                  </span>
                  <span>{formatMXN(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Envío</span>
                  <span>{formatMXN(cart.shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xl pt-3 border-t border-border">
                <span>Total</span>
                <span>{formatMXN(cart.total)}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-3 text-center font-bold bg-accent hover:bg-accent-hover rounded-lg transition-colors"
              >
                Ir al Checkout
              </Link>

              <Link
                to="/catalogo"
                className="block text-center text-sm text-text-muted hover:text-accent transition-colors"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
