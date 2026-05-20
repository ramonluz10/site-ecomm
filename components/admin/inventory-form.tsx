"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminForm } from '@/lib/hooks/use-admin-form'
import { InventoryFormSchema, type InventoryFormValues } from '@/lib/types/forms'
import { FormInput } from './forms/form-input'
import { zodResolver } from '@hookform/resolvers/zod'

interface InventoryFormProps {
  products: Array<{ id: string; name: string }>
}

export function InventoryForm({ products }: InventoryFormProps) {
  const router = useRouter()

  const form = useAdminForm<InventoryFormValues>({
    resolver: zodResolver(InventoryFormSchema),
    defaultValues: {
      type: 'entrada',
      product_id: products[0]?.id || '',
      quantity: 0,
      supplier_id: '',
      note: '',
    },
    onSubmit: async (data) => {
      const response = await fetch('/api/admin/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result?.error || 'Falha ao registrar movimentação')
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo</label>
        <select
          {...form.register('type')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Produto</label>
        <select
          {...form.register('product_id')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Quantidade"
        type="number"
        placeholder="0"
        registration={form.register('quantity')}
        error={form.formState.errors.quantity}
        required
      />

      <FormInput
        label="Fornecedor (opcional)"
        placeholder="ID do fornecedor"
        registration={form.register('supplier_id')}
        error={form.formState.errors.supplier_id}
      />

      <FormInput
        label="Observação"
        placeholder="Descrição da movimentação"
        registration={form.register('note')}
        error={form.formState.errors.note}
      />

      <Button type="submit" className="w-full" disabled={form.submitting}>
        {form.submitting ? 'Registrando...' : 'Registrar movimentação'}
      </Button>
    </form>
  )
}
