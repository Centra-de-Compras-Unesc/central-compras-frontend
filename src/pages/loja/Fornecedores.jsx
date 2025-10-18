import React, { useState } from "react";
import FornecedorCard from "../../components/shared/FornecedorCard";

const CATEGORIAS = [
  { id: 1, nome: "Materiais de Construção" },
  { id: 2, nome: "Material Elétrico" },
  { id: 3, nome: "Ferragens" },
  { id: 4, nome: "Hidráulica" },
  { id: 5, nome: "Acabamentos" },
];

const fornecedoresMock = [
  {
    id: 1,
    nome: "Krona",
    logo: "/logos/krona.png",
    descricao: "Tubos, conexões e soluções completas para hidráulica",
    categoria: "Material Elétrico",
    cashback: "0,5%",
    pedidoMinimo: "R$ 1.000,00",
  },
  {
    id: 2,
    nome: "Quartzlit",
    logo: "/logos/quartzlit.png",
    descricao: "Argamassas, rejuntes e soluções de impermeabilização",
    categoria: "Materiais de Construção",
    cashback: "1%",
    pedidoMinimo: "R$ 800,00",
  },
  {
    id: 3,
    nome: "Gerdau",
    logo: "/logos/gerdau.png",
    descricao: "Vergalhões, treliças, malhas e linhas de aço especiais",
    categoria: "Ferragens",
    cashback: "0,8%",
    pedidoMinimo: "R$ 2.000,00",
  },
];

export default function Fornecedores() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  const fornecedoresFiltrados = fornecedoresMock.filter((fornecedor) => {
    const matchCategoria =
      categoriaAtiva === "todos" || fornecedor.categoria === categoriaAtiva;
    const matchBusca =
      fornecedor.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      fornecedor.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const handleVerProdutos = (fornecedor) => {
    console.log("Ver produtos do fornecedor:", fornecedor.nome);
  };

  return (
    <div className="space-y-10 text-gray-200">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Rede de fornecedores
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Catálogo inteligente por categoria
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Explore os fornecedores homologados, com cashback automático e
            condições comerciais personalizadas por estado.
          </p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner lg:w-auto">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por fornecedor ou solução"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            {fornecedoresFiltrados.length.toString().padStart(2, "0")} encontrados
          </span>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setCategoriaAtiva("todos")}
          className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
            categoriaAtiva === "todos"
              ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.65)]"
              : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Todos
        </button>
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaAtiva(categoria.nome)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
              categoriaAtiva === categoria.nome
                ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.65)]"
                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      <section className="grid gap-4">
        {fornecedoresFiltrados.map((fornecedor) => (
          <FornecedorCard
            key={fornecedor.id}
            fornecedor={fornecedor}
            onVerProdutos={handleVerProdutos}
          />
        ))}
        {fornecedoresFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-gray-400">
            <svg
              className="mb-4 h-10 w-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7h2l2 10h11l2-7H7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17a2 2 0 11-4 0 2 2 0 014 0zm5-12h-2l-3.34-3.34A1 1 0 0015.59 1H8.41a1 1 0 00-.71.29L4.34 5H2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nenhum fornecedor encontrado com os filtros atuais. Ajuste a busca
            ou explore outra categoria.
          </div>
        )}
      </section>
    </div>
  );
}
