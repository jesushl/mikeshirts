interface Props {
  label: string
  value: string | number
  icon?: string
  subtitle?: string
  accent?: boolean
}

export default function KpiCard({ label, value, icon, subtitle, accent }: Props) {
  return (
    <div className={`bg-surface border rounded-xl p-5 ${accent ? 'border-accent/40' : 'border-border'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-black mt-1 ${accent ? 'text-accent' : ''}`}>{value}</p>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  )
}
