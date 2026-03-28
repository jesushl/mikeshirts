import api from '../api/client'
import type { Category, ProductDetail, ProductListItem, PaginatedResponse } from '../types'

export interface CatalogFilters {
  category?: string
  size?: string
  color?: string
  min_price?: string
  max_price?: string
  featured?: string
  search?: string
  ordering?: string
  page?: number
  page_size?: string
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/catalog/categories/')
  return data
}

export async function fetchProducts(
  params: CatalogFilters = {},
): Promise<PaginatedResponse<ProductListItem>> {
  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    '/catalog/products/',
    { params },
  )
  return data
}

export async function fetchProduct(slug: string): Promise<ProductDetail> {
  const { data } = await api.get<ProductDetail>(`/catalog/products/${slug}/`)
  return data
}
