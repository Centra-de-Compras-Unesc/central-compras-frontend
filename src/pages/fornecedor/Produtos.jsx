import { useState, useEffect } from "react";
import { api } from "../../utils/api";

export default function FornecedorProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    codigo_produto: "",
    produto: "",
    gtin: "",
    codigo_referencia: "",
    tipo_embalagem: "",
    valor_produto: "",
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const data = await api("/produtos");
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function abrirModalNovo() {
    setEditando(null);
    setForm({
      codigo_produto: "",
      produto: "",
      gtin: "",
      codigo_referencia: "",
      tipo_embalagem: "",
      valor_produto: "",
    });
    setShowModal(true);
  }

  function abrirModalEditar(produto) {
    setEditando(produto);
    setForm({
      codigo_produto: produto.codigo_produto || "",
      produto: produto.produto || "",
      gtin: produto.gtin || "",
      codigo_referencia: produto.codigo_referencia || "",
      tipo_embalagem: produto.tipo_embalagem || "",
      valor_produto: produto.valor_produto || "",
    });
    setShowModal(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!form.produto || !form.valor_produto) {
      alert("Preencha os campos obrigatórios: Nome do Produto e Valor");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        id_fornecedor: 1,
        id_conta: 1,
        id_usuario: 1,
        codigo_produto: form.codigo_produto,
        produto: form.produto,
        gtin: form.gtin,
        codigo_referencia: form.codigo_referencia,
        tipo_embalagem: form.tipo_embalagem,
        valor_produto: parseFloat(form.valor_produto),
      };

      if (editando) {
        await api(`/produtos/${editando.id}`, { method: "PUT", body: payload });
      } else {
        await api("/produtos", { method: "POST", body: payload });
      }

      await carregarProdutos();
      setShowModal(false);
    } catch (error) {
      alert(
        "Erro ao salvar produto: " + (error.message || "Erro desconhecido")
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api(`/produtos/${id}`, { method: "DELETE" });
      await carregarProdutos();
    } catch (error) {
      alert("Erro ao excluir produto");
    }
  }

  const tiposEmbalagem = ["UN", "CX", "PCT", "FD", "KG", "LT", "MT", "DZ"];

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
          <h1 className="text-2xl font-bold text-white">Meus Produtos</h1>
          <p className="text-gray-400 mt-1">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Novo Produto
        </button>
      </div>

      <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  GTIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Embalagem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {produtos.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Nenhum produto cadastrado
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr
                    key={produto.id}
                    className="hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {produto.codigo_produto || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {produto.produto}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {produto.gtin || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-300">
                        {produto.tipo_embalagem || "UN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-green-400 font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(produto.valor_produto || 0)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(produto)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleExcluir(produto.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editando ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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

            <form onSubmit={handleSalvar} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={form.codigo_produto}
                    onChange={(e) =>
                      setForm({ ...form, codigo_produto: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    GTIN/EAN
                  </label>
                  <input
                    type="text"
                    value={form.gtin}
                    onChange={(e) => setForm({ ...form, gtin: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Produto <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.produto}
                  onChange={(e) =>
                    setForm({ ...form, produto: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Embalagem
                  </label>
                  <select
                    value={form.tipo_embalagem}
                    onChange={(e) =>
                      setForm({ ...form, tipo_embalagem: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Selecione</option>
                    {tiposEmbalagem.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Valor (R$) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.valor_produto}
                    onChange={(e) =>
                      setForm({ ...form, valor_produto: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : editando ? "Salvar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
