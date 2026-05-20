"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdminForm } from '@/lib/hooks/use-admin-form'
import { ProductFormSchema, type ProductFormValues } from '@/lib/types/forms'
import { FormInput } from './forms/form-input'
import { zodResolver } from '@hookform/resolvers/zod'

export function ProductForm() {
  const router = useRouter()
  
  const form = useAdminForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      stock_quantity: 0,
      description: '',
      short_description: '',
    },
    onSubmit: async (data) => {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result?.error || 'Falha ao cadastrar produto')
      }

      router.refresh()
    },
  })

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit}>
      {form.error && (
        <Alert variant="destructive">
          <AlertDescription>{form.error}</AlertDescription>
        </Alert>
      )}

      <FormInput
        label="Nome"
        placeholder="Nome do produto"
        registration={form.register('name')}
        error={form.formState.errors.name}
        required
      />

      <FormInput
        label="SKU"
        placeholder="Código SKU"
        registration={form.register('sku')}
        error={form.formState.errors.sku}
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Preço"
          type="number"
          step="0.01"
          placeholder="7999.90"
          registration={form.register('price')}
          error={form.formState.errors.price}
          required
        />
        <FormInput
          label="Quantidade"
          type="number"
          placeholder="10"
          registration={form.register('stock_quantity')}
          error={form.formState.errors.stock_quantity}
          required
        />
      </div>

      <FormInput
        label="Descrição"
        placeholder="Descrição completa"
        registration={form.register('description')}
        error={form.formState.errors.description}
      />

      <FormInput
        label="Breve descrição"
        placeholder="Descrição curta"
        registration={form.register('short_description')}
        error={form.formState.errors.short_description}
      />

      <Button type="submit" className="w-full" disabled={form.submitting}>
        {form.submitting ? 'Cadastrando...' : 'Cadastrar produto'}
      </Button>
    </form>
  )
}
