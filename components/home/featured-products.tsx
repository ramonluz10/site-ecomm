'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/lib/types'

interface FeaturedProductsProps {
  products: Product[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary mb-2 block"
            >
              Destaques
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold"
            >
              Produtos em Destaque
            </motion.h2>
          </div>
          <Link
            href="/catalogo?destaque=true"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Link */}
        <Link
          href="/catalogo?destaque=true"
          className="flex sm:hidden items-center justify-center gap-2 text-sm font-medium text-primary hover:underline mt-8"
        >
          Ver todos os destaques
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
