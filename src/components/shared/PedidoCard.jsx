import React from "react";
import PropTypes from "prop-types";

export default function PedidoCard({ pedido }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "enviado":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{pedido.numero}</h3>
          <p className="text-gray-600 text-sm">{pedido.data}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            pedido.status
          )}`}
        >
          {pedido.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Fornecedor:</span>
          <span className="font-medium">{pedido.fornecedor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Valor Total:</span>
          <span className="font-medium">R$ {pedido.valorTotal.toFixed(2)}</span>
        </div>
        {pedido.previsaoEntrega && (
          <div className="flex justify-between">
            <span className="text-gray-600">Previsão de Entrega:</span>
            <span className="font-medium">{pedido.previsaoEntrega}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Ver Detalhes
        </button>
        {pedido.status === "Pendente" && (
          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

PedidoCard.propTypes = {
  pedido: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fornecedor: PropTypes.string.isRequired,
    valorTotal: PropTypes.number.isRequired,
    previsaoEntrega: PropTypes.string,
  }).isRequired,
};
