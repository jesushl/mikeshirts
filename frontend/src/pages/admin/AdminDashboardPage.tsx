import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchDashboard, type DashboardData } from '../../services/admin'
import { formatMXN } from '../../utils/format'
import KpiCard from '../../components/admin/KpiCard'

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard().then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Helmet>
        <title>Dashboard — Gestión Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-brand-lighter rounded w-20 mb-3" />
              <div className="h-7 bg-brand-lighter rounded w-16" />
            </div>
          ))}
        </div>
      ) : data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard label="Pedidos hoy" value={data.orders_today} icon="🛒" accent />
            <KpiCard label="Revenue hoy" value={formatMXN(data.revenue_today)} icon="💵" accent />
            <KpiCard label="Pago pendiente" value={data.pending_orders} icon="⏳" />
            <KpiCard label="En producción" value={data.pending_production + data.in_production} icon="🏭" />
            <KpiCard label="Envío pendiente" value={data.pending_shipping} icon="📦" />
            <KpiCard label="Stock bajo" value={data.low_stock_count} icon="⚠️" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/gestion/ventas" className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors">
              <p className="font-bold mb-1">Ventas</p>
              <p className="text-sm text-text-muted">Pedidos, tickets de venta, métricas</p>
            </Link>
            <Link to="/gestion/produccion" className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors">
              <p className="font-bold mb-1">Producción</p>
              <p className="text-sm text-text-muted">Tickets pendientes y en proceso</p>
            </Link>
            <Link to="/gestion/envios" className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors">
              <p className="font-bold mb-1">Envíos</p>
              <p className="text-sm text-text-muted">Guías, paquetería, seguimiento</p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
