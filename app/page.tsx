import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BenefitsSection } from '@/components/home/benefits-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import type { Category, Product } from '@/lib/types'

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('[v0] Error fetching categories:', error)
    return []
  }
  
  return data || []
}

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)
  
  if (error) {
    console.error('[v0] Error fetching featured products:', error)
    return []
  }
  
  return (data || []).map(product => ({
    ...product,
    images: product.images || []
  }))
}

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts()
  ])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <CategoriesSection categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <CTASection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
