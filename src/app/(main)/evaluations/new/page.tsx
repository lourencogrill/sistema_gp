'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Collaborator = {
  id: string;
  name: string;
  jobPosition: {
    id: string;
    name: string;
  } | null;
};

// Este é um ID de empresa de exemplo. Em um app real, você o obteria da sessão do usuário.
const FAKE_COMPANY_ID = "cly7z5l77000008l34s8h4gq1";

export default function NewEvaluationPage() {
  const router = useRouter();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");
  const [evaluationPeriodStart, setEvaluationPeriodStart] = useState("");
  const [evaluationPeriodEnd, setEvaluationPeriodEnd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const response = await fetch(`/api/companies/${FAKE_COMPANY_ID}/collaborators`);
        if (!response.ok) {
          throw new Error("Falha ao buscar colaboradores.");
        }
        const data = await response.json();
        setCollaborators(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCollaborators();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollaborator || !evaluationPeriodStart || !evaluationPeriodEnd) {
        setError("Todos os campos são obrigatórios.");
        return;
    }
    setError(null);
    setIsCreating(true);

    try {
        const response = await fetch(`/api/companies/${FAKE_COMPANY_ID}/evaluations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collaboratorId: selectedCollaborator,
                evaluationPeriodStart,
                evaluationPeriodEnd,
            }),
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Erro ao iniciar avaliação.");
        }
        
        // Redireciona para a página da avaliação criada
        router.push(`/evaluations/${data.id}`);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsCreating(false);
    }
  };
  
  const selectedCollaboratorInfo = collaborators.find(c => c.id === selectedCollaborator);

  if (isLoading) return <p>Carregando colaboradores...</p>;
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Iniciar Nova Avaliação de Desempenho</h1>
      
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="collaborator" className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Colaborador
          </label>
          <select
            id="collaborator"
            value={selectedCollaborator}
            onChange={(e) => setSelectedCollaborator(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>Selecione...</option>
            {collaborators.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {selectedCollaboratorInfo && (
            <p className="text-sm text-gray-500 mt-2">
                Cargo: {selectedCollaboratorInfo.jobPosition?.name || "Não definido"}
            </p>
          )}
        </div>

        <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Período de Avaliação</label>
            <div className="flex items-center gap-4">
                <input 
                    type="date"
                    id="start-date"
                    value={evaluationPeriodStart}
                    onChange={(e) => setEvaluationPeriodStart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
                <span className="text-gray-500">até</span>
                <input 
                    type="date"
                    id="end-date"
                    value={evaluationPeriodEnd}
                    onChange={(e) => setEvaluationPeriodEnd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
        </div>

        <button 
          type="submit"
          disabled={isCreating || !selectedCollaboratorInfo?.jobPosition}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreating ? "Iniciando..." : "Iniciar Avaliação"}
        </button>
        {!selectedCollaboratorInfo?.jobPosition && selectedCollaborator && (
            <p className="text-xs text-center text-red-600 mt-2">
                Este colaborador não possui um cargo associado e não pode ser avaliado.
            </p>
        )}
      </form>
    </div>
  );
} 