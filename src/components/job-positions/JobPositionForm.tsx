'use client';

import { useState, useEffect } from "react";
import { ActivitiesSection, ActivityFormState } from "./ActivitiesSection";
import { CareerType } from "@prisma/client";

// Placeholder para o tipo de dados das configurações de avaliação
type EvaluationSettings = {
  primaryActivityWeight: number;
  secondaryActivityWeight: number;
};

// Placeholder para o tipo de dados do formulário de cargo
type JobPositionFormState = {
    name: string;
    area: string;
    careerType: CareerType;
    mainObjective: string;
    activities: ActivityFormState[];
    // Adicionar outros campos aqui...
};

// Este é um ID de empresa de exemplo. Em um app real, você o obteria da sessão do usuário.
const FAKE_COMPANY_ID = "cly7z5l77000008l34s8h4gq1";

export function JobPositionForm() {
  const [formState, setFormState] = useState<JobPositionFormState>({
    name: "",
    area: "",
    careerType: "TECNICA",
    mainObjective: "",
    activities: [],
  });
  const [settings, setSettings] = useState<EvaluationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`/api/companies/${FAKE_COMPANY_ID}/settings/evaluation`);
        if (!response.ok) {
          throw new Error("Falha ao buscar as configurações de avaliação.");
        }
        const data = await response.json();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const setActivities = (activities: ActivityFormState[]) => {
    setFormState(prevState => ({ ...prevState, activities }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário para enviar:", formState);
    // Lógica para chamar a API POST para criar o cargo...
  };

  if (isLoading) return <p>Carregando configurações...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;
  if (!settings) return <p>Configurações de avaliação não encontradas. Não é possível criar o cargo.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Informações Básicas</h2>
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Cargo</label>
            <input 
                type="text" 
                id="name"
                value={formState.name}
                onChange={(e) => setFormState({...formState, name: e.target.value})}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                required
            />
        </div>
         <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área/Setor</label>
            <input 
                type="text" 
                id="area"
                value={formState.area}
                onChange={(e) => setFormState({...formState, area: e.target.value})}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                required
            />
        </div>
         <div>
            <label htmlFor="mainObjective" className="block text-sm font-medium text-gray-700">Objetivo Principal</label>
            <textarea 
                id="mainObjective"
                value={formState.mainObjective}
                onChange={(e) => setFormState({...formState, mainObjective: e.target.value})}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
                required
            />
        </div>
      </div>
      
      {/* Seção de Atividades integrada */}
      <ActivitiesSection 
        activities={formState.activities}
        setActivities={setActivities}
        settings={settings}
      />
      
      <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
        Salvar Cargo
      </button>
    </form>
  );
} 