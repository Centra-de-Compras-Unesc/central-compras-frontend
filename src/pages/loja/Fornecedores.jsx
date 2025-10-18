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
    descricao: "Tubos, Conexões, Material Elétrico",
    categoria: "Material Elétrico",
    cashback: "0.5%",
    pedidoMinimo: "R$ 1.000,00",
  },
  {
    id: 2,
    nome: "Quartzlit",
    logo: "/logos/quartzlit.png",
    descricao: "Argamassas, Impermeabilizantes",
    categoria: "Materiais de Construção",
    cashback: "1%",
    pedidoMinimo: "R$ 800,00",
  },
  {
    id: 3,
    nome: "Gerdau",
    logo: "/logos/gerdau.png",
    descricao: "Vergalhões, Treliças, Malhas, Pregos",
    categoria: "Ferragens",
    cashback: "0.8%",
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
    // Implementar navegação para a página de produtos do fornecedor
    console.log("Ver produtos do fornecedor:", fornecedor.nome);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar fornecedores..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtro por Categorias */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategoriaAtiva("todos")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            categoriaAtiva === "todos"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaAtiva(categoria.nome)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              categoriaAtiva === categoria.nome
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      {/* Lista de Fornecedores */}
      <div className="space-y-4">
        {fornecedoresFiltrados.map((fornecedor) => (
          <FornecedorCard
            key={fornecedor.id}
            fornecedor={fornecedor}
            onVerProdutos={handleVerProdutos}
          />
        ))}
        {fornecedoresFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhum fornecedor encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
