"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface LoginFormValues {
  username: string
  password: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null)

    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const result = await response.json()
      setErrorMessage(result?.error || 'Falha ao autenticar')
      return
    }

    const result = await response.json()
    const role = result?.role || 'admin'

    if (role === 'estoquista') {
      router.push('/admin/estoque')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-lg rounded-3xl border border-slate-200 shadow-xl">
        <CardHeader className="space-y-2 px-8 pt-8">
          <CardTitle className="text-2xl">Login Administrativo</CardTitle>
          <CardDescription>
            Entre com sua conta de administrador para acessar o painel de gestão empresarial.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Usuário</label>
              <Input
                type="text"
                placeholder="admin"
                {...register('username', { required: true })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: true })}
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              Entrar no ERP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
