import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchOrder } from '../../services/orders'
import { formatMXN } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import type { OrderDetail } from '../../types'

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const setCart = useCartStore((s) => s.setCart)

  useEffect(() => {
    setCart(null)
  }, [setCart])

  useEffect(() => {
    if (!orderId) { setLoading(false); return }
    fetchOrder(Number(orderId))
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>Pago Exitoso — Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-black mb-2">¡Pago exitoso!</h1>
      <p className="text-text-muted mb-8">Tu pedido ha sido confirmado. Recibirás un email de confirmación.</p>

      {loading && (
        <div className="bg-surface border border-border rounded-xl p-6 animate-pulse space-y-3">
          <div className="h-5 bg-brand-lighter rounded w-1/2 mx-auto" />
          <div className="h-4 bg-brand-lighter rounded w-1/3 mx-auto" />
        </div>
      )}

      {order && (
        <div className="bg-surface border border-border rounded-xl p-6 text-left space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Pedido #{order.id}</h2>
            {order.sale_ticket && (
              <span className="text-sm text-cyan font-medium">Folio: {order.sale_ticket.folio}</span>
            )}
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product_name} ({item.variant_desc}) × {item.quantity}</span>
                <span className="font-medium">{formatMXN(item.line_total)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span>{formatMXN(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Envío</span>
              <span>{formatMXN(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>{formatMXN(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link
          to="/pedidos"
          className="px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-bold transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          to="/catalogo"
          className="px-6 py-3 border border-border hover:border-text-muted rounded-lg font-medium transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
