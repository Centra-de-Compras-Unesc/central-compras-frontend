import { useState, useEffect } from "react";
import { api } from "../../utils/api";

export default function FornecedorPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);
  const [carregandoItens, setCarregandoItens] = useState(false);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      const data = await api("/pedidos");
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function carregarItensPedido(pedidoId) {
    try {
      setCarregandoItens(true);
      const pedidoCompleto = await api(`/pedidos/${pedidoId}`);

      const itens = (pedidoCompleto.tb_pedido_item || []).map((item) => ({
        id: item.id,
        produto:
          item.produto ||
          item.tb_fornecedor_produto?.produto ||
          `Produto #${item.id_produto}`,
        quantidade: Number(item.quantidade || 0),
        valor_unitario: Number(item.valor_unitario || 0),
        valor_total: Number(item.valor_total || 0),
      }));

      setItensPedido(itens);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
      setItensPedido([]);
    } finally {
      setCarregandoItens(false);
    }
  }

  async function abrirDetalhes(pedido) {
    setPedidoSelecionado(pedido);
    await carregarItensPedido(pedido.id);
  }

  async function atualizarStatus(id, novoStatus) {
    try {
      await api(`/pedidos/${id}`, {
        method: "PATCH",
        body: { status: novoStatus },
      });
      await carregarPedidos();
      setPedidoSelecionado(null);
      setItensPedido([]);
    } catch (error) {
      alert("Erro ao atualizar status do pedido");
    }
  }

  function fecharModal() {
    setPedidoSelecionado(null);
    setItensPedido([]);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case "pendente":
      case "em análise":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "aprovado":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "separado":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "enviado":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "entregue":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  }

  const pedidosFiltrados = filtroStatus
    ? pedidos.filter((p) => p.status === filtroStatus)
    : pedidos;

  const statusOptions = [
    "Pendente",
    "Em análise",
    "Aprovado",
    "Separado",
    "Enviado",
    "Entregue",
    "Cancelado",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos Recebidos</h1>
          <p className="text-gray-400 mt-1">Gerencie os pedidos das lojas</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
        >
          <option value="">Todos os status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <span className="text-gray-400">
          {pedidosFiltrados.length} pedido(s)
        </span>
      </div>

      <div className="grid gap-4">
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-dark-surface rounded-xl p-12 text-center border border-dark-border">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-400">Nenhum pedido encontrado</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-dark-surface rounded-xl p-6 border border-dark-border hover:border-dark-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Pedido #{String(pedido.id).padStart(4, "0")}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full border ${getStatusStyle(
                        pedido.status
                      )}`}
                    >
                      {pedido.status || "Pendente"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Loja</p>
                      <p className="text-white">
                        {pedido.tb_loja?.nome_fantasia || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Data</p>
                      <p className="text-white">{formatDate(pedido.dt_inc)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Valor Total</p>
                      <p className="text-green-400 font-semibold">
                        {formatCurrency(pedido.vl_total_pedido)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Canal</p>
                      <p className="text-white">{pedido.canal || "Web"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => abrirDetalhes(pedido)}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors text-sm"
                  >
                    Gerenciar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pedidoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Pedido #{String(pedidoSelecionado.id).padStart(4, "0")}
              </h2>
              <button
                onClick={fecharModal}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Loja</p>
                  <p className="text-white">
                    {pedidoSelecionado.tb_loja?.nome_fantasia || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data</p>
                  <p className="text-white">
                    {formatDate(pedidoSelecionado.dt_inc)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Valor Total</p>
                  <p className="text-green-400 font-semibold">
                    {formatCurrency(pedidoSelecionado.vl_total_pedido)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status Atual</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-xs rounded-full border ${getStatusStyle(
                      pedidoSelecionado.status
                    )}`}
                  >
                    {pedidoSelecionado.status || "Pendente"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-border">
                <p className="text-gray-400 text-sm mb-3">
                  Produtos para Separação
                </p>
                {carregandoItens ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : itensPedido.length === 0 ? (
                  <div className="bg-dark-bg rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">
                      Nenhum item encontrado
                    </p>
                  </div>
                ) : (
                  <div className="bg-dark-bg rounded-lg border border-dark-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-dark-surface">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-400 font-medium">
                            Produto
                          </th>
                          <th className="px-4 py-3 text-center text-gray-400 font-medium">
                            Qtd
                          </th>
                          <th className="px-4 py-3 text-right text-gray-400 font-medium">
                            Vlr Unit.
                          </th>
                          <th className="px-4 py-3 text-right text-gray-400 font-medium">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {itensPedido.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-dark-surface/50"
                          >
                            <td className="px-4 py-3 text-white">
                              {item.produto}
                            </td>
                            <td className="px-4 py-3 text-center text-white font-medium">
                              {item.quantidade}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-300">
                              {formatCurrency(item.valor_unitario)}
                            </td>
                            <td className="px-4 py-3 text-right text-green-400 font-semibold">
                              {formatCurrency(item.valor_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-dark-surface border-t-2 border-primary">
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-right text-white font-semibold"
                          >
                            Total do Pedido:
                          </td>
                          <td className="px-4 py-3 text-right text-green-400 font-bold text-base">
                            {formatCurrency(
                              itensPedido.reduce(
                                (acc, item) => acc + item.valor_total,
                                0
                              )
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-dark-border">
                <p className="text-gray-400 text-sm mb-3">Alterar Status</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      atualizarStatus(pedidoSelecionado.id, "Aprovado")
                    }
                    className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() =>
                      atualizarStatus(pedidoSelecionado.id, "Separado")
                    }
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    Marcar Separado
                  </button>
                  <button
                    onClick={() =>
                      atualizarStatus(pedidoSelecionado.id, "Enviado")
                    }
                    className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  >
                    Marcar Enviado
                  </button>
                  <button
                    onClick={() =>
                      atualizarStatus(pedidoSelecionado.id, "Entregue")
                    }
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors"
                  >
                    Marcar Entregue
                  </button>
                </div>
                <button
                  onClick={() =>
                    atualizarStatus(pedidoSelecionado.id, "Cancelado")
                  }
                  className="w-full mt-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Cancelar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
