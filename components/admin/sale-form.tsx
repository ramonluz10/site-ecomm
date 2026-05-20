"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SaleFormProps {
  products: Array<{ id: string; name: string; price: number }>
}

interface SaleFormValues {
  customer_name: string
  product_id: string
  quantity: string
}

export function SaleForm({ products }: SaleFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<SaleFormValues>({
    defaultValues: {
      customer_name: '',
      product_id: products[0]?.id || '',
      quantity: '1',
    },
  })

  async function onSubmit(values: SaleFormValues) {
    setError(null)
    setSubmitting(true)

    const selectedProduct = products.find((product) => product.id === values.product_id)
    const payload = {
      customer_name: values.customer_name,
      items: [
        {
          product_id: values.product_id,
          quantity: Number(values.quantity),
          price: selectedProduct?.price ?? 0,
        },
      ],
    }

    const response = await fetch('/api/admin/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSubmitting(false)

    if (!response.ok) {
      const result = await response.json()
      setError(result?.error || 'Falha ao registrar venda')
      return
    }

    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Cliente</label>
        <Input type="text" {...register('customer_name')} placeholder="Nome do cliente" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Produto</label>
        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" {...register('product_id')}>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — R$ {product.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Quantidade</label>
        <Input type="number" {...register('quantity')} placeholder="1" />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        Registrar venda
      </Button>
    </form>
  )
}
