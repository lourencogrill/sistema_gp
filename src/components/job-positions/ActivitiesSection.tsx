'use client';

import { ActivityFrequency } from "@prisma/client";
import { useEffect, useState } from "react";
// Assumindo que esses componentes existem e seguem o padrão shadcn/ui
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Tipo para uma atividade no estado do formulário
export type ActivityFormState = {
  id: string; // Para o 'key' do React
  description: string;
  isPrimary: boolean;
  frequency: ActivityFrequency;
  order: number;
  weight: number; // Peso calculado
};

type ActivitiesSectionProps = {
  activities: ActivityFormState[];
  setActivities: (activities: ActivityFormState[]) => void;
  settings: { primaryActivityWeight: number; secondaryActivityWeight: number };
};

// Componente para a seção de atividades
export function ActivitiesSection({ activities, setActivities, settings }: ActivitiesSectionProps) {
  const primaryCount = activities.filter((act) => act.isPrimary).length;

  // Recalcula os pesos sempre que as atividades mudarem
  useEffect(() => {
    const updatedActivities = activities.map(act => {
      const primaryActivitiesCount = activities.filter(a => a.isPrimary).length;
      const secondaryActivitiesCount = activities.length - primaryActivitiesCount;

      let newWeight = 0;
      if (act.isPrimary && primaryActivitiesCount > 0) {
        newWeight = settings.primaryActivityWeight / primaryActivitiesCount;
      } else if (!act.isPrimary && secondaryActivitiesCount > 0) {
        newWeight = settings.secondaryActivityWeight / secondaryActivitiesCount;
      }
      return { ...act, weight: newWeight };
    });
    // Evita loop infinito, verificando se houve mudança real nos pesos
    if (JSON.stringify(updatedActivities) !== JSON.stringify(activities)) {
      setActivities(updatedActivities);
    }
  }, [activities, settings, setActivities]);

  const handleAddActivity = () => {
    if (activities.length >= 10) return;
    const newActivity: ActivityFormState = {
      id: `new-${Date.now()}`,
      description: "",
      isPrimary: false,
      frequency: "MENSALMENTE",
      order: activities.length + 1,
      weight: 0,
    };
    setActivities([...activities, newActivity]);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  }

  const handleActivityChange = (id: string, field: keyof ActivityFormState, value: any) => {
    setActivities(
      activities.map((act) => (act.id === id ? { ...act, [field]: value } : act))
    );
  };
  
  const handlePrimaryChange = (id: string, checked: boolean) => {
    if(!checked || primaryCount < 5){
      handleActivityChange(id, 'isPrimary', checked);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Atividades do Cargo</h3>
        <div /* Badge */ className={`px-2 py-1 text-sm rounded ${primaryCount >= 5 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}>
          Principais: {primaryCount}/5
        </div>
      </div>

      {!activities.some(a => a.isPrimary) && activities.length > 0 && (
         <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            Atenção: Um cargo deve ter pelo menos uma atividade principal para o cálculo correto da avaliação.
         </div>
      )}

      {activities.map((activity) => (
        <div key={activity.id} /* Card */ className={`p-4 border rounded-md ${activity.isPrimary ? "border-blue-500" : ""}`}>
          <div /* CardContent */ className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id={`isPrimary-${activity.id}`}
                  checked={activity.isPrimary}
                  disabled={!activity.isPrimary && primaryCount >= 5}
                  onChange={(e) => handlePrimaryChange(activity.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                 <label htmlFor={`isPrimary-${activity.id}`}>Atividade Principal</label>
              </div>
              <div /* TooltipProvider */>
                <div /* Tooltip */>
                  <div /* TooltipTrigger */>
                    <div /* Badge */ className={`px-2 py-1 text-sm rounded ${activity.isPrimary ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                      Peso: {(activity.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div /* TooltipContent */>
                    <p>Esta atividade contribui com {(activity.weight * 100).toFixed(0)}% para a pontuação final das atividades.</p>
                  </div>
                </div>
              </div>
            </div>
            <textarea
              placeholder="Descreva a atividade (ex: Gerenciar o orçamento do projeto...)"
              value={activity.description}
              onChange={(e) => handleActivityChange(activity.id, 'description', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select 
                value={activity.frequency}
                onChange={(e) => handleActivityChange(activity.id, 'frequency', e.target.value)}
                className="w-full p-2 border rounded"
            >
              {Object.values(ActivityFrequency).map(freq => (
                <option key={freq} value={freq}>{freq.replace(/_/g, ' ').toLowerCase()}</option>
              ))}
            </select>
            <button onClick={() => handleRemoveActivity(activity.id)} className="text-red-500 text-sm">Remover</button>
          </div>
        </div>
      ))}
      
      <button onClick={handleAddActivity} disabled={activities.length >= 10} className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300">
        + Adicionar Atividade
      </button>
    </div>
  );
} 