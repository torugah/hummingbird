import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'
import { withAuth } from 'next-auth/middleware'

// 1. Configuração principal do middleware
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Redireciona para login se não houver token
    if (!request.nextauth.token) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Proteção adicional para rotas específicas (exemplo)
    if (request.nextUrl.pathname.startsWith('/admin') && 
        request.nextauth.token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  },
  {
    // 2. Configurações de callbacks
    callbacks: {
      authorized: ({ token }) => {
        // Debug: descomente para ver o token no log do Vercel
        // console.log('[MIDDLEWARE_TOKEN]', token)
        return !!token // Transforma em booleano
      },
    },
    // 3. Páginas de erro personalizadas (opcional)
    pages: {
      signIn: '/',
      error: '/auth/error'
    }
  }
)

// 4. Configuração de rotas protegidas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/calendar/:path*',
    '/categories/:path*',
    '/configurations/:path*',
    '/cards/:path*',
    '/desiresAndDecisions/:path*'
  ]
}