import React from "react";
import PropTypes from "prop-types";

export default function FornecedorCard({ fornecedor, onVerProdutos }) {
  const { nome, logo, descricao, categoria, cashback, pedidoMinimo } = fornecedor;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#14141B]/80 p-5 transition hover:border-orange-500/40 hover:shadow-[0_24px_60px_-30px_rgba(255,115,29,0.7)]">
      <div className="pointer-events-none absolute -right-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {logo ? (
              <img
                src={logo}
                alt={nome}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-400">
                {nome.substring(0, 2)}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{nome}</h3>
              {categoria && (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-gray-300">
                  {categoria}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-md text-sm text-gray-400">{descricao}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-300">
              {cashback && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Cashback {cashback}
                </span>
              )}
              {pedidoMinimo && (
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-semibold text-orange-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Pedido mínimo {pedidoMinimo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <button
            onClick={() => onVerProdutos(fornecedor)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.7)] transition hover:shadow-[0_28px_60px_-24px_rgba(255,115,29,0.85)]"
          >
            Ver produtos
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 transition hover:text-white">
            Contato rápido
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

FornecedorCard.propTypes = {
  fornecedor: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    logo: PropTypes.string,
    descricao: PropTypes.string.isRequired,
    categoria: PropTypes.string,
    cashback: PropTypes.string,
    pedidoMinimo: PropTypes.string,
  }).isRequired,
  onVerProdutos: PropTypes.func.isRequired,
};
