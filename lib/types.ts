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

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  active: boolean
  created_at: string
  updated_at: string
}

export type MovementType = 'entrada' | 'saida'

export interface InventoryMovement {
  id: string
  type: MovementType
  product_id: string
  quantity: number
  supplier_id: string | null
  created_at: string
  note: string
}

export interface SaleItem {
  product_id: string
  quantity: number
  price: number
}

export interface Sale {
  id: string
  code: string
  customer_name: string
  items: SaleItem[]
  total: number
  status: 'finalizado' | 'pendente' | 'cancelado'
  created_at: string
}

export interface ERPMetrics {
  totalSuppliers: number
  totalProducts: number
  stockAvailable: number
  totalSales: number
  totalRevenue: number
  entries: number
  exits: number
}

export interface ERPUserRecord {
  id: string
  username: string
  passwordHash: string
  role?: string
  salt?: string
}

export interface ERPSession {
  id: string
  user_id: string
  created_at: string
  expires_at: string
}

export interface ERPData {
  users: ERPUserRecord[]
  sessions: ERPSession[]
  suppliers: Supplier[]
  products: Product[]
  inventoryMovements: InventoryMovement[]
  sales: Sale[]
}
