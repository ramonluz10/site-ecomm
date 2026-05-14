export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  currency: string
  sku: string | null
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  category_id: string | null
  images: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  product: Product
  added_at: string
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest'
}
