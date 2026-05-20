import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BenefitsSection } from '@/components/home/benefits-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import {
  getCategories as fetchCategories,
  getFeaturedProducts as fetchFeaturedProducts,
} from '@/lib/data'
// tipos importados removidos — não utilizados

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    fetchCategories(),
    fetchFeaturedProducts()
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
