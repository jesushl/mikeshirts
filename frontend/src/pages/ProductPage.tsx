import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../services/catalog'
import { trackEvent } from '../services/analytics'
import { formatMXN } from '../utils/format'
import { useCartStore } from '../store/cartStore'
import type { ProductDetail, Variant } from '../types'
import ImageGallery from '../components/ImageGallery'
import VariantSelector from '../components/VariantSelector'
import SizeChart from '../components/SizeChart'
import AvailabilityBadge from '../components/AvailabilityBadge'
import SeoHead from '../components/SeoHead'
import api from '../api/client'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [jsonLd, setJsonLd] = useState<Record<string, unknown> | null>(null)

  const setCart = useCartStore((s) => s.setCart)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    setNotFound(false)
    fetchProduct(slug)
      .then((data) => {
        setProduct(data)
        trackEvent('product_view', { product_id: data.id, slug: data.slug })
        api.get(`/catalog/products/${slug}/schema/`).then((r) => setJsonLd(r.data)).catch(() => {})
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleSelect = useCallback((v: Variant | null) => {
    setSelectedVariant(v)
    setAdded(false)
  }, [])

  async function handleAddToCart() {
    if (!selectedVariant || !product) return
    setAdding(true)
    try {
      const { data } = await api.post('/cart/items/', {
        variant_id: selectedVariant.id,
        quantity,
      })
      setCart(data)
      openCart()
      setAdded(true)
      trackEvent('add_to_cart', {
        variant_id: selectedVariant.id,
        product_id: product.id,
        quantity,
      })
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      setAdding(false)
    }
  }

  const canAdd =
    selectedVariant &&
    selectedVariant.stock?.availability !== 'unavailable'

  if (isLoading) return <ProductSkeleton />

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
        <p className="text-text-muted mb-6">Este producto no existe o fue descontinuado.</p>
        <Link to="/catalogo" className="text-accent hover:text-accent-hover font-medium">
          ← Volver al catálogo
        </Link>
      </div>
    )
  }

  const mainImage = product.images.find((img) => img.is_main) ?? product.images[0]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SeoHead
        title={product.name}
        description={product.description.slice(0, 160)}
        ogImage={mainImage?.image}
        ogUrl={`/producto/${product.slug}`}
        ogType="product"
        jsonLd={jsonLd ?? undefined}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/" className="hover:text-text transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="hover:text-text transition-colors">Catálogo</Link>
        <span>/</span>
        <Link
          to={`/catalogo?category=${product.category.slug}`}
          className="hover:text-text transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-text truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Gallery */}
        <div className="md:w-[55%] shrink-0">
          <ImageGallery images={product.images} />
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <p className="text-sm text-text-muted mb-1">{product.category.name}</p>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold">
            {selectedVariant ? formatMXN(selectedVariant.effective_price) : formatMXN(product.base_price)}
          </p>

          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={handleSelect}
          />

          {selectedVariant?.stock && (
            <AvailabilityBadge
              availability={selectedVariant.stock.availability}
              productionDays={selectedVariant.stock.production_days}
              className="text-sm"
            />
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-text-muted hover:text-text transition-colors"
                aria-label="Menos"
              >
                −
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3 py-2 text-text-muted hover:text-text transition-colors"
                aria-label="Más"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAdd || adding}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : canAdd
                    ? 'bg-accent hover:bg-accent-hover text-white'
                    : 'bg-brand-lighter text-text-muted cursor-not-allowed'
              }`}
            >
              {adding ? 'Agregando...' : added ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>

          <SizeChart chart={product.size_chart} />

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t border-border">
              <h2 className="text-sm font-semibold mb-2">Descripción</h2>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {selectedVariant && (
            <p className="text-xs text-text-muted">SKU: {selectedVariant.sku}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-4 bg-brand-lighter rounded w-48 mb-6 animate-pulse" />
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="md:w-[55%] aspect-square bg-brand-lighter rounded-xl animate-pulse" />
        <div className="flex-1 space-y-4 animate-pulse">
          <div className="h-3 bg-brand-lighter rounded w-24" />
          <div className="h-8 bg-brand-lighter rounded w-3/4" />
          <div className="h-8 bg-brand-lighter rounded w-32" />
          <div className="h-20 bg-brand-lighter rounded" />
          <div className="h-12 bg-brand-lighter rounded" />
          <div className="h-24 bg-brand-lighter rounded" />
        </div>
      </div>
    </div>
  )
}
