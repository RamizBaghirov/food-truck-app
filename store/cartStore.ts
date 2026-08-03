import { create } from 'zustand'
import { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    const currentItems = get().items
    const existingItem = currentItems.find((item) => item.id === product.id)
    if (existingItem) {
      set({ items: currentItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) })
    } else {
      set({ items: [...currentItems, { id: product.id, name: product.name, price: product.price, quantity: 1 }] })
    }
  },
  removeItem: (productId) => set({ items: get().items.filter((item) => item.id !== productId) }),
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) { get().removeItem(productId); return }
    set({ items: get().items.map((item) => item.id === productId ? { ...item, quantity } : item) })
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}))