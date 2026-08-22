import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    )
  }

  try {
    // Exchange the auth code for a session via Supabase API
    const response = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=pkce`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({ auth_code: code }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to exchange code')
    }

    const data = await response.json()

    // Create redirect response and set cookies
    const redirectResponse = NextResponse.redirect(
      new URL(next, request.url)
    )

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }

    redirectResponse.cookies.set(
      'sb-access-token',
      data.access_token,
      cookieOptions
    )
    redirectResponse.cookies.set(
      'sb-refresh-token',
      data.refresh_token,
      cookieOptions
    )

    return redirectResponse
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=invalid_link', request.url)
    )
  }
}
