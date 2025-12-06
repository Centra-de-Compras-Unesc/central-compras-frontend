import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  MdStorefront,
  MdLocalShipping,
  MdInventory2,
  MdShoppingCart,
  MdTrendingUp,
} from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLojas: 0,
    totalFornecedores: 0,
    totalProdutos: 0,
    totalPedidos: 0,
    totalValor: 0,
    pedidosUltimosDias: [],
    lojasTop: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  async function carregarEstatisticas() {
    try {
      const [lojas, fornecedores, produtos, pedidos] = await Promise.all([
        api("/lojas").catch(() => []),
        api("/fornecedores").catch(() => []),
        api("/produtos").catch(() => []),
        api("/pedidos").catch(() => []),
      ]);

      const lojasArray = Array.isArray(lojas) ? lojas : [];
      const fornecedoresArray = Array.isArray(fornecedores) ? fornecedores : [];
      const produtosArray = Array.isArray(produtos) ? produtos : [];
      const pedidosArray = Array.isArray(pedidos) ? pedidos : [];

      // Agrupar pedidos por data
      const pedidosPorData = {};
      pedidosArray.forEach((p) => {
        const data = p.dt_inc?.slice(0, 10);
        if (data) {
          if (!pedidosPorData[data]) {
            pedidosPorData[data] = [];
          }
          pedidosPorData[data].push(p);
        }
      });

      // Se há dados, pegar o período dos últimos 7 dias com dados
      // Se não houver, usar últimos 7 dias correntes
      const datasComPedidos = Object.keys(pedidosPorData).sort();
      let dataInicio, dataFim;

      if (datasComPedidos.length > 0) {
        dataFim = new Date(datasComPedidos[datasComPedidos.length - 1]);
        dataInicio = new Date(dataFim);
        dataInicio.setDate(dataInicio.getDate() - 6);
      } else {
        dataFim = new Date();
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 6);
      }

      const ultimosDias = Array.from({ length: 7 }, (_, i) => {
        const data = new Date(dataInicio);
        data.setDate(data.getDate() + i);
        const dataStr = data.toISOString().slice(0, 10);
        return {
          dia: data.toLocaleDateString("pt-BR", { weekday: "short" }),
          dataStr,
        };
      });

      const pedidosUltimosDias = ultimosDias.map(({ dia, dataStr }) => {
        const pedidosDia = pedidosPorData[dataStr] || [];
        const valorDia = pedidosDia.reduce(
          (sum, p) => sum + (parseFloat(p.vl_total_pedido) || 0),
          0
        );
        return {
          dia,
          pedidos: pedidosDia.length,
          valor: Math.round(valorDia),
        };
      });

      const lojasComPedidos = lojasArray.map((loja) => {
        const pedidosLoja = pedidosArray.filter(
          (p) => p.id_loja?.toString() === loja.id?.toString()
        );
        return {
          id: loja.id,
          nome:
            loja.nome_fantasia?.substring(0, 12) ||
            loja.nome?.substring(0, 12) ||
            "Loja",
          pedidos: pedidosLoja.length,
          valor: pedidosLoja.reduce(
            (sum, p) => sum + (parseFloat(p.vl_total_pedido) || 0),
            0
          ),
        };
      });

      const lojasTop = lojasComPedidos
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

      const totalValor = pedidosArray.reduce(
        (sum, p) => sum + (parseFloat(p.vl_total_pedido) || 0),
        0
      );
      const totalPedidos = pedidosArray.length;

      setStats({
        totalLojas: lojasArray.length,
        totalFornecedores: fornecedoresArray.length,
        totalProdutos: produtosArray.length,
        totalPedidos,
        totalValor,
        pedidosUltimosDias,
        lojasTop,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">
          Bem-vindo, {user?.nome || "Administrador"}!
        </h1>
        <p className="text-gray-400 mt-2">
          Controle central do sistema de gerenciamento
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-100 text-sm font-medium">Lojas</h3>
            <MdStorefront className="text-blue-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalLojas}</p>
          <p className="text-blue-100 text-xs mt-2">Ativas</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-100 text-sm font-medium">
              Fornecedores
            </h3>
            <MdLocalShipping className="text-emerald-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.totalFornecedores}
          </p>
          <p className="text-emerald-100 text-xs mt-2">Cadastrados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-100 text-sm font-medium">Produtos</h3>
            <MdInventory2 className="text-purple-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProdutos}</p>
          <p className="text-purple-100 text-xs mt-2">Ativos</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-100 text-sm font-medium">Pedidos</h3>
            <MdShoppingCart className="text-amber-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalPedidos}</p>
          <p className="text-amber-100 text-xs mt-2">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdTrendingUp className="text-blue-400 text-xl" />
            <h2 className="text-xl font-bold text-gray-100">
              Tendência de Pedidos
            </h2>
          </div>
          {stats.pedidosUltimosDias && stats.pedidosUltimosDias.length > 0 ? (
            <div style={{ width: "100%", height: "280px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.pedidosUltimosDias}>
                  <defs>
                    <linearGradient
                      id="colorPedidos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="dia"
                    stroke="#999"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#999" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #3b82f6",
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                    formatter={(value) => [value, "Pedidos"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="pedidos"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorPedidos)"
                    name="Pedidos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>Sem dados disponíveis</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Lojas</h3>
          <div className="space-y-3">
            {stats.lojasTop && stats.lojasTop.length > 0 ? (
              stats.lojasTop.map((loja, idx) => (
                <div
                  key={loja.id}
                  className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold text-sm">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-gray-200 text-sm font-medium">
                        {loja.nome}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {loja.pedidos} pedidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-sm font-bold">
                      R${(loja.valor / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Sem dados</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
          <p className="text-gray-400 text-xs font-medium uppercase mb-2">
            Valor Total
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            R${(stats.totalValor / 100).toFixed(0)}
          </p>
          <p className="text-gray-500 text-xs mt-2">Pedidos processados</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
          <p className="text-gray-400 text-xs font-medium uppercase mb-2">
            Média por Loja
          </p>
          <p className="text-3xl font-bold text-blue-400">
            {stats.totalLojas > 0
              ? Math.round(stats.totalPedidos / stats.totalLojas)
              : 0}
          </p>
          <p className="text-gray-500 text-xs mt-2">Pedidos</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
          <p className="text-gray-400 text-xs font-medium uppercase mb-2">
            Taxa de Crescimento
          </p>
          <p className="text-3xl font-bold text-amber-400">
            +
            {stats.totalPedidos > 0
              ? Math.round(
                  (stats.totalFornecedores / stats.totalLojas) * 100 * 10
                ) / 10
              : 0}
            %
          </p>
          <p className="text-gray-500 text-xs mt-2">Fornecedores/Loja</p>
        </div>
      </div>
    </div>
  );
}
