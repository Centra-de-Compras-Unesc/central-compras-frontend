import React from "react";
import PropTypes from "prop-types";

export default function FornecedorCard({ fornecedor, onVerProdutos }) {
  const { nome, logo, descricao } = fornecedor;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex-shrink-0">
          <img src={logo} alt={nome} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{nome}</h3>
          <p className="text-gray-600 text-sm">{descricao}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onVerProdutos(fornecedor)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ver Produtos
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

FornecedorCard.propTypes = {
  fornecedor: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    descricao: PropTypes.string.isRequired,
  }).isRequired,
  onVerProdutos: PropTypes.func.isRequired,
};
