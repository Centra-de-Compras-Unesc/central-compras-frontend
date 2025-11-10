import React, { useState } from "react";

const INITIAL_CAMPANHAS = [
  {
    id: 1,
    titulo: "Campanha de Verão",
    subtitulo: "Descontos e cashback",
    descricao: "Ofertas especiais de verão com descontos progressivos e cashback.",
    imagem: "/assets/natal.jpg",
    ativo: true,
  },
  {
    id: 2,
    titulo: "Liquidação",
    subtitulo: "Black Friday",
    descricao:
      "Liquidação de Black Friday com promoções em toda a loja, incluindo eletrônicos, papelaria e escritório.",
    imagem: "/assets/blackfriday.jpg",
    ativo: true,
  },
  {
    id: 3,
    titulo: "Promoção Escritório",
    subtitulo: "Ofertas",
    descricao:
      "Campanha focada em produtos de escritório com preços especiais para empresas parceiras.",
    imagem: "/assets/blackfriday.jpg",
    ativo: false,
  },
];

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState(INITIAL_CAMPANHAS);
  const [showModal, setShowModal] = useState(false); // criar/editar
  const [imagePreview, setImagePreview] = useState(null);
  const [isManaging, setIsManaging] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailCampanha, setDetailCampanha] = useState(null); // 🔥 detalhe

  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    descricao: "",
    imagem: "",
    ativo: false,
  });

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

  const handleDelete = (id) => {
    const ok = window.confirm("Tem certeza que deseja excluir esta campanha?");
    if (!ok) return;
    setCampanhas((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      alert("Informe um título para a campanha.");
      return;
    }

    const dadosCampanha = {
      titulo: formData.titulo.trim(),
      subtitulo: formData.subtitulo.trim(),
      descricao: formData.descricao.trim(),
      imagem: formData.imagem || "/assets/natal.jpg",
      ativo: formData.ativo,
    };

    if (editingId !== null) {
      // EDITAR
      setCampanhas((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...dadosCampanha } : c
        )
      );
    } else {
      // NOVA
      const novaCampanha = {
        id: Date.now(),
        ...dadosCampanha,
      };
      setCampanhas((prev) => [...prev, novaCampanha]);
    }

    handleCloseModal();
  };

  // campanhas visíveis na grade
  const campanhasVisiveis = isManaging
    ? campanhas
    : campanhas.filter((c) => c.ativo);

  // 🔍 Detalhes (Saiba mais)
  const handleOpenDetails = (campanha) => {
    setDetailCampanha(campanha);
  };

  const handleCloseDetails = () => {
    setDetailCampanha(null);
  };

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
