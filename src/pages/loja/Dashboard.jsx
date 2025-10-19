import React from "react";
import DataCard from "../../components/shared/DataCard";

const dadosGerais = [
  {
    id: 1,
    titulo: "TOTAL DE PEDIDOS",
    valor: "532",
    variacao: "+8%",
  },
  {
    id: 2,
    titulo: "CASHBACK DISPONÍVEL",
    valor: "R$ 2.580,30",
    variacao: "+15%",
  },
  {
    id: 3,
    titulo: "PEDIDOS EM ANDAMENTO",
    valor: "16",
    variacao: "+3%",
  },
  {
    id: 4,
    titulo: "FORNECEDORES ATIVOS",
    valor: "24",
    variacao: "+2%",
  },
];

const campanhas = [
  {
    id: 1,
    titulo: "Campanha de Verão",
    descricao:
      "Cashback extra de 10% em tintas premium para pedidos acima de R$ 5.000",
    duracao: "Até 05/03/2024",
    fornecedor: "Quartzlit",
    destaque: "Cashback +10%",
    gradient: "from-orange-500/70 via-orange-500/10 to-transparent",
  },
  {
    id: 2,
    titulo: "Liquidação Eletro",
    descricao: "Frete subsidiado + bonificação em pedidos de linha branca",
    duracao: "Até 20/04/2024",
    fornecedor: "Office Plus",
    destaque: "Frete 50% off",
    gradient: "from-amber-400/60 via-amber-400/10 to-transparent",
  },
];

const ultimosPedidos = [
  {
    id: "123456",
    data: "2023-10-18",
    fornecedor: "Quartzlit",
    status: "Em andamento",
    valor: 1580.0,
  },
  {
    id: "123455",
    data: "2023-10-17",
    fornecedor: "Gerdau",
    status: "Entregue",
    valor: 2340.0,
  },
  {
    id: "123454",
    data: "2023-10-15",
    fornecedor: "Krona",
    status: "Separado",
    valor: 980.5,
  },
];

const topFornecedores = [
  {
    nome: "Quartzlit",
    categoria: "Materiais de construção",
    crescimento: "+21%",
  },
  {
    nome: "Gerdau",
    categoria: "Ferragens",
    crescimento: "+14%",
  },
  {
    nome: "Krona",
    categoria: "Material hidráulico",
    crescimento: "+11%",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const statusStyles = {
  Entregue: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  "Em andamento": "border border-amber-500/20 bg-amber-500/10 text-amber-300",
  Separado: "border border-blue-500/20 bg-blue-500/10 text-blue-300",
};

export default function Dashboard() {
  return (
    <div className="space-y-10 text-gray-200">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Visão geral
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Central de Compras • Loja Horizon
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Acompanhe o desempenho da sua loja, campanhas promocionais e o
            status dos pedidos em tempo real.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-orange-500/60 hover:text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                d="M5 5h14M5 12h14M5 19h14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Relatórios
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.7)] transition hover:shadow-[0_28px_60px_-24px_rgba(255,115,29,0.85)]">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 5v14m-7-7h14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Novo Pedido
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dadosGerais.map((dado) => (
          <DataCard
            key={dado.id}
            title={dado.titulo}
            value={dado.valor}
            change={dado.variacao}
          />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#14141C] via-[#0F0F15] to-[#09090F] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Histórico de Pedidos
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Volume mensal de pedidos
                </h2>
              </div>
              <button className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-orange-500/40 hover:text-white">
                Últimos 12 meses
              </button>
            </div>
            <div className="mt-8 h-64 rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,_rgba(255,115,29,0.18),_transparent_55%),_linear-gradient(180deg,_rgba(12,12,20,0.65),_rgba(8,8,14,0.9))] p-4">
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                Gráfico interativo será exibido aqui
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#111118]/80">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Últimos pedidos
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Acompanhe o status de cada pedido
                </h2>
              </div>
              <button className="text-xs font-semibold text-orange-400 transition hover:text-orange-300">
                Ver todos
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.25em] text-gray-500">
                    <th className="px-6 py-4 font-medium">Pedido</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium">Fornecedor</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Valor</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {ultimosPedidos.map((pedido) => (
                    <tr key={pedido.id} className="transition hover:bg-white/5">
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-white">
                        #{pedido.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(pedido.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-white/80">
                        {pedido.fornecedor}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[pedido.status] ||
                            "border border-gray-500/20 bg-gray-500/10 text-gray-300"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {pedido.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-white">
                        {formatCurrency(pedido.valor)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-semibold text-orange-400 transition hover:text-orange-300">
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#181820] via-[#12121A] to-[#0A0A10] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Campanhas em destaque
            </p>
            <div className="mt-6 space-y-4">
              {campanhas.map((campanha) => (
                <div
                  key={campanha.id}
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${campanha.gradient}`}
                  />
                  <div className="relative flex flex-col gap-3">
                    <span className="inline-flex w-max items-center rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                      {campanha.destaque}
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {campanha.titulo}
                    </h3>
                    <p className="text-sm text-gray-200/80">
                      {campanha.descricao}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span>{campanha.fornecedor}</span>
                      <span>{campanha.duracao}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#111118]/90 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Top fornecedores
            </p>
            <ul className="mt-6 space-y-4">
              {topFornecedores.map((fornecedor) => (
                <li
                  key={fornecedor.nome}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {fornecedor.nome}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fornecedor.categoria}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {fornecedor.crescimento}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl border border-dashed border-orange-500/40 bg-orange-500/5 p-6 text-sm text-orange-200">
            <h3 className="text-lg font-semibold text-orange-300">
              Condições comerciais regionais
            </h3>
            <p className="mt-2 text-sm">
              Aplique automaticamente cashback, prazos e acréscimos definidos
              pelos fornecedores para cada estado. Reduza erros e acelere a
              negociação.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 hover:text-orange-200">
              Ajustar regras
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
