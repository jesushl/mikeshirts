import { useEffect, useRef } from 'react'
import { useCartStore } from '../store/cartStore'

export function useCart() {
  const store = useCartStore()
  const fetched = useRef(false)

  useEffect(() => {
    if (!fetched.current && !store.cart) {
      fetched.current = true
      store.fetchCart()
    }
  }, [store])

  return {
    cart: store.cart,
    isOpen: store.isOpen,
    isUpdating: store.isUpdating,
    isEmpty: !store.cart || store.cart.item_count === 0,
    itemCount: store.cart?.item_count ?? 0,
    subtotal: store.cart?.subtotal ?? '0',
    shipping: store.cart?.shipping ?? '0',
    total: store.cart?.total ?? '0',
    addItem: store.addItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    clearAll: store.clearAll,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
  }
}
