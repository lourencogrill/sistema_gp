import { SidebarItem } from './SidebarItem';
import {
  Home,
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Network,
  Settings,
  HelpCircle,
} from 'lucide-react';

// No futuro, esses dados virão de hooks/serviços que chamam a API
const getSidebarData = async () => {
  // const company = await getCompanyData(); // Ex: busca dados da empresa
  // const stats = await getNotificationStats(); // Ex: busca contadores
  return {
    company: { name: 'Empresa Exemplo' },
    inactiveCollaborators: 0,
    jobPositionsWithoutDescription: 2,
    pendingEvaluations: 3,
    overdueDays: 8, // Mais de 7, para teste do 'urgent'
    criticalInsights: 1,
    orphanedEmployees: 0,
  };
};

export const Sidebar = async () => {
  const data = await getSidebarData();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">Lume People</h1>
        <p className="text-sm text-gray-600">{data.company.name}</p>
      </div>

      <nav className="px-4 space-y-2 flex-grow">
        <SidebarItem icon="Home" label="Dashboard" href="/dashboard" />

        <SidebarItem
          icon="Users"
          label="Colaboradores"
          href="/collaborators"
          badge={data.inactiveCollaborators > 0 ? data.inactiveCollaborators : null}
          badgeVariant="secondary"
        />

        <SidebarItem
          icon="Briefcase"
          label="Cargos"
          href="/job-positions"
          badge={data.jobPositionsWithoutDescription > 0 ? data.jobPositionsWithoutDescription : null}
          badgeVariant="warning"
        />

        <SidebarItem
          icon="ClipboardCheck"
          label="Avaliações"
          href="/evaluations"
          badge={data.pendingEvaluations > 0 ? data.pendingEvaluations : null}
          badgeVariant="destructive"
          urgent={data.overdueDays > 7}
        />

        <SidebarItem
          icon="TrendingUp"
          label="Analytics"
          href="/analytics"
          badge={data.criticalInsights > 0 ? '!' : null}
          badgeVariant="info"
        />

        <SidebarItem
          icon="Network"
          label="Organização"
          href="/organization"
          badge={data.orphanedEmployees > 0 ? data.orphanedEmployees : null}
          badgeVariant="warning"
        />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <SidebarItem icon="Settings" label="Configurações" href="/settings" />
        <SidebarItem icon="HelpCircle" label="Ajuda" href="/help" />
      </div>
    </aside>
  );
}; 