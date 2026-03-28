import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, type CatalogFilters } from '../services/catalog'
import type { ProductListItem } from '../types'

const FILTER_KEYS: (keyof CatalogFilters)[] = [
  'category', 'size', 'color', 'min_price', 'max_price', 'featured', 'search', 'ordering',
]

function filtersFromParams(params: URLSearchParams): CatalogFilters {
  const filters: CatalogFilters = {}
  for (const key of FILTER_KEYS) {
    const val = params.get(key)
    if (val) (filters as Record<string, string>)[key] = val
  }
  return filters
}

function paramsFromFilters(filters: CatalogFilters): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of FILTER_KEYS) {
    const val = filters[key]
    if (val) out[key] = String(val)
  }
  return out
}

export function useCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filters = filtersFromParams(searchParams)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async (currentFilters: CatalogFilters, pageNum: number, append: boolean) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchProducts({ ...currentFilters, page: pageNum })
      if (controller.signal.aborted) return
      setProducts((prev) => append ? [...prev, ...data.results] : data.results)
      setCount(data.count)
      setHasMore(!!data.next)
      setPage(pageNum)
    } catch (err) {
      if (controller.signal.aborted) return
      setError('Error al cargar productos')
      console.error(err)
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load(filters, 1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const setFilter = useCallback((key: keyof CatalogFilters, value: string) => {
    const next = { ...filtersFromParams(searchParams) }
    if (value) {
      (next as Record<string, string>)[key] = value
    } else {
      delete (next as Record<string, string | undefined>)[key]
    }
    setSearchParams(paramsFromFilters(next), { replace: true })
  }, [searchParams, setSearchParams])

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      load(filters, page + 1, true)
    }
  }, [hasMore, isLoading, filters, page, load])

  return {
    products,
    count,
    hasMore,
    isLoading,
    error,
    filters,
    setFilter,
    resetFilters,
    loadMore,
  }
}
