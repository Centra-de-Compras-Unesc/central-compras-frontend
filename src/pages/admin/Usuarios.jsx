import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [credenciaisGeradas, setCredenciaisGeradas] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "loja",
    ativo: true,
  });
  const [salvando, setSalvando] = useState(false);
  const { user } = useContext(AuthContext);

  // Verifica se está editando o próprio usuário
  const isEditandoProprio =
    editando &&
    user &&
    (editando.id === user.id || editando.email === user.email);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const data = await api("/usuarios");
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function gerarSenhaAleatoria() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let senha = "";
    for (let i = 0; i < 10; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return senha;
  }

  function abrirModalNovo() {
    setEditando(null);
    setCredenciaisGeradas(null);
    const senhaGerada = gerarSenhaAleatoria();
    setForm({
      nome: "",
      email: "",
      senha: senhaGerada,
      perfil: "loja",
      ativo: true,
    });
    setShowModal(true);
  }

  function abrirModalEditar(usuario) {
    setEditando(usuario);
    setCredenciaisGeradas(null);

    // Obtém o perfil do usuário - suporta múltiplas estruturas
    let perfilAtual = "loja";
    if (usuario.tb_sistema_usuario_perfil?.length > 0) {
      perfilAtual = usuario.tb_sistema_usuario_perfil[0].perfil || "loja";
    } else if (usuario.perfil) {
      perfilAtual = usuario.perfil;
    }

    setForm({
      nome: usuario.nome || "",
      email: usuario.email || "",
      senha: "",
      perfil: perfilAtual,
      ativo: usuario.ativo ?? true,
    });
    setShowModal(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!form.nome || !form.email) {
      alert("Preencha os campos obrigatórios: Nome e E-mail");
      return;
    }
    if (!editando && !form.senha) {
      alert("Informe uma senha para o novo usuário");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        nome: form.nome,
        email: form.email,
        ativo: form.ativo,
        id_conta: 1,
        perfil: form.perfil,
      };

      if (form.senha) {
        payload.senha = form.senha;
      }

      if (editando) {
        await api(`/usuarios/${editando.id}`, { method: "PUT", body: payload });
        setShowModal(false);
      } else {
        await api("/usuarios", { method: "POST", body: payload });
        setCredenciaisGeradas({
          email: form.email,
          senha: form.senha,
        });
      }

      await carregarUsuarios();
    } catch (error) {
      alert(error.message || "Erro ao salvar usuário");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api(`/usuarios/${id}`, { method: "DELETE" });
      await carregarUsuarios();
    } catch (error) {
      alert("Erro ao excluir usuário");
    }
  }

  // Mapeamento de valores do banco para exibição amigável
  const perfilLabels = {
    admin: "Admin",
    fornecedor: "Fornecedor",
    loja: "Lojista",
    televendas: "Televendas",
  };

  function getPerfil(usuario) {
    // Tenta múltiplas estruturas de dados
    let perfilValue = null;

    // Opção 1: tb_sistema_usuario_perfil (array)
    if (
      usuario.tb_sistema_usuario_perfil &&
      usuario.tb_sistema_usuario_perfil.length > 0
    ) {
      perfilValue = usuario.tb_sistema_usuario_perfil[0].perfil;
    }
    // Opção 2: perfil direto no usuário
    else if (usuario.perfil) {
      perfilValue = usuario.perfil;
    }
    // Opção 3: tb_sistema_usuario_perfil como objeto único
    else if (usuario.tb_sistema_usuario_perfil?.perfil) {
      perfilValue = usuario.tb_sistema_usuario_perfil.perfil;
    }

    if (perfilValue) {
      return perfilLabels[perfilValue.toLowerCase()] || perfilValue;
    }

    return "Não definido";
  }

  function getPerfilColor(perfil) {
    switch (perfil?.toLowerCase()) {
      case "admin":
        return "bg-purple-500/20 text-purple-400";
      case "fornecedor":
        return "bg-green-500/20 text-green-400";
      case "loja":
      case "lojista":
        return "bg-blue-500/20 text-blue-400";
      case "televendas":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
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
          <h1 className="text-2xl font-bold text-white">Usuários</h1>
          <p className="text-gray-400 mt-1">Gerencie os usuários do sistema</p>
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
          Novo Usuário
        </button>
      </div>

      <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {(usuario.nome ||
                              usuario.email ||
                              "U")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {usuario.nome || "Sem nome"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{usuario.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPerfilColor(
                          getPerfil(usuario)
                        )}`}
                      >
                        {getPerfil(usuario)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          usuario.ativo
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(usuario)}
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
                          onClick={() => handleExcluir(usuario.id)}
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
          <div className="bg-dark-surface rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editando ? "Editar Usuário" : "Novo Usuário"}
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

            {credenciaisGeradas ? (
              <div className="p-6 space-y-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-400">
                      Usuário Criado!
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">Credenciais de acesso:</p>
                  <div className="bg-dark-bg rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">E-mail:</span>
                      <span className="text-white font-mono">
                        {credenciaisGeradas.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Senha:</span>
                      <span className="text-white font-mono">
                        {credenciaisGeradas.senha}
                      </span>
                    </div>
                  </div>
                  <p className="text-yellow-400 text-sm mt-4">
                    ⚠️ Anote essas credenciais!
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSalvar} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    E-mail <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Senha {!editando && <span className="text-red-400">*</span>}
                    {editando && (
                      <span className="text-gray-500">
                        (deixe vazio para manter)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary font-mono"
                  />
                  {!editando && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, senha: gerarSenhaAleatoria() })
                      }
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Gerar nova senha
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Perfil
                  </label>
                  <select
                    value={form.perfil}
                    onChange={(e) =>
                      setForm({ ...form, perfil: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="loja">Lojista</option>
                    <option value="fornecedor">Fornecedor</option>
                    <option value="admin">Administrador</option>
                    <option value="televendas">Televendas</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={form.ativo}
                    onChange={(e) =>
                      setForm({ ...form, ativo: e.target.checked })
                    }
                    disabled={isEditandoProprio}
                    className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor="ativo"
                    className={`${
                      isEditandoProprio ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    Usuário ativo
                  </label>
                </div>
                {isEditandoProprio && (
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Você não pode desativar seu próprio perfil
                  </p>
                )}

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
                      : "Criar Usuário"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
