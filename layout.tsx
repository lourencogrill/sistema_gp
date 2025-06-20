'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Settings, User } from 'lucide-react';
import SideMenu from './components/SideMenu';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function FinancialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [menuExpandido, setMenuExpandido] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Verificar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Logs para depuração
  useEffect(() => {
    console.log("Estado da sessão:", status);
    console.log("Dados da sessão:", session);
  }, [status, session]);

  // Redirecionar para o login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Usuário não autenticado, redirecionando para login");
      router.push("/login");
    }
  }, [status, router]);

  // Redirecionar para /financials/dashboard se autenticado e na rota /financials
  useEffect(() => {
    if (status === "authenticated" && pathname === "/financials") {
      console.log("Usuário autenticado em /financials, redirecionando para /financials/dashboard");
      router.push("/financials/dashboard");
    }
  }, [status, pathname, router]);

  // Função para receber a alteração do estado de expandido do menu
  const handleMenuExpandChange = (expandido: boolean) => {
    setMenuExpandido(expandido);
  };

  // Se estiver carregando ou não autenticado, não renderizar o conteúdo
  if (status === "loading") {
    console.log("Renderizando tela de carregamento");
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    console.log("Renderizando nada (usuário não autenticado)");
    return null; // Não renderiza nada, deixa o redirecionamento acontecer
  }

  console.log("Renderizando layout principal");
  return (
    <div className="flex min-h-screen bg-muted">
      {/* Menu Lateral */}
      <SideMenu 
        menuAberto={menuAberto} 
        onMenuClose={() => setMenuAberto(false)}
        onMenuExpandChange={handleMenuExpandChange}
      />
      
      {/* Conteúdo Principal - Ajuste de margem conforme o tamanho do menu */}
      <div className={`
        flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${isMobile ? '' : (menuExpandido ? 'ml-64' : 'ml-20')}
      `}>
        {/* Cabeçalho */}
        <header className="bg-background shadow-sm h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center">
            <button
              className="text-foreground hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary md:hidden"
              onClick={() => setMenuAberto(true)}
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 flex items-center">
              <img src="/lume_logo.png" alt="Lume Logo" className="h-20 w-auto" />
            </div>
          </div>
          
          {/* Perfil do usuário na barra superior */}
          {session?.user && (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex flex-col items-end">
                <div className="font-medium text-sm text-foreground">{session.user.name}</div>
                <div className="text-xs text-muted-foreground">{session.user.email}</div>
              </div>
              <Link 
                href="/financials/settings"
                className="text-muted-foreground hover:text-foreground"
                title="Configurações"
              >
                <Settings size={20} />
              </Link>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || ''} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={16} />
                )}
              </div>
            </div>
          )}
        </header>
        
        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
} 