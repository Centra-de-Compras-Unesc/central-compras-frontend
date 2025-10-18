import React from "react";

const dadosPerfil = {
  nomeLoja: "Loja Horizon",
  responsavel: "Ana Souza",
  email: "ana.souza@horizon.com",
  telefone: "+55 (47) 99876-5432",
  endereco: "Rua das Flores, 120 - Centro, Joinville - SC",
  segmento: "Materiais de construção",
};

export default function PerfilLojista() {
  return (
    <div className="space-y-10 text-gray-200">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Perfil da loja
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Dados cadastrais e credenciais de acesso
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Atualize informações da sua loja, responsável e contatos para
            garantir comunicação fluida com os fornecedores.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#14141C]/80 p-6">
            <h2 className="text-xl font-semibold text-white">Informações principais</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Nome da loja
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {dadosPerfil.nomeLoja}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Responsável
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {dadosPerfil.responsavel}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Telefone
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {dadosPerfil.telefone}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Segmento
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {dadosPerfil.segmento}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#14141C]/80 p-6">
            <h2 className="text-xl font-semibold text-white">Credenciais e contato</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                Email comercial
                <input
                  type="email"
                  defaultValue={dadosPerfil.email}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                Telefone principal
                <input
                  type="tel"
                  defaultValue={dadosPerfil.telefone}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 sm:col-span-2">
                Endereço completo
                <textarea
                  rows="3"
                  defaultValue={dadosPerfil.endereco}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-300 transition hover:border-orange-500/50 hover:text-white">
                Cancelar alterações
              </button>
              <button className="rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.7)] transition hover:shadow-[0_28px_60px_-24px_rgba(255,115,29,0.85)]">
                Salvar informações
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#181820] via-[#12121A] to-[#0B0B10] p-6">
            <h2 className="text-xl font-semibold text-white">Equipe e acessos</h2>
            <p className="mt-2 text-sm text-gray-400">
              Gere credenciais para televendas e equipe comercial, com níveis de
              permissão e auditoria de ações.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-300 transition hover:border-orange-500/40 hover:text-white">
              Gerar nova credencial
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 5v14m-7-7h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="rounded-3xl border border-dashed border-orange-500/40 bg-orange-500/5 p-6 text-sm text-orange-200">
            <h3 className="text-lg font-semibold text-orange-300">
              Checklist de atualização
            </h3>
            <ul className="mt-3 space-y-2">
              <li>• Revise contatos a cada 30 dias</li>
              <li>• Alinhe horários de recebimento com fornecedores</li>
              <li>• Garanta que a equipe possua acessos individuais</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
