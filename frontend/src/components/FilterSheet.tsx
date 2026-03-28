import { useEffect } from 'react'
import CatalogFilters from './CatalogFilters'
import type { CatalogFilters as Filters } from '../services/catalog'

interface Props {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  onReset: () => void
}

export default function FilterSheet({ isOpen, onClose, filters, onFilterChange, onReset }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-brand border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle + Header */}
        <div className="px-4 pt-3 pb-2 border-b border-border shrink-0">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Filtros</h2>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text" aria-label="Cerrar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CatalogFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onReset}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0 flex gap-3">
          <button
            onClick={() => { onReset(); onClose() }}
            className="flex-1 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-text-muted transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold bg-accent hover:bg-accent-hover rounded-lg transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}
