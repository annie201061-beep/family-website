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
  const { pathname } = request.nextUrl

  // Allow login page and auth callback without authentication
  if (pathname === '/login' || pathname.startsWith('/auth/callback')) {
    return NextResponse.next()
  }

  // Check Supabase access token (expires in ~1 hour, no persistent session)
  const accessToken = request.cookies.get('sb-access-token')
  if (accessToken) {
    const payload = parseJwt(accessToken.value)
    if (payload?.exp && Date.now() < payload.exp * 1000) {
      return NextResponse.next()
    }
  }

  // No valid session — redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
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
