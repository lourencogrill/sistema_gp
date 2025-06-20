import { NextRequest, NextResponse } from 'next/server';
import {
  withAuth,
  type NextRequestWithAuth,
  type NextAuthMiddlewareOptions,
} from 'next-auth/middleware';
import { NextAuthToken } from 'next-auth/jwt';

// Este é um placeholder. Em uma aplicação real, você buscaria a empresa no BD.
const FAKE_COMPANY_DB = [
  { id: 'company_a', name: 'Acme Corp', slug: 'acme' },
  { id: 'company_b', name: 'Lume Inc', slug: 'lume' },
];

/**
 * Extrai o slug da empresa do início do pathname.
 * Ex: /acme/dashboard -> "acme"
 */
function extractCompanySlug(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  // Assumimos que o slug da empresa é o primeiro segmento do path.
  // Você pode ajustar essa lógica se a estrutura da URL for diferente.
  if (parts.length > 0) {
    // Verificamos se o slug corresponde a uma empresa conhecida.
    const companyExists = FAKE_COMPANY_DB.some(c => c.slug === parts[0]);
    if (companyExists) {
      return parts[0];
    }
  }
  return null;
}

async function tenancyMiddleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl;

  // Ignorar rotas que não precisam de tenancy (ex: /login, /api/auth)
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  const companySlug = extractCompanySlug(pathname);

  if (!companySlug) {
    // Se a rota for uma API que espera um companyId, retorne 401.
    // Para páginas, você pode querer redirecionar para uma página de seleção de empresa.
    if (pathname.startsWith('/api/companies')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Company not identified' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Por enquanto, permite o acesso a outras páginas, mas sem o header do companyId
    // Idealmente, redirecionaria para /select-company ou página de erro.
    return NextResponse.next();
  }
  
  const company = FAKE_COMPANY_DB.find(c => c.slug === companySlug);
  const companyId = company?.id;

  if (!companyId) {
    // Não deveria acontecer se o slug foi validado, mas é uma boa verificação.
    return new Response(JSON.stringify({ error: 'Unauthorized: Company not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
  }

  // Reescrever a URL para remover o slug da empresa, para que as páginas não precisem saber sobre ele.
  // Ex: /acme/dashboard -> /dashboard
  const newPathname = pathname.replace(`/${companySlug}`, '') || '/';
  const url = request.nextUrl.clone();
  url.pathname = newPathname;

  // Injetar companyId no header para uso nas API Routes e Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-company-id', companyId);

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
}

export default withAuth(
  // `withAuth` estende o `req` com o token do usuário.
  async function middleware(request: NextRequestWithAuth) {
    // Roda o middleware de tenancy primeiro
    const tenancyResponse = await tenancyMiddleware(request);

    // Se o middleware de tenancy retornou uma resposta (reescrita ou outra),
    // devemos usá-la. Caso contrário, continuamos.
    if (tenancyResponse) {
      return tenancyResponse;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: NextAuthToken | null }) => {
        // Se a variável de ambiente SKIP_AUTH for true, sempre autoriza.
        if (process.env.SKIP_AUTH === 'true') {
          return true;
        }
        // Caso contrário, exige um token (usuário logado).
        return !!token;
      },
    },
    pages: {
      signIn: '/login', // Redireciona para a página de login se não autorizado
    },
  } as NextAuthMiddlewareOptions
);

// Configuração para especificar em quais rotas o middleware deve rodar.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 