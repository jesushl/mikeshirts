import { Link } from 'react-router-dom'
import type { ProductListItem } from '../types'
import { formatMXN } from '../utils/format'
import AvailabilityBadge from './AvailabilityBadge'

interface Props {
  product: ProductListItem
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block bg-surface rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-colors"
    >
      <div className="aspect-square bg-brand-lighter overflow-hidden">
        {product.main_image ? (
          <img
            src={product.main_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src="/logo.png" alt="" className="w-16 h-16 opacity-20" />
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-1.5">
        <p className="text-xs text-text-muted">{product.category.name}</p>
        <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold">{formatMXN(product.base_price)}</p>
        <AvailabilityBadge availability={product.availability} />
      </div>
    </Link>
  )
}
