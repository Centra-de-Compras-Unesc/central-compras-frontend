import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function FornecedorCampanhas() {
  const { user } = useContext(AuthContext);
  const [campanhas, setCampanhas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    descricao_campanha: "",
    tipo_campanha: "valor",
    valor_meta: "",
    quantidade_meta: "",
    percentual_cashback_campanha: "",
    dt_inicio: "",
    dt_fim: "",
    ativo: true,
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [user]);

  async function carregarDados() {
    try {
      setLoading(true);

      // Buscar fornecedor do usuário logado
      let idFornecedor = null;
      if (user?.id) {
        const fornecedorData = await api(`/fornecedores?id_usuario=${user.id}`);
        const fornecedorList = Array.isArray(fornecedorData)
          ? fornecedorData
          : [];
        if (fornecedorList.length > 0) {
          const forn = fornecedorList[0];
          setFornecedor(forn);
          idFornecedor = forn.id;
        }
      }

      // Buscar campanhas do fornecedor
      const campanhasUrl = idFornecedor
        ? `/campanhas?id_fornecedor=${idFornecedor}`
        : "/campanhas";

      const [campanhasData, produtosData] = await Promise.all([
        api(campanhasUrl),
        api("/produtos"),
      ]);
      setCampanhas(Array.isArray(campanhasData) ? campanhasData : []);
      setProdutos(Array.isArray(produtosData) ? produtosData : []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function abrirModalNovo() {
    setEditando(null);
    setForm({
      descricao_campanha: "",
      tipo_campanha: "valor",
      valor_meta: "",
      quantidade_meta: "",
      percentual_cashback_campanha: "",
      dt_inicio: formatDateForInput(new Date()),
      dt_fim: "",
      ativo: true,
    });
    setShowModal(true);
  }

  function abrirModalEditar(campanha) {
    setEditando(campanha);
    setForm({
      descricao_campanha: campanha.descricao_campanha || "",
      tipo_campanha: campanha.tipo || "valor",
      valor_meta: campanha.valor_meta || "",
      quantidade_meta: campanha.quantidade_meta || "",
      percentual_cashback_campanha: campanha.percentual_cashback_campanha || "",
      dt_inicio: formatDateForInput(campanha.dt_inicio),
      dt_fim: formatDateForInput(campanha.dt_fim),
      ativo: campanha.ativa !== false,
    });
    setShowModal(true);
  }

  function formatDateForInput(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  async function handleSalvar(e) {
    e.preventDefault();

    if (
      !form.descricao_campanha ||
      !form.percentual_cashback_campanha ||
      !form.dt_inicio ||
      !form.dt_fim
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (form.tipo_campanha === "valor" && !form.valor_meta) {
      alert("Para campanha por valor, informe o valor meta");
      return;
    }

    if (form.tipo_campanha === "quantidade" && !form.quantidade_meta) {
      alert("Para campanha por quantidade, informe a quantidade meta");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        id_fornecedor: fornecedor?.id,
        id_conta: 1,
        id_usuario: user?.id,
        descricao_campanha: form.descricao_campanha,
        valor_meta:
          form.tipo_campanha === "valor" ? parseFloat(form.valor_meta) : null,
        quantidade_meta:
          form.tipo_campanha === "quantidade"
            ? parseInt(form.quantidade_meta)
            : null,
        percentual_cashback_campanha: parseFloat(
          form.percentual_cashback_campanha
        ),
        dt_inicio: new Date(form.dt_inicio).toISOString(),
        dt_fim: new Date(form.dt_fim).toISOString(),
        tipo: form.tipo_campanha,
        ativa: form.ativo,
      };

      if (editando) {
        await api(`/campanhas/${editando.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await api("/campanhas", { method: "POST", body: payload });
      }

      await carregarDados();
      setShowModal(false);
    } catch (error) {
      alert(
        "Erro ao salvar campanha: " + (error.message || "Erro desconhecido")
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;

    try {
      await api(`/campanhas/${id}`, { method: "DELETE" });
      await carregarDados();
    } catch (error) {
      alert("Erro ao excluir campanha");
    }
  }

  async function toggleAtivo(campanha) {
    try {
      const payload = {
        ...campanha,
        ativa: !campanha.ativa,
      };
      await api(`/campanhas/${campanha.id}`, {
        method: "PUT",
        body: payload,
      });
      await carregarDados();
    } catch (error) {}
  }

  function isAtiva(campanha) {
    const hoje = new Date();
    const inicio = new Date(campanha.dt_inicio);
    const fim = new Date(campanha.dt_fim);
    return campanha.ativa && hoje >= inicio && hoje <= fim;
  }

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
          <h1 className="text-2xl font-bold text-white">Campanhas</h1>
          <p className="text-gray-400 mt-1">
            Gerencie suas campanhas de cashback
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
          Nova Campanha
        </button>
      </div>

      <div className="grid gap-4">
        {campanhas.length === 0 ? (
          <div className="bg-dark-surface rounded-xl border border-dark-border p-12 text-center">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-400">Nenhuma campanha cadastrada</p>
            <p className="text-gray-500 text-sm mt-1">
              Crie sua primeira campanha de cashback!
            </p>
          </div>
        ) : (
          campanhas.map((campanha) => (
            <div
              key={campanha.id}
              className="bg-dark-surface rounded-xl border border-dark-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {campanha.descricao_campanha ||
                        `Campanha #${campanha.id}`}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        isAtiva(campanha)
                          ? "bg-green-500/20 text-green-400"
                          : campanha.ativa
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {isAtiva(campanha)
                        ? "Ativa"
                        : campanha.ativa
                        ? "Agendada"
                        : "Inativa"}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        campanha.tipo === "valor"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {campanha.tipo === "valor"
                        ? "Por Valor"
                        : "Por Quantidade"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Meta</p>
                      <p className="text-white font-medium">
                        {campanha.tipo === "valor"
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(campanha.valor_meta || 0)
                          : `${campanha.quantidade_meta || 0} unidades`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cashback</p>
                      <p className="text-green-400 font-medium">
                        {campanha.percentual_cashback_campanha}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Início</p>
                      <p className="text-gray-300">
                        {new Date(campanha.dt_inicio).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fim</p>
                      <p className="text-gray-300">
                        {new Date(campanha.dt_fim).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAtivo(campanha)}
                    className={`p-2 rounded-lg transition-colors ${
                      campanha.ativa
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-400 hover:bg-gray-500/10"
                    }`}
                    title={campanha.ativa ? "Desativar" : "Ativar"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {campanha.ativa ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => abrirModalEditar(campanha)}
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
                    onClick={() => handleExcluir(campanha.id)}
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
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editando ? "Editar Campanha" : "Nova Campanha"}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.descricao_campanha}
                  onChange={(e) =>
                    setForm({ ...form, descricao_campanha: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Descreva a campanha..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de Campanha
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_campanha"
                      value="valor"
                      checked={form.tipo_campanha === "valor"}
                      onChange={(e) =>
                        setForm({ ...form, tipo_campanha: e.target.value })
                      }
                      className="text-primary"
                    />
                    <span className="text-gray-300">Por Valor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_campanha"
                      value="quantidade"
                      checked={form.tipo_campanha === "quantidade"}
                      onChange={(e) =>
                        setForm({ ...form, tipo_campanha: e.target.value })
                      }
                      className="text-primary"
                    />
                    <span className="text-gray-300">Por Quantidade</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {form.tipo_campanha === "valor" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Valor Meta (R$) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.valor_meta}
                      onChange={(e) =>
                        setForm({ ...form, valor_meta: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="1000.00"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Quantidade Meta <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.quantidade_meta}
                      onChange={(e) =>
                        setForm({ ...form, quantidade_meta: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="100"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cashback (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={form.percentual_cashback_campanha}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        percentual_cashback_campanha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="5.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data Início <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dt_inicio}
                    onChange={(e) =>
                      setForm({ ...form, dt_inicio: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data Fim <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dt_fim}
                    onChange={(e) =>
                      setForm({ ...form, dt_fim: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) =>
                    setForm({ ...form, ativo: e.target.checked })
                  }
                  className="rounded border-dark-border text-primary focus:ring-primary"
                />
                <span className="text-gray-300">Campanha ativa</span>
              </label>

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
                  {salvando
                    ? "Salvando..."
                    : editando
                    ? "Salvar"
                    : "Criar Campanha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
