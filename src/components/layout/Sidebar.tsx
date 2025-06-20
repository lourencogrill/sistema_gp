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
  Menu,
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
    ],
  },
  {
    title: 'GESTÃO DE PESSOAS',
    items: [
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    title: 'ORGANIZAÇÃO',
    items: [
      { icon: Network, label: 'Estrutura', href: '/organization' },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { icon: Settings, label: 'Configurações', href: '/settings' },
      { icon: HelpCircle, label: 'Ajuda', href: '/help' },
    ],
  },
];

export const Sidebar = ({ isMobileMenuOpen, onMenuClose, onMenuExpandChange }: SideMenuProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkScreenSize();
    onMenuExpandChange(false);
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onMenuExpandChange]);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onMenuExpandChange(newState);
  };

  const handleItemClick = () => {
    if (isMobile) {
      onMenuClose();
    }
  };

  const shouldShowExpanded = isMobile ? isMobileMenuOpen : (isExpanded || isHovered);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMenuClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 
          transition-all duration-300 ease-in-out shadow-sm
          ${isMobile 
            ? isMobileMenuOpen 
              ? 'w-64 translate-x-0' 
              : 'w-64 -translate-x-full'
            : shouldShowExpanded 
              ? 'w-64' 
              : 'w-16'
          }
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-gray-100 bg-gray-50/50 ${
          shouldShowExpanded ? 'justify-between px-4' : 'justify-center px-2'
        }`}>
          {shouldShowExpanded && (
            <h2 className="font-bold text-gray-800 text-lg tracking-tight">
              Lume People
            </h2>
          )}
          
          <div className="flex items-center space-x-1">
            {isMobile && isMobileMenuOpen && (
              <button
                onClick={onMenuClose}
                className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            
            {!isMobile && (
              <button
                onClick={toggleExpanded}
                className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                title={isExpanded ? "Recolher menu" : "Expandir menu"}
              >
                {shouldShowExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-1">
              {/* Section divider */}
              {sectionIndex > 0 && (
                <div className="py-3">
                  <hr className="border-gray-200" />
                </div>
              )}
              
              {/* Section title */}
              {section.title && shouldShowExpanded && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              
              {/* Section items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleItemClick}
                      className={`
                        flex items-center rounded-lg text-sm font-medium
                        transition-all duration-200 group relative
                        ${shouldShowExpanded ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'}
                        ${isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      title={!shouldShowExpanded ? item.label : undefined}
                    >
                      <IconComponent 
                        className={`
                          flex-shrink-0 w-5 h-5
                          ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                        `}
                      />
                      {shouldShowExpanded && (
                        <span className="ml-3 truncate font-medium">
                          {item.label}
                        </span>
                      )}
                      
                      {/* Indicador de item ativo */}
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Footer com informações do usuário (opcional) */}
        {shouldShowExpanded && (
          <div className="border-t border-gray-100 p-4">
            <div className="text-xs text-gray-500 text-center">
              Sistema Lume GP
            </div>
          </div>
        )}
      </aside>
    </>
  );
}; 