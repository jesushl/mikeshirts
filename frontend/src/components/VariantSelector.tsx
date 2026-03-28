import { useMemo, useState, useEffect } from 'react'
import type { Variant } from '../types'

interface Props {
  variants: Variant[]
  selected: Variant | null
  onSelect: (variant: Variant | null) => void
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const COLOR_HEX: Record<string, string> = {
  negro: '#0a0a0a',
  blanco: '#f5f5f5',
  gris: '#6b7280',
  azul_marino: '#1e3a5f',
  rojo: '#e11d48',
  verde: '#16a34a',
}

function isAvailable(v: Variant): boolean {
  return v.stock?.availability === 'in_stock' || v.stock?.availability === 'made_to_order'
}

export default function VariantSelector({ variants, selected, onSelect }: Props) {
  const sizes = useMemo(() => {
    const unique = [...new Set(variants.map((v) => v.size))]
    return unique.sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
  }, [variants])

  const colors = useMemo(() => {
    const unique = new Map<string, string>()
    for (const v of variants) {
      if (!unique.has(v.color)) unique.set(v.color, v.color_display)
    }
    return [...unique.entries()].map(([value, label]) => ({ value, label }))
  }, [variants])

  const firstAvailable = useMemo(() => {
    for (const s of sizes) {
      const v = variants.find((v) => v.size === s && isAvailable(v))
      if (v) return { size: v.size, color: v.color }
    }
    return { size: sizes[0] ?? null, color: colors[0]?.value ?? null }
  }, [variants, sizes, colors])

  const [selectedSize, setSelectedSize] = useState<string | null>(
    selected?.size ?? firstAvailable.size,
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(
    selected?.color ?? firstAvailable.color,
  )

  const sizeHasAvailable = useMemo(() => {
    const map: Record<string, boolean> = {}
    for (const s of sizes) {
      map[s] = variants.some((v) => v.size === s && isAvailable(v))
    }
    return map
  }, [variants, sizes])

  const availableColorsForSize = useMemo(() => {
    if (!selectedSize) return new Set(colors.map((c) => c.value))
    return new Set(
      variants.filter((v) => v.size === selectedSize && isAvailable(v)).map((v) => v.color),
    )
  }, [variants, selectedSize, colors])

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const match = variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
      )
      onSelect(match ?? null)
    } else {
      onSelect(null)
    }
  }, [selectedSize, selectedColor, variants, onSelect])

  function handleSizeClick(size: string) {
    const next = selectedSize === size ? null : size
    setSelectedSize(next)
    if (next && selectedColor) {
      const combo = variants.find((v) => v.size === next && v.color === selectedColor)
      if (!combo || !isAvailable(combo)) setSelectedColor(null)
    }
  }

  function handleColorClick(color: string) {
    setSelectedColor(selectedColor === color ? null : color)
  }

  return (
    <div className="space-y-5">
      {/* Size */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Talla{selectedSize && <span className="text-text-muted font-normal ml-2">{selectedSize}</span>}
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const available = sizeHasAvailable[s]
            const active = selectedSize === s
            return (
              <button
                key={s}
                onClick={() => handleSizeClick(s)}
                disabled={!available}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  active
                    ? 'border-accent text-accent bg-accent/10'
                    : available
                      ? 'border-border text-text hover:border-text-muted'
                      : 'border-border text-text-muted/40 line-through cursor-not-allowed'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Color{selectedColor && (
            <span className="text-text-muted font-normal ml-2">
              {colors.find((c) => c.value === selectedColor)?.label}
            </span>
          )}
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const available = availableColorsForSize.has(c.value)
            const active = selectedColor === c.value
            return (
              <button
                key={c.value}
                onClick={() => handleColorClick(c.value)}
                disabled={!available}
                title={c.label}
                className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                  active
                    ? 'border-accent scale-110 ring-2 ring-accent/30'
                    : available
                      ? 'border-border hover:border-text-muted'
                      : 'border-border opacity-30 cursor-not-allowed'
                }`}
                style={{ backgroundColor: COLOR_HEX[c.value] ?? '#666' }}
              >
                {!available && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
                    </svg>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
