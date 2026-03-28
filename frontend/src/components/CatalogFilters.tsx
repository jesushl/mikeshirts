import { useEffect, useState } from 'react'
import { fetchCategories } from '../services/catalog'
import type { Category } from '../types'
import type { CatalogFilters as Filters } from '../services/catalog'

interface Props {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  onReset: () => void
  className?: string
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const COLORS: { value: string; label: string; hex: string }[] = [
  { value: 'negro', label: 'Negro', hex: '#0a0a0a' },
  { value: 'blanco', label: 'Blanco', hex: '#f5f5f5' },
  { value: 'gris', label: 'Gris', hex: '#6b7280' },
  { value: 'azul_marino', label: 'Azul Marino', hex: '#1e3a5f' },
  { value: 'rojo', label: 'Rojo', hex: '#e11d48' },
  { value: 'verde', label: 'Verde', hex: '#16a34a' },
]

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Más recientes' },
  { value: 'base_price', label: 'Precio: menor a mayor' },
  { value: '-base_price', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A–Z' },
]

export default function CatalogFilters({ filters, onFilterChange, onReset, className = '' }: Props) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  const hasActiveFilters = !!(
    filters.category || filters.size || filters.color ||
    filters.min_price || filters.max_price
  )

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Categorías */}
      <FilterSection title="Categorías">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onFilterChange('category', '')}
              className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                !filters.category ? 'text-accent font-semibold' : 'text-text-muted hover:text-text'
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onFilterChange('category', cat.slug)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                  filters.category === cat.slug ? 'text-accent font-semibold' : 'text-text-muted hover:text-text'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Talla */}
      <FilterSection title="Talla">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange('size', filters.size === s ? '' : s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.size === s
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onFilterChange('color', filters.color === c.value ? '' : c.value)}
              title={c.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                filters.color === c.value
                  ? 'border-accent scale-110'
                  : 'border-border hover:border-text-muted'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Precio */}
      <FilterSection title="Precio">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price ?? ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-full !py-2 !px-3 text-sm"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price ?? ''}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-full !py-2 !px-3 text-sm"
          />
        </div>
      </FilterSection>

      {/* Ordenar */}
      <FilterSection title="Ordenar por">
        <select
          value={filters.ordering ?? '-created_at'}
          onChange={(e) => onFilterChange('ordering', e.target.value)}
          className="w-full !py-2 !px-3 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FilterSection>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full text-sm text-accent hover:text-accent-hover transition-colors py-2"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-text">{title}</h3>
      {children}
    </div>
  )
}
