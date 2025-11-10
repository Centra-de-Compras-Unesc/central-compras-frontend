import React from "react";
import PropTypes from "prop-types";

export default function PedidoCard({ pedido, onVerDetalhes }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500/20 text-yellow-400";
      case "aprovado":
        return "bg-green-500/20 text-green-400";
      case "enviado":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-dark-surface text-dark-text";
    }
  };

  const handleVerDetalhes = () => {
    if (typeof onVerDetalhes === "function") {
      onVerDetalhes(pedido);
    }
  };

  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{pedido.numero}</h3>
          <p className="text-dark-text/70 text-sm">{pedido.data}</p>
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
          <span className="text-dark-text/70">Fornecedor:</span>
          <span className="font-medium">{pedido.fornecedor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-text/70">Valor Total:</span>
          <span className="font-medium">R$ {pedido.valorTotal.toFixed(2)}</span>
        </div>
        {pedido.previsaoEntrega && (
          <div className="flex justify-between">
            <span className="text-dark-text/70">Previsao de Entrega:</span>
            <span className="font-medium">{pedido.previsaoEntrega}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleVerDetalhes}
          className="text-primary hover:text-primary/90 text-sm font-medium"
        >
          Ver Detalhes
        </button>
        {pedido.status === "Pendente" && (
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
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
  onVerDetalhes: PropTypes.func,
};

PedidoCard.defaultProps = {
  onVerDetalhes: undefined,
};
