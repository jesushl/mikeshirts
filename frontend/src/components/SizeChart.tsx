import { useState, useEffect } from 'react'
import type { SizeChartEntry } from '../types'

interface Props {
  chart: SizeChartEntry[]
}

export default function SizeChart({ chart }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (chart.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-cyan hover:text-cyan-hover transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 6h18m-9 8h9m-9 4h9" />
        </svg>
        Guía de tallas
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-brand-light border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Guía de Tallas</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-text-muted hover:text-text"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-text-muted mb-4">Medidas en centímetros</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Talla</th>
                    <th className="text-center py-2 px-2 font-semibold">Pecho</th>
                    <th className="text-center py-2 px-2 font-semibold">Largo</th>
                    <th className="text-center py-2 px-2 font-semibold">Hombro</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.map((row, i) => (
                    <tr
                      key={row.size}
                      className={i % 2 === 0 ? 'bg-brand-lighter/50' : ''}
                    >
                      <td className="py-2 pr-4 font-medium">{row.size}</td>
                      <td className="py-2 px-2 text-center text-text-muted">{row.chest}</td>
                      <td className="py-2 px-2 text-center text-text-muted">{row.length}</td>
                      <td className="py-2 px-2 text-center text-text-muted">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
