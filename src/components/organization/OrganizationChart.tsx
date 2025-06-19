'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge
} from 'reactflow';

// Importa o CSS da biblioteca
import 'reactflow/dist/style.css';

// Este é um ID de empresa de exemplo. Em um app real, você o obteria da sessão do usuário.
const FAKE_COMPANY_ID = "cly7z5l77000008l34s8h4gq1";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function OrganizationChart() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/companies/${FAKE_COMPANY_ID}/organization/chart-data`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do organograma. A API pode não ter sido criada corretamente.');
        }
        const data = await response.json();
        
        // TODO: Implementar um algoritmo de layout automático (ex: Dagre) para posicionar os nós
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);
  
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
   const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (error) {
    return <div className="p-4 text-red-500 bg-red-100 border border-red-200 rounded-md">Erro: {error}</div>;
  }

  return (
    <div style={{ height: '80vh', width: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
} 