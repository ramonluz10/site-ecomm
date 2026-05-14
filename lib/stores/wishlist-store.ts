'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, WishlistItem } from '@/lib/types'

interface WishlistState {
  items: WishlistItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const exists = state.items.some(item => item.product.id === product.id)
          if (exists) return state
          
          return {
            items: [...state.items, { product, added_at: new Date().toISOString() }]
          }
        })
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId)
      },
      
      toggleItem: (product) => {
        const isIn = get().isInWishlist(product.id)
        if (isIn) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
      
      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'pragmatic-wishlist'
    }
  )
)
