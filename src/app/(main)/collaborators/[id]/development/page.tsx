import React from 'react';

type Props = {
  params: { id: string };
};

const CollaboratorDevelopmentPage = ({ params }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Plano de Desenvolvimento</h1>
      <p>Plano de desenvolvimento para o colaborador com ID: {params.id}</p>
    </div>
  );
};

export default CollaboratorDevelopmentPage; 