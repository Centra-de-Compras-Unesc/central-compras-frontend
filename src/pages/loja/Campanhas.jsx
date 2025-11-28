import React, { useState, useEffect } from "react";
 // backend na porta 3000, sem /api
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = `${API_URL}/campanhas`;


// Helper para fazer fetch + JSON com tratamento de erro
async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // DELETE normalmente não tem body
  if (options.method === "DELETE") {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${text}`);
    }
    return;
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Erro HTTP ${res.status}: ${text}`);
  }

  // se vier vazio, retorna null
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Resposta do servidor não é JSON válido");
  }
}

// Converte o objeto do banco para o formato da tela
function mapApiToUi(c) {
  return {
    id: c.id,
    titulo: c.descricao_campanha || `Campanha #${c.id}`,
    subtitulo: c.tipo || "",
    descricao: c.descricao_campanha || "",
    // por enquanto uso uma imagem padrão; depois podemos mapear c.foto
    imagem: "/assets/blackfriday.jpg",
    ativo: c.ativa ?? true,
  };
}

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState([]); // vem do backend
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [showModal, setShowModal] = useState(false); // criar/editar
  const [imagePreview, setImagePreview] = useState(null);
  const [isManaging, setIsManaging] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailCampanha, setDetailCampanha] = useState(null); // detalhe

  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    descricao: "",
    imagem: "",
    ativo: false,
  });

  // ==========================
  // 1) Carregar campanhas do banco ao abrir a tela
  // ==========================
  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await fetchJson(API_BASE);
        if (Array.isArray(data)) {
          setCampanhas(data.map(mapApiToUi));
        } else {
          setCampanhas([]);
        }
      } catch (e) {
        setErro("Erro ao carregar campanhas");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const resetForm = () => {
    setFormData({
      titulo: "",
      subtitulo: "",
      descricao: "",
      imagem: "",
      ativo: false,
    });
    setImagePreview(null);
    setEditingId(null);
  };

  // NOVA CAMPANHA
  const handleOpenNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  // EDITAR CAMPANHA
  const handleOpenEditModal = (campanha) => {
    setFormData({
      titulo: campanha.titulo || "",
      subtitulo: campanha.subtitulo || "",
      descricao: campanha.descricao || "",
      imagem: campanha.imagem || "",
      ativo: campanha.ativo ?? false,
    });
    setImagePreview(campanha.imagem || null);
    setEditingId(campanha.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagem: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ==========================
  // 2) Excluir campanha (DELETE no backend)
  // ==========================
  const handleDelete = async (id) => {
    const ok = window.confirm("Tem certeza que deseja excluir esta campanha?");
    if (!ok) return;

    try {
      await fetchJson(`${API_BASE}/${id}`, { method: "DELETE" });
      setCampanhas((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert("Erro ao excluir campanha");
    }
  };

  // ==========================
  // 3) Salvar campanha (nova ou edição) no banco
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      alert("Informe um título para a campanha.");
      return;
    }

    const dadosCampanhaTela = {
      titulo: formData.titulo.trim(),
      subtitulo: formData.subtitulo.trim(),
      descricao: formData.descricao.trim(),
      imagem: formData.imagem || "/assets/natal.jpg",
      ativo: formData.ativo,
    };

    // payload para o backend (tb_fornecedor_campanha)
    const payloadApi = {
      id_fornecedor: 1, // TODO: trocar pelo fornecedor real
      id_usuario: 1, // TODO: usuário logado
      id_conta: 1, // TODO: conta correta
      descricao_campanha:
        dadosCampanhaTela.descricao || dadosCampanhaTela.titulo,
      valor_meta: null,
      tempo_duracao_campanha: null,
      dt_inicio: null,
      dt_fim: null,
      tipo: dadosCampanhaTela.subtitulo || null,
      pedido_minimo: null,
      percentual_cashback_campanha: null,
      bloquear_pedidos_se_nao_atingir: false,
      tem_meta_global: false,
      ativa: dadosCampanhaTela.ativo,
      status: dadosCampanhaTela.ativo ? "ATIVA" : "INATIVA",
      // foto: aqui poderíamos mandar dadosCampanhaTela.imagem (base64)
      // mas depende do tipo da coluna no banco; por enquanto deixo null
      foto: null,
    };

    try {
      if (editingId !== null) {
        // EDITAR -> PUT /campanhas/:id
        const updated = await fetchJson(`${API_BASE}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payloadApi),
        });

        const ui = mapApiToUi(updated);
        setCampanhas((prev) =>
          prev.map((c) => (c.id === editingId ? ui : c))
        );
      } else {
        // NOVA -> POST /campanhas
        const created = await fetchJson(API_BASE, {
          method: "POST",
          body: JSON.stringify(payloadApi),
        });

        const ui = mapApiToUi(created);
        setCampanhas((prev) => [...prev, ui]);
      }

      handleCloseModal();
    } catch (e) {
      alert("Erro ao salvar campanha");
    }
  };

  // campanhas visíveis na grade
  const campanhasVisiveis = isManaging
    ? campanhas
    : campanhas.filter((c) => c.ativo);

  // Detalhes (Saiba mais)
  const handleOpenDetails = (campanha) => {
    setDetailCampanha(campanha);
  };

  const handleCloseDetails = () => {
    setDetailCampanha(null);
  };

  // Loading / erro simples
  if (loading) {
    return <div className="p-6">Carregando campanhas...</div>;
  }

  if (erro) {
    return (
      <div className="p-6">
        <p className="text-red-400">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER COM BOTÕES */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campanhas</h1>

        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => setIsManaging((prev) => !prev)}
          >
            {isManaging ? "Sair do gerenciamento" : "Gerenciar"}
          </button>

          <button className="btn-primary" onClick={handleOpenNewModal}>
            Nova Campanha
          </button>
        </div>
      </div>

      {/* LISTA DE CAMPANHAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campanhasVisiveis.map((c) => (
          <div key={c.id} className="card overflow-hidden p-0">
            <img
              src={c.imagem}
              alt={c.titulo}
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              {/* Título + badge inativa no modo gerenciamento */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{c.titulo}</h3>
                {isManaging && !c.ativo && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-200">
                    Inativa
                  </span>
                )}
              </div>

              <p className="text-sm text-dark-text/70 mb-3">
                {c.subtitulo}
              </p>

              {isManaging ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-secondary text-xs px-3 py-1"
                    onClick={() => handleOpenEditModal(c)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-primary text-xs px-3 py-1 bg-red-600 hover:bg-red-500"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </button>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => handleOpenDetails(c)}
                >
                  Saiba mais
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CRIAR / EDITAR */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId !== null ? "Editar Campanha" : "Nova Campanha"}
              </h2>
              <button
                className="text-sm text-dark-text/70 hover:text-dark-text"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  name="titulo"
                  type="text"
                  className="w-full p-2 rounded-md bg-[#1e1e1e] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Campanha de Verão"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm mb-1">Subtítulo</label>
                <input
                  name="subtitulo"
                  type="text"
                  className="w-full p-2 rounded-md bg-[#1e1e1e] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.subtitulo}
                  onChange={handleChange}
                  placeholder="Ex: Black Friday, Natal..."
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm mb-1">
                  Descrição / Regras da campanha
                </label>
                <textarea
                  name="descricao"
                  className="w-full p-2 rounded-md bg-[#1e1e1e] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-y"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva as regras e detalhes da campanha..."
                />
              </div>

              {/* Upload de imagem */}
              <div>
                <label className="block text-sm mb-1">Imagem da campanha</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="mt-3 rounded-md max-h-48 object-cover w-full"
                  />
                )}
              </div>

              {/* Checkbox ativo */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <label htmlFor="ativo" className="text-sm">
                  Campanha ativa
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId !== null
                    ? "Salvar alterações"
                    : "Salvar campanha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES (Saiba mais) */}
      {detailCampanha && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {detailCampanha.titulo}
              </h2>
              <button
                className="text-sm text-dark-text/70 hover:text-dark-text"
                onClick={handleCloseDetails}
              >
                ✕
              </button>
            </div>

            {detailCampanha.imagem && (
              <img
                src={detailCampanha.imagem}
                alt={detailCampanha.titulo}
                className="w-full max-h-72 object-cover rounded-md mb-4"
              />
            )}

            <p className="text-sm text-dark-text/70 mb-2">
              {detailCampanha.subtitulo}
            </p>

            <div className="mt-2 text-sm leading-relaxed whitespace-pre-line">
              {detailCampanha.descricao || "Sem descrição cadastrada."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
