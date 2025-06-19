import React from 'react';

const CollaboratorDevelopmentPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Plano de Desenvolvimento</h1>
      <p>Plano de desenvolvimento para o colaborador com ID: {params.id}</p>
    </div>
  );
};

export default CollaboratorDevelopmentPage; 