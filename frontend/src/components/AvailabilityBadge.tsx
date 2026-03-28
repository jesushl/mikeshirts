import { availabilityLabel } from '../utils/format'

interface Props {
  availability: string
  productionDays?: number
  className?: string
}

const dotColor: Record<string, string> = {
  in_stock: 'bg-emerald-500',
  made_to_order: 'bg-cyan',
  unavailable: 'bg-neutral-500',
}

export default function AvailabilityBadge({ availability, productionDays, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor[availability] ?? dotColor.unavailable}`} />
      {availabilityLabel(availability, productionDays)}
    </span>
  )
}
