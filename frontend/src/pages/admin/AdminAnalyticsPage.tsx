import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchAnalytics, type AnalyticsData } from '../../services/admin'
import KpiCard from '../../components/admin/KpiCard'

const PERIOD_OPTIONS = [
  { value: 7, label: '7 días' },
  { value: 30, label: '30 días' },
  { value: 90, label: '90 días' },
]

const FUNNEL_STEPS = [
  { key: 'visit', label: 'Visitas', color: 'bg-blue-500' },
  { key: 'product_view', label: 'Vieron producto', color: 'bg-cyan' },
  { key: 'add_to_cart', label: 'Agregaron al carrito', color: 'bg-amber-500' },
  { key: 'checkout_start', label: 'Iniciaron checkout', color: 'bg-purple-500' },
  { key: 'purchase', label: 'Compraron', color: 'bg-emerald-500' },
]

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    setLoading(true)
    fetchAnalytics(period).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [period])

  const maxFunnel = data ? Math.max(...Object.values(data.funnel), 1) : 1

  return (
    <div>
      <Helmet>
        <title>Analítica — Gestión Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analítica</h1>
        <div className="flex gap-2">
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
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-brand-lighter rounded w-20 mb-3" />
              <div className="h-7 bg-brand-lighter rounded w-16" />
            </div>
          ))}
        </div>
      ) : data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard label="Visitas totales" value={data.total_visits} icon="👁️" />
            <KpiCard label="Visitantes únicos" value={data.unique_visitors} icon="👤" />
            <KpiCard label="Pageviews" value={data.total_pageviews} icon="📄" />
            <KpiCard label="Conversión" value={`${data.conversion_rate}%`} icon="🎯" accent />
          </div>

          {/* Funnel */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-8">
            <h2 className="font-bold mb-4">Funnel de conversión</h2>
            <div className="space-y-3">
              {FUNNEL_STEPS.map((step, i) => {
                const count = data.funnel[step.key] ?? 0
                const prev = i > 0 ? (data.funnel[FUNNEL_STEPS[i - 1].key] ?? 0) : 0
                const dropoff = i > 0 && prev > 0 ? Math.round((1 - count / prev) * 100) : null
                return (
                  <div key={step.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{step.label}</span>
                      <span className="font-medium">
                        {count}
                        {dropoff !== null && (
                          <span className="text-red-400 text-xs ml-2">-{dropoff}%</span>
                        )}
                      </span>
                    </div>
                    <div className="h-3 bg-brand-lighter rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${step.color} transition-all duration-500`}
                        style={{ width: `${(count / maxFunnel) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top referrers */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-bold mb-4">Top Referrers</h2>
              {data.top_referrers.length === 0 ? (
                <p className="text-sm text-text-muted">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {data.top_referrers.map((r) => (
                    <div key={r.referrer} className="flex items-center justify-between text-sm">
                      <span className="text-text-muted truncate mr-3">{r.referrer}</span>
                      <span className="font-medium shrink-0">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top UTM sources */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-bold mb-4">Top UTM Sources</h2>
              {data.top_utm_sources.length === 0 ? (
                <p className="text-sm text-text-muted">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {data.top_utm_sources.map((r) => (
                    <div key={r.utm_source} className="flex items-center justify-between text-sm">
                      <span className="text-text-muted truncate mr-3">{r.utm_source}</span>
                      <span className="font-medium shrink-0">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
