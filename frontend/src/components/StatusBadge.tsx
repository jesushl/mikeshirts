interface Props {
  status: string
  label: string
}

const styles: Record<string, string> = {
  pending_payment: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  paid: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  in_production: 'bg-cyan/15 text-cyan border-cyan/30',
  shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

const dots: Record<string, string> = {
  pending_payment: 'bg-amber-400',
  paid: 'bg-blue-400',
  in_production: 'bg-cyan',
  shipped: 'bg-purple-400',
  delivered: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  pending: 'bg-amber-400',
  completed: 'bg-emerald-400',
}

export default function StatusBadge({ status, label }: Props) {
  const style = styles[status] ?? 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30'
  const dot = dots[status] ?? 'bg-neutral-400'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
