import React from "react";

const campanhasCashback = [
  {
    id: 1,
    titulo: "Cashback Santa Catarina",
    descricao:
      "Pedidos acima de R$ 5.000 recebem 10% de cashback e acréscimo de R$ 2,00 por unidade.",
    vigencia: "Válido até 30/04/2024",
    fornecedor: "Fornecedor XYZ",
    estado: "SC",
  },
  {
    id: 2,
    titulo: "Campanha Nordeste",
    descricao:
      "Cashback progressivo para pedidos de iluminação com prazo estendido em 15 dias.",
    vigencia: "Válido até 12/05/2024",
    fornecedor: "Ilumitech",
    estado: "PE",
  },
];

export default function CashbackLojista() {
  return (
    <div className="space-y-10 text-gray-200">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Benefícios e cashback
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Regras inteligentes por estado e fornecedor
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Visualize os benefícios ativos para a sua loja, com aplicação
            automática das condições comerciais configuradas pelos
            fornecedores.
          </p>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { titulo: "Cashback disponível", valor: "R$ 2.580,30" },
          { titulo: "Campanhas ativas", valor: "08" },
          { titulo: "Pedidos bonificados", valor: "37" },
          { titulo: "Economia acumulada", valor: "R$ 18.400,00" },
        ].map((card) => (
          <div
            key={card.titulo}
            className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#181820] via-[#13131B] to-[#0B0B10] p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              {card.titulo}
            </p>
            <span className="mt-4 block text-2xl font-semibold text-white">
              {card.valor}
            </span>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-white/5 bg-[#12121A]/80 p-6">
            <h2 className="text-xl font-semibold text-white">
              Condições personalizadas por estado
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Configure regras específicas de cashback, prazos e acréscimos de
              acordo com a região da loja. Ao finalizar o pedido, o sistema
              aplica automaticamente os ajustes definidos pelo fornecedor.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Exemplo SC
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>
                    <span className="font-semibold text-white">Cashback:</span> 10%
                  </li>
                  <li>
                    <span className="font-semibold text-white">Prazo:</span> 45 dias
                  </li>
                  <li>
                    <span className="font-semibold text-white">Acréscimo:</span> R$ 2,00 por unidade
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Exemplo SP
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>
                    <span className="font-semibold text-white">Cashback:</span> 5%
                  </li>
                  <li>
                    <span className="font-semibold text-white">Prazo:</span> 30 dias
                  </li>
                  <li>
                    <span className="font-semibold text-white">Desconto:</span> R$ 1,50 por unidade
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#181820] via-[#12121A] to-[#0B0B10] p-6">
            <h2 className="text-xl font-semibold text-white">Campanhas em vigor</h2>
            <div className="mt-4 space-y-4">
              {campanhasCashback.map((campanha) => (
                <div
                  key={campanha.id}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-500">
                    <span>{campanha.estado}</span>
                    <span>{campanha.vigencia}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {campanha.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    {campanha.descricao}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
                    {campanha.fornecedor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
