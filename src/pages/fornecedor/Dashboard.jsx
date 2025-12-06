import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { IoCheckmarkDone, IoCart, IoGift, IoTrendingUp } from "react-icons/io5";
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

export default function FornecedorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pedidosPendentes: 0,
    pedidosHoje: 0,
    totalProdutos: 0,
    campanhasAtivas: 0,
    graficoVendas: [],
  });
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [pedidos, produtos, campanhas] = await Promise.all([
        api("/pedidos").catch(() => []),
        api("/produtos").catch(() => []),
        api("/campanhas").catch(() => []),
      ]);

      const hoje = new Date().toISOString().slice(0, 10);
      const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
      const produtosArray = Array.isArray(produtos) ? produtos : [];
      const campanhasArray = Array.isArray(campanhas) ? campanhas : [];

      const graficoVendas = Array.from({ length: 7 }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() - (6 - i));
        const dataStr = data.toISOString().slice(0, 10);
        const pedidosDia = pedidosArray.filter(
          (p) => p.dt_inc?.slice(0, 10) === dataStr
        );
        const valorDia = pedidosDia.reduce(
          (sum, p) => sum + (parseFloat(p.vl_total_pedido) || 0),
          0
        );

        return {
          data: data.toLocaleDateString("pt-BR", {
            month: "2-digit",
            day: "2-digit",
          }),
          pedidos: pedidosDia.length,
          valor: Math.round(valorDia),
        };
      });

      setStats({
        pedidosPendentes: pedidosArray.filter(
          (p) => p.status === "Pendente" || p.status === "Em análise"
        ).length,
        pedidosHoje: pedidosArray.filter((p) => p.dt_inc?.slice(0, 10) === hoje)
          .length,
        totalProdutos: produtosArray.length,
        campanhasAtivas: campanhasArray.filter((c) => c.ativa).length,
        graficoVendas,
      });

      setPedidosRecentes(pedidosArray.slice(0, 5));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case "pendente":
      case "em análise":
        return "bg-yellow-500/20 text-yellow-400";
      case "aprovado":
        return "bg-green-500/20 text-green-400";
      case "separado":
      case "enviado":
        return "bg-blue-500/20 text-blue-400";
      case "entregue":
        return "bg-emerald-500/20 text-emerald-400";
      case "cancelado":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
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
          Bem-vindo, {user?.nome || "Fornecedor"}!
        </h1>
        <p className="text-gray-400 mt-2">
          Acompanhe seus pedidos e gerencie seu catálogo de produtos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-100 text-sm font-medium">
              Pedidos Pendentes
            </h3>
            <IoCheckmarkDone className="text-amber-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.pedidosPendentes}
          </p>
          <p className="text-amber-100 text-xs mt-2">Aguardando aprovação</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-100 text-sm font-medium">Pedidos Hoje</h3>
            <IoCart className="text-blue-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.pedidosHoje}</p>
          <p className="text-blue-100 text-xs mt-2">Hoje mesmo</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-100 text-sm font-medium">Produtos</h3>
            <IoGift className="text-emerald-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProdutos}</p>
          <p className="text-emerald-100 text-xs mt-2">Cadastrados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-100 text-sm font-medium">Campanhas</h3>
            <IoTrendingUp className="text-purple-200 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.campanhasAtivas}
          </p>
          <p className="text-purple-100 text-xs mt-2">Ativas agora</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-100 mb-6">
          Pedidos - Últimos 7 Dias
        </h2>
        {stats.graficoVendas && stats.graficoVendas.length > 0 ? (
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.graficoVendas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="data" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #444",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pedidos"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Pedidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>Sem dados de pedidos disponíveis</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-100">
              Pedidos Recentes
            </h2>
            <a
              href="/fornecedor/pedidos"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Ver todos →
            </a>
          </div>
        </div>

        {pedidosRecentes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-100">
                    ID
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-100">
                    Data
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-100">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-100">
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecentes.slice(0, 5).map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-8 py-4 text-sm text-gray-300 font-mono">
                      {pedido.id}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-300">
                      {pedido.dt_inc
                        ? new Date(pedido.dt_inc).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-8 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          pedido.status
                        )}`}
                      >
                        {pedido.status || "Desconhecido"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-400">
                      {pedido.observacao?.substring(0, 30) || "Sem observação"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
