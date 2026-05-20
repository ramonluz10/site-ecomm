"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdminForm } from '@/lib/hooks/use-admin-form'
import { SupplierFormSchema, type SupplierFormValues } from '@/lib/types/forms'
import { FormInput } from './forms/form-input'
import { zodResolver } from '@hookform/resolvers/zod'

export function SupplierForm() {
  const router = useRouter()

  const form = useAdminForm<SupplierFormValues>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    onSubmit: async (data) => {
      const response = await fetch('/api/admin/fornecedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result?.error || 'Falha ao cadastrar fornecedor')
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
        placeholder="Nome do fornecedor"
        registration={form.register('name')}
        error={form.formState.errors.name}
        required
      />

      <FormInput
        label="E-mail"
        type="email"
        placeholder="email@fornecedor.com"
        registration={form.register('email')}
        error={form.formState.errors.email}
        required
      />

      <FormInput
        label="Telefone"
        placeholder="(11) 99999-0001"
        registration={form.register('phone')}
        error={form.formState.errors.phone}
        required
      />

      <FormInput
        label="Endereço"
        placeholder="Rua, número, cidade"
        registration={form.register('address')}
        error={form.formState.errors.address}
        required
      />

      <Button type="submit" className="w-full" disabled={form.submitting}>
        {form.submitting ? 'Cadastrando...' : 'Cadastrar fornecedor'}
      </Button>
    </form>
  )
}
