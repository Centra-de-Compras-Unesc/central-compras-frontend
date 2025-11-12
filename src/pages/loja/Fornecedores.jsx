import React, { useEffect, useMemo, useState } from "react";

import ProdutosDoFornecedorModal from "../../components/shared/ProdutosDoFornecedorModal";
import FornecedorCard from "../../components/shared/FornecedorCard";
import { api } from "../../utils/api";

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
  window.open(
    `https://wa.me/${p}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
    "_blank",
    "noopener,noreferrer"
  );
};
/* ============================ */

/** Mantemos a lista fixa de categorias para NÃO mudar o layout */
const CATEGORIAS = [
  { id: 1, nome: "Materiais de Construção" },
  { id: 2, nome: "Material Elétrico" },
  { id: 3, nome: "Ferragens" },
  { id: 4, nome: "Hidráulica" },
  { id: 5, nome: "Acabamentos" },
];

/** Fallback para nunca ficar sem conteúdo (usado só se a API falhar) */
const fornecedoresMock = [
  { id: 1, nome: "Krona", descricao: "Hidráulica", categoria: "Material Elétrico", telefone: "(48) 99999-0003" },
  { id: 2, nome: "Quartzlit", descricao: "Argamassas", categoria: "Materiais de Construção", telefone: "(48) 99999-0001" },
  { id: 3, nome: "Gerdau", descricao: "Aços", categoria: "Ferragens", telefone: "(48) 99999-0002" },
];

export default function Fornecedores() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Lista real vinda do backend (padronizada)
  const [fornecedores, setFornecedores] = useState(fornecedoresMock);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Modal de produtos por fornecedor
  const [modalProdutosOpen, setModalProdutosOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  // Carrega todos os fornecedores do backend, mantendo layout original
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const data = await api("/fornecedores"); // <--- ajuste a rota se sua API for diferente
        if (!Array.isArray(data)) throw new Error("Resposta inesperada (não é array).");

        // Normaliza campos para o layout atual (id, nome, descricao, categoria, telefone)
        const normalizados = data.map((f) => {
          // tenta deduzir categoria de diferentes formatos
          const categoriaInferida =
            f.categoria?.nome ||
            f.categoria ||
            f.segmento ||
            f.tipo ||
            f.area ||
            null;

          return {
            id: f.id ?? f.id_fornecedor ?? f.fornecedor_id ?? f.codigo ?? null,
            nome:
              f.nome ??
              f.nome_fantasia ??
              f.razao_social ??
              (f.id ? `Fornecedor #${f.id}` : "Fornecedor"),
            descricao: f.descricao ?? f.obs ?? "",
            categoria: categoriaInferida,
            telefone:
              f.telefone ??
              f.celular ??
              f.whatsapp ??
              f.contato ??
              null,
          };
        });

        if (!cancelado) setFornecedores(normalizados);
      } catch (e) {
        console.error("Erro ao carregar /fornecedores:", e);
        if (!cancelado) {
          setErro("Não foi possível carregar os fornecedores. Exibindo dados de exemplo.");
          // mantém mock como fallback
          setFornecedores(fornecedoresMock);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  // Filtro de categoria e busca (preserva exatamente o comportamento visual)
  const fornecedoresFiltrados = useMemo(() => {
    const normaliza = (s) => String(s || "").toLowerCase();

    return fornecedores.filter((f) => {
      const catSelecionada = normaliza(categoriaAtiva);
      const catFornecedor = normaliza(f.categoria);

      const catOk =
        categoriaAtiva === "todos" ||
        // Aceita equivalências comuns (ex.: "Materiais de Construção" vs "Materiais de Construção")
        catFornecedor === catSelecionada;

      const busca = normaliza(termoBusca);
      const buscaOk =
        normaliza(f.nome).includes(busca) ||
        normaliza(f.descricao).includes(busca);

      return catOk && buscaOk;
    });
  }, [fornecedores, categoriaAtiva, termoBusca]);

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

  /* ===== Ver Produtos (abre modal) ===== */
  const handleVerProdutos = (fornecedor) => {
    if (!fornecedor?.id) return;
    setFornecedorSelecionado(fornecedor);
    setModalProdutosOpen(true);
  };

  /* ===== Fechar modal produtos ===== */
  const fecharModalProdutos = () => {
    setModalProdutosOpen(false);
  };

  return (
    <div className="space-y-10 text-gray-200">
      {/* filtro de busca e contagem */}
      <div className="flex justify-between flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar fornecedor"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />
        <span className="text-xs text-gray-400">
          {carregando ? "Carregando..." : `${fornecedoresFiltrados.length} encontrados`}
        </span>
      </div>

      {/* filtros de categoria (fixos, para manter o layout) */}
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

      {/* estado de erro (não altera layout, só informa) */}
      {erro && (
        <div className="text-xs text-red-300">{erro}</div>
      )}

      {/* cards de fornecedores */}
      <section className="grid gap-4">
        {!carregando && fornecedoresFiltrados.length === 0 && (
          <div className="text-sm text-gray-400">
            Nenhum fornecedor encontrado com os filtros atuais.
          </div>
        )}

        {fornecedoresFiltrados.map((f) => (
          <FornecedorCard
            key={f.id}
            fornecedor={f}
            onVerProdutos={() => handleVerProdutos(f)}
            onContatoRapido={() => handleContatoRapido(f)}
          />
        ))}
      </section>

      {/* Modal de produtos do fornecedor (não altera o layout existente) */}
      <ProdutosDoFornecedorModal
        open={modalProdutosOpen}
        onClose={fecharModalProdutos}
        fornecedor={fornecedorSelecionado}
      />
    </div>
  );
}
