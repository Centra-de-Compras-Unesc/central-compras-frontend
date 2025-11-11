import React, { useState } from "react";
import DataCard from "../../components/shared/DataCard";
import { api } from "../../utils/api";

const dadosGerais = [
  {
    id: 1,
    titulo: "TOTAL DE PEDIDOS",
    valor: "532",
    variacao: "+8%",
  },
  {
    id: 2,
    titulo: "CASHBACK DISPONÍVEL",
    valor: "R$ 2.580,30",
    variacao: "+15%",
  },
  {
    id: 3,
    titulo: "PEDIDOS EM ANDAMENTO",
    valor: "16",
    variacao: "+3%",
  },
  {
    id: 4,
    titulo: "FORNECEDORES ATIVOS",
    valor: "24",
    variacao: "+2%",
  },
];

const campanhas = [
  {
    id: 1,
    titulo: "Campanha de Verão",
    descricao:
      "Cashback extra de 10% em tintas premium para pedidos acima de R$ 5.000",
    duracao: "Até 05/03/2024",
    fornecedor: "Quartzlit",
    destaque: "Cashback +10%",
  },
  {
    id: 2,
    titulo: "Liquidação Eletro",
    descricao:
      "Frete subsidiado + bonificação em pedidos de linha branca selecionada.",
    duracao: "Até 20/04/2024",
    fornecedor: "Office Plus",
    destaque: "Frete 50% off",
  },
];

const ultimosPedidos = [
  {
    id: "123456",
    data: "2023-10-18",
    fornecedor: "Quartzlit",
    valor: 15320.9,
    status: "Em análise",
  },
  {
    id: "123455",
    data: "2023-10-17",
    fornecedor: "Votorantim Cimentos",
    valor: 8420.0,
    status: "Aprovado",
  },
  {
    id: "123454",
    data: "2023-10-16",
    fornecedor: "Tigre",
    valor: 2310.5,
    status: "Faturado",
  },
];

const fornecedoresDestaque = [
  {
    nome: "Quartzlit",
    categoria: "Tintas e Texturas",
    crescimento: "+18%",
  },
  {
    nome: "Votorantim Cimentos",
    categoria: "Cimentos e Argamassas",
    crescimento: "+12%",
  },
  {
    nome: "Tigre",
    categoria: "Tubos e conexões",
    crescimento: "+9%",
  },
  {
    nome: "Gerdau",
    categoria: "Ferragens",
    crescimento: "+14%",
  },
  {
    nome: "Krona",
    categoria: "Material hidráulico",
    crescimento: "+11%",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const statusStyles = {
  "Em análise":
    "border border-amber-500/30 bg-amber-500/10 text-amber-300",
  Aprovado: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Faturado: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
};

export default function Dashboard() {
  // ========= ESTADO DO NOVO PEDIDO =========
  const [showNovoPedidoModal, setShowNovoPedidoModal] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedidoForm, setPedidoForm] = useState({
    id_fornecedor: "",
    id_produto: "",
    quantidade: "",
    valor_unitario: 0,
    valor_total: 0,
    observacao: "",
  });
  const [salvandoPedido, setSalvandoPedido] = useState(false);

  // ========= ABRIR MODAL E BUSCAR DADOS =========
  async function handleAbrirNovoPedido() {
    try {
      const [fornData, prodData] = await Promise.all([
        api("/fornecedores"),
        api("/produtos"),
      ]);

      setFornecedores(Array.isArray(fornData) ? fornData : []);
      setProdutos(Array.isArray(prodData) ? prodData : []);
      setShowNovoPedidoModal(true);
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar fornecedores/produtos.");
    }
  }

  // ========= MUDANÇA DE CAMPOS DO FORM =========
  function handleChangePedido(e) {
    const { name, value } = e.target;

    setPedidoForm((prev) => {
      // ao mudar o fornecedor, limpa produto/quantidade/valores
      if (name === "id_fornecedor") {
        return {
          ...prev,
          id_fornecedor: value,
          id_produto: "",
          quantidade: "",
          valor_unitario: 0,
          valor_total: 0,
        };
      }

      // ao escolher produto, define preço unitário e recalcula total
      if (name === "id_produto") {
        const prod = produtos.find((p) => String(p.id) === String(value));
        const unit =
          prod && prod.valor_produto != null
            ? Number(prod.valor_produto)
            : 0;
        const qtd = prev.quantidade ? Number(prev.quantidade) : 0;
        const total = unit * qtd;

        return {
          ...prev,
          id_produto: value,
          valor_unitario: unit,
          valor_total: total,
        };
      }

      // quantidade → recalcula total
      if (name === "quantidade") {
        const qtd = value ? Number(value) : 0;
        const total = (prev.valor_unitario || 0) * qtd;

        return {
          ...prev,
          quantidade: value,
          valor_total: total,
        };
      }

      // observação ou outros
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // ========= SALVAR PEDIDO NO BACKEND =========
  async function handleSalvarPedido(e) {
    e.preventDefault();

    if (!pedidoForm.id_fornecedor) {
      alert("Selecione um fornecedor.");
      return;
    }
    if (!pedidoForm.id_produto) {
      alert("Selecione um produto.");
      return;
    }
    if (!pedidoForm.quantidade || Number(pedidoForm.quantidade) <= 0) {
      alert("Informe a quantidade.");
      return;
    }

    try {
      setSalvandoPedido(true);

      // aqui você pode trocar depois pelos dados reais do usuário/loja
      const idLoja = 1;
      const idUsuario = 1;
      const idConta = 1;

      const payload = {
        id_loja: idLoja,
        id_fornecedor: Number(pedidoForm.id_fornecedor),
        id_usuario: idUsuario,
        id_conta: idConta,
        vl_total_pedido: pedidoForm.valor_total,
        // outros campos opcionais do backend podem ficar como null
      };

      await api("/pedidos", {
        method: "POST",
        body: payload,
      });

      setShowNovoPedidoModal(false);
      setPedidoForm({
        id_fornecedor: "",
        id_produto: "",
        quantidade: "",
        valor_unitario: 0,
        valor_total: 0,
        observacao: "",
      });

      alert("Pedido criado com sucesso! Confira na aba Pedidos.");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar pedido.");
    } finally {
      setSalvandoPedido(false);
    }
  }

  // ========= FILTRAR PRODUTOS POR FORNECEDOR =========
  const produtosFiltrados = pedidoForm.id_fornecedor
    ? produtos.filter(
        (p) =>
          String(p.id_fornecedor ?? p.tb_fornecedor?.id) ===
          String(pedidoForm.id_fornecedor)
      )
    : [];

  return (
    <div className="space-y-10 text-gray-200">
      {/* ====== CABEÇALHO ====== */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Visão geral
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Central de Compras • Loja Horizon
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Acompanhe o desempenho da sua loja, campanhas promocionais e o
            status dos pedidos em tempo real.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* você pode manter outros botões aqui se quiser */}
          <button
            className="inline-flex items-center gap-2 rounded-full border border-gray-700/80 bg-gray-900/80 px-5 py-3 text-sm font-medium text-gray-200 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.9)] transition hover:border-orange-500/60 hover:text-white"
            onClick={handleAbrirNovoPedido}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
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
        </div>
      </section>

      {/* ====== CARDS RESUMO ====== */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dadosGerais.map((dado) => (
          <DataCard
            key={dado.id}
            title={dado.titulo}
            value={dado.valor}
            change={dado.variacao}
          />
        ))}
      </section>

      {/* ====== GRID PRINCIPAL ====== */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* coluna esquerda */}
        <div className="space-y-6 xl:col-span-2">
          {/* Campanhas */}
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#111118]/80 p-6">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Campanhas em vigor
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Oportunidades com fornecedores parceiros
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {campanhas.map((campanha) => (
                <div
                  key={campanha.id}
                  className="relative overflow-hidden rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent p-4"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-orange-300 ring-1 ring-orange-500/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      {campanha.destaque}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {campanha.titulo}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {campanha.descricao}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                      <span>{campanha.fornecedor}</span>
                      <span>{campanha.duracao}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimos pedidos (estático) */}
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#111118]/80">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Últimos pedidos
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Acompanhe o status de cada pedido
                </h2>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {ultimosPedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between px-6 py-4 text-sm"
                >
                  <div>
                    <p className="font-mono text-xs text-gray-400">
                      #{pedido.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-300">
                      {pedido.fornecedor}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {pedido.data}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-100">
                      {formatCurrency(pedido.valor)}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                        statusStyles[pedido.status] || "border border-gray-600"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {pedido.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* coluna direita */}
        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-b from-orange-500/15 via-[#111118] to-[#050509] p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                Cashback programado
              </p>
              <h2 className="text-sm font-semibold text-white">
                Planeje suas compras em campanhas conjuntas
              </h2>
              <p className="text-xs text-orange-100/80">
                Agrupe pedidos por fornecedor e maximize o retorno em campanhas
                ativas.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#111118]/80 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Fornecedores
                </p>
                <h2 className="mt-2 text-sm font-semibold text-white">
                  Parceiros em destaque
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {fornecedoresDestaque.map((f) => (
                <div
                  key={f.nome}
                  className="flex items-center justify-between rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-xs"
                >
                  <div>
                    <p className="font-medium text-gray-100">{f.nome}</p>
                    <p className="text-[11px] text-gray-400">
                      {f.categoria}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {f.crescimento}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ====== MODAL NOVO PEDIDO ====== */}
      {showNovoPedidoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Novo Pedido
              </h2>
              <button
                type="button"
                onClick={() => setShowNovoPedidoModal(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarPedido} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Fornecedor
                </label>
                <select
                  name="id_fornecedor"
                  value={pedidoForm.id_fornecedor}
                  onChange={handleChangePedido}
                  className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-3 py-2 text-sm text-gray-100"
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome_fantasia || f.nome || `Fornecedor #${f.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Produto
                </label>
                <select
                  name="id_produto"
                  value={pedidoForm.id_produto}
                  onChange={handleChangePedido}
                  disabled={!pedidoForm.id_fornecedor}
                  className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-3 py-2 text-sm text-gray-100 disabled:opacity-50"
                >
                  <option value="">
                    {pedidoForm.id_fornecedor
                      ? "Selecione o produto..."
                      : "Escolha um fornecedor primeiro"}
                  </option>
                  {produtosFiltrados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {(p.produto || p.nome) +
                        " — R$ " +
                        Number(p.valor_produto || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    min={1}
                    value={pedidoForm.quantidade}
                    onChange={handleChangePedido}
                    className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-3 py-2 text-sm text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Preço unitário
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      pedidoForm.valor_unitario
                        ? `R$ ${pedidoForm.valor_unitario.toFixed(2)}`
                        : "—"
                    }
                    className="w-full rounded-lg border border-gray-700 bg-[#15151c] px-3 py-2 text-sm text-gray-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Valor total
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      pedidoForm.valor_total
                        ? `R$ ${pedidoForm.valor_total.toFixed(2)}`
                        : "—"
                    }
                    className="w-full rounded-lg border border-gray-700 bg-[#15151c] px-3 py-2 text-sm text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Observações
                </label>
                <textarea
                  name="observacao"
                  value={pedidoForm.observacao}
                  onChange={handleChangePedido}
                  className="min-h-[80px] w-full resize-y rounded-lg border border-gray-700 bg-[#1b1c22] px-3 py-2 text-sm text-gray-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:border-gray-400"
                  onClick={() => setShowNovoPedidoModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoPedido}
                  className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {salvandoPedido ? "Salvando..." : "Salvar Pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
