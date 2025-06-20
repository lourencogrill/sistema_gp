import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CollaboratorActions } from '@/components/people/CollaboratorActions';

// Função para buscar os dados
async function getCollaborators() {
  return prisma.collaborator.findMany({
    include: {
      jobPosition: true,
    },
    orderBy: {
      name: 'asc',
    }
  });
}

export default async function CollaboratorsPage() {
  const collaborators = await getCollaborators();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Colaboradores</h1>
        <Link href="/collaborators/new">
          <Button>Adicionar Colaborador</Button>
        </Link>
      </div>

      <div className="bg-background border shadow-sm rounded-lg">
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators.map((collaborator: any) => (
              <TableRow key={collaborator.id}>
                <TableCell className="font-medium">{collaborator.name}</TableCell>
                <TableCell>{collaborator.email}</TableCell>
                <TableCell>{collaborator.jobPosition?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={collaborator.status === 'ACTIVE' ? 'default' : 'destructive'}>
                    {collaborator.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <CollaboratorActions collaboratorId={collaborator.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 