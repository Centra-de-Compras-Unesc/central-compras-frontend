import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const CORES = ["#ff7324", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function Relatorios() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loja, setLoja] = useState(null);
  const [periodo, setPeriodo] = useState("12m");
  const [graficoVendas, setGraficoVendas] = useState([]);
  const [graficoFornecedores, setGraficoFornecedores] = useState([]);
  const [graficoStatus, setGraficoStatus] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

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
  }, [loja?.id, periodo]);

  async function carregarDados() {
    setCarregando(true);
    setErro(null);
    try {
      const data = await api("/pedidos");
      if (Array.isArray(data)) {
        const pedidosDaLoja = loja?.id
          ? data.filter((p) => p.id_loja?.toString() === loja.id?.toString())
          : [];
        setPedidos(pedidosDaLoja);
        processarGraficos(pedidosDaLoja);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      setErro(error.message);
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  }

  function processarGraficos(data) {
    const hoje = new Date();
    let dataInicio;
    let formato = "MM/YYYY"; 
    let diasRetrocesso = 365;

    if (periodo === "7d") {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 7);
      formato = "DD/MM";
      diasRetrocesso = 7;
    } else if (periodo === "30d") {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 30);
      formato = "DD/MM";
      diasRetrocesso = 30;
    } else if (periodo === "90d") {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 90);
      formato = "DD/MM";
      diasRetrocesso = 90;
    } else {
      dataInicio = new Date(hoje);
      dataInicio.setMonth(dataInicio.getMonth() - 12);
    }

    const pedidosFiltrados = Array.isArray(data)
      ? data.filter((p) => {
          const dataPedido = p.dt_inc ? new Date(p.dt_inc) : new Date();
          return dataPedido >= dataInicio;
        })
      : [];

    const mesesHistorico = {};

    if (periodo === "12m") {
      for (let i = 12; i >= 0; i--) {
        const data_mes = new Date(hoje);
        data_mes.setMonth(data_mes.getMonth() - i);
        const chave = `${String(data_mes.getMonth() + 1).padStart(
          2,
          "0"
        )}/${data_mes.getFullYear()}`;

        mesesHistorico[chave] = {
          mes: chave,
          total: 0,
          quantidade: 0,
        };
      }

      pedidosFiltrados.forEach((p) => {
        const d = p.dt_inc ? new Date(p.dt_inc) : new Date();
        const chave = `${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}/${d.getFullYear()}`;
        if (mesesHistorico[chave]) {
          mesesHistorico[chave].total += Number(p.vl_total_pedido || 0);
          mesesHistorico[chave].quantidade += 1;
        }
      });
    } else {
      for (let i = diasRetrocesso - 1; i >= 0; i--) {
        const data_dia = new Date(hoje);
        data_dia.setDate(hoje.getDate() - i);
        const chave = data_dia.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        mesesHistorico[chave] = {
          mes: chave,
          total: 0,
          quantidade: 0,
        };
      }

      pedidosFiltrados.forEach((p) => {
        const d = p.dt_inc ? new Date(p.dt_inc) : new Date();
        const chave = d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
        if (mesesHistorico[chave]) {
          mesesHistorico[chave].total += Number(p.vl_total_pedido || 0);
          mesesHistorico[chave].quantidade += 1;
        }
      });
    }

    const vendas = Object.values(mesesHistorico).sort((a, b) => {
      if (periodo === "12m") {
        const [mesA, anoA] = a.mes.split("/");
        const [mesB, anoB] = b.mes.split("/");
        const dataA = new Date(anoA, mesA - 1);
        const dataB = new Date(anoB, mesB - 1);
        return dataA - dataB;
      } else {
        const [diaA, mesA] = a.mes.split("/");
        const [diaB, mesB] = b.mes.split("/");
        const dataA = new Date(hoje.getFullYear(), mesA - 1, diaA);
        const dataB = new Date(hoje.getFullYear(), mesB - 1, diaB);
        return dataA - dataB;
      }
    });

    setGraficoVendas(vendas);

    const fornecedores = {};
    pedidosFiltrados.forEach((p) => {
      const nome =
        p.tb_fornecedor?.nome_fantasia || `Fornecedor #${p.id_fornecedor}`;
      if (!fornecedores[nome]) {
        fornecedores[nome] = 0;
      }
      fornecedores[nome] += Number(p.vl_total_pedido || 0);
    });
    setGraficoFornecedores(
      Object.entries(fornecedores)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    );

    const status = {};
    pedidosFiltrados.forEach((p) => {
      const s = p.status || "Pendente";
      if (!status[s]) {
        status[s] = 0;
      }
      status[s] += 1;
    });
    setGraficoStatus(
      Object.entries(status).map(([name, value]) => ({ name, value }))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Relatórios</h1>
          <p className="text-sm text-gray-400 mt-1">
            Análise detalhada de pedidos e desempenho
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "12m"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                periodo === p
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      ) : erro ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Erro ao carregar relatórios</p>
            <p className="text-sm text-gray-400">{erro}</p>
          </div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">
            Nenhum pedido encontrado para exibir relatórios
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="bg-[#111118]/80 border border-white/5 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Vendas por Período
            </h2>
            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graficoVendas}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="mes" stroke="#999" />
                  <YAxis yAxisId="left" stroke="#ff7324" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#ff7324"
                    strokeWidth={2}
                    name="Valor Total (R$)"
                    yAxisId="left"
                  />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Quantidade de Pedidos"
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#111118]/80 border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Top 5 Fornecedores
              </h2>
              <div style={{ width: "100%", height: "256px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoFornecedores}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                      }}
                    />
                    <Bar dataKey="value" fill="#ff7324" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111118]/80 border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Distribuição por Status
              </h2>
              <div style={{ width: "100%", height: "256px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graficoStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#ff7324"
                      dataKey="value"
                    >
                      {graficoStatus.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CORES[index % CORES.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total de Pedidos", valor: pedidos.length },
              {
                label: "Valor Total",
                valor: `R$ ${pedidos
                  .reduce((a, p) => a + Number(p.vl_total_pedido || 0), 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              },
              {
                label: "Ticket Médio",
                valor: `R$ ${(
                  pedidos.reduce(
                    (a, p) => a + Number(p.vl_total_pedido || 0),
                    0
                  ) / (pedidos.length || 1)
                ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              },
              {
                label: "Fornecedores",
                valor: new Set(pedidos.map((p) => p.id_fornecedor)).size,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111118]/80 border border-white/5 rounded-2xl p-4"
              >
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-xl font-semibold text-white">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
