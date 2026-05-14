'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground max-w-md">
          Tente ajustar os filtros ou fazer uma busca diferente para encontrar o que procura.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
