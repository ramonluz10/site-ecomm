import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { addProduct, getProducts } from '@/lib/server/erp-db'
import { authorizeApi } from '@/lib/server/authorize'
import { validateCsrfMiddleware } from '@/lib/server/csrf-middleware'

export async function GET() {
  const auth = await authorizeApi('produtos')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const products = await getProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const csrfError = await validateCsrfMiddleware(request)
  if (csrfError) return csrfError
  const auth = await authorizeApi('produtos')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const body = await request.json()
  const name = String(body.name || '')
  const sku = String(body.sku || '')
  const price = Number(body.price)
  const stock_quantity = Number(body.stock_quantity)
  const description = String(body.description || '')
  const short_description = String(body.short_description || '')

  if (!name || !sku || Number.isNaN(price) || Number.isNaN(stock_quantity)) {
    return NextResponse.json({ error: 'Preencha nome, SKU, preço e quantidade em estoque' }, { status: 400 })
  }

  try {
    const product = await addProduct({ name, sku, price, stock_quantity, description, short_description })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
