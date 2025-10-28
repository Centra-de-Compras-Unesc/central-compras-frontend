import React, { useState } from "react";
import FornecedorCard from "../../components/shared/FornecedorCard";

/* ===== Helpers WhatsApp ===== */
const toWhatsappPhone = (raw) => {
  if (!raw) return null;
  const d = String(raw).replace(/\D/g, "");
  if (d.startsWith("55")) return d;
  if (d.length >= 10 && d.length <= 13) return "55" + d;
  return d;
};
const openWhatsApp = (phone, text = "") => {
  const p = toWhatsappPhone(phone);
  if (!p) return alert("Telefone não encontrado para este fornecedor.");
  window.open(`https://wa.me/${p}${text ? `?text=${encodeURIComponent(text)}` : ""}`, "_blank", "noopener,noreferrer");
};
/* ============================ */

const CATEGORIAS = [
  { id: 1, nome: "Materiais de Construção" },
  { id: 2, nome: "Material Elétrico" },
  { id: 3, nome: "Ferragens" },
  { id: 4, nome: "Hidráulica" },
  { id: 5, nome: "Acabamentos" },
];

const fornecedoresMock = [
  { id: 1, nome: "Krona", descricao: "Hidráulica", categoria: "Material Elétrico", telefone: "(48) 99999-0003" },
  { id: 2, nome: "Quartzlit", descricao: "Argamassas", categoria: "Materiais de Construção", telefone: "(48) 99999-0001" },
  { id: 3, nome: "Gerdau", descricao: "Aços", categoria: "Ferragens", telefone: "(48) 99999-0002" },
];

export default function Fornecedores() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [fornecedorAtual, setFornecedorAtual] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [erroProdutos, setErroProdutos] = useState("");

  const fornecedoresFiltrados = fornecedoresMock.filter((f) => {
    const catOk = categoriaAtiva === "todos" || f.categoria === categoriaAtiva;
    const buscaOk =
      f.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (f.descricao || "").toLowerCase().includes(termoBusca.toLowerCase());
    return catOk && buscaOk;
  });

  /* ===== Contato Rápido ===== */
  const handleContatoRapido = (fornecedor) => {
    let telefone = fornecedor?.telefone;
    const msg = `Olá ${fornecedor?.nome ?? "tudo bem"}? Sou da Central de Compras e gostaria de falar com você.`;

    if (!telefone) {
      alert("Telefone não encontrado para este fornecedor.");
      return;
    }
    openWhatsApp(telefone, msg);
  };

  /* ===== Ver Produtos ===== */
  const handleVerProdutos = (fornecedor) => {
    console.log("Ver produtos do fornecedor:", fornecedor.nome);
  };

  return (
    <div className="space-y-10 text-gray-200">
      {/* filtro de busca e categorias */}
      <div className="flex justify-between flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar fornecedor"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />
        <span className="text-xs text-gray-400">{fornecedoresFiltrados.length} encontrados</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {["todos", ...CATEGORIAS.map((c) => c.nome)].map((nome) => (
          <button
            key={nome}
            onClick={() => setCategoriaAtiva(nome)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              categoriaAtiva === nome
                ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white"
                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {nome}
          </button>
        ))}
      </div>

      {/* cards de fornecedores */}
      <section className="grid gap-4">
        {fornecedoresFiltrados.map((f) => (
          <FornecedorCard
            key={f.id}
            fornecedor={f}
            onVerProdutos={handleVerProdutos}
            onContatoRapido={handleContatoRapido} // Passando a função de contato rápido
          />
        ))}
      </section>
    </div>
  );
}
