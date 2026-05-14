'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)
  const { isInWishlist, toggleItem } = useWishlistStore()
  
  const inWishlist = isInWishlist(product.id)
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative glass-card rounded-2xl overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {hasDiscount && (
            <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-md">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md">
              Destaque
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleItem(product)}
          className={cn(
            'absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all',
            inWishlist
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
          )}
          aria-label={inWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
        </button>

        {/* Image */}
        <Link href={`/produto/${product.slug}`} className="block relative aspect-square">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quick View Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Button variant="secondary" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </Button>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-muted-foreground mb-1 block">
              {product.category.name}
            </span>
          )}
          
          {/* Name */}
          <Link href={`/produto/${product.slug}`}>
            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full gap-2"
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock_quantity > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
