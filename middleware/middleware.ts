// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Allow access to public routes without login
  const publicRoutes = ['/login', '/public']
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If no session, but accessing public route — allow
  if (!session) return res

  // Get user role from profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = profile?.role

  // Fallback if no role found
  if (!role) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin logic
  if (role === 'admin') {
    if (!pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  // User logic
  if (role === 'user') {
    // Block access to admin pages
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // Allow access to /dashboard and other normal pages
  }

  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Protect all routes except static files
}
