'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/lib/types'

interface CategoriesSectionProps {
  categories: Category[]
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

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-2"
            >
              Explore por Categoria
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Encontre exatamente o que você procura
            </motion.p>
          </div>
          <Link
            href="/categorias"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link
                href={`/catalogo?categoria=${category.slug}`}
                className="group block relative aspect-square rounded-2xl overflow-hidden glass-card hover:border-primary/30 transition-colors"
              >
                {/* Image */}
                {category.image_url && (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                  <h3 className="text-lg font-semibold text-center mb-1">{category.name}</h3>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver produtos
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Link */}
        <Link
          href="/categorias"
          className="flex sm:hidden items-center justify-center gap-2 text-sm font-medium text-primary hover:underline mt-8"
        >
          Ver todas as categorias
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
