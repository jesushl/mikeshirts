import { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchShipTickets, updateShipTicket, type AdminShipTicket } from '../../services/admin'
import { formatMXN } from '../../utils/format'
import DataTable, { type Column } from '../../components/admin/DataTable'
import StatusBadge from '../../components/StatusBadge'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
]

export default function AdminEnviosPage() {
  const [tickets, setTickets] = useState<AdminShipTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState({ tracking_number: '', carrier: '', shipping_cost: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (statusFilter) params.status = statusFilter
    fetchShipTickets(params)
      .then((data) => setTickets(data.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  function startEdit(t: AdminShipTicket) {
    setEditing(t.id)
    setForm({
      tracking_number: t.tracking_number,
      carrier: t.carrier,
      shipping_cost: t.shipping_cost,
    })
  }

  async function saveEdit(id: number, nextStatus?: string) {
    setSaving(true)
    const payload: Record<string, unknown> = { ...form }
    if (nextStatus) {
      payload.status = nextStatus
      if (nextStatus === 'shipped') payload.shipped_at = new Date().toISOString()
      if (nextStatus === 'delivered') payload.delivered_at = new Date().toISOString()
    }
    try {
      await updateShipTicket(id, payload as Partial<AdminShipTicket>)
      setEditing(null)
      load()
    } catch { /* ignore */ }
    setSaving(false)
  }

  const columns: Column<AdminShipTicket>[] = [
    { key: 'id', label: '#', render: (r) => <span className="font-medium">#{r.id}</span> },
    { key: 'order', label: 'Pedido', render: (r) => `#${r.order_id}` },
    { key: 'email', label: 'Email', render: (r) => <span className="text-text-muted text-xs">{r.user_email}</span> },
    { key: 'carrier', label: 'Paquetería', render: (r) => r.carrier || '—' },
    { key: 'tracking', label: 'Guía', render: (r) => r.tracking_number || '—' },
    { key: 'cost', label: 'Costo', render: (r) => formatMXN(r.shipping_cost) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} label={r.status_display} /> },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <button
          onClick={() => startEdit(r)}
          className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
        >
          Editar
        </button>
      ),
    },
  ]

  return (
    <div>
      <Helmet>
        <title>Envíos — Gestión Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Envíos</h1>

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
          emptyMessage="No hay tickets de envío"
          rowKey={(r) => r.id}
        />
      </div>

      {/* Edit modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(null)} />
          <div className="relative bg-brand-light border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="font-bold text-lg">Editar Envío #{editing}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Paquetería</label>
                <input value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} className="w-full !py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Número de guía</label>
                <input value={form.tracking_number} onChange={(e) => setForm({ ...form, tracking_number: e.target.value })} className="w-full !py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Costo de envío</label>
                <input type="number" value={form.shipping_cost} onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })} className="w-full !py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-2 text-sm border border-border rounded-lg hover:border-text-muted transition-colors">
                Cancelar
              </button>
              <button onClick={() => saveEdit(editing)} disabled={saving} className="flex-1 py-2 text-sm bg-surface border border-border rounded-lg hover:border-accent transition-colors disabled:opacity-50">
                Guardar
              </button>
              {tickets.find((t) => t.id === editing)?.status === 'pending' && (
                <button onClick={() => saveEdit(editing, 'shipped')} disabled={saving} className="flex-1 py-2 text-sm font-bold bg-accent rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
                  Marcar Enviado
                </button>
              )}
              {tickets.find((t) => t.id === editing)?.status === 'shipped' && (
                <button onClick={() => saveEdit(editing, 'delivered')} disabled={saving} className="flex-1 py-2 text-sm font-bold bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  Entregado
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
