// Página de visualização de um cargo específico
export default function JobPositionViewPage({ params }: { params: { id: string } }) {
  return <div>Visualizando Cargo: {params.id}</div>;
} 