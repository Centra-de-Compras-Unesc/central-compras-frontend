import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function FornecedorCondicoes() {
  const { user } = useAuth();
  const [condicoes, setCondicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    estado: "",
    percentual_cashback: "",
    prazo_pagamento_dias: "",
    ajuste_unitario: "",
    pedido_minimo: "",
    prazo_entrega: "",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ];

  const nomeEstado = {
    AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
    CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
    MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
    MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
    PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia",
    RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe",
    TO: "Tocantins",
  };

  useEffect(() => {
    if (user) {
      carregarCondicoes();
    }
  }, [user]);

  async function carregarCondicoes() {
    try {
      setLoading(true);
      const data = await api("/condicoes-comerciais");
      setCondicoes(Array.isArray(data) ? data : []);
      setErro(null);
    } catch (error) {
      setErro("Erro ao carregar condições comerciais");
    } finally {
      setLoading(false);
    }
  }

  function abrirModalNovo() {
    setEditando(null);
    setForm({
      estado: "",
      percentual_cashback: "",
      prazo_pagamento_dias: "",
      ajuste_unitario: "",
      pedido_minimo: "",
      prazo_entrega: "",
      observacoes: "",
    });
    setShowModal(true);
  }

  function abrirModalEditar(condicao) {
    setEditando(condicao);
    setForm({
      estado: condicao.estado || "",
      percentual_cashback: condicao.percentual_cashback || "",
      prazo_pagamento_dias: condicao.prazo_pagamento_dias || "",
      ajuste_unitario: condicao.ajuste_unitario || "",
      pedido_minimo: condicao.pedido_minimo || "",
      prazo_entrega: condicao.prazo_entrega || "",
      observacoes: condicao.observacoes || "",
    });
    setShowModal(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();

    if (!form.estado) {
      alert("Preencha o campo obrigatório: Estado");
      return;
    }

    try {
      setSalvando(true);
      setErro(null);

      const payload = {
        estado: form.estado,
        percentual_cashback: form.percentual_cashback
          ? parseFloat(form.percentual_cashback)
          : null,
        prazo_pagamento_dias: form.prazo_pagamento_dias
          ? parseInt(form.prazo_pagamento_dias)
          : null,
        ajuste_unitario: form.ajuste_unitario
          ? parseFloat(form.ajuste_unitario)
          : null,
        pedido_minimo: form.pedido_minimo
          ? parseFloat(form.pedido_minimo)
          : null,
        prazo_entrega: form.prazo_entrega
          ? parseInt(form.prazo_entrega)
          : null,
        observacoes: form.observacoes || null,
      };

      if (editando) {
        await api(`/condicoes-comerciais/${editando.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await api("/condicoes-comerciais", { method: "POST", body: payload });
      }

      await carregarCondicoes();
      setShowModal(false);
    } catch (error) {
      setErro(
        "Erro ao salvar condição: " + (error.message || "Erro desconhecido")
      );
      alert("Erro: " + error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir esta condição comercial?"))
      return;

    try {
      await api(`/condicoes-comerciais/${id}`, { method: "DELETE" });
      await carregarCondicoes();
    } catch (error) {
      setErro("Erro ao excluir condição");
      alert("Erro ao excluir: " + error.message);
    }
  }

  function agruparPorRegiao() {
    const regioes = {
      Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
      Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
      "Centro-Oeste": ["DF", "GO", "MT", "MS"],
      Sudeste: ["ES", "MG", "RJ", "SP"],
      Sul: ["PR", "RS", "SC"],
    };

    const agrupado = {};
    Object.entries(regioes).forEach(([regiao, ufList]) => {
      const condicoesRegiao = condicoes.filter((c) =>
        ufList.includes(c.estado)
      );
      if (condicoesRegiao.length > 0) {
        agrupado[regiao] = condicoesRegiao;
      }
    });
    return agrupado;
  }

  const estadosComCondicao = condicoes.map((c) => c.estado);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const condicoesAgrupadas = agruparPorRegiao();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-text">
          Condições Comerciais
        </h1>
        <button
          onClick={abrirModalNovo}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nova Condição
        </button>
      </div>

      {erro && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {erro}
        </div>
      )}

      {condicoes.length === 0 ? (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
          <p className="text-gray-400">
            Nenhuma condição comercial cadastrada
          </p>
          <button
            onClick={abrirModalNovo}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Criar Primeira Condição
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(condicoesAgrupadas).map(([regiao, conds]) => (
            <div
              key={regiao}
              className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden"
            >
              <div className="p-4 bg-dark-bg border-b border-dark-border">
                <h2 className="text-lg font-semibold text-dark-text">
                  {regiao}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-dark-bg">
                      <th className="px-4 py-3 text-left text-gray-400">
                        UF
                      </th>
                      <th className="px-4 py-3 text-left text-gray-400">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-right text-gray-400">
                        Cashback (%)
                      </th>
                      <th className="px-4 py-3 text-right text-gray-400">
                        Prazo (dias)
                      </th>
                      <th className="px-4 py-3 text-right text-gray-400">
                        Acréscimo (R$)
                      </th>
                      <th className="px-4 py-3 text-center text-gray-400">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {conds.map((condicao) => (
                      <tr key={condicao.id} className="hover:bg-dark-bg/50">
                        <td className="px-4 py-3 font-semibold text-primary">
                          {condicao.estado}
                        </td>
                        <td className="px-4 py-3 text-dark-text">
                          {nomeEstado[condicao.estado]}
                        </td>
                        <td className="px-4 py-3 text-right text-dark-text">
                          {condicao.percentual_cashback
                            ? `${condicao.percentual_cashback}%`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right text-dark-text">
                          {condicao.prazo_pagamento_dias
                            ? `${condicao.prazo_pagamento_dias}d`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right text-dark-text">
                          {condicao.ajuste_unitario
                            ? `+R$ ${condicao.ajuste_unitario.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center space-x-2">
                          <button
                            onClick={() => abrirModalEditar(condicao)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluir(condicao.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm"
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-dark-text mb-4">
              {editando ? "Editar Condição" : "Nova Condição Comercial"}
            </h2>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Estado (UF) *
                </label>
                <select
                  value={form.estado}
                  onChange={(e) =>
                    setForm({ ...form, estado: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  disabled={editando}
                >
                  <option value="">Selecione...</option>
                  {estados
                    .filter(
                      (uf) =>
                        !editando ||
                        uf === form.estado ||
                        !estadosComCondicao.includes(uf)
                    )
                    .map((uf) => (
                      <option key={uf} value={uf}>
                        {uf} - {nomeEstado[uf]}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Cashback (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.percentual_cashback}
                  onChange={(e) =>
                    setForm({ ...form, percentual_cashback: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  placeholder="10.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Prazo de Pagamento (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.prazo_pagamento_dias}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      prazo_pagamento_dias: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Acréscimo/Desconto Unitário (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.ajuste_unitario}
                  onChange={(e) =>
                    setForm({ ...form, ajuste_unitario: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  placeholder="2.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Pedido Mínimo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.pedido_minimo}
                  onChange={(e) =>
                    setForm({ ...form, pedido_minimo: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Prazo de Entrega (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.prazo_entrega}
                  onChange={(e) =>
                    setForm({ ...form, prazo_entrega: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary"
                  placeholder="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Observações
                </label>
                <textarea
                  value={form.observacoes}
                  onChange={(e) =>
                    setForm({ ...form, observacoes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:ring-1 focus:ring-primary resize-none"
                  rows="3"
                  placeholder="Digite observações adicionais..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-dark-border text-gray-400 rounded hover:bg-dark-border/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {salvando
                    ? "Salvando..."
                    : editando
                    ? "Atualizar"
                    : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
