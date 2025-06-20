import CollaboratorForm from '@/components/people/CollaboratorForm';
import prisma from '@/lib/prisma';
import React from 'react';

const NewCollaboratorPage = async () => {
  const jobPositions = await prisma.jobPosition.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Colaborador</h1>
      <CollaboratorForm jobPositions={jobPositions} />
    </div>
  );
};

export default NewCollaboratorPage; 