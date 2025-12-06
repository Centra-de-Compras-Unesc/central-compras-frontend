import React from "react";

const statusBadgeStyles = {
  pendente: "border border-amber-500/30 bg-amber-500/10 text-amber-300",
  aprovado: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "em separacao":
    "border border-sky-500/30 bg-sky-500/10 text-sky-300",
  enviado: "border border-blue-500/30 bg-blue-500/10 text-blue-300",
  entregue: "border border-gray-500/30 bg-gray-500/10 text-gray-300",
  cancelado: "border border-red-500/30 bg-red-500/10 text-red-300",
};

function formatarMoeda(valor) {
  if (typeof valor !== "number") return valor;
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PedidoCard({
  pedido,
  onVerDetalhes,
  onCancelar,
  onOcultar,
  cancelando,
}) {
  const statusKey = String(pedido.status || "").toLowerCase();
  const badgeClass =
    statusBadgeStyles[statusKey] ||
    "border border-white/10 bg-white/5 text-gray-200";

  const ehPendente = statusKey === "pendente";
  const ehCancelado = statusKey === "cancelado";

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#111118]/80 p-4">
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] text-gray-500">
              {pedido.numero}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {pedido.fornecedor}
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
          >
            {pedido.status}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Data do pedido:{" "}
          <span className="font-medium text-gray-200">{pedido.data}</span>
        </p>

        <p className="text-xs text-gray-400">
          Valor total:{" "}
          <span className="font-semibold text-primary">
            {formatarMoeda(pedido.valorTotal)}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onVerDetalhes}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-200 transition hover:border-white/30 hover:text-white"
        >
          Ver detalhes
        </button>

        {ehPendente && !!onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={cancelando}
            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelando ? "Cancelando..." : "Cancelar"}
          </button>
        )}

        {ehCancelado && !!onOcultar && (
          <button
            type="button"
            onClick={onOcultar}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-red-400/60 hover:text-red-300"
          >
            Remover da lista
          </button>
        )}
      </div>
    </div>
  );
}
