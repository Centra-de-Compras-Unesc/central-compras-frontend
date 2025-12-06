import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "../../components/shared/DataCard";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dadosGerais = [
  { id: 1, titulo: "TOTAL DE PEDIDOS", valor: "0", variacao: "+0%" },
  {
    id: 2,
    titulo: "CASHBACK DISPONÍVEL",
    valor: "R$ 0,00",
    variacao: "+0%",
  },
  { id: 3, titulo: "PEDIDOS EM ANDAMENTO", valor: "0", variacao: "+0%" },
  { id: 4, titulo: "FORNECEDORES ATIVOS", valor: "0", variacao: "+0%" },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

const statusStyles = {
  "Em análise": "border border-amber-500/30 bg-amber-500/10 text-amber-300",
  Aprovado: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Faturado: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loja, setLoja] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [showNovoPedidoModal, setShowNovoPedidoModal] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [fornecedoresDestaque, setFornecedoresDestaque] = useState([]);
  const [dadosGeraisCalculados, setDadosGeraisCalculados] =
    useState(dadosGerais);
  const [pedidoForm, setPedidoForm] = useState({
    id_fornecedor: "",
    id_produto: "",
    quantidade: "",
    valor_unitario: 0,
    valor_total: 0,
    observacao: "",
  });
  const [salvandoPedido, setSalvandoPedido] = useState(false);
  const [periodoHistorico, setPeriodoHistorico] = useState("12m");
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [pedidosFiltradosState, setPedidosFiltradosState] = useState([]);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [showDetalhePedido, setShowDetalhePedido] = useState(null);
  const [showCondicoesModal, setShowCondicoesModal] = useState(false);
  const [condicoesComerciaisForm, setCondicoesComerciaisForm] = useState({
    SP: { cashback: "", prazo: "", acrescimo: "" },
    RJ: { cashback: "", prazo: "", acrescimo: "" },
    MG: { cashback: "", prazo: "", acrescimo: "" },
    BA: { cashback: "", prazo: "", acrescimo: "" },
    PE: { cashback: "", prazo: "", acrescimo: "" },
    SC: { cashback: "", prazo: "", acrescimo: "" },
    PR: { cashback: "", prazo: "", acrescimo: "" },
  });
  const [salvandoCondicoes, setSalvandoCondicoes] = useState(false);

  useEffect(() => {
    const carregarLoja = async () => {
      try {
        if (!user?.id) return;
        const lojas = await api("/lojas");
        const minhaLoja = Array.isArray(lojas)
          ? lojas.find((l) => l.id_usuario?.toString() === user.id?.toString())
          : null;
        if (minhaLoja) {
          setLoja(minhaLoja);
        }
      } catch (error) {}
    };
    carregarLoja();
  }, [user?.id]);

  useEffect(() => {
    carregarDados();
  }, [loja?.id]);

  useEffect(() => {
    setProfileName(user?.nome || "");
  }, [user?.nome]);

  async function carregarDados() {
    try {
      const [fornData, pedidosData, campanhasData] = await Promise.all([
        api("/fornecedores"),
        api("/pedidos"),
        api("/campanhas").catch(() => []),
      ]);
      setFornecedores(Array.isArray(fornData) ? fornData : []);

      if (Array.isArray(pedidosData)) {
        const pedidosFiltrados = loja?.id
          ? pedidosData.filter(
              (p) => p.id_loja?.toString() === loja.id?.toString()
            )
          : pedidosData;

        processarPedidosParaGrafico(pedidosFiltrados, periodoHistorico);
        setPedidosFiltradosState(pedidosFiltrados);

        const totalPedidos = pedidosFiltrados.length;
        const pedidosEmAndamento = pedidosFiltrados.filter(
          (p) =>
            p.status === "Pendente" ||
            p.status === "Em análise" ||
            p.status === "Separado"
        ).length;
        const totalValor = pedidosFiltrados.reduce(
          (sum, p) => sum + (parseFloat(p.vl_total_pedido) || 0),
          0
        );

        setDadosGeraisCalculados([
          {
            id: 1,
            titulo: "TOTAL DE PEDIDOS",
            valor: totalPedidos.toString(),
            variacao: "+0%",
          },
          {
            id: 2,
            titulo: "CASHBACK DISPONÍVEL",
            valor: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalValor * 0.05),
            variacao: "+0%",
          },
          {
            id: 3,
            titulo: "PEDIDOS EM ANDAMENTO",
            valor: pedidosEmAndamento.toString(),
            variacao: "+0%",
          },
          {
            id: 4,
            titulo: "FORNECEDORES ATIVOS",
            valor: Array.isArray(fornData) ? fornData.length.toString() : "0",
            variacao: "+0%",
          },
        ]);

        setUltimosPedidos(
          pedidosFiltrados.slice(0, 3).map((p) => ({
            id: p.id,
            numero: `PED${String(p.id).padStart(4, "0")}`,
            data: p.dt_inc ? String(p.dt_inc).slice(0, 10) : "",
            fornecedor:
              p.tb_fornecedor?.nome_fantasia ||
              `Fornecedor #${p.id_fornecedor}`,
            valor: p.vl_total_pedido || 0,
            status: p.status || "Pendente",
          }))
        );

        const fornecedoresMap = {};
        pedidosFiltrados.forEach((p) => {
          const f = p.tb_fornecedor;
          if (f) {
            if (!fornecedoresMap[f.id]) {
              fornecedoresMap[f.id] = {
                nome: f.nome_fantasia || f.nome,
                categoria: f.categoria || "Diversos",
                total: 0,
                count: 0,
              };
            }
            fornecedoresMap[f.id].total += Number(p.vl_total_pedido || 0);
            fornecedoresMap[f.id].count += 1;
          }
        });

        const destaque = Object.values(fornecedoresMap)
          .map((f) => ({
            ...f,
            crescimento: `+${Math.round(
              (f.count / pedidosFiltrados.length) * 100
            )}%`,
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        setFornecedoresDestaque(destaque);
      }

      if (Array.isArray(campanhasData) && campanhasData.length > 0) {
        setCampanhas(
          campanhasData.slice(0, 2).map((c) => ({
            id: c.id,
            titulo: c.titulo_campanha || c.titulo,
            descricao: c.descricao_campanha || c.descricao,
            duracao: c.data_fim
              ? `Até ${new Date(c.data_fim).toLocaleDateString("pt-BR")}`
              : "Sem data limite",
            fornecedor: c.tb_fornecedor?.nome_fantasia || "Fornecedor",
            destaque:
              c.descricao_campanha?.split(" ").slice(0, 3).join(" ") ||
              "Oferta especial",
          }))
        );
      } else {
        setCampanhas([
          {
            id: 1,
            titulo: "Carregando campanhas...",
            descricao: "As campanhas ativas aparecerão aqui",
            duracao: "—",
            fornecedor: "Sistema",
            destaque: "Conectando",
          },
        ]);
      }
      if (Array.isArray(pedidosData)) {
        const pedidosFiltrados = loja?.id
          ? pedidosData.filter(
              (p) => p.id_loja?.toString() === loja.id?.toString()
            )
          : pedidosData;
        setPedidosFiltradosState(pedidosFiltrados);
        processarPedidosParaGrafico(pedidosFiltrados, periodoHistorico);
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (
      Array.isArray(pedidosFiltradosState) &&
      pedidosFiltradosState.length > 0
    ) {
      processarPedidosParaGrafico(pedidosFiltradosState, periodoHistorico);
    }
  }, [periodoHistorico, pedidosFiltradosState]);

  function processarPedidosParaGrafico(pedidos, periodo = "12m") {
    const now = new Date();
    const buckets = {};

    if (periodo === "12m") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}/${d.getFullYear()}`;
        buckets[key] = {
          mes: key,
          valor: 0,
          quantidade: 0,
          _date: new Date(d.getFullYear(), d.getMonth(), 1),
        };
      }

      if (Array.isArray(pedidos) && pedidos.length > 0) {
        pedidos.forEach((p) => {
          const d = p.dt_inc ? new Date(p.dt_inc) : null;
          if (!d) return;
          const key = `${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}/${d.getFullYear()}`;
          if (buckets[key]) {
            buckets[key].valor += Number(p.vl_total_pedido || 0);
            buckets[key].quantidade += 1;
          }
        });
      }

      const out = Object.values(buckets)
        .sort((a, b) => a._date - b._date)
        .map(({ mes, valor, quantidade }) => ({ mes, valor, quantidade }));
      setDadosGrafico(out);
      return;
    }

    let days = 7;
    if (periodo === "30d") days = 30;
    else if (periodo === "90d") days = 90;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      buckets[key] = {
        mes: key,
        valor: 0,
        quantidade: 0,
        _date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
      };
    }

    if (Array.isArray(pedidos) && pedidos.length > 0) {
      pedidos.forEach((p) => {
        const d = p.dt_inc ? new Date(p.dt_inc) : null;
        if (!d) return;
        const key = d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
        if (buckets[key]) {
          buckets[key].valor += Number(p.vl_total_pedido || 0);
          buckets[key].quantidade += 1;
        }
      });
    }

    const outDays = Object.values(buckets)
      .sort((a, b) => a._date - b._date)
      .map(({ mes, valor, quantidade }) => ({ mes, valor, quantidade }));
    setDadosGrafico(outDays);
  }

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
      alert("Não foi possível carregar fornecedores/produtos.");
    }
  }

  function handleChangePedido(e) {
    const { name, value } = e.target;
    setPedidoForm((prev) => {
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
      if (name === "id_produto") {
        const prod = produtos.find((p) => String(p.id) === String(value));
        const unit =
          prod && prod.valor_produto != null ? Number(prod.valor_produto) : 0;
        const qtd = prev.quantidade ? Number(prev.quantidade) : 0;
        const total = unit * qtd;
        return {
          ...prev,
          id_produto: value,
          valor_unitario: unit,
          valor_total: total,
        };
      }
      if (name === "quantidade") {
        const qtd = value ? Number(value) : 0;
        const total = (prev.valor_unitario || 0) * qtd;
        return { ...prev, quantidade: value, valor_total: total };
      }
      return { ...prev, [name]: value };
    });
  }

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

    try {
      setSalvandoPedido(true);
      const payload = {
        id_loja: Number(user.id_loja),
        id_fornecedor: Number(pedidoForm.id_fornecedor),
        id_usuario: Number(user.id),
        id_conta: Number(user.id_conta),
        vl_total_pedido: pedidoForm.valor_total,
        status: "Pendente",
        status_norm: "pendente",
        canal: "web",
        is_televenda: false,
        itens: [
          {
            id_produto: Number(pedidoForm.id_produto),
            quantidade: Number(pedidoForm.quantidade),
            valor_unitario: Number(pedidoForm.valor_unitario),
            produto:
              produtos.find((p) => p.id === Number(pedidoForm.id_produto))
                ?.produto || null,
          },
        ],
      };
      await api("/pedidos", { method: "POST", body: payload });
      setShowNovoPedidoModal(false);
      setPedidoForm({
        id_fornecedor: "",
        id_produto: "",
        quantidade: "",
        valor_unitario: 0,
        valor_total: 0,
        observacao: "",
      });
      carregarDados();
      alert("Pedido criado com sucesso!");
    } catch (error) {
      alert("Erro ao salvar pedido.");
    } finally {
      setSalvandoPedido(false);
    }
  }

  async function handleSalvarCondicoes() {
    try {
      setSalvandoCondicoes(true);
      const estados = ["SP", "RJ", "MG", "BA", "PE", "SC", "PR"];

      for (const uf of estados) {
        const { cashback, prazo, acrescimo } = condicoesComerciaisForm[uf];
        if (cashback || prazo || acrescimo) {
          await api("/condicoes-comerciais", {
            method: "POST",
            body: {
              id_loja: 1,
              id_fornecedor: 1,
              uf,
              cashback_percent: Number(cashback) || 0,
              prazo_dias: Number(prazo) || 30,
              acrescimo_percent: Number(acrescimo) || 0,
            },
          });
        }
      }

      setShowCondicoesModal(false);
      alert("✅ Condições comerciais salvas com sucesso!");
    } catch (error) {
      alert("Erro ao salvar condições comerciais.");
    } finally {
      setSalvandoCondicoes(false);
    }
  }

  const produtosFiltrados = pedidoForm.id_fornecedor
    ? produtos.filter(
        (p) =>
          String(p.id_fornecedor ?? p.tb_fornecedor?.id) ===
          String(pedidoForm.id_fornecedor)
      )
    : [];

  return (
    <div className="space-y-10 text-gray-200">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Visão geral
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Bem vindo{profileName ? `, ${profileName}` : ""}!
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Acompanhe o desempenho da sua loja, campanhas promocionais e o
            status dos pedidos em tempo real.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("/loja/relatorios")}
            className="inline-flex items-center gap-2 rounded-full border border-gray-700/80 bg-gray-900/80 px-5 py-3 text-sm font-medium text-gray-200 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.9)] transition hover:border-orange-500/60 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                d="M3 12h6m6 0h6M3 6h18M3 18h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Relatórios
          </button>
          <button
            onClick={handleAbrirNovoPedido}
            className="inline-flex items-center gap-2 rounded-full border border-gray-700/80 bg-gray-900/80 px-5 py-3 text-sm font-medium text-gray-200 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.9)] transition hover:border-orange-500/60 hover:text-white"
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

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dadosGeraisCalculados.map((dado) => (
          <DataCard
            key={dado.id}
            title={dado.titulo}
            value={dado.valor}
            change={dado.variacao}
          />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#111118]/80 p-6">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Histórico de Pedidos
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Evolução de compras por período
                </h2>
              </div>
              <div className="flex gap-2">
                {["7d", "30d", "90d", "12m"].map((periodo) => (
                  <button
                    key={periodo}
                    onClick={() => setPeriodoHistorico(periodo)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      periodoHistorico === periodo
                        ? "bg-orange-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {periodo}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ width: "100%", height: "256px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#ff7324"
                    strokeWidth={2}
                    dot={{ fill: "#ff7324", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Valor Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Quantidade"
                    yAxisId="right"
                  />
                  <YAxis yAxisId="right" orientation="right" stroke="#999" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

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
              <button
                onClick={() => navigate("/loja/pedidos")}
                className="text-sm text-orange-500 hover:text-orange-400 font-medium"
              >
                Ver todos →
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {ultimosPedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between px-6 py-4 text-sm hover:bg-white/5 transition cursor-pointer"
                  onClick={() => setShowDetalhePedido(pedido)}
                >
                  <div>
                    <p className="font-mono text-xs text-gray-400">
                      #{pedido.numero}
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
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Condições Comerciais
              </p>
              <h2 className="mt-2 text-sm font-semibold text-white">
                Regionais por Estado
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Aplique automaticamente cashback, prazos e acréscimos definidos
              pelos fornecedores para cada estado.
            </p>
            <button
              onClick={() => setShowCondicoesModal(true)}
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 transition"
            >
              Ajustar regras
            </button>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#111118]/80 p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Fornecedores
              </p>
              <h2 className="mt-2 text-sm font-semibold text-white">
                Parceiros em destaque
              </h2>
            </div>
            <div className="space-y-3">
              {fornecedoresDestaque.map((f) => (
                <div
                  key={f.nome}
                  className="flex items-center justify-between rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-xs"
                >
                  <div>
                    <p className="font-medium text-gray-100">{f.nome}</p>
                    <p className="text-[11px] text-gray-400">{f.categoria}</p>
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

      {showNovoPedidoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Novo Pedido</h2>
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

      {showDetalhePedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Detalhes do Pedido
              </h2>
              <button
                type="button"
                onClick={() => setShowDetalhePedido(null)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-gray-400">Número:</span>
                <span className="font-mono text-white">
                  {showDetalhePedido.numero}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-gray-400">Fornecedor:</span>
                <span className="text-white">
                  {showDetalhePedido.fornecedor}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-gray-400">Data:</span>
                <span className="text-white">{showDetalhePedido.data}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-gray-400">Valor Total:</span>
                <span className="font-semibold text-orange-500">
                  {formatCurrency(showDetalhePedido.valor)}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    statusStyles[showDetalhePedido.status] ||
                    "border border-gray-600"
                  }`}
                >
                  {showDetalhePedido.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-700">
              <button
                type="button"
                className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:border-gray-400"
                onClick={() => setShowDetalhePedido(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCondicoesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Ajustar Condições Comerciais Regionais
              </h2>
              <button
                type="button"
                onClick={() => setShowCondicoesModal(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Defina condições especiais por estado (UF), incluindo cashback,
                prazo de entrega e acréscimos.
              </p>
              <div className="grid gap-4">
                {["SP", "RJ", "MG", "BA", "PE", "SC", "PR"].map((estado) => (
                  <div
                    key={estado}
                    className="border border-gray-700 rounded-lg p-4 bg-[#15151c]"
                  >
                    <h3 className="font-semibold text-white mb-3">{estado}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">
                          Cashback %
                        </label>
                        <input
                          type="number"
                          placeholder="5"
                          value={condicoesComerciaisForm[estado].cashback}
                          onChange={(e) =>
                            setCondicoesComerciaisForm((prev) => ({
                              ...prev,
                              [estado]: {
                                ...prev[estado],
                                cashback: e.target.value,
                              },
                            }))
                          }
                          className="w-full mt-1 px-2 py-1 rounded bg-[#1b1c22] border border-gray-600 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">
                          Prazo (dias)
                        </label>
                        <input
                          type="number"
                          placeholder="30"
                          value={condicoesComerciaisForm[estado].prazo}
                          onChange={(e) =>
                            setCondicoesComerciaisForm((prev) => ({
                              ...prev,
                              [estado]: {
                                ...prev[estado],
                                prazo: e.target.value,
                              },
                            }))
                          }
                          className="w-full mt-1 px-2 py-1 rounded bg-[#1b1c22] border border-gray-600 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">
                          Acréscimo %
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={condicoesComerciaisForm[estado].acrescimo}
                          onChange={(e) =>
                            setCondicoesComerciaisForm((prev) => ({
                              ...prev,
                              [estado]: {
                                ...prev[estado],
                                acrescimo: e.target.value,
                              },
                            }))
                          }
                          className="w-full mt-1 px-2 py-1 rounded bg-[#1b1c22] border border-gray-600 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-700">
              <button
                type="button"
                className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:border-gray-400"
                onClick={() => setShowCondicoesModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={salvandoCondicoes}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                onClick={handleSalvarCondicoes}
              >
                {salvandoCondicoes ? "Salvando..." : "Salvar Condições"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
