import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/server/erp-db'

export async function GET(request: Request) {
  const cookieJar = await cookies()
  const sessionId = cookieJar.get?.('erp_session')?.value
  if (sessionId) {
    await destroySession(sessionId)
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.set({
    name: 'erp_session',
    value: '',
    path: '/',
    maxAge: 0,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
