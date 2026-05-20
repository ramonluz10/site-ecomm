import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './erp-db'
import { validateCsrfToken } from './csrf'
import { cookies } from 'next/headers'

export async function validateCsrfMiddleware(request: NextRequest, sessionId?: string) {
  const method = request.method
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return null
  }

  const sid = sessionId || (await cookies()).get('erp_session')?.value
  if (!sid) {
    return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
  }

  const session = await getSession(sid)
  if (!session) {
    return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 })
  }

  const csrfToken = request.headers.get('x-csrf-token')
  if (!csrfToken) {
    return NextResponse.json({ error: 'Token CSRF ausente' }, { status: 403 })
  }

  if (!validateCsrfToken(sid, csrfToken)) {
    return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 })
  }

  return null
}
