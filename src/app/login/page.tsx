'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60
  // URL-encode to handle special chars in JWT tokens
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter both email and password.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error || !data.session) {
        setMessage(error?.message || 'Login failed.')
        setLoading(false)
        return
      }

      // Set a persistent session cookie (7 days) — middleware checks this
      const maxAge = 7 * 24 * 60 * 60
      document.cookie = `family_session=1; path=/; max-age=${maxAge}; SameSite=Lax`

      // Also set Supabase tokens as cookies for the client library
      setCookie('sb-access-token', data.session.access_token)
      setCookie('sb-refresh-token', data.session.refresh_token)

      window.location.href = '/'
    } catch {
      setMessage('An error occurred. Please try again later.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">👨‍👩‍👦‍👦</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Ouyang-Wu 家庭网站
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in with your email and password
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-800"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-800"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            message.startsWith('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Only registered family members can access this site.</p>
          <p className="mt-1">📍 Mercer Island, WA</p>
        </div>
      </div>
    </div>
  )
}
