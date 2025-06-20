import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

export default withAuth(
  // A função do middleware é chamada após a verificação de autorização.
  // Como estamos pulando a autorização em dev/preview, ela simplesmente continua.
  function middleware(req: NextRequestWithAuth) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => {
        // Pula a autorização para todos os ambientes da Vercel que não são 'production'.
        if (process.env.VERCEL_ENV !== 'production') {
          return true;
        }
        // Em produção, exige um token (usuário logado).
        return !!token;
      },
    },
    pages: {
      signIn: '/login', // Para onde redirecionar se a autorização falhar (apenas em produção).
    },
  }
);

// Configuração para especificar em quais rotas o middleware deve rodar.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (rotas de API do NextAuth)
     * - login (a página de login)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ],
}; 