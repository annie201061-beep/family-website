import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }

    const redirectResponse = NextResponse.redirect(new URL('/', request.url))

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }

    redirectResponse.cookies.set('sb-access-token', access_token, cookieOptions)
    redirectResponse.cookies.set('sb-refresh-token', refresh_token, cookieOptions)

    return redirectResponse
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
