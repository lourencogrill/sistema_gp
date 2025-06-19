import React from 'react';

const CollaboratorEvaluationPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Avaliação Atual</h1>
      <p>Avaliação atual para o colaborador com ID: {params.id}</p>
    </div>
  );
};

export default CollaboratorEvaluationPage; 