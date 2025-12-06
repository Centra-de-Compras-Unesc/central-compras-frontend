import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [detalheCampanha, setDetalheCampanha] = useState(null);

  useEffect(() => {
    carregarCampanhas();
  }, []);

  async function carregarCampanhas() {
    try {
      setLoading(true);
      setErro("");
      const data = await api("/campanhas");
      const campanhasAtivas = (Array.isArray(data) ? data : []).filter(
        (c) => c.ativa !== false
      );
      setCampanhas(campanhasAtivas);
    } catch (e) {
      setErro("Não foi possível carregar as campanhas");
    } finally {
      setLoading(false);
    }
  }

  const campanhasFiltradas = campanhas.filter((c) => {
    if (filtroAtivo === "ativas") return c.ativa !== false;
    if (filtroAtivo === "inativas") return c.ativa === false;
    return true;
  });

  const formatarData = (data) => {
    if (!data) return "Não informado";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor) => {
    if (!valor) return "—";
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-200">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Promoções Disponíveis
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Campanhas dos Fornecedores
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">
          Visualize as campanhas e promoções disponíveis de seus fornecedores.
          Aproveite os cashbacks e descontos oferecidos.
        </p>
      </header>

      {erro && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {erro}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setFiltroAtivo("todos")}
          className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
            filtroAtivo === "todos"
              ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.65)]"
              : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltroAtivo("ativas")}
          className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
            filtroAtivo === "ativas"
              ? "bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.65)]"
              : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Ativas
        </button>
      </div>

      {campanhasFiltradas.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-400">
            {erro
              ? "Não foi possível carregar as campanhas"
              : "Nenhuma campanha disponível no momento"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campanhasFiltradas.map((campanha) => (
            <div
              key={campanha.id}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#14141B]/80 transition hover:border-orange-500/40 hover:shadow-[0_24px_60px_-30px_rgba(255,115,29,0.7)]"
            >
              <div className="pointer-events-none absolute -right-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {campanha.descricao_campanha ||
                        `Campanha #${campanha.id}`}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {campanha.tb_fornecedor?.nome_fantasia ||
                        `Fornecedor #${campanha.id_fornecedor}`}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      campanha.ativa
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border border-gray-500/30 bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {campanha.ativa ? "Ativa" : "Inativa"}
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="font-medium text-white capitalize">
                      {campanha.tipo || "—"}
                    </span>
                  </div>
                  {campanha.percentual_cashback_campanha && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cashback:</span>
                      <span className="font-semibold text-emerald-400">
                        {campanha.percentual_cashback_campanha}%
                      </span>
                    </div>
                  )}
                  {campanha.valor_meta && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Meta de Valor:</span>
                      <span className="font-medium text-white">
                        {formatarMoeda(campanha.valor_meta)}
                      </span>
                    </div>
                  )}
                  {campanha.quantidade_meta && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Meta de Qtd:</span>
                      <span className="font-medium text-white">
                        {campanha.quantidade_meta} un.
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Início:</span>
                    <span>{formatarData(campanha.dt_inicio)}</span>
                  </div>
                  {campanha.dt_fim && (
                    <div className="flex justify-between">
                      <span>Término:</span>
                      <span>{formatarData(campanha.dt_fim)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setDetalheCampanha(campanha)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {detalheCampanha && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={() => setDetalheCampanha(null)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-[#050509]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {detalheCampanha.descricao_campanha || "Campanha"}
              </h2>
              <button
                onClick={() => setDetalheCampanha(null)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Informações Gerais
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fornecedor:</span>
                      <span className="font-medium text-white">
                        {detalheCampanha.tb_fornecedor?.nome_fantasia ||
                          `Fornecedor #${detalheCampanha.id_fornecedor}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          detalheCampanha.ativa
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      >
                        {detalheCampanha.ativa ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="font-medium text-white capitalize">
                        {detalheCampanha.tipo || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">
                    Benefícios
                  </p>
                  <div className="space-y-2">
                    {detalheCampanha.percentual_cashback_campanha && (
                      <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-gray-400">Cashback:</span>
                        <span className="font-semibold text-emerald-400">
                          {detalheCampanha.percentual_cashback_campanha}%
                        </span>
                      </div>
                    )}
                    {detalheCampanha.valor_meta && (
                      <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-gray-400">Meta de Valor:</span>
                        <span className="font-medium text-white">
                          {formatarMoeda(detalheCampanha.valor_meta)}
                        </span>
                      </div>
                    )}
                    {detalheCampanha.quantidade_meta && (
                      <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-gray-400">
                          Meta de Quantidade:
                        </span>
                        <span className="font-medium text-white">
                          {detalheCampanha.quantidade_meta} unidades
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">
                    Período
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                      <span className="text-gray-400">Início:</span>
                      <span className="font-medium text-white">
                        {formatarData(detalheCampanha.dt_inicio)}
                      </span>
                    </div>
                    {detalheCampanha.dt_fim && (
                      <div className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-gray-400">Término:</span>
                        <span className="font-medium text-white">
                          {formatarData(detalheCampanha.dt_fim)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetalheCampanha(null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
