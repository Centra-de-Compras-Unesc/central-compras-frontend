import React, { useState } from "react";
import PedidoCard from "../../components/shared/PedidoCard";

const STATUS_PEDIDOS = [
  { id: "todos", nome: "Todos" },
  { id: "pendente", nome: "Pendente" },
  { id: "aprovado", nome: "Aprovado" },
  { id: "separacao", nome: "Em Separação" },
  { id: "enviado", nome: "Enviado" },
  { id: "entregue", nome: "Entregue" },
];

const pedidosMock = [
  {
    numero: "PED001",
    data: "2023-10-18",
    fornecedor: "Quartzlit",
    status: "Entregue",
    valorTotal: 1580.5,
    previsaoEntrega: "2023-10-20",
    itens: [
      { id: 1, produto: "Argamassa AC3", quantidade: 10, valorUnitario: 28.9 },
      { id: 2, produto: "Rejunte Flex", quantidade: 5, valorUnitario: 15.9 },
    ],
  },
  {
    numero: "PED002",
    data: "2023-10-17",
    fornecedor: "Krona",
    status: "Em Separação",
    valorTotal: 2340.75,
    previsaoEntrega: "2023-10-22",
    itens: [
      { id: 1, produto: "Tubo PVC 100mm", quantidade: 15, valorUnitario: 45.9 },
      { id: 2, produto: "Conexões", quantidade: 30, valorUnitario: 12.5 },
    ],
  },
];

export default function PedidosHistorico() {
  const [statusAtivo, setStatusAtivo] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  const pedidosFiltrados = pedidosMock.filter((pedido) => {
    const matchStatus =
      statusAtivo === "todos" || pedido.status.toLowerCase() === statusAtivo;
    const matchBusca =
      pedido.numero.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.fornecedor.toLowerCase().includes(termoBusca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Histórico de Pedidos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtro por Status */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {STATUS_PEDIDOS.map((status) => (
          <button
            key={status.id}
            onClick={() => setStatusAtivo(status.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              statusAtivo === status.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.nome}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.map((pedido) => (
          <PedidoCard key={pedido.numero} pedido={pedido} />
        ))}
        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhum pedido encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
