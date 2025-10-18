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
      statusAtivo === "todos" ||
      pedido.status.toLowerCase() === statusAtivo ||
      (statusAtivo === "separacao" && pedido.status.toLowerCase() === "em separação");
    const matchBusca =
      pedido.numero.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.fornecedor.toLowerCase().includes(termoBusca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="space-y-8 text-gray-200">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Pedidos da rede
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Histórico completo de compras
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Controle a jornada de cada pedido, atualize status em tempo real e
            visualize os benefícios aplicados por campanha e estado.
          </p>
        </div>
        <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner lg:w-auto">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por número, fornecedor ou status"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        {STATUS_PEDIDOS.map((status) => (
          <button
            key={status.id}
            onClick={() => setStatusAtivo(status.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
              statusAtivo === status.id
                ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.65)]"
                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {status.nome}
          </button>
        ))}
      </div>

      <section className="grid gap-4">
        {pedidosFiltrados.map((pedido) => (
          <PedidoCard key={pedido.numero} pedido={pedido} />
        ))}
        {pedidosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-gray-400">
            <svg
              className="mb-4 h-10 w-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7h18M9 7V5a3 3 0 016 0v2m3 0v11a2 2 0 01-2 2H8a2 2 0 01-2-2V7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 11h4m-4 4h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nenhum pedido localizado. Ajuste os filtros ou revise o período
            selecionado.
          </div>
        )}
      </section>
    </div>
  );
}
