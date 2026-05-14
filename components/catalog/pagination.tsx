'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('pagina')
    } else {
      params.set('pagina', String(page))
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5
    
    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-muted-foreground">
        Mostrando página {currentPage} de {totalPages} ({totalItems} produtos)
      </p>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? 'default' : 'outline'}
                size="icon"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2 text-muted-foreground">
                {page}
              </span>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
