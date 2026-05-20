import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/server/auth'
import { readERPData, createSession } from '@/lib/server/erp-db'
import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt } from '@/lib/server/rate-limit'

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

export async function POST(request: Request) {
  const body = await request.json()
  const username = String(body.username || '')
  const password = String(body.password || '')
  const clientIp = getClientIp(request)
  const rateLimitKey = `login:${clientIp}`

  if (!username || !password) {
    return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 })
  }

  const rateLimitCheck = await checkRateLimit(rateLimitKey)
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimitCheck.retryAfter || 300) } },
    )
  }

  const isValid = await verifyAdmin(username, password)

  if (!isValid) {
    await recordFailedAttempt(rateLimitKey)
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  const data = await readERPData()
  const user = data.users.find((u) => u.username === username)
  if (!user) {
    await recordFailedAttempt(rateLimitKey)
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 })
  }

  const session = await createSession(user.id, 60 * 60 * 8)
  const role = user.role || 'admin'

  await recordSuccessfulAttempt(rateLimitKey)

  const response = NextResponse.json({ success: true, role })
  response.cookies.set({
    name: 'erp_session',
    value: session.id,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  })

  return response
}
