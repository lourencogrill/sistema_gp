import { JobPositionForm } from "@/components/job-positions/JobPositionForm";

// Página de criação
export default function NewJobPositionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Cargo</h1>
      <JobPositionForm />
    </div>
  );
} 