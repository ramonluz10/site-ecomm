import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getInventoryMovements, getProducts, registerInventoryMovement } from '@/lib/server/erp-db'
import { authorizeApi } from '@/lib/server/authorize'
import { validateCsrfMiddleware } from '@/lib/server/csrf-middleware'

export async function GET() {
  const auth = await authorizeApi('estoque')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const [movements, products] = await Promise.all([getInventoryMovements(), getProducts()])
  return NextResponse.json({ movements, products })
}

export async function POST(request: NextRequest) {
  const csrfError = await validateCsrfMiddleware(request)
  if (csrfError) return csrfError
  const auth = await authorizeApi('estoque')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await request.json()
  const type = body.type === 'entrada' ? 'entrada' : 'saida'
  const product_id = String(body.product_id || '')
  const quantity = Number(body.quantity)
  const supplier_id = body.supplier_id ? String(body.supplier_id) : null
  const note = String(body.note || '')

  if (!product_id || Number.isNaN(quantity) || quantity <= 0) {
    return NextResponse.json({ error: 'Produto e quantidade válidos são necessários' }, { status: 400 })
  }

  try {
    const movement = await registerInventoryMovement({ type, product_id, quantity, supplier_id, note })
    return NextResponse.json(movement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
