import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/catalog'
import type { ProductListItem } from '../types'
import ProductCard from '../components/ProductCard'
import SeoHead from '../components/SeoHead'
import { formatMXN } from '../utils/format'


export default function HomePage() {
  const [topSellers, setTopSellers] = useState<ProductListItem[]>([])
  const [featured, setFeatured] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProducts({ featured: 'true', ordering: '-created_at', page_size: '5' }),
      fetchProducts({ ordering: '-created_at', page_size: '12' }),
    ])
      .then(([topData, allData]) => {
        setTopSellers(topData.results.slice(0, 5))
        setFeatured(allData.results)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <SeoHead title="Inicio" />

      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[60vh] px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
        <div className="relative text-center max-w-2xl mx-auto">
          <img src="/logo.png" alt="" className="h-28 w-28 mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Cultura Geek.{' '}
            <span className="text-accent">Identidad Mexicana.</span>
          </h1>
          <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
            Playeras originales que fusionan anime, videojuegos y cómics con el espíritu mexicano.
          </p>
        </div>
      </section>

      {/* Top 5 Carousel */}
      {!loading && topSellers.length > 0 && (
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Top Ventas</h2>
          </div>
          <Carousel items={topSellers} />
          <div className="text-center mt-8">
            <Link
              to="/catalogo"
              className="inline-block px-10 py-3.5 bg-accent hover:bg-accent-hover rounded-lg font-bold text-lg transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold mb-1">Diseños Originales</h3>
            <p className="text-text-muted text-sm">Cada playera es una pieza única creada por artistas mexicanos.</p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">🇲🇽</div>
            <h3 className="font-bold mb-1">Producción Local</h3>
            <p className="text-text-muted text-sm">Hecho en México con materiales de calidad. Envíos a todo el país.</p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold mb-1">Stock + On-Demand</h3>
            <p className="text-text-muted text-sm">Si no tenemos tu talla, la producimos para ti en pocos días.</p>
          </div>
        </div>
      </section>

      {/* Full catalog grid */}
      {!loading && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <Link to="/catalogo" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="h-7 bg-brand-lighter rounded w-48 mb-6 mx-auto animate-pulse" />
          <div className="flex gap-6 overflow-hidden px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-72 shrink-0 bg-surface rounded-xl border border-border animate-pulse">
                <div className="aspect-[3/4] bg-brand-lighter rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-brand-lighter rounded w-3/4" />
                  <div className="h-5 bg-brand-lighter rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Carousel({ items }: { items: ProductListItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const dragOffset = useRef(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval>>()

  const total = items.length

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total)
  }, [total])

  useEffect(() => {
    autoplayRef.current = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(autoplayRef.current)
  }, [current, goTo])

  function handlePointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    dragStart.current = e.clientX
    dragOffset.current = 0
    clearInterval(autoplayRef.current)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    dragOffset.current = e.clientX - dragStart.current
  }

  function handlePointerUp() {
    if (!isDragging) return
    setIsDragging(false)
    if (dragOffset.current < -50) goTo(current + 1)
    else if (dragOffset.current > 50) goTo(current - 1)
  }

  return (
    <div className="relative overflow-hidden select-none">
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {items.map((item) => (
          <CarouselSlide key={item.id} product={item} />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-accent w-6' : 'bg-border hover:bg-text-muted'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function CarouselSlide({ product }: { product: ProductListItem }) {
  const imgSrc = product.main_image ?? '/logo.png'

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="w-full shrink-0 flex flex-col sm:flex-row items-center gap-6 px-4 sm:px-12 lg:px-24"
    >
      <div className="w-full sm:w-1/2 max-w-md mx-auto">
        <div className="aspect-square rounded-2xl overflow-hidden bg-brand-lighter">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>
      <div className="sm:w-1/2 text-center sm:text-left">
        <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">
          {product.category.name}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black mb-3">{product.name}</h3>
        <p className="text-3xl font-bold text-accent mb-4">{formatMXN(product.base_price)}</p>
        <span className="inline-block px-6 py-2 border border-accent text-accent rounded-lg text-sm font-semibold hover:bg-accent/10 transition-colors">
          Ver Producto
        </span>
      </div>
    </Link>
  )
}
