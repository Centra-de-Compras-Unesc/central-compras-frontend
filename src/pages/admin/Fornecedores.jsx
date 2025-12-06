import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import {
  formatCNPJ,
  formatTelefone,
  formatCEP,
  isValidCNPJ,
  isValidEmail,
  isValidTelefone,
  isValidSite,
} from "../../utils/validators";

export default function AdminFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [credenciaisGeradas, setCredenciaisGeradas] = useState(null);
  const [form, setForm] = useState({
    cnpj: "",
    nome_fantasia: "",
    razao_social: "",
    inscricao_estadual: "",
    email_fornecedor: "",
    email_nfe: "",
    telefone: "",
    site: "",
    tipo_classificacao: "",
    observacoes: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    contato_nome: "",
    contato_email: "",
    contato_telefone: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    carregarFornecedores();
  }, []);

  async function carregarFornecedores() {
    try {
      const data = await api("/fornecedores");
      setFornecedores(Array.isArray(data) ? data : []);
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
    setTouched({});
    setForm({
      cnpj: "",
      nome_fantasia: "",
      razao_social: "",
      inscricao_estadual: "",
      email_fornecedor: "",
      email_nfe: "",
      telefone: "",
      site: "",
      tipo_classificacao: "",
      observacoes: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      contato_nome: "",
      contato_email: "",
      contato_telefone: "",
    });
    setShowModal(true);
  }

  function abrirModalEditar(fornecedor) {
    setEditando(fornecedor);
    setCredenciaisGeradas(null);
    setTouched({});
    const endereco = fornecedor.tb_fornecedor_endereco?.[0] || {};
    const contato = fornecedor.tb_fornecedor_contato?.[0] || {};
    setForm({
      cnpj: fornecedor.cnpj || "",
      nome_fantasia: fornecedor.nome_fantasia || "",
      razao_social: fornecedor.razao_social || "",
      inscricao_estadual: fornecedor.inscricao_estadual || "",
      email_fornecedor: fornecedor.email_fornecedor || "",
      email_nfe: fornecedor.email_nfe || "",
      telefone: fornecedor.telefone || "",
      site: fornecedor.site || "",
      tipo_classificacao: fornecedor.tipo_classificacao || "",
      observacoes: fornecedor.observacoes || "",
      logradouro: endereco.logradouro || "",
      numero: endereco.numero || "",
      bairro: endereco.bairro || "",
      cidade: endereco.cidade || "",
      estado: endereco.estado || "",
      cep: endereco.cep || "",
      contato_nome: contato.nome || "",
      contato_email: contato.email || "",
      contato_telefone: contato.fone1 || "",
    });
    setShowModal(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!form.cnpj || !form.nome_fantasia || !form.email_fornecedor) {
      alert("Preencha os campos obrigatórios: CNPJ, Nome Fantasia e E-mail");
      return;
    }

    if (!isValidCNPJ(form.cnpj)) {
      alert("CNPJ inválido. Verifique o número digitado.");
      return;
    }

    if (!isValidEmail(form.email_fornecedor)) {
      alert("E-mail do fornecedor inválido. Verifique o formato.");
      return;
    }

    if (form.email_nfe && !isValidEmail(form.email_nfe)) {
      alert("E-mail NFe inválido. Verifique o formato.");
      return;
    }

    if (form.telefone && !isValidTelefone(form.telefone)) {
      alert("Telefone inválido. Digite 10 ou 11 dígitos.");
      return;
    }

    if (form.site && !isValidSite(form.site)) {
      alert("Site inválido. Verifique o URL digitado.");
      return;
    }

    if (form.contato_email && !isValidEmail(form.contato_email)) {
      alert("E-mail do contato inválido. Verifique o formato.");
      return;
    }

    if (form.contato_telefone && !isValidTelefone(form.contato_telefone)) {
      alert("Telefone do contato inválido. Digite 10 ou 11 dígitos.");
      return;
    }

    try {
      setSalvando(true);

      const senhaGerada = editando ? null : gerarSenhaAleatoria();

      const payload = {
        cnpj: form.cnpj,
        nome_fantasia: form.nome_fantasia,
        razao_social: form.razao_social,
        inscricao_estadual: form.inscricao_estadual,
        email_fornecedor: form.email_fornecedor,
        email_nfe: form.email_nfe,
        telefone: form.telefone,
        site: form.site,
        tipo_classificacao: form.tipo_classificacao,
        observacoes: form.observacoes,
        id_conta: 1,
        id_usuario: 1,
        endereco: {
          logradouro: form.logradouro,
          numero: form.numero,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep,
        },
        contato: {
          nome: form.contato_nome,
          email: form.contato_email,
          fone1: form.contato_telefone,
          is_responsavel: true,
        },
        gerarCredenciais: !editando,
        senhaGerada: senhaGerada,
      };

      if (editando) {
        await api(`/fornecedores/${editando.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await api("/fornecedores", { method: "POST", body: payload });
        setCredenciaisGeradas({
          email: form.email_fornecedor,
          senha: senhaGerada,
        });
      }

      try {
        await carregarFornecedores();
      } catch (reloadError) {}

      if (editando) {
        setShowModal(false);
      }
    } catch (error) {
      alert(
        "Erro ao salvar fornecedor: " + (error.message || "Erro desconhecido")
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;

    try {
      await api(`/fornecedores/${id}`, { method: "DELETE" });
      await carregarFornecedores();
    } catch (error) {
      alert("Erro ao excluir fornecedor");
    }
  }

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const categorias = [
    "Materiais de Construção",
    "Material Elétrico",
    "Ferragens",
    "Hidráulica",
    "Acabamentos",
    "Tintas e Acessórios",
    "Pisos e Revestimentos",
    "Ferramentas",
    "Iluminação",
    "Outros",
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
          <h1 className="text-2xl font-bold text-white">Fornecedores</h1>
          <p className="text-gray-400 mt-1">
            Gerencie os fornecedores cadastrados
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
          Novo Fornecedor
        </button>
      </div>

      <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  E-mail
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
              {fornecedores.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Nenhum fornecedor cadastrado
                  </td>
                </tr>
              ) : (
                fornecedores.map((fornecedor) => (
                  <tr
                    key={fornecedor.id}
                    className="hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {fornecedor.nome_fantasia}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {fornecedor.razao_social}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {fornecedor.cnpj}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        {fornecedor.tipo_classificacao || "Geral"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {fornecedor.email_fornecedor}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          fornecedor.ativo
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {fornecedor.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(fornecedor)}
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
                          onClick={() => handleExcluir(fornecedor.id)}
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
          <div className="bg-dark-surface rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editando ? "Editar Fornecedor" : "Novo Fornecedor"}
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
                      Fornecedor Cadastrado com Sucesso!
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    As credenciais de acesso foram geradas automaticamente:
                  </p>
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
                    ⚠️ Anote essas credenciais! A senha não poderá ser
                    recuperada.
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
              <form onSubmit={handleSalvar} className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Dados do Fornecedor
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        CNPJ <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.cnpj}
                        onChange={(e) =>
                          setForm({ ...form, cnpj: formatCNPJ(e.target.value) })
                        }
                        onBlur={() => setTouched({ ...touched, cnpj: true })}
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.cnpj && form.cnpj && !isValidCNPJ(form.cnpj)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                        placeholder="00.000.000/0000-00"
                      />
                      {touched.cnpj && form.cnpj && !isValidCNPJ(form.cnpj) && (
                        <span className="text-red-400 text-xs mt-1">
                          CNPJ inválido
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome Fantasia <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nome_fantasia}
                        onChange={(e) =>
                          setForm({ ...form, nome_fantasia: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Razão Social
                      </label>
                      <input
                        type="text"
                        value={form.razao_social}
                        onChange={(e) =>
                          setForm({ ...form, razao_social: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Categoria
                      </label>
                      <select
                        value={form.tipo_classificacao}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            tipo_classificacao: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Selecione</option>
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        E-mail <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email_fornecedor}
                        onChange={(e) =>
                          setForm({ ...form, email_fornecedor: e.target.value })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, email_fornecedor: true })
                        }
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.email_fornecedor &&
                          form.email_fornecedor &&
                          !isValidEmail(form.email_fornecedor)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                      />
                      {touched.email_fornecedor &&
                        form.email_fornecedor &&
                        !isValidEmail(form.email_fornecedor) && (
                          <span className="text-red-400 text-xs mt-1">
                            E-mail inválido
                          </span>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        E-mail NFe
                      </label>
                      <input
                        type="email"
                        value={form.email_nfe}
                        onChange={(e) =>
                          setForm({ ...form, email_nfe: e.target.value })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, email_nfe: true })
                        }
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.email_nfe &&
                          form.email_nfe &&
                          !isValidEmail(form.email_nfe)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                      />
                      {touched.email_nfe &&
                        form.email_nfe &&
                        !isValidEmail(form.email_nfe) && (
                          <span className="text-red-400 text-xs mt-1">
                            E-mail inválido
                          </span>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={form.telefone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            telefone: formatTelefone(e.target.value),
                          })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, telefone: true })
                        }
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.telefone &&
                          form.telefone &&
                          !isValidTelefone(form.telefone)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                        placeholder="(00) 00000-0000"
                      />
                      {touched.telefone &&
                        form.telefone &&
                        !isValidTelefone(form.telefone) && (
                          <span className="text-red-400 text-xs mt-1">
                            Telefone inválido
                          </span>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Site
                      </label>
                      <input
                        type="text"
                        value={form.site}
                        onChange={(e) =>
                          setForm({ ...form, site: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Observações
                      </label>
                      <textarea
                        value={form.observacoes}
                        onChange={(e) =>
                          setForm({ ...form, observacoes: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Logradouro
                      </label>
                      <input
                        type="text"
                        value={form.logradouro}
                        onChange={(e) =>
                          setForm({ ...form, logradouro: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        value={form.numero}
                        onChange={(e) =>
                          setForm({ ...form, numero: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={form.bairro}
                        onChange={(e) =>
                          setForm({ ...form, bairro: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={form.cidade}
                        onChange={(e) =>
                          setForm({ ...form, cidade: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Estado
                      </label>
                      <select
                        value={form.estado}
                        onChange={(e) =>
                          setForm({ ...form, estado: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Selecione</option>
                        {estados.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        CEP
                      </label>
                      <input
                        type="text"
                        value={form.cep}
                        onChange={(e) =>
                          setForm({ ...form, cep: formatCEP(e.target.value) })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Contato Principal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={form.contato_nome}
                        onChange={(e) =>
                          setForm({ ...form, contato_nome: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={form.contato_email}
                        onChange={(e) =>
                          setForm({ ...form, contato_email: e.target.value })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, contato_email: true })
                        }
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.contato_email &&
                          form.contato_email &&
                          !isValidEmail(form.contato_email)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                      />
                      {touched.contato_email &&
                        form.contato_email &&
                        !isValidEmail(form.contato_email) && (
                          <span className="text-red-400 text-xs mt-1">
                            E-mail inválido
                          </span>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={form.contato_telefone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            contato_telefone: formatTelefone(e.target.value),
                          })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, contato_telefone: true })
                        }
                        className={`w-full px-4 py-2 bg-dark-bg border rounded-lg text-white focus:outline-none ${
                          touched.contato_telefone &&
                          form.contato_telefone &&
                          !isValidTelefone(form.contato_telefone)
                            ? "border-red-500 focus:border-red-500"
                            : "border-dark-border focus:border-primary"
                        }`}
                      />
                      {touched.contato_telefone &&
                        form.contato_telefone &&
                        !isValidTelefone(form.contato_telefone) && (
                          <span className="text-red-400 text-xs mt-1">
                            Telefone inválido
                          </span>
                        )}
                    </div>
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
                    {salvando
                      ? "Salvando..."
                      : editando
                      ? "Salvar Alterações"
                      : "Cadastrar Fornecedor"}
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
