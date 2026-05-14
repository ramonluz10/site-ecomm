'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import type { Category } from '@/lib/types'

interface ProductFiltersProps {
  categories: Category[]
  maxPrice: number
}

export function ProductFilters({ categories, maxPrice }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('busca') || ''
  const currentCategory = searchParams.get('categoria') || ''
  const currentMinPrice = Number(searchParams.get('preco_min')) || 0
  const currentMaxPrice = Number(searchParams.get('preco_max')) || maxPrice
  const currentInStock = searchParams.get('em_estoque') === 'true'
  const currentSort = searchParams.get('ordenar') || 'newest'

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === '0') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset to first page on filter change
    params.delete('pagina')
    
    router.push(`/catalogo?${params.toString()}`)
  }, [router, searchParams])

  const clearFilters = () => {
    router.push('/catalogo')
  }

  const hasActiveFilters = currentSearch || currentCategory || currentInStock || 
    currentMinPrice > 0 || currentMaxPrice < maxPrice || currentSort !== 'newest'

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Nome do produto..."
            value={currentSearch}
            onChange={(e) => updateParams({ busca: e.target.value || null })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={currentCategory}
          onValueChange={(value) => updateParams({ categoria: value === 'all' ? null : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label>Faixa de Preço</Label>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={[currentMinPrice, currentMaxPrice]}
          onValueChange={([min, max]) => {
            updateParams({
              preco_min: min > 0 ? String(min) : null,
              preco_max: max < maxPrice ? String(max) : null
            })
          }}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentMinPrice)}
          </span>
          <span>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentMaxPrice)}
          </span>
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={currentInStock}
          onCheckedChange={(checked) => updateParams({ em_estoque: checked ? 'true' : null })}
        />
        <Label htmlFor="in-stock" className="cursor-pointer">
          Apenas produtos em estoque
        </Label>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Ordenar por</Label>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParams({ ordenar: value === 'newest' ? null : value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="glass-card rounded-2xl p-6 sticky top-24">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </h2>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
