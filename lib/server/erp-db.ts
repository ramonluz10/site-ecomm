import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type {
  ERPMetrics,
  ERPData,
  ERPUserRecord,
  ERPSession,
  InventoryMovement,
  Product,
  Sale,
  SaleItem,
  Supplier,
} from '@/lib/types'

const erpFilePath = path.join(process.cwd(), 'data', 'erp.json')

type AddProductInput = {
  name: string
  sku: string
  price: number
  stock_quantity: number
  description: string
  short_description: string
  slug?: string
  compare_at_price?: number | null
  currency?: string
}

async function ensureDataFile() {
  try {
    await fs.access(erpFilePath)
  } catch {
    await fs.mkdir(path.dirname(erpFilePath), { recursive: true })
    await fs.writeFile(erpFilePath, JSON.stringify(getDefaultERPData(), null, 2), 'utf-8')
  }
}

export async function readERPData(): Promise<ERPData> {
  await ensureDataFile()
  const raw = await fs.readFile(erpFilePath, 'utf-8')
  return JSON.parse(raw) as ERPData
}

export async function writeERPData(data: ERPData) {
  await fs.mkdir(path.dirname(erpFilePath), { recursive: true })
  await fs.writeFile(erpFilePath, JSON.stringify(data, null, 2), 'utf-8')
}

function getDefaultERPData(): ERPData {
  return {
    users: [],
    sessions: [],
    suppliers: [],
    products: [],
    inventoryMovements: [],
    sales: [],
  }
}

export async function getSuppliers(): Promise<Supplier[]> {
  const data = await readERPData()
  return data.suppliers
}

export async function getProducts(): Promise<Product[]> {
  const data = await readERPData()
  return data.products
}

export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  const data = await readERPData()
  return data.inventoryMovements.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export async function getSales(): Promise<Sale[]> {
  const data = await readERPData()
  return data.sales.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export async function getDashboardMetrics(): Promise<ERPMetrics> {
  const data = await readERPData()
  const stockAvailable = data.products.reduce((sum, product) => sum + product.stock_quantity, 0)
  const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.total, 0)
  const entries = data.inventoryMovements
    .filter((movement) => movement.type === 'entrada')
    .reduce((sum, movement) => sum + movement.quantity, 0)
  const exits = data.inventoryMovements
    .filter((movement) => movement.type === 'saida')
    .reduce((sum, movement) => sum + movement.quantity, 0)

  return {
    totalSuppliers: data.suppliers.length,
    totalProducts: data.products.length,
    stockAvailable,
    totalSales: data.sales.length,
    totalRevenue,
    entries,
    exits,
  }
}

export async function addSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at' | 'active'>) {
  const data = await readERPData()
  const now = new Date().toISOString()
  const newSupplier: Supplier = {
    ...supplier,
    id: `supplier-${randomUUID()}`,
    active: true,
    created_at: now,
    updated_at: now,
  }
  data.suppliers.push(newSupplier)
  await writeERPData(data)
  return newSupplier
}

export async function addProduct(product: AddProductInput) {
  const data = await readERPData()
  const now = new Date().toISOString()
  const newProduct: Product = {
    ...product,
    id: `product-${randomUUID()}`,
    slug: product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-'),
    compare_at_price: product.compare_at_price ?? null,
    currency: product.currency ?? 'BRL',
    images: [],
    metadata: {},
    category_id: null,
    is_active: true,
    is_featured: false,
    created_at: now,
    updated_at: now,
  }
  data.products.push(newProduct)
  await writeERPData(data)
  return newProduct
}

export async function registerInventoryMovement(movement: {
  type: 'entrada' | 'saida'
  product_id: string
  quantity: number
  supplier_id?: string | null
  note?: string
}) {
  const data = await readERPData()
  const product = data.products.find((item) => item.id === movement.product_id)

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  if (movement.type === 'saida' && product.stock_quantity < movement.quantity) {
    throw new Error('Estoque insuficiente para saída')
  }

  product.stock_quantity += movement.type === 'entrada' ? movement.quantity : -movement.quantity
  product.updated_at = new Date().toISOString()

  const now = new Date().toISOString()
  const newMovement: InventoryMovement = {
    id: `movement-${randomUUID()}`,
    type: movement.type,
    product_id: movement.product_id,
    quantity: movement.quantity,
    supplier_id: movement.supplier_id ?? null,
    created_at: now,
    note: movement.note ?? '',
  }

  data.inventoryMovements.push(newMovement)
  await writeERPData(data)
  return newMovement
}

export async function registerSale(sale: {
  customer_name: string
  items: SaleItem[]
}) {
  const data = await readERPData()
  const now = new Date().toISOString()
  let total = 0

  const items = sale.items.map((item) => {
    const product = data.products.find((product) => product.id === item.product_id)
    if (!product) {
      throw new Error(`Produto com id ${item.product_id} não encontrado`)
    }
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}`)
    }
    product.stock_quantity -= item.quantity
    product.updated_at = now
    const itemTotal = item.quantity * item.price
    total += itemTotal
    return {
      product_id: product.id,
      quantity: item.quantity,
      price: item.price,
    }
  })

  const newSale: Sale = {
    id: `sale-${randomUUID()}`,
    code: `VND-${data.sales.length + 1}`,
    customer_name: sale.customer_name,
    items,
    total,
    status: 'finalizado',
    created_at: now,
  }

  data.sales.push(newSale)
  await writeERPData(data)
  return newSale
}

export async function getSession(sessionId: string): Promise<ERPSession | null> {
  const data = await readERPData()
  return data.sessions.find((s) => s.id === sessionId) ?? null
}

export async function getUserById(userId: string): Promise<ERPUserRecord | null> {
  const data = await readERPData()
  return data.users.find((u) => u.id === userId) ?? null
}

export async function createSession(userId: string, ttlSeconds: number) {
  const data = await readERPData()
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()
  const session: ERPSession = {
    id: `session-${randomUUID()}`,
    user_id: userId,
    created_at: now,
    expires_at: expiresAt,
  }
  data.sessions.push(session)
  await writeERPData(data)
  return session
}
