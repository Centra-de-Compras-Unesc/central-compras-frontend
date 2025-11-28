import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PedidoCard from "../../components/shared/PedidoCard";
import { api } from "../../utils/api";

const STATUS_PEDIDOS = [
  { id: "todos", nome: "Todos" },
  { id: "pendente", nome: "Pendente" },
  { id: "aprovado", nome: "Aprovado" },
  { id: "separacao", nome: "Em Separacao" },
  { id: "enviado", nome: "Enviado" },
  { id: "entregue", nome: "Entregue" },
];

// Mantemos o mock como fallback / estrutura base
const pedidosMock = [
  {
    id: 1,
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
    id: 2,
    numero: "PED002",
    data: "2023-10-17",
    fornecedor: "Votorantim Cimentos",
    status: "Enviado",
    valorTotal: 8420.0,
    previsaoEntrega: "2023-10-21",
    itens: [
      { id: 1, produto: "Cimento CP-II 50kg", quantidade: 50, valorUnitario: 42.5 },
      { id: 2, produto: "Argamassa Interna", quantidade: 30, valorUnitario: 22.9 },
    ],
  },
  {
    id: 3,
    numero: "PED003",
    data: "2023-10-15",
    fornecedor: "Tigre",
    status: "Pendente",
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

  // 👉 lista real de pedidos (começa com o mock, depois substitui pelo backend)
  const [pedidos, setPedidos] = useState(pedidosMock);
  const [cancelandoId, setCancelandoId] = useState(null);

  // controla portal (SSR-safe)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // trava scroll ao abrir modal
  useEffect(() => {
    if (typeof document === "undefined" || !pedidoSelecionado) return undefined;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
    };
  }, [pedidoSelecionado]);

  // 🔥 carrega pedidos do backend (/pedidos)
  useEffect(() => {
    async function carregarPedidos() {
      try {
        const apiPedidos = await api("/pedidos");

        if (Array.isArray(apiPedidos)) {
          const mapeados = apiPedidos.map((p) => ({
            id: p.id,
            // numero exibido
            numero: `PED${String(p.id).padStart(4, "0")}`,
            // data de inclusão (dt_inc) cortada em AAAA-MM-DD
            data: p.dt_inc ? String(p.dt_inc).slice(0, 10) : "",
            // status simples (se não tiver, marca como Pendente)
            status: p.status || "Pendente",
            // nome do fornecedor vindo do include
            fornecedor:
              p.tb_fornecedor?.nome_fantasia ||
              p.tb_fornecedor?.nome ||
              `Fornecedor #${p.id_fornecedor}`,
            // valor total do pedido (se tiver no banco)
            valorTotal: Number(p.vl_total_pedido ?? 0),
            // por enquanto não temos previsão de entrega no banco
            previsaoEntrega: null,
            // itens ainda não estão vindo do backend
            itens: [],
          }));

          setPedidos(mapeados);
        }
      } catch (e) {
        // em caso de erro, mantemos o mock mesmo
      }
    }

    carregarPedidos();
  }, []);

  const formatarMoeda = (valor) =>
    typeof valor === "number"
      ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : valor;

  const fecharModal = () => setPedidoSelecionado(null);

  // 🧨 CANCELAR PEDIDO PENDENTE (backend + atualizar lista)
  async function handleCancelarPedido(pedido) {
    if (!pedido?.id) {
      alert("Não foi possível identificar o pedido para cancelamento.");
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza que deseja cancelar o pedido ${pedido.numero}?`
    );
    if (!confirmar) return;

    try {
      setCancelandoId(pedido.id);

      // 🔧 ajuste a rota/método se no seu backend for diferente
      await api(`/pedidos/${pedido.id}`, {
        method: "PATCH",
        body: { status: "Cancelado" },
      });

      // atualiza lista na tela
      setPedidos((listaAtual) =>
        listaAtual.map((p) =>
          p.id === pedido.id ? { ...p, status: "Cancelado" } : p
        )
      );

      // se o modal desse pedido estiver aberto, atualiza lá também
      setPedidoSelecionado((atual) =>
        atual && atual.id === pedido.id
          ? { ...atual, status: "Cancelado" }
          : atual
      );

      alert("Pedido cancelado com sucesso.");
    } catch (e) {
      alert("Erro ao cancelar pedido. Verifique com o suporte.");
    } finally {
      setCancelandoId(null);
    }
  }

  // ❌ REMOVER DA LISTA (DELETE no backend + some pra sempre)
  async function handleOcultarPedido(pedido) {
    if (!pedido?.id) return;

    const confirmar = window.confirm(
      `Remover o pedido ${pedido.numero} da lista? Essa ação não poderá ser desfeita.`
    );
    if (!confirmar) return;

    try {
      await api(`/pedidos/${pedido.id}`, {
        method: "DELETE",
      });

      // remove da lista em memória
      setPedidos((lista) => lista.filter((p) => p.id !== pedido.id));

      // se o modal aberto for desse pedido, fecha também
      setPedidoSelecionado((atual) =>
        atual && atual.id === pedido.id ? null : atual
      );
    } catch (e) {
      alert("Erro ao remover pedido. Verifique com o suporte.");
    }
  }

  // 🔎 aplica filtros (status + busca) em cima da lista real `pedidos`
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchStatus =
      statusAtivo === "todos" ||
      pedido.status.toLowerCase() === statusAtivo ||
      (statusAtivo === "separacao" &&
        pedido.status.toLowerCase() === "em separacao");

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
        <div className="flex w-full max-w-lg items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)]">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
          >
            <path
              d="M10.5 6a4.5 4.5 0 0 1 3.577 7.216l3.853 3.854a.75.75 0 1 1-1.06 1.06l-3.854-3.853A4.5 4.5 0 1 1 10.5 6Zm0 1.5a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pedidosFiltrados.map((pedido) => {
          const statusLower = String(pedido.status || "").toLowerCase();

          return (
            <PedidoCard
              key={pedido.numero}
              pedido={pedido}
              onVerDetalhes={() => setPedidoSelecionado(pedido)}
              onCancelar={
                statusLower === "pendente"
                  ? () => handleCancelarPedido(pedido)
                  : undefined
              }
              onOcultar={
                statusLower === "cancelado"
                  ? () => handleOcultarPedido(pedido)
                  : undefined
              }
              cancelando={cancelandoId === pedido.id}
            />
          );
        })}

        {pedidosFiltrados.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-gray-400">
            <svg
              className="mb-3 h-8 w-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              viewBox="0 0 24 24"
            >
              <path
                d="M5 7h14M5 12h14M5 17h8"
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
            />
            <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-[#050509]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.9)]">
              <header className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Detalhes do pedido
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Pedido {pedidoSelecionado.numero}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Fornecedor:{" "}
                    <span className="font-medium text-gray-200">
                      {pedidoSelecionado.fornecedor}
                    </span>
                  </p>
                </div>

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
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </header>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="font-medium text-white">
                      {pedidoSelecionado.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data do pedido</span>
                    <span className="font-medium text-white">
                      {pedidoSelecionado.data}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor total</span>
                    <span className="font-semibold text-primary">
                      {formatarMoeda(pedidoSelecionado.valorTotal)}
                    </span>
                  </div>
                  {pedidoSelecionado.previsaoEntrega && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Previsao de entrega
                      </span>
                      <span className="font-medium text-white">
                        {pedidoSelecionado.previsaoEntrega}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    Itens do pedido
                  </h3>
                  <div className="max-h-52 overflow-y-auto rounded-xl border border-white/5">
                    <table className="min-w-full text-xs">
                      <thead className="bg-white/10 text-[11px] uppercase tracking-wide text-gray-300">
                        <tr>
                          <th className="px-4 py-2 text-left">Produto</th>
                          <th className="px-4 py-2 text-right">Qtde</th>
                          <th className="px-4 py-2 text-right">Vlr Unit.</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(pedidoSelecionado.itens ?? []).map((item) => (
                          <tr key={item.id} className="bg-white/[0.03]">
                            <td className="px-4 py-3 font-medium text-white">
                              {item.produto}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item.quantidade}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatarMoeda(item.valorUnitario)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-white">
                              {formatarMoeda(
                                item.quantidade * item.valorUnitario
                              )}
                            </td>
                          </tr>
                        ))}
                        {(pedidoSelecionado.itens ?? []).length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-6 text-center text-sm text-gray-400"
                            >
                              Nenhum item cadastrado para este pedido.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <footer className="mt-6 flex justify-end">
                <button
                  onClick={fecharModal}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
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
