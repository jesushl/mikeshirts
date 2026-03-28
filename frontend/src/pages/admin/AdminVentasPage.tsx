import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchAdminOrders, fetchVentasMetrics, type AdminOrder, type VentasMetrics } from '../../services/admin'
import { formatMXN } from '../../utils/format'
import KpiCard from '../../components/admin/KpiCard'
import DataTable, { type Column } from '../../components/admin/DataTable'
import StatusBadge from '../../components/StatusBadge'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending_payment', label: 'Pago pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'in_production', label: 'En producción' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const PERIOD_OPTIONS = [
  { value: 7, label: '7 días' },
  { value: 30, label: '30 días' },
  { value: 90, label: '90 días' },
]

const columns: Column<AdminOrder>[] = [
  { key: 'id', label: '#', render: (r) => <span className="font-medium">#{r.id}</span> },
  { key: 'email', label: 'Email', render: (r) => <span className="text-text-muted">{r.user_email}</span> },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} label={r.status_display} /> },
  { key: 'total', label: 'Total', render: (r) => <span className="font-medium">{formatMXN(r.total)}</span> },
  { key: 'items', label: 'Items', render: (r) => r.item_count },
  { key: 'date', label: 'Fecha', render: (r) => new Date(r.created_at).toLocaleDateString('es-MX') },
]

export default function AdminVentasPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [metrics, setMetrics] = useState<VentasMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    fetchVentasMetrics(period).then(setMetrics).catch(() => {})
  }, [period])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (statusFilter) params.status = statusFilter
    fetchAdminOrders(params)
      .then((data) => setOrders(data.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [statusFilter])

  return (
    <div>
      <Helmet>
        <title>Ventas — Gestión Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Ventas</h1>

      {/* Metrics */}
      <div className="flex items-center gap-2 mb-4">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              period === opt.value ? 'border-accent text-accent bg-accent/10' : 'border-border text-text-muted hover:border-text-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {metrics && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <KpiCard label="Ventas totales" value={formatMXN(metrics.total_sales)} icon="💰" accent />
          <KpiCard label="Pedidos" value={metrics.order_count} icon="📋" />
          <KpiCard label="Ticket promedio" value={formatMXN(metrics.avg_ticket)} icon="🎫" />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="!py-2 !px-3 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="No hay pedidos con este filtro"
          rowKey={(r) => r.id}
        />
      </div>
    </div>
  )
}
