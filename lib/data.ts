import type { Category, Product } from '@/lib/types'

const categories: Category[] = [
  {
    id: '1',
    name: 'Fones de Ouvido',
    slug: 'fones-de-ouvido',
    description: 'Som imersivo para trabalho e lazer',
    image_url: null,
    parent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Os melhores celulares do mercado',
    image_url: null,
    parent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Carregadores, cabos e outros itens essenciais',
    image_url: null,
    parent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Fone Bluetooth Studio',
    slug: 'fone-bluetooth-studio',
    description: 'Fone sem fio com cancelamento de ruído avançado.',
    short_description: 'Cancelamento de ruído e bateria de longa duração.',
    price: 699.9,
    compare_at_price: 899.9,
    currency: 'BRL',
    sku: 'FB-STUDIO-01',
    stock_quantity: 24,
    is_active: true,
    is_featured: true,
    category_id: '1',
    images: ['https://images.unsplash.com/photo-1512499617640-c2f99912f2d5?auto=format&fit=crop&w=800&q=80'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories[0],
  },
  {
    id: 'prod-2',
    name: 'Smartphone Ultra',
    slug: 'smartphone-ultra',
    description: 'Câmera profissional e performance máxima.',
    short_description: 'Tela grande e bateria potente.',
    price: 3499.0,
    compare_at_price: 3799.0,
    currency: 'BRL',
    sku: 'SP-ULTRA-02',
    stock_quantity: 10,
    is_active: true,
    is_featured: true,
    category_id: '2',
    images: ['https://images.unsplash.com/photo-1510557880182-3db4c9a1d3c1?auto=format&fit=crop&w=800&q=80'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories[1],
  },
  {
    id: 'prod-3',
    name: 'Carregador Turbo USB-C',
    slug: 'carregador-turbo-usb-c',
    description: 'Carregamento rápido e seguro para todos os dispositivos.',
    short_description: '50W de potência e compatível com USB-C.',
    price: 129.9,
    compare_at_price: null,
    currency: 'BRL',
    sku: 'CH-USB-C-03',
    stock_quantity: 45,
    is_active: true,
    is_featured: false,
    category_id: '3',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories[2],
  },
  {
    id: 'prod-4',
    name: 'Cabo Lightning Premium',
    slug: 'cabo-lightning-premium',
    description: 'Durável e em alta velocidade para sincronização.',
    short_description: 'Revestimento resistente e rápido.',
    price: 79.9,
    compare_at_price: null,
    currency: 'BRL',
    sku: 'CB-LT-04',
    stock_quantity: 60,
    is_active: true,
    is_featured: false,
    category_id: '3',
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories[2],
  },
  {
    id: 'prod-5',
    name: 'Fone Gamer RGB',
    slug: 'fone-gamer-rgb',
    description: 'Som imersivo com design gamer e microfone flexível.',
    short_description: 'Som espacial com LED RGB.',
    price: 399.9,
    compare_at_price: 499.9,
    currency: 'BRL',
    sku: 'FB-GAMER-05',
    stock_quantity: 18,
    is_active: true,
    is_featured: false,
    category_id: '1',
    images: ['https://images.unsplash.com/photo-1519750157634-b3e2cd6fd599?auto=format&fit=crop&w=800&q=80'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: categories[0],
  },
]

const ITEMS_PER_PAGE = 12

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.is_featured && product.is_active).slice(0, 8)
}

export async function getMaxPrice(): Promise<number> {
  return Math.ceil(
    (Math.max(...products.filter((product) => product.is_active).map((product) => product.price)) || 0) / 1000,
  ) * 1000
}

interface ProductQueryParams {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: string
  page?: number
}

export async function getProducts(params: ProductQueryParams): Promise<{ products: Product[]; totalCount: number }> {
  let filtered = products.filter((product) => product.is_active)

  if (params.search) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(params.search!.toLowerCase()),
    )
  }

  if (params.category) {
    filtered = filtered.filter((product) => product.category?.slug === params.category)
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((product) => product.price >= params.minPrice!)
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((product) => product.price <= params.maxPrice!)
  }

  if (params.inStock) {
    filtered = filtered.filter((product) => product.stock_quantity > 0)
  }

  switch (params.sortBy) {
    case 'price-asc':
      filtered = filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered = filtered.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      filtered = filtered.sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  const page = params.page || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE
  const paginated = filtered.slice(from, to)

  return {
    products: paginated,
    totalCount: filtered.length,
  }
}

export { ITEMS_PER_PAGE }
