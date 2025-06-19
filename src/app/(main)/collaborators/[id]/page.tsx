import React from 'react';

const CollaboratorProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Perfil do Colaborador</h1>
      <p>Perfil completo do colaborador com ID: {params.id}</p>
      <p>Histórico de avaliações será exibido aqui.</p>
    </div>
  );
};

export default CollaboratorProfilePage; 