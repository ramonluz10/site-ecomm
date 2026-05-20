import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductFilters } from '@/components/catalog/product-filters'
import { ProductGrid } from '@/components/catalog/product-grid'
import { Pagination } from '@/components/catalog/pagination'
import {
  getCategories as fetchCategories,
  getMaxPrice as fetchMaxPrice,
  getProducts as fetchProducts,
  ITEMS_PER_PAGE,
} from '@/lib/data'
import type { Category, Product } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explore nossa coleção completa de produtos de tecnologia premium.',
}

interface CatalogPageProps {
  searchParams: Promise<{
    busca?: string
    categoria?: string
    preco_min?: string
    preco_max?: string
    em_estoque?: string
    ordenar?: string
    pagina?: string
  }>
}

function CatalogContent({ 
  products, 
  totalCount, 
  currentPage, 
  categories, 
  maxPrice 
}: { 
  products: Product[]
  totalCount: number
  currentPage: number
  categories: Category[]
  maxPrice: number
}) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="flex gap-8">
      <ProductFilters categories={categories} maxPrice={maxPrice} />
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        <ProductGrid products={products} />
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={totalCount} 
        />
      </div>
    </div>
  )
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  
  const [categories, maxPrice, { products, totalCount }] = await Promise.all([
    fetchCategories(),
    fetchMaxPrice(),
    fetchProducts({
      search: params.busca,
      category: params.categoria,
      minPrice: params.preco_min ? Number(params.preco_min) : undefined,
      maxPrice: params.preco_max ? Number(params.preco_max) : undefined,
      inStock: params.em_estoque === 'true',
      sortBy: params.ordenar,
      page: params.pagina ? Number(params.pagina) : 1
    })
  ])

  const currentPage = params.pagina ? Number(params.pagina) : 1

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Catálogo</h1>
            <p className="text-muted-foreground">
              Explore nossa coleção completa de produtos de tecnologia premium
            </p>
          </div>

          <Suspense fallback={<div className="animate-pulse">Carregando...</div>}>
            <CatalogContent 
              products={products}
              totalCount={totalCount}
              currentPage={currentPage}
              categories={categories}
              maxPrice={maxPrice}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
