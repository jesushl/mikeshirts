import { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchProductionTickets, updateProductionTicket, type AdminProductionTicket } from '../../services/admin'
import DataTable, { type Column } from '../../components/admin/DataTable'
import StatusBadge from '../../components/StatusBadge'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_production', label: 'En producción' },
  { value: 'completed', label: 'Completado' },
]

export default function AdminProduccionPage() {
  const [tickets, setTickets] = useState<AdminProductionTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (statusFilter) params.status = statusFilter
    fetchProductionTickets(params)
      .then((data) => setTickets(data.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  async function handleStatusChange(id: number, newStatus: string) {
    const payload: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'completed') payload.completed_at = new Date().toISOString()
    setUpdating(id)
    try {
      await updateProductionTicket(id, payload as Partial<AdminProductionTicket>)
      load()
    } catch { /* ignore */ }
    setUpdating(null)
  }

  const counts = {
    pending: tickets.filter((t) => t.status === 'pending').length,
    in_production: tickets.filter((t) => t.status === 'in_production').length,
    completed: tickets.filter((t) => t.status === 'completed').length,
  }

  const columns: Column<AdminProductionTicket>[] = [
    { key: 'id', label: '#', render: (r) => <span className="font-medium">#{r.id}</span> },
    { key: 'order', label: 'Pedido', render: (r) => `#${r.order_id}` },
    { key: 'product', label: 'Producto', render: (r) => <span className="truncate max-w-[200px] block">{r.product_name}</span> },
    { key: 'sku', label: 'SKU', render: (r) => <span className="text-text-muted text-xs">{r.variant_sku}</span> },
    { key: 'qty', label: 'Cant.', render: (r) => r.quantity_needed },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} label={r.status_display} /> },
    { key: 'est', label: 'Estimado', render: (r) => r.estimated_completion ? new Date(r.estimated_completion).toLocaleDateString('es-MX') : '—' },
    {
      key: 'actions',
      label: '',
      render: (r) => {
        if (r.status === 'completed') return null
        const next = r.status === 'pending' ? 'in_production' : 'completed'
        const label = r.status === 'pending' ? 'Iniciar' : 'Completar'
        return (
          <button
            onClick={() => handleStatusChange(r.id, next)}
            disabled={updating === r.id}
            className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors disabled:opacity-50"
          >
            {updating === r.id ? '...' : label}
          </button>
        )
      },
    },
  ]

  return (
    <div>
      <Helmet>
        <title>Producción — Gestión Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Producción</h1>

      {!loading && !statusFilter && (
        <div className="flex gap-3 mb-6">
          <span className="px-3 py-1 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {counts.pending} pendientes
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-cyan/15 text-cyan border border-cyan/30">
            {counts.in_production} en producción
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {counts.completed} completados
          </span>
        </div>
      )}

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
          data={tickets}
          loading={loading}
          emptyMessage="No hay tickets de producción"
          rowKey={(r) => r.id}
        />
      </div>
    </div>
  )
}
