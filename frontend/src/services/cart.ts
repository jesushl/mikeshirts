import api from '../api/client'
import type { Cart } from '../types'

export async function fetchCart(): Promise<Cart> {
  const { data } = await api.get<Cart>('/cart/')
  return data
}

export async function addToCart(variantId: number, quantity: number): Promise<Cart> {
  const { data } = await api.post<Cart>('/cart/items/', {
    variant_id: variantId,
    quantity,
  })
  return data
}

export async function updateCartItem(variantId: number, quantity: number): Promise<Cart> {
  const { data } = await api.patch<Cart>(`/cart/items/${variantId}/`, { quantity })
  return data
}

export async function removeCartItem(variantId: number): Promise<void> {
  await api.delete(`/cart/items/${variantId}/delete/`)
}

export async function clearCart(): Promise<void> {
  await api.delete('/cart/')
}

export async function mergeCart(): Promise<Cart> {
  const { data } = await api.post<Cart>('/cart/merge/')
  return data
}
