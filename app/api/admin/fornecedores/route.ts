import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { addSupplier, getSuppliers } from '@/lib/server/erp-db'
import { authorizeApi } from '@/lib/server/authorize'
import { validateCsrfMiddleware } from '@/lib/server/csrf-middleware'

export async function GET() {
  const auth = await authorizeApi('fornecedores')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const suppliers = await getSuppliers()
  return NextResponse.json(suppliers)
}

export async function POST(request: NextRequest) {
  const csrfError = await validateCsrfMiddleware(request)
  if (csrfError) return csrfError
  const auth = await authorizeApi('fornecedores')
  if (auth.status === 'unauthorized') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  if (auth.status === 'forbidden') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await request.json()
  const name = String(body.name || '')
  const email = String(body.email || '')
  const phone = String(body.phone || '')
  const address = String(body.address || '')

  if (!name || !email || !phone || !address) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
  }

  try {
    const supplier = await addSupplier({ name, email, phone, address })
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
