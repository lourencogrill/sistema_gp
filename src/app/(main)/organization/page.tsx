import { OrganizationChart } from "@/components/organization/OrganizationChart";

// Placeholder para a página principal do organograma
export default function OrganizationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Organograma da Empresa</h1>
      <OrganizationChart />
    </div>
  );
} 