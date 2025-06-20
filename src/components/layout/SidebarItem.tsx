'use client';

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
  type LucideIcon,
} from 'lucide-react';

const icons = {
  Home,
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Network,
  Settings,
  HelpCircle,
};

// Idealmente, viria de um arquivo de UI centralizado (shadcn/ui)
const badgeVariants = {
  default: 'bg-gray-100 text-gray-600',
  secondary: 'bg-gray-200 text-gray-800',
  destructive: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-yellow-800',
  info: 'bg-blue-500 text-white',
};

interface SidebarItemProps {
  icon: keyof typeof icons;
  label: string;
  href: string;
  active?: boolean; // Pode ser passado explicitamente
  badge?: string | number | null;
  badgeVariant?: keyof typeof badgeVariants;
  urgent?: boolean;
}

export const SidebarItem = ({
  icon,
  label,
  href,
  active,
  badge,
  badgeVariant = 'default',
  urgent = false,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = active ?? pathname === href;
  const Icon = icons[icon] as LucideIcon;

  return (
    <Link
      href={href}
      className={`
        flex items-center p-3 rounded-lg transition-colors
        ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}
      `}
    >
      <Icon className={`h-5 w-5 ${urgent ? 'text-red-500' : ''}`} />
      <span className="ml-4 flex-1">{label}</span>
      {badge != null && (
        <span
          className={`
            px-2 py-0.5 text-xs font-bold rounded-full
            ${badgeVariants[badgeVariant]}
          `}
        >
          {badge}
        </span>
      )}
      {urgent && !badge && <div className="w-2 h-2 bg-red-500 rounded-full ml-auto" />}
    </Link>
  );
}; 