import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useRequireAuth } from '../../hooks/useAuth'
import { fetchOrders } from '../../services/orders'
import { formatMXN } from '../../utils/format'
import StatusBadge from '../../components/StatusBadge'
import type { OrderListItem } from '../../types'

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useRequireAuth()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchOrders()
      .then((data) => setOrders(data.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet><title>Mis Pedidos — Mike Shirts</title></Helmet>

      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 bg-brand-lighter rounded w-32" />
                <div className="h-5 bg-brand-lighter rounded w-20" />
              </div>
              <div className="h-4 bg-brand-lighter rounded w-48 mt-3" />
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Aún no tienes pedidos</h2>
          <p className="text-text-muted mb-6">Cuando compres algo, tus pedidos aparecerán aquí.</p>
          <Link to="/catalogo" className="px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-bold transition-colors">
            Ver Catálogo
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/pedidos/${order.id}`}
              className="block bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Pedido #{order.id}</span>
                  <span className="text-text-muted text-sm ml-3">
                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
                <StatusBadge status={order.status} label={order.status_display} />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-text-muted">
                  {order.item_count} {order.item_count === 1 ? 'artículo' : 'artículos'}
                </span>
                <span className="font-bold text-lg">{formatMXN(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
