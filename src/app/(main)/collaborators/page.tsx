import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { CollaboratorActions } from '@/components/people/CollaboratorActions';

type CollaboratorWithJobPosition = Prisma.CollaboratorGetPayload<{
  include: { jobPosition: true };
}>;

const CollaboratorsPage = async () => {
  const collaborators = await prisma.collaborator.findMany({
    include: {
      jobPosition: true,
    },
    orderBy: {
      name: 'asc',
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Colaboradores</CardTitle>
        <Link href="/collaborators/new">
          <Button>Adicionar Colaborador</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators.map((collaborator: CollaboratorWithJobPosition) => (
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
      </CardContent>
    </Card>
  );
};

export default CollaboratorsPage; 