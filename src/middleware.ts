import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'

export default withAuth(
  async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const isAuth = !!token
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register')
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
    const isProtectedApi = request.nextUrl.pathname.startsWith('/api/create') ||
                          request.nextUrl.pathname.startsWith('/api/admin') ||
                          request.nextUrl.pathname.startsWith('/api/user')
    
    // 认证页面处理
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return null
    }

    // API和管理页面需要认证
    if (!isAuth && (isProtectedApi || isAdminPage)) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
      
      let from = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }
      
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
      );
    }

    // 管理员页面需要特定邮箱
    if (isAdminPage && token?.email !== 'kevinkang604@gmail.com') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => true  // 让中间件处理授权
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/create/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/login', 
    '/register'
  ]
} 