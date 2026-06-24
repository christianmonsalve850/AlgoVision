export const publicRoutes = ['/', '/login', '/auth/callback'] as const

export const protectedRoutes = ['/dashboard/:path*', '/learn/:path*', 'practice/:path*', 'interview/:path*'] as const

function routePatternToPrefix(pattern: string) {
  return pattern.replace(/\/:path\*$/, '')
}

export function matchesRoute(pathname: string, pattern: string) {
  if (pattern.endsWith('/:path*')) {
    return pathname === routePatternToPrefix(pattern) || pathname.startsWith(`${routePatternToPrefix(pattern)}/`)
  }

  return pathname === pattern
}

export function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => matchesRoute(pathname, route))
}

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => matchesRoute(pathname, route))
}
