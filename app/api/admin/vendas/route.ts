import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSales, getProducts, registerSale } from '@/lib/server/erp-db'
import { authorizeApi } from '@/lib/server/authorize'
import { validateCsrfMiddleware } from '@/lib/server/csrf-middleware'

export async function GET() {
  const auth = await authorizeApi('vendas')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const [sales, products] = await Promise.all([getSales(), getProducts()])
  return NextResponse.json({ sales, products })
}

export async function POST(request: NextRequest) {
  const csrfError = await validateCsrfMiddleware(request)
  if (csrfError) return csrfError
  const auth = await authorizeApi('vendas')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await request.json()
  const customer_name = String(body.customer_name || '')
  const items = Array.isArray(body.items) ? body.items : []

  if (!customer_name || items.length === 0) {
    return NextResponse.json({ error: 'Nome do cliente e itens da venda são obrigatórios' }, { status: 400 })
  }

  try {
    const sale = await registerSale({ customer_name, items })
    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
