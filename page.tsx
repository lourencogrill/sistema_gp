'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipos
interface Conta {
  id: string;
  nome: string;
  tipo: string;
  saldoAtual: number;
}

interface Movimento {
  id: string;
  tipo: 'receita' | 'despesa' | 'transferencia';
  valor: number;
  data: string;
  descricao: string;
  efetivado: boolean;
  categoria?: string;
  conta?: string;
}

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<'movimentos' | 'contas'>('movimentos');
  const [isLoading, setIsLoading] = useState(true);
  const [contas, setContas] = useState<Conta[]>([]);
  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [periodoFiltro, setPeriodoFiltro] = useState('mes');

  useEffect(() => {
    // Em um caso real, buscaríamos os dados da API
    // Por enquanto, vamos simular alguns dados
    setTimeout(() => {
      setContas([
        {
          id: '1',
          nome: 'Caixa Principal',
          tipo: 'caixa',
          saldoAtual: 1250.80
        },
        {
          id: '2',
          nome: 'Banco XYZ - Conta Corrente',
          tipo: 'banco',
          saldoAtual: 5637.35
        },
        {
          id: '3',
          nome: 'Maquininha Cartão',
          tipo: 'cartao',
          saldoAtual: 0
        }
      ]);

      setMovimentos([
        {
          id: '1',
          tipo: 'receita',
          valor: 1580.90,
          data: '2023-05-15',
          descricao: 'Vendas Diárias',
          efetivado: true,
          categoria: 'Vendas',
          conta: 'Caixa Principal'
        },
        {
          id: '2',
          tipo: 'transferencia',
          valor: 1000.00,
          data: '2023-05-14',
          descricao: 'Transferência para banco',
          efetivado: true,
          conta: 'Banco XYZ - Conta Corrente'
        },
        {
          id: '3',
          tipo: 'despesa',
          valor: 3500.00,
          data: '2023-05-10',
          descricao: 'Aluguel',
          efetivado: true,
          categoria: 'Instalações',
          conta: 'Banco XYZ - Conta Corrente'
        },
        {
          id: '4',
          tipo: 'despesa',
          valor: 1245.78,
          data: '2023-05-08',
          descricao: 'Fornecedor ABC',
          efetivado: true,
          categoria: 'Insumos',
          conta: 'Banco XYZ - Conta Corrente'
        },
        {
          id: '5',
          tipo: 'despesa',
          valor: 420.00,
          data: '2023-05-20',
          descricao: 'Conta de Energia',
          efetivado: false,
          categoria: 'Utilidades',
          conta: 'Banco XYZ - Conta Corrente'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSaldoTotal = () => {
    return contas.reduce((total, conta) => total + conta.saldoAtual, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sumário financeiro com botões de ação incorporados */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Sumário Financeiro</h2>
          <div className="flex space-x-3">
            <Link 
              href="/financials/movements/new" 
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Novo Movimento
            </Link>
            <Link 
              href="/financials/reports" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Relatórios
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Saldo Total</p>
            <p className={`text-2xl font-bold ${getSaldoTotal() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getSaldoTotal())}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">A Pagar (próximos 30 dias)</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(4500.00)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">A Receber (próximos 30 dias)</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(8200.00)}
            </p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('movimentos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'movimentos'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Movimentos Financeiros
            </button>
            <button
              onClick={() => setActiveTab('contas')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'contas'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contas e Saldos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'movimentos' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <select
                value={periodoFiltro}
                onChange={(e) => setPeriodoFiltro(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="tres-meses">Últimos 3 Meses</option>
                <option value="ano">Este Ano</option>
              </select>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                Filtros Avançados
              </button>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conta
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movimentos.map((movimento) => (
                    <tr key={movimento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(movimento.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {movimento.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movimento.categoria || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movimento.conta || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                        movimento.tipo === 'receita' ? 'text-green-600' : 
                        movimento.tipo === 'despesa' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {formatCurrency(movimento.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {movimento.efetivado ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Efetivado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/financials/movements/${movimento.id}`} className="text-primary-600 hover:text-primary-900">
                            Ver
                          </Link>
                          <Link href={`/financials/movements/${movimento.id}/edit`} className="text-amber-600 hover:text-amber-900">
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'contas' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Contas Financeiras</h3>
            <Link 
              href="/financials/accounts/new" 
              className="px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
            >
              Nova Conta
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contas.map((conta) => (
              <div key={conta.id} className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{conta.nome}</h4>
                    <p className="text-sm text-gray-500 mt-1">{conta.tipo.charAt(0).toUpperCase() + conta.tipo.slice(1)}</p>
                  </div>
                  <div className={`text-right ${conta.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <p className="text-xl font-bold">{formatCurrency(conta.saldoAtual)}</p>
                    <p className="text-xs text-gray-500 mt-1">Saldo Atual</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <Link href={`/financials/accounts/${conta.id}`} className="text-primary-600 text-sm hover:underline">
                    Ver Detalhes
                  </Link>
                  <Link href={`/financials/accounts/${conta.id}/conciliation`} className="text-primary-600 text-sm hover:underline">
                    Conciliar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 