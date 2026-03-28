import { useState, useEffect, useRef } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import type { CatalogFilters as Filters } from '../services/catalog'
import ProductCard from '../components/ProductCard'
import CatalogFilters from '../components/CatalogFilters'
import FilterSheet from '../components/FilterSheet'
import SeoHead from '../components/SeoHead'

const ACTIVE_LABELS: Record<string, (v: string) => string> = {
  category: (v) => `Cat: ${v}`,
  size: (v) => `Talla: ${v}`,
  color: (v) => `Color: ${v}`,
  min_price: (v) => `Desde $${v}`,
  max_price: (v) => `Hasta $${v}`,
}

export default function CatalogPage() {
  const { products, count, hasMore, isLoading, error, filters, setFilter, resetFilters, loadMore } = useCatalog()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setSearchInput(filters.search ?? '')
  }, [filters.search])

  function handleSearch(value: string) {
    setSearchInput(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilter('search', value)
    }, 400)
  }

  const activePills = Object.entries(filters)
    .filter(([key, val]) => val && key !== 'ordering' && key !== 'search' && key !== 'featured')
    .map(([key, val]) => ({
      key: key as keyof Filters,
      label: ACTIVE_LABELS[key]?.(val as string) ?? val,
    }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SeoHead
        title="Catálogo"
        description="Explora nuestra colección de playeras: cultura geek, identidad mexicana, diseños únicos. Filtra por categoría, talla, color y precio."
      />

      {/* Search bar */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar playeras..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full !pl-10 !pr-4"
        />
      </div>

      {/* Mobile filter button */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <p className="text-sm text-text-muted">{count} producto{count !== 1 && 's'}</p>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:border-text-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activePills.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key, '')}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
            >
              {label}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-text-muted hover:text-text transition-colors px-2"
          >
            Limpiar todo
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <CatalogFilters
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
          className="hidden md:block w-64 shrink-0"
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <p className="hidden md:block text-sm text-text-muted mb-4">
            {count} producto{count !== 1 && 's'} encontrado{count !== 1 && 's'}
          </p>

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={resetFilters} className="text-accent hover:text-accent-hover text-sm">
                Reintentar
              </button>
            </div>
          )}

          {!error && !isLoading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-bold mb-2">No encontramos productos</h2>
              <p className="text-text-muted mb-4">Prueba con otros filtros o busca algo diferente.</p>
              <button onClick={resetFilters} className="text-accent hover:text-accent-hover font-medium">
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Skeleton loading */}
          {isLoading && products.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl overflow-hidden border border-border animate-pulse">
                  <div className="aspect-square bg-brand-lighter" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-brand-lighter rounded w-1/3" />
                    <div className="h-4 bg-brand-lighter rounded w-3/4" />
                    <div className="h-5 bg-brand-lighter rounded w-1/2" />
                    <div className="h-3 bg-brand-lighter rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-8 py-3 bg-surface border border-border rounded-lg text-sm font-medium hover:border-text-muted transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Cargando...' : 'Cargar más'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <FilterSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />
    </div>
  )
}
