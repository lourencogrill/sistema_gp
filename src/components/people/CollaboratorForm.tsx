'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CollaboratorFormProps {
  jobPositions: any[]; // Temporariamente como any para destravar
}

const CollaboratorForm = ({ jobPositions }: CollaboratorFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    jobPositionId: '',
    hireDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jobPositionId: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // ID da empresa fixo por enquanto, pego do seed script
    const companyId = 'clxpyl0h2000008l4hyru8m5m'; // ID gerado para "Lume Corporate"

    try {
      const response = await fetch(`/api/companies/${companyId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar colaborador');
      }

      toast.success('Colaborador adicionado com sucesso!');

      // Redireciona para a página de listagem após o sucesso
      router.push('/collaborators');
      
    } catch (err: any) {
      toast.error(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Adicionar Novo Colaborador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              placeholder="Nome completo do colaborador" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="email@empresa.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Departamento</Label>
            <Input 
              id="department" 
              placeholder="Ex: Financeiro, Tecnologia" 
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="jobPosition">Cargo</Label>
            <Select onValueChange={handleSelectChange} value={formData.jobPositionId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="hireDate">Data de Admissão</Label>
            <Input 
              id="hireDate" 
              type="date" 
              value={formData.hireDate}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Colaborador'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CollaboratorForm; 