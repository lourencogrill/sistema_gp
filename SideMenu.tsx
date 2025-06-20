'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  X, PlusCircle, DollarSign, CreditCard, RefreshCw, FileText, 
  TrendingUp, PieChart, ExternalLink, ArrowRight, BarChart2,
  Home, FilePlus, Calendar, Settings, ChevronRight, ChevronLeft,
  Package, ShoppingBag, Boxes, User, Users, ArrowRightLeft,
  ClipboardList
} from 'lucide-react';

interface SideMenuProps {
  menuAberto: boolean;
  onMenuClose: () => void;
  onMenuExpandChange?: (expandido: boolean) => void;
}

// Estrutura de menu reorganizada com seções
const menuSections = [
  {
    items: [
      { icon: Home, label: 'Dashboard', href: '/financials/dashboard' },
      { icon: ClipboardList, label: 'Planos de Ação', href: '/financials/kanban' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { icon: FileText, label: 'Contas a Pagar', href: '/financials/accounts-payable' },
      { icon: CreditCard, label: 'Contas a Receber', href: '/financials/accounts-receivable' },
      { icon: Calendar, label: 'Extrato', href: '/financials/statement' },
      { icon: RefreshCw, label: 'Conciliação', href: '/financials/reconciliation' },
    ],
  },
  {
    title: 'Relatórios',
    items: [
      { icon: TrendingUp, label: 'Fluxo de Caixa', href: '/financials/cash-flow' },
      { icon: BarChart2, label: 'DRE', href: '/financials/dre' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { icon: ExternalLink, label: 'Importação XML', href: '/financials/importacao-xml' },
      { icon: Package, label: 'Produtos', href: '/financials/produtos' },
      { icon: ArrowRightLeft, label: 'Transferências', href: '/financials/estoque' },
      { icon: PieChart, label: 'Cadastros', href: '/financials/cadastros' },
      { icon: Users, label: 'RH', href: '/financials/rh' },
    ],
  },
];

export default function SideMenu({ menuAberto, onMenuClose, onMenuExpandChange }: SideMenuProps) {
  const pathname = usePathname();
  const [menuExpandido, setMenuExpandido] = useState(false); // Iniciar recolhido por padrão
  const [menuHover, setMenuHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const { rhPendingCount } = useNotifications();

  // Verificar tamanho da tela e atualizar estados
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // 768px é o breakpoint md do Tailwind
      setIsMobile(mobile);
    };
    
    // Verificar inicialmente
    checkScreenSize();
    
    // Notificar o componente pai sobre o estado inicial do menu
    if (onMenuExpandChange) {
      onMenuExpandChange(false); // Informar que o menu começa recolhido
    }
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Limpar listener ao desmontar o componente
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onMenuExpandChange]);

  // Função para alternar o estado do menu expandido
  const toggleMenuExpandido = () => {
    const novoEstado = !menuExpandido;
    setMenuExpandido(novoEstado);
    
    // Notificar o componente pai sobre a mudança
    if (onMenuExpandChange) {
      onMenuExpandChange(novoEstado);
    }
  };

  // Função para lidar com clique nos itens do menu
  const handleMenuItemClick = () => {
    // Fecha o menu somente em dispositivos móveis
    if (isMobile) {
      onMenuClose();
    }
  };

  // Determinar se o menu deve ser exibido expandido
  const isExpanded = isMobile ? menuAberto : (menuExpandido || menuHover);
  
  return (
    <>
      {/* Overlay para fechar o menu em telas pequenas */}
      {menuAberto && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMenuClose}
        />
      )}
      
      {/* Menu lateral */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-background border-r border-border z-40 transition-all duration-300 ease-in-out
          ${isMobile 
            ? (menuAberto ? 'w-64 translate-x-0' : 'w-64 -translate-x-full')
            : (isExpanded ? 'w-64' : 'w-20')
          }
        `}
        onMouseEnter={() => !isMobile && setMenuHover(true)}
        onMouseLeave={() => !isMobile && setMenuHover(false)}
      >
        {/* Cabeçalho do menu */}
        <div className={`flex justify-between items-center h-16 border-b border-border transition-all duration-300 ${
          isExpanded ? 'px-4' : 'px-6 justify-center'
        }`}>
          <div className="overflow-hidden">
            <h2 className={`font-semibold text-foreground text-base transition-all duration-300 transform ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              Lume
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && menuAberto && (
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={onMenuClose}
              >
                <X size={20} />
              </button>
            )}
            {!isMobile && (
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={toggleMenuExpandido}
                title={menuExpandido ? "Recolher menu" : "Expandir menu"}
              >
                {menuExpandido ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>
          
        {/* Links do menu */}
        <nav className="p-2">
          <ul className="space-y-1">
            {menuSections.map((section, sectionIndex) => (
              <React.Fragment key={section.title || `section-${sectionIndex}`}>
                {sectionIndex > 0 && ( // Adiciona hr antes de seções com título, exceto a primeira
                  <li className="pt-1.5 pb-0.5"> {/* Espaçamento Reduzido */}
                    <hr className="border-border/60" />
                  </li>
                )}
                {section.title && (
                  <li 
                    className={`pt-1.5 pb-0.5 overflow-hidden transition-all duration-300 ease-in-out
                                ${isExpanded ? 'px-3' : 'px-6'}`} 
                  >
                    <h3 
                      className={`relative text-xs font-semibold text-muted-foreground uppercase tracking-wider h-5
                                  ${isExpanded ? 'text-left' : 'text-center'}`}
                    >
                      {/* Texto Completo - posicionado para preencher, transição de opacidade */}
                      <span
                        className={`absolute inset-0 flex items-center transition-opacity duration-300 ease-in-out
                                    ${isExpanded ? 'justify-start opacity-100' : 'justify-center opacity-0 pointer-events-none'}`}
                      >
                        <span className="truncate max-w-full">{section.title}</span>
                      </span>

                      {/* Texto Abreviado - posicionado para preencher, transição de opacidade */}
                      {/* Só mostrar se !isMobile */}
                      {!isMobile && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-[10px] transition-opacity duration-300 ease-in-out
                                      ${!isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                          {section.title.substring(0, 3)}
                        </span>
                      )}
                    </h3>
                  </li>
                )}
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  const showNotification = item.href === '/financials/rh' && rhPendingCount > 0;
                  
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        className={`
                          flex items-center justify-start py-1.5 rounded-md transition-all duration-300 relative group
                          ${isExpanded ? 'px-3' : 'px-6'}
                          ${isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-foreground hover:bg-muted hover:text-foreground'}
                        `}
                        title={!isExpanded ? item.label : ""}
                        onClick={handleMenuItemClick}
                      >
                        <IconComponent size={18} className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        <div className="overflow-hidden">
                          <span className={`ml-3 whitespace-nowrap transition-all duration-300 transform block text-sm ${
                            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                          } ${isActive ? 'font-medium' : 'font-normal'}`}>
                            {item.label}
                          </span>
                        </div>
                        
                        {/* Indicador de notificação */}
                        {showNotification && (
                          <span className={`
                            bg-destructive text-destructive-foreground text-xs rounded-full font-medium
                            px-1.5 py-0.5 min-w-[20px] text-center transition-all duration-300
                            ${isExpanded 
                              ? 'ml-auto' 
                              : 'absolute -top-1 -right-1 ml-0'
                            }
                          `}>
                            {rhPendingCount > 0 ? rhPendingCount : ''}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
} 