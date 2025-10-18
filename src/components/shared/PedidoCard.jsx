import React from "react";
import PropTypes from "prop-types";

const statusClassMap = {
  pendente: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
  aprovado: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  enviado: "border border-blue-500/20 bg-blue-500/10 text-blue-300",
  separado: "border border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
  entregue: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
};

export default function PedidoCard({ pedido }) {
  const statusKey = pedido.status.toLowerCase();
  const statusClasses =
    statusClassMap[statusKey] || "border border-gray-500/20 bg-gray-500/10 text-gray-300";

  return (
    <div className="rounded-2xl border border-white/5 bg-[#14141C]/80 p-6 text-sm text-gray-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Pedido #{pedido.numero}</h3>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              {new Date(pedido.data).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Fornecedor
              </span>
              <span className="text-sm font-medium text-white">{pedido.fornecedor}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Valor total
              </span>
              <span className="text-sm font-semibold text-white">
                R$ {pedido.valorTotal.toFixed(2)}
              </span>
            </div>
            {pedido.previsaoEntrega && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  Previsão de entrega
                </span>
                <span className="text-sm text-white/80">
                  {pedido.previsaoEntrega}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${statusClasses}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {pedido.status}
          </span>
          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 transition hover:text-white">
              Ver detalhes
            </button>
            {statusKey === "pendente" && (
              <button className="rounded-full border border-rose-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-300 transition hover:border-rose-400 hover:text-rose-200">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {pedido.itens?.length > 0 && (
        <div className="mt-5 grid gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Itens do pedido
          </p>
          <ul className="space-y-2 text-xs text-gray-300">
            {pedido.itens.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4">
                <span className="font-medium text-white/90">
                  {item.quantidade}x {item.produto}
                </span>
                <span className="text-white/70">
                  R$ {(item.valorUnitario * item.quantidade).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
    itens: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        produto: PropTypes.string.isRequired,
        quantidade: PropTypes.number.isRequired,
        valorUnitario: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
};
