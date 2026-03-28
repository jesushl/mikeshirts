import { Link } from 'react-router-dom'
import type { CartItem } from '../types'
import { formatMXN } from '../utils/format'

interface Props {
  item: CartItem
  onUpdateQuantity: (variantId: number, quantity: number) => void
  onRemove: (variantId: number) => void
  compact?: boolean
  disabled?: boolean
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove, compact, disabled }: Props) {
  const imgSize = compact ? 'w-16 h-16' : 'w-20 h-20'

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Image */}
      <Link to={`/producto/${item.product_slug}`} className={`${imgSize} shrink-0 rounded-lg overflow-hidden bg-brand-lighter`}>
        {item.image ? (
          <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src="/logo.png" alt="" className="w-8 h-8 opacity-20" />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/producto/${item.product_slug}`}
          className="text-sm font-semibold hover:text-accent transition-colors line-clamp-1"
        >
          {item.product_name}
        </Link>
        <p className="text-xs text-text-muted mt-0.5">{item.size} / {item.color}</p>
        <p className="text-sm font-medium mt-1">{formatMXN(item.unit_price)}</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-border rounded">
            <button
              onClick={() => onUpdateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
              disabled={disabled || item.quantity <= 1}
              className="px-2 py-1 text-xs text-text-muted hover:text-text transition-colors disabled:opacity-30"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.variant_id, Math.min(10, item.quantity + 1))}
              disabled={disabled || item.quantity >= 10}
              className="px-2 py-1 text-xs text-text-muted hover:text-text transition-colors disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.variant_id)}
            disabled={disabled}
            className="text-text-muted hover:text-red-400 transition-colors disabled:opacity-30"
            aria-label="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold">{formatMXN(item.line_total)}</p>
      </div>
    </div>
  )
}
