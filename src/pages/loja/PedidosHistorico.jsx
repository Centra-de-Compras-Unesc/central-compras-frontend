import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PedidoCard from "../../components/shared/PedidoCard";

const STATUS_PEDIDOS = [
  { id: "todos", nome: "Todos" },
  { id: "pendente", nome: "Pendente" },
  { id: "aprovado", nome: "Aprovado" },
  { id: "separacao", nome: "Em Separacao" },
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
    status: "Em Separacao",
    valorTotal: 2340.75,
    previsaoEntrega: "2023-10-22",
    itens: [
      { id: 1, produto: "Tubo PVC 100mm", quantidade: 15, valorUnitario: 45.9 },
      { id: 2, produto: "Conexoes", quantidade: 30, valorUnitario: 12.5 },
    ],
  },
];

export default function PedidosHistorico() {
  const [statusAtivo, setStatusAtivo] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || !pedidoSelecionado) return undefined;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
    };
  }, [pedidoSelecionado]);

  const formatarMoeda = (valor) =>
    typeof valor === "number"
      ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : valor;

  const fecharModal = () => setPedidoSelecionado(null);

  const pedidosFiltrados = pedidosMock.filter((pedido) => {
    const matchStatus =
      statusAtivo === "todos" ||
      pedido.status.toLowerCase() === statusAtivo ||
      (statusAtivo === "separacao" && pedido.status.toLowerCase() === "em separacao");
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
            Historico completo de compras
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Controle a jornada de cada pedido, atualize status em tempo real e
            visualize os beneficios aplicados por campanha e estado.
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
            placeholder="Buscar por numero, fornecedor ou status"
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
          <PedidoCard
            key={pedido.numero}
            pedido={pedido}
            onVerDetalhes={setPedidoSelecionado}
          />
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
            Nenhum pedido localizado. Ajuste os filtros ou revise o periodo
            selecionado.
          </div>
        )}
      </section>

      {isBrowser &&
        pedidoSelecionado &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-lg"
              onClick={fecharModal}
              aria-hidden="true"
            />
            <div
              className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-dark-surface p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="detalhes-pedido-titulo"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={fecharModal}
                className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:text-white"
                aria-label="Fechar detalhes do pedido"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <header className="mb-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Detalhes do pedido
                </p>
                <h2 id="detalhes-pedido-titulo" className="text-2xl font-semibold text-white">
                  Pedido #{pedidoSelecionado.numero}
                </h2>
                <p className="text-sm text-gray-400">
                  Em {pedidoSelecionado.data} com fornecedor {pedidoSelecionado.fornecedor}. Status{" "}
                  <span className="font-medium text-white">{pedidoSelecionado.status}</span>.
                </p>
              </header>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Fornecedor</p>
                  <p className="mt-2 text-lg font-semibold text-white">{pedidoSelecionado.fornecedor}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Previsao entrega</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {pedidoSelecionado.previsaoEntrega ?? "Nao informado"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Valor total</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {formatarMoeda(pedidoSelecionado.valorTotal)}
                  </p>
                </div>
              </div>

              <section className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Itens do pedido
                </h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10 text-sm text-gray-200">
                    <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-gray-400">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Produto</th>
                        <th className="px-4 py-3 text-left font-medium">Quantidade</th>
                        <th className="px-4 py-3 text-left font-medium">Valor unitario</th>
                        <th className="px-4 py-3 text-left font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(pedidoSelecionado.itens ?? []).map((item) => (
                        <tr key={item.id} className="bg-white/[0.03]">
                          <td className="px-4 py-3 font-medium text-white">{item.produto}</td>
                          <td className="px-4 py-3">{item.quantidade}</td>
                          <td className="px-4 py-3">{formatarMoeda(item.valorUnitario)}</td>
                          <td className="px-4 py-3 font-medium text-white">
                            {formatarMoeda(item.quantidade * item.valorUnitario)}
                          </td>
                        </tr>
                      ))}
                      {(pedidoSelecionado.itens ?? []).length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-400">
                            Nenhum item cadastrado para este pedido.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <footer className="mt-6 flex justify-end">
                <button
                  onClick={fecharModal}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
                >
                  Fechar
                </button>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

