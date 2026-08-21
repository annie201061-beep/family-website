import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Parse a JWT token payload without verification.
 * Used to check token expiry in the middleware.
 */
function parseJwt(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  const { pathname } = request.nextUrl

  // Allow access to login page and auth callback without authentication
  if (pathname === '/login' || pathname.startsWith('/auth/callback')) {
    // If already logged in, redirect to home
    if (accessToken) {
      const payload = parseJwt(accessToken)
      if (payload?.exp && Date.now() < payload.exp * 1000) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return NextResponse.next()
  }

  // All other routes require authentication
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = parseJwt(accessToken)
  if (!payload?.exp || Date.now() >= payload.exp * 1000) {
    // Token expired
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
