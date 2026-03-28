import { useState, useRef } from 'react'
import type { ProductImage } from '../types'

interface Props {
  images: ProductImage[]
}

export default function ImageGallery({ images }: Props) {
  const mainIndex = images.findIndex((img) => img.is_main)
  const [selected, setSelected] = useState(mainIndex >= 0 ? mainIndex : 0)
  const scrollRef = useRef<HTMLDivElement>(null)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-brand-lighter rounded-xl flex items-center justify-center">
        <img src="/logo.png" alt="" className="w-24 h-24 opacity-20" />
      </div>
    )
  }

  const current = images[selected]

  function scrollToIndex(index: number) {
    setSelected(index)
    if (scrollRef.current) {
      const children = scrollRef.current.children
      if (children[index]) {
        children[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails — vertical on desktop, horizontal on mobile */}
      {images.length > 1 && (
        <>
          {/* Desktop: vertical strip */}
          <div className="hidden md:flex flex-col gap-2 w-20 shrink-0 max-h-[600px] overflow-y-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelected(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                  i === selected ? 'border-accent' : 'border-border hover:border-text-muted'
                }`}
              >
                <img src={img.image} alt={img.alt_text} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2 order-2" ref={scrollRef}>
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelected(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                  i === selected ? 'border-accent' : 'border-border hover:border-text-muted'
                }`}
              >
                <img src={img.image} alt={img.alt_text} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Main image + swipe on mobile */}
      <div className="flex-1 min-w-0">
        <div className="relative aspect-square bg-brand-lighter rounded-xl overflow-hidden">
          <img
            src={current.image}
            alt={current.alt_text || 'Producto'}
            className="w-full h-full object-contain"
          />

          {/* Navigation arrows for mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => scrollToIndex(selected > 0 ? selected - 1 : images.length - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                aria-label="Anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollToIndex(selected < images.length - 1 ? selected + 1 : 0)}
                className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                aria-label="Siguiente"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots indicator for mobile */}
        {images.length > 1 && (
          <div className="flex md:hidden justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === selected ? 'bg-accent' : 'bg-border'
                }`}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
