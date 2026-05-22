import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { registerSale } from '@/lib/server/erp-db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const customer_name = String(body.customer_name || 'Cliente')
  const items = Array.isArray(body.items) ? body.items : []

  if (!customer_name || items.length === 0) {
    return NextResponse.json(
      { error: 'Nome do cliente e itens do carrinho são obrigatórios' },
      { status: 400 },
    )
  }

  try {
    const sale = await registerSale({ customer_name, items })
    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 },
    )
  }
}
