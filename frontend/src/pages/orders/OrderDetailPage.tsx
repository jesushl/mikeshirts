import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useRequireAuth } from '../../hooks/useAuth'
import { fetchOrder } from '../../services/orders'
import { formatMXN } from '../../utils/format'
import StatusBadge from '../../components/StatusBadge'
import OrderTimeline from '../../components/OrderTimeline'
import type { OrderDetail } from '../../types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading: authLoading } = useRequireAuth()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!user || !id) return
    fetchOrder(Number(id))
      .then(setOrder)
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [user, id])

  if (authLoading) return null

  if (loading) return <OrderDetailSkeleton />

  if (notFound || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Pedido no encontrado</h1>
        <Link to="/pedidos" className="text-accent hover:text-accent-hover font-medium">
          ← Volver a mis pedidos
        </Link>
      </div>
    )
  }

  const addr = order.shipping_address

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Helmet><title>Pedido #{order.id} — Mike Shirts</title></Helmet>

      <Link to="/pedidos" className="text-sm text-text-muted hover:text-accent transition-colors mb-4 inline-block">
        ← Mis Pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
        <StatusBadge status={order.status} label={order.status_display} />
        <span className="text-sm text-text-muted">
          {new Date(order.created_at).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Items */}
          <section className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-bold mb-4">Productos</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-text-muted text-xs">{item.variant_desc} × {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-medium">{formatMXN(item.line_total)}</p>
                    <p className="text-text-muted text-xs">{formatMXN(item.unit_price)} c/u</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-3 space-y-1 text-sm">
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
          </section>

          {/* Tickets */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-bold">Tickets</h2>

            {order.sale_ticket && (
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Ticket de Venta</p>
                  <p className="text-text-muted text-xs">Folio: {order.sale_ticket.folio}</p>
                </div>
                <span className="text-xs text-text-muted">
                  {new Date(order.sale_ticket.issued_at).toLocaleDateString('es-MX')}
                </span>
              </div>
            )}

            {order.ship_ticket && (
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Ticket de Envío</p>
                  <StatusBadge status={order.ship_ticket.status} label={order.ship_ticket.status_display} />
                </div>
                {order.ship_ticket.carrier && (
                  <p className="text-text-muted text-xs mt-1">
                    {order.ship_ticket.carrier}
                    {order.ship_ticket.tracking_number && ` — Guía: ${order.ship_ticket.tracking_number}`}
                  </p>
                )}
              </div>
            )}

            {order.production_tickets.length > 0 && (
              <div className="text-sm">
                <p className="font-medium mb-2">Tickets de Producción</p>
                {order.production_tickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-1">
                    <span className="text-text-muted text-xs">
                      {t.quantity_needed} unidad{t.quantity_needed > 1 && 'es'}
                      {t.estimated_completion && ` — Est. ${new Date(t.estimated_completion).toLocaleDateString('es-MX')}`}
                    </span>
                    <StatusBadge status={t.status} label={t.status_display} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Shipping address */}
          {addr && (
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-bold mb-2">Dirección de envío</h2>
              <p className="text-sm text-text-muted">
                {addr.street} {addr.ext_number}{addr.int_number ? `, Int. ${addr.int_number}` : ''}
              </p>
              <p className="text-sm text-text-muted">
                {addr.neighborhood}, {addr.city}, {addr.state} {addr.zip_code}
              </p>
            </section>
          )}
        </div>

        {/* Timeline sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-surface border border-border rounded-xl p-5 lg:sticky lg:top-24">
            <h2 className="font-bold mb-4">Estado del pedido</h2>
            <OrderTimeline order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-4 bg-brand-lighter rounded w-32 mb-4" />
      <div className="h-8 bg-brand-lighter rounded w-64 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="h-48 bg-brand-lighter rounded-xl" />
          <div className="h-32 bg-brand-lighter rounded-xl" />
        </div>
        <div className="lg:w-72">
          <div className="h-64 bg-brand-lighter rounded-xl" />
        </div>
      </div>
    </div>
  )
}
