import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PedidoCard from "../../components/shared/PedidoCard";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

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
      {
        id: 1,
        produto: "Cimento CP-II 50kg",
        quantidade: 50,
        valorUnitario: 42.5,
      },
      {
        id: 2,
        produto: "Argamassa Interna",
        quantidade: 30,
        valorUnitario: 22.9,
      },
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
  const { user } = useAuth();
  const [statusAtivo, setStatusAtivo] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const [pedidos, setPedidos] = useState(pedidosMock);
  const [cancelandoId, setCancelandoId] = useState(null);

  const [showNovoPedidoModal, setShowNovoPedidoModal] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [itensPedido, setItensPedido] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [criandoPedido, setCriandoPedido] = useState(false);
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

  useEffect(() => {
    async function carregarFornecedores() {
      if (!showNovoPedidoModal) return;
      try {
        const apiFornecedores = await api("/fornecedores");
        setFornecedores(Array.isArray(apiFornecedores) ? apiFornecedores : []);
      } catch (e) {
        console.error("Erro ao carregar fornecedores", e);
      }
    }
    carregarFornecedores();
  }, [showNovoPedidoModal]);

  useEffect(() => {
    async function carregarProdutos() {
      if (!fornecedorSelecionado) {
        setProdutos([]);
        return;
      }
      try {
        const apiProdutos = await api("/produtos");
        const produtosFiltrados = (
          Array.isArray(apiProdutos) ? apiProdutos : []
        ).filter(
          (p) => String(p.id_fornecedor) === String(fornecedorSelecionado)
        );
        setProdutos(produtosFiltrados);
      } catch (e) {
        console.error("Erro ao carregar produtos", e);
      }
    }
    carregarProdutos();
  }, [fornecedorSelecionado]);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const apiPedidos = await api("/pedidos");

        if (Array.isArray(apiPedidos)) {
          const mapeados = apiPedidos.map((p) => ({
            id: p.id,
            numero: `PED${String(p.id).padStart(4, "0")}`,
            data: p.dt_inc ? String(p.dt_inc).slice(0, 10) : "",
            status: p.status || "Pendente",
            fornecedor:
              p.tb_fornecedor?.nome_fantasia ||
              p.tb_fornecedor?.nome ||
              `Fornecedor #${p.id_fornecedor}`,
            valorTotal: Number(p.vl_total_pedido ?? 0),
            previsaoEntrega: null,
            itens: [],
          }));

          setPedidos(mapeados);
        }
      } catch (e) {}
    }

    carregarPedidos();
  }, []);

  const formatarMoeda = (valor) =>
    typeof valor === "number"
      ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : valor;

  const fecharModal = () => setPedidoSelecionado(null);

  async function abrirDetalhesPedido(pedido) {
    try {
      setCarregandoDetalhes(true);

      // Buscar detalhes completos do pedido incluindo itens
      const pedidoCompleto = await api(`/pedidos/${pedido.id}`);

      // Mapear os itens do pedido - campos do schema: produto, quantidade, valor_unitario
      const itens = (pedidoCompleto.tb_pedido_item || []).map((item) => ({
        id: item.id,
        produto:
          item.produto ||
          item.tb_fornecedor_produto?.produto ||
          `Produto #${item.id_produto}`,
        quantidade: Number(item.quantidade || 0),
        valorUnitario: Number(item.valor_unitario || 0),
      }));

      setPedidoSelecionado({
        ...pedido,
        itens,
      });
    } catch (e) {
      setPedidoSelecionado(pedido);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

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

      await api(`/pedidos/${pedido.id}`, {
        method: "PATCH",
        body: { status: "Cancelado" },
      });

      setPedidos((listaAtual) =>
        listaAtual.map((p) =>
          p.id === pedido.id ? { ...p, status: "Cancelado" } : p
        )
      );

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

      setPedidos((lista) => lista.filter((p) => p.id !== pedido.id));

      setPedidoSelecionado((atual) =>
        atual && atual.id === pedido.id ? null : atual
      );
    } catch (e) {
      alert("Erro ao remover pedido. Verifique com o suporte.");
    }
  }

  function adicionarItemPedido() {
    if (!produtoSelecionado || quantidade < 1) {
      alert("Selecione um produto e quantidade válida");
      return;
    }

    const produto = produtos.find(
      (p) => String(p.id) === String(produtoSelecionado)
    );
    if (!produto) return;

    const itemExistente = itensPedido.find(
      (item) => String(item.id_produto) === String(produtoSelecionado)
    );

    if (itemExistente) {
      setItensPedido(
        itensPedido.map((item) =>
          String(item.id_produto) === String(produtoSelecionado)
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      setItensPedido([
        ...itensPedido,
        {
          id_produto: produto.id,
          produto: produto.produto || produto.nome || `Produto #${produto.id}`,
          quantidade: quantidade,
          valor_unitario: Number(produto.valor_produto || 0),
        },
      ]);
    }

    setProdutoSelecionado("");
    setQuantidade(1);
  }

  function removerItemPedido(idProduto) {
    setItensPedido(itensPedido.filter((item) => item.id_produto !== idProduto));
  }

  async function handleCriarPedido(e) {
    e.preventDefault();

    if (!fornecedorSelecionado) {
      alert("Selecione um fornecedor");
      return;
    }

    if (itensPedido.length === 0) {
      alert("Adicione pelo menos um produto ao pedido");
      return;
    }

    try {
      setCriandoPedido(true);

      if (!user || !user.id) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      if (!user.id_conta) {
        alert("Usuário sem conta associada. Entre em contato com o suporte.");
        return;
      }

      if (!user.id_loja) {
        alert("Usuário sem loja associada. Entre em contato com o suporte.");
        return;
      }

      const valorTotal = itensPedido.reduce(
        (acc, item) => acc + item.quantidade * item.valor_unitario,
        0
      );

      const payloadPedido = {
        id_fornecedor: Number(fornecedorSelecionado),
        id_loja: Number(user.id_loja),
        id_usuario: Number(user.id),
        id_conta: Number(user.id_conta),
        vl_total_pedido: valorTotal,
        status: "Pendente",
        status_norm: "pendente",
        canal: "web",
        is_televenda: false,
        itens: itensPedido.map((item) => ({
          id_produto: Number(item.id_produto),
          quantidade: Number(item.quantidade),
          valor_unitario: Number(item.valor_unitario),
          codigo_produto: item.codigo_produto || null,
          codigo_referencia: item.codigo_referencia || null,
          produto: item.produto || null,
        })),
      };

      const pedidoCriado = await api("/pedidos", {
        method: "POST",
        body: payloadPedido,
      });

      const fornecedor = fornecedores.find(
        (f) => String(f.id) === String(fornecedorSelecionado)
      );

      const novoPedido = {
        id: pedidoCriado.id,
        numero: `PED${String(pedidoCriado.id).padStart(4, "0")}`,
        data: new Date().toISOString().slice(0, 10),
        status: "pendente",
        fornecedor: fornecedor?.nome_fantasia || "Fornecedor",
        valorTotal: pedidoCriado.vl_total_pedido || valorTotal,
        previsaoEntrega: null,
        itens: pedidoCriado.itens || itensPedido,
      };

      setPedidos([novoPedido, ...pedidos]);
      setShowNovoPedidoModal(false);
      setFornecedorSelecionado("");
      setItensPedido([]);
      setObservacao("");

      alert(
        `Pedido criado com sucesso!\nTotal: R$ ${(
          pedidoCriado.vl_total_pedido || valorTotal
        ).toFixed(2)}`
      );
    } catch (e) {
      alert("Erro ao criar pedido. Tente novamente.");
    } finally {
      setCriandoPedido(false);
    }
  }

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
        <button
          onClick={() => setShowNovoPedidoModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-medium text-white transition shadow-lg"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 5v14m-7-7h14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Novo Pedido
        </button>
      </header>

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
              onVerDetalhes={() => abrirDetalhesPedido(pedido)}
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
                      <span className="text-gray-400">Previsao de entrega</span>
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

      {showNovoPedidoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Novo Pedido</h2>
              <button
                type="button"
                onClick={() => setShowNovoPedidoModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCriarPedido} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Fornecedor *
                </label>
                <select
                  value={fornecedorSelecionado}
                  onChange={(e) => setFornecedorSelecionado(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-4 py-2.5 text-sm text-gray-100 focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome_fantasia ||
                        f.razao_social ||
                        `Fornecedor #${f.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {fornecedorSelecionado && (
                <>
                  <div className="rounded-lg border border-gray-700 bg-[#1b1c22] p-4">
                    <h3 className="mb-3 text-sm font-semibold text-white">
                      Adicionar Produtos
                    </h3>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select
                          value={produtoSelecionado}
                          onChange={(e) =>
                            setProdutoSelecionado(e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-700 bg-[#0d0d10] px-3 py-2 text-sm text-gray-100 focus:border-orange-500 focus:outline-none"
                        >
                          <option value="">Selecione um produto</option>
                          {produtos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.produto || `Produto #${p.id}`} - R${" "}
                              {Number(p.valor_produto || 0).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={quantidade}
                          onChange={(e) =>
                            setQuantidade(Number(e.target.value))
                          }
                          className="w-full rounded-lg border border-gray-700 bg-[#0d0d10] px-3 py-2 text-sm text-gray-100 focus:border-orange-500 focus:outline-none"
                          placeholder="Qtd"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={adicionarItemPedido}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {itensPedido.length > 0 && (
                    <div className="rounded-lg border border-gray-700 bg-[#1b1c22] p-4">
                      <h3 className="mb-3 text-sm font-semibold text-white">
                        Itens do Pedido ({itensPedido.length})
                      </h3>
                      <div className="space-y-2">
                        {itensPedido.map((item) => (
                          <div
                            key={item.id_produto}
                            className="flex items-center justify-between rounded-lg bg-[#0d0d10] p-3"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">
                                {item.produto}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.quantidade}x R${" "}
                                {item.valor_unitario.toFixed(2)} = R${" "}
                                {(
                                  item.quantidade * item.valor_unitario
                                ).toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removerItemPedido(item.id_produto)}
                              className="ml-3 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/40"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between border-t border-gray-700 pt-4">
                        <span className="text-sm font-semibold text-white">
                          Valor Total:
                        </span>
                        <span className="text-lg font-bold text-orange-500">
                          R${" "}
                          {itensPedido
                            .reduce(
                              (acc, item) =>
                                acc + item.quantidade * item.valor_unitario,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Observações
                </label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-4 py-2.5 text-sm text-gray-100 focus:border-orange-500 focus:outline-none"
                  placeholder="Informações adicionais sobre o pedido..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNovoPedidoModal(false)}
                  className="rounded-full border border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-200 hover:border-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={criandoPedido || itensPedido.length === 0}
                  className="rounded-full bg-orange-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {criandoPedido ? "Criando..." : "Criar Pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
