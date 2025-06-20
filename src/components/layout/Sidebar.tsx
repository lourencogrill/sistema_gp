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
    title: 'Gestão de Pessoas',
    items: [
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
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
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
            : shouldShowExpanded ? 'w-64' : 'w-16'
          }
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {shouldShowExpanded && (
            <h2 className="font-semibold text-gray-900 text-lg">
              Lume People
            </h2>
          )}
          
          {isMobile && isMobileMenuOpen && (
            <button
              onClick={onMenuClose}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
            >
              <X size={20} />
            </button>
          )}
          
          {!isMobile && shouldShowExpanded && (
            <button
              onClick={toggleExpanded}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              {/* Section divider */}
              {sectionIndex > 0 && (
                <div className="pt-4">
                  <hr className="border-gray-200" />
                </div>
              )}
              
              {/* Section title */}
              {section.title && shouldShowExpanded && (
                <div className="px-2 py-1">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        flex items-center px-3 py-2 rounded-md text-sm font-medium
                        transition-colors duration-200 group
                        ${isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      title={!shouldShowExpanded ? item.label : undefined}
                    >
                      <IconComponent 
                        className={`
                          flex-shrink-0 w-5 h-5
                          ${!shouldShowExpanded ? 'mx-auto' : ''}
                          ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                        `}
                      />
                      {shouldShowExpanded && (
                        <span className="ml-3 truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}; 