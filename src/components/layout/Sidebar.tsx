'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Network,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  UserCog,
} from 'lucide-react';

interface SideMenuProps {
  isMobileMenuOpen: boolean;
  onMenuClose: () => void;
  onMenuExpandChange: (isExpanded: boolean) => void;
}

// Estrutura de menu reorganizada com seções
const menuSections = [
  {
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Users, label: 'Colaboradores', href: '/collaborators' },
    ],
  },
  {
    title: 'Gestão de Pessoas',
    items: [
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    title: 'Organização',
    items: [
      { icon: Network, label: 'Estrutura', href: '/organization' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: Settings, label: 'Configurações', href: '/settings' },
      { icon: HelpCircle, label: 'Ajuda', href: '/help' },
    ],
  },
];

export const Sidebar = ({ isMobileMenuOpen, onMenuClose, onMenuExpandChange }: SideMenuProps) => {
  const pathname = usePathname();
  const [menuExpandido, setMenuExpandido] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Verificar tamanho da tela e atualizar estados
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      console.log('Screen size check - isMobile:', mobile); // Debug temporário
    };
    
    checkScreenSize();
    onMenuExpandChange(false);
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onMenuExpandChange]);

  // Função para alternar o estado do menu expandido
  const toggleMenuExpandido = () => {
    const novoEstado = !menuExpandido;
    setMenuExpandido(novoEstado);
    onMenuExpandChange(novoEstado);
    console.log('Menu toggle clicked - new state:', novoEstado); // Debug temporário
  };

  // Função para lidar com clique nos itens do menu
  const handleMenuItemClick = () => {
    if (isMobile) {
      onMenuClose();
    }
  };

  // Handlers de mouse melhorados
  const handleMouseEnter = () => {
    if (!isMobile) {
      console.log('Mouse entered sidebar - isMobile:', isMobile); // Debug temporário
      setMenuHover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      console.log('Mouse left sidebar - isMobile:', isMobile); // Debug temporário
      setMenuHover(false);
    }
  };

  // Determinar se o menu deve ser exibido expandido
  const isExpanded = isMobile ? isMobileMenuOpen : (menuExpandido || menuHover);
  
  console.log('Sidebar state - isExpanded:', isExpanded, 'menuHover:', menuHover, 'menuExpandido:', menuExpandido, 'isMobile:', isMobile); // Debug temporário

  return (
    <>
      {/* Overlay para fechar o menu em telas pequenas */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMenuClose}
        />
      )}
      
      {/* Menu lateral */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-background border-r border-border z-40 
          transition-all duration-300 ease-in-out select-none
          ${isMobile 
            ? (isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full')
            : (isExpanded ? 'w-64' : 'w-20')
          }
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Cabeçalho do menu */}
        <div className={`flex justify-between items-center h-16 border-b border-border transition-all duration-300 ${
          isExpanded ? 'px-4' : 'px-6 justify-center'
        }`}>
          <div className="overflow-hidden">
            <h2 className={`font-semibold text-foreground text-base transition-all duration-300 transform ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              Lume People
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && isMobileMenuOpen && (
              <button 
                className="text-muted-foreground hover:text-foreground p-1 rounded"
                onClick={onMenuClose}
              >
                <X size={20} />
              </button>
            )}
            {!isMobile && (
              <button
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                onClick={toggleMenuExpandido}
                title={menuExpandido ? "Recolher menu" : "Expandir menu"}
              >
                {menuExpandido ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>
          
        {/* Links do menu */}
        <nav className="p-2 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuSections.map((section, sectionIndex) => (
              <React.Fragment key={section.title || `section-${sectionIndex}`}>
                {sectionIndex > 0 && (
                  <li className="pt-1.5 pb-0.5">
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
                      <span
                        className={`absolute inset-0 flex items-center transition-opacity duration-300 ease-in-out
                                    ${isExpanded ? 'justify-start opacity-100' : 'justify-center opacity-0 pointer-events-none'}`}
                      >
                        <span className="truncate max-w-full">{section.title}</span>
                      </span>

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
                      </Link>
                    </li>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}; 