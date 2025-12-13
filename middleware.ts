// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = req.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/', '/register', '/public']
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  // If not logged in → redirect to login (unless public)
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If not logged in but accessing a public route → allow
  if (!session) return res

  // Get role from user_metadata instead of DB
  const role = session.user.user_metadata?.role

  if (!role) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Admin rules
  if (role === 'admin') {
    // Admins can access anything, except normal users area
    // No redirect forcing them to admin dashboard automatically
    return res
  }

  // Regular user rules
  if (role === 'user') {
    // Block admin pages
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next|static|.*\\.png|.*\\.jpg|.*\\.svg|favicon.ico).*)',
  ],
}


// admin@mathosim.co.za
// admin123
