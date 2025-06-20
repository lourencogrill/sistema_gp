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
} from 'lucide-react';

interface SideMenuProps {
  isMobileMenuOpen: boolean;
  onMenuClose: () => void;
  onMenuExpandChange: (isExpanded: boolean) => void;
}

const menuSections = [
  {
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Users, label: 'Colaboradores', href: '/collaborators' },
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
      { icon: Network, label: 'Organização', href: '/organization' },
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
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    onMenuExpandChange(false); // Informar que o menu começa recolhido
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onMenuExpandChange]);

  const toggleMenuExpand = () => {
    const newState = !isMenuExpanded;
    setIsMenuExpanded(newState);
    onMenuExpandChange(newState);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      onMenuClose();
    }
  };

  const isExpanded = isMobile ? isMobileMenuOpen : isMenuExpanded || isMenuHovered;

  return (
    <>
      {isMobileMenuOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onMenuClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r border-border z-40 transition-all duration-300 ease-in-out ${
          isMobile
            ? isMobileMenuOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full'
            : isExpanded
            ? 'w-64'
            : 'w-20'
        }`}
        onMouseEnter={() => !isMobile && setIsMenuHovered(true)}
        onMouseLeave={() => !isMobile && setIsMenuHovered(false)}
      >
        <div
          className={`flex justify-between items-center h-16 border-b border-border transition-all duration-300 ${
            isExpanded ? 'px-4' : 'px-6 justify-center'
          }`}
        >
          <div className="overflow-hidden">
            <h2
              className={`font-semibold text-foreground text-base transition-all duration-300 transform ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              Lume People
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && isMobileMenuOpen && (
              <button className="text-muted-foreground hover:text-foreground" onClick={onMenuClose}>
                <X size={20} />
              </button>
            )}
            {!isMobile && (
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={toggleMenuExpand}
                title={isMenuExpanded ? 'Recolher menu' : 'Expandir menu'}
              >
                {isMenuExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {menuSections.map((section, sectionIndex) => (
              <React.Fragment key={section.title || `section-${sectionIndex}`}>
                {section.title && (
                  <li className="pt-1.5 pb-0.5">
                    <hr className="border-border/60" />
                  </li>
                )}
                {section.title && (
                  <li
                    className={`pt-1.5 pb-0.5 overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'px-3' : 'px-6'
                    }`}
                  >
                    <h3
                      className={`relative text-xs font-semibold text-muted-foreground uppercase tracking-wider h-5 ${
                        isExpanded ? 'text-left' : 'text-center'
                      }`}
                    >
                      <span
                        className={`absolute inset-0 flex items-center transition-opacity duration-300 ease-in-out ${
                          isExpanded
                            ? 'justify-start opacity-100'
                            : 'justify-center opacity-0 pointer-events-none'
                        }`}
                      >
                        <span className="truncate max-w-full">{section.title}</span>
                      </span>

                      {!isMobile && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-[10px] transition-opacity duration-300 ease-in-out ${
                            !isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}
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
                  // TODO: Implementar notificações
                  // const showNotification = item.href === '/collaborators' && notificationCount > 0;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-start py-1.5 rounded-md transition-all duration-300 relative group ${
                          isExpanded ? 'px-3' : 'px-6'
                        } ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title={!isExpanded ? item.label : ''}
                        onClick={handleMenuItemClick}
                      >
                        <IconComponent
                          size={18}
                          className={`flex-shrink-0 ${
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        />
                        <div className="overflow-hidden">
                          <span
                            className={`ml-3 whitespace-nowrap transition-all duration-300 transform block text-sm ${
                              isExpanded
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-4'
                            } ${isActive ? 'font-medium' : 'font-normal'}`}
                          >
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