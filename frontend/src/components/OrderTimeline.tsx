import type { OrderDetail } from '../types'

interface Props {
  order: OrderDetail
}

interface Step {
  label: string
  detail?: string
  status: 'done' | 'active' | 'pending' | 'failed'
}

const STATUS_ORDER = ['pending_payment', 'paid', 'in_production', 'shipped', 'delivered']

function formatDate(d: string | null | undefined): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function buildSteps(order: OrderDetail): Step[] {
  const isCancelled = order.status === 'cancelled'
  const currentIdx = STATUS_ORDER.indexOf(order.status)

  const steps: Step[] = [
    {
      label: 'Pedido creado',
      detail: formatDate(order.created_at),
      status: 'done',
    },
    {
      label: 'Pago confirmado',
      detail: order.sale_ticket ? `Folio: ${order.sale_ticket.folio} — ${formatDate(order.sale_ticket.issued_at)}` : undefined,
      status: currentIdx >= 1 ? 'done' : isCancelled ? 'failed' : currentIdx === 0 ? 'active' : 'pending',
    },
  ]

  if (order.production_tickets.length > 0) {
    const allDone = order.production_tickets.every((t) => t.status === 'completed')
    steps.push({
      label: 'En producción',
      detail: allDone
        ? 'Producción completada'
        : `${order.production_tickets.filter((t) => t.status !== 'completed').length} ticket(s) pendientes`,
      status: allDone || currentIdx >= 3 ? 'done' : currentIdx === 2 ? 'active' : 'pending',
    })
  }

  steps.push({
    label: 'Enviado',
    detail: order.ship_ticket?.shipped_at
      ? `${order.ship_ticket.carrier} — ${order.ship_ticket.tracking_number || 'Sin guía'} — ${formatDate(order.ship_ticket.shipped_at)}`
      : undefined,
    status: currentIdx >= 3 ? 'done' : isCancelled ? 'pending' : currentIdx === 3 ? 'active' : 'pending',
  })

  steps.push({
    label: 'Entregado',
    detail: order.ship_ticket?.delivered_at ? formatDate(order.ship_ticket.delivered_at) : undefined,
    status: currentIdx >= 4 ? 'done' : 'pending',
  })

  if (isCancelled) {
    steps.push({ label: 'Cancelado', status: 'failed' })
  }

  return steps
}

export default function OrderTimeline({ order }: Props) {
  const steps = buildSteps(order)

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          {/* Line + dot */}
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
              step.status === 'done' ? 'bg-emerald-500' :
              step.status === 'active' ? 'bg-accent ring-4 ring-accent/20' :
              step.status === 'failed' ? 'bg-red-500' :
              'bg-border'
            }`} />
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 min-h-[32px] ${
                step.status === 'done' ? 'bg-emerald-500/40' : 'bg-border'
              }`} />
            )}
          </div>

          {/* Content */}
          <div className="pb-6">
            <p className={`text-sm font-medium ${
              step.status === 'pending' ? 'text-text-muted' :
              step.status === 'failed' ? 'text-red-400' : 'text-text'
            }`}>
              {step.label}
            </p>
            {step.detail && (
              <p className="text-xs text-text-muted mt-0.5">{step.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
