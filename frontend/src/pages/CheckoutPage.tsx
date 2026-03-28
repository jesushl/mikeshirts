import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useRequireAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { checkout } from '../services/orders'
import { trackEvent } from '../services/analytics'
import { formatMXN } from '../utils/format'
import type { Address } from '../types'

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useRequireAuth()
  const { cart, isEmpty } = useCart()
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) return <CheckoutSkeleton />
  if (!user) return null
  if (isEmpty) return <Navigate to="/catalogo" replace />

  const addresses = user.addresses ?? []
  const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0]
  const activeId = selectedAddressId ?? defaultAddr?.id ?? null

  async function handleCheckout() {
    if (!activeId) return
    setProcessing(true)
    setError(null)
    try {
      trackEvent('checkout_start', { order_total: cart?.total })
      const { init_point } = await checkout(activeId)
      window.location.href = init_point
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Error al procesar el checkout. Inténtalo de nuevo.'
      setError(msg)
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>Checkout — Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Address selection */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Dirección de envío</h2>

          {addresses.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <p className="text-text-muted mb-4">No tienes direcciones guardadas.</p>
              <Link
                to="/cuenta/direcciones/nueva?redirect=/checkout"
                className="text-accent hover:text-accent-hover font-medium"
              >
                Agregar dirección →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={activeId === addr.id}
                  onSelect={() => setSelectedAddressId(addr.id)}
                />
              ))}
              <Link
                to="/cuenta/direcciones/nueva?redirect=/checkout"
                className="inline-block text-sm text-cyan hover:text-cyan-hover mt-2"
              >
                + Agregar otra dirección
              </Link>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-surface border border-border rounded-xl p-6 lg:sticky lg:top-24 space-y-4">
            <h2 className="font-bold text-lg">Resumen del pedido</h2>

            {cart && (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.variant_id} className="flex justify-between text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{item.product_name}</p>
                        <p className="text-text-muted text-xs">{item.size} / {item.color} × {item.quantity}</p>
                      </div>
                      <p className="shrink-0 ml-3 font-medium">{formatMXN(item.line_total)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
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
              </>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!activeId || processing}
              className="w-full py-3.5 rounded-lg font-bold transition-all bg-accent hover:bg-accent-hover disabled:bg-brand-lighter disabled:text-text-muted disabled:cursor-not-allowed"
            >
              {processing ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>

            {!activeId && addresses.length > 0 && (
              <p className="text-xs text-text-muted text-center">Selecciona una dirección para continuar.</p>
            )}

            <Link to="/carrito" className="block text-center text-sm text-text-muted hover:text-accent transition-colors">
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-text-muted bg-surface'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-sm">
            {address.label}
            {address.is_default && (
              <span className="ml-2 text-xs text-cyan font-normal">Predeterminada</span>
            )}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {address.street} {address.ext_number}
            {address.int_number && `, Int. ${address.int_number}`}
          </p>
          <p className="text-sm text-text-muted">
            {address.neighborhood}, {address.city}, {address.state} {address.zip_code}
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
          selected ? 'border-accent' : 'border-border'
        }`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
        </div>
      </div>
    </button>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-8 bg-brand-lighter rounded w-40 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-brand-lighter rounded w-48 mb-4" />
          <div className="h-24 bg-brand-lighter rounded-xl" />
          <div className="h-24 bg-brand-lighter rounded-xl" />
        </div>
        <div className="lg:w-96">
          <div className="h-80 bg-brand-lighter rounded-xl" />
        </div>
      </div>
    </div>
  )
}
