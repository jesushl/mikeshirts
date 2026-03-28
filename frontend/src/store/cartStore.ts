import { create } from 'zustand'
import type { Cart } from '../types'
import * as cartService from '../services/cart'

interface CartState {
  cart: Cart | null
  isOpen: boolean
  isUpdating: boolean
  setCart: (cart: Cart | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  fetchCart: () => Promise<void>
  addItem: (variantId: number, quantity: number) => Promise<void>
  updateItem: (variantId: number, quantity: number) => Promise<void>
  removeItem: (variantId: number) => Promise<void>
  clearAll: () => Promise<void>
  merge: () => Promise<void>
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,
  isUpdating: false,

  setCart: (cart) => set({ cart }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  fetchCart: async () => {
    try {
      const cart = await cartService.fetchCart()
      set({ cart })
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    }
  },

  addItem: async (variantId, quantity) => {
    set({ isUpdating: true })
    try {
      const cart = await cartService.addToCart(variantId, quantity)
      set({ cart, isOpen: true })
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      set({ isUpdating: false })
    }
  },

  updateItem: async (variantId, quantity) => {
    set({ isUpdating: true })
    try {
      const cart = await cartService.updateCartItem(variantId, quantity)
      set({ cart })
    } catch (err) {
      console.error('Failed to update cart item:', err)
    } finally {
      set({ isUpdating: false })
    }
  },

  removeItem: async (variantId) => {
    set({ isUpdating: true })
    try {
      await cartService.removeCartItem(variantId)
      const cart = await cartService.fetchCart()
      set({ cart })
    } catch (err) {
      console.error('Failed to remove cart item:', err)
    } finally {
      set({ isUpdating: false })
    }
  },

  clearAll: async () => {
    set({ isUpdating: true })
    try {
      await cartService.clearCart()
      set({ cart: null })
    } catch (err) {
      console.error('Failed to clear cart:', err)
    } finally {
      set({ isUpdating: false })
    }
  },

  merge: async () => {
    try {
      const cart = await cartService.mergeCart()
      set({ cart })
    } catch (err) {
      console.error('Failed to merge cart:', err)
    }
  },
}))
