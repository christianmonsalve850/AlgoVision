import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

// 1. Define your route boundaries
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/']

export async function proxy(request: NextRequest) {
  // 2. First, let Supabase handle the session refresh logic.
  // This will read/update cookies and return a response or the session data.
  const supabaseResponse = await updateSession(request)
  
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Check for the user's session from the request cookies
  // Supabase stores the session in cookies (usually named 'sb-access-token' or similar)
  const hasSession = request.cookies.getAll().some(cookie => cookie.name.includes('auth-token'))

  // 4. Redirect to /login if trying to access a protected route without a session
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // 5. Redirect to a dashboard if logged-in user tries to hit public landing/auth pages
  if (isPublicRoute && hasSession && path !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  // 6. Return the response modified by Supabase so cookies stay updated
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
