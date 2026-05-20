import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/robots.txt', '/favicon.ico']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_PATHS.some((path) => pathname === path) || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('admin_access_token')?.value
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
