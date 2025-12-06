import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Configuracoes() {
  const { addToast } = useOutletContext() || { addToast: () => {} };
  const [settings, setSettings] = useState({
    notificacoes: true,
    sons: true,
    emailNotificacoes: true,
    tema: "escuro",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    addToast(`⚙️ ${key} ${!settings[key] ? "ativado" : "desativado"}`, "info");
  };

  const handleSave = () => {
    addToast("✅ Configurações salvas com sucesso!", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-gray-400 mt-2">
          Personalize suas preferências do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-surface rounded-xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notificações
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <span className="text-gray-300">Notificações Visuais</span>
              <button
                onClick={() => handleToggle("notificacoes")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notificacoes ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notificacoes ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <span className="text-gray-300">Efeitos Sonoros</span>
              <button
                onClick={() => handleToggle("sons")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sons ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sons ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <span className="text-gray-300">Notificações por Email</span>
              <button
                onClick={() => handleToggle("emailNotificacoes")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotificacoes ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotificacoes
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface rounded-xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            Aparência
          </h2>

          <div className="space-y-3">
            <label className="block">
              <span className="text-gray-300 text-sm mb-2 block">Tema</span>
              <select
                value={settings.tema}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, tema: e.target.value }))
                }
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="escuro">Escuro (Padrão)</option>
                <option value="claro">Claro</option>
                <option value="sistema">Sistema</option>
              </select>
            </label>
          </div>
        </div>

        <div className="bg-dark-surface rounded-xl p-6 border border-dark-border lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Informações do Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-dark-bg rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Versão</p>
              <p className="text-white text-lg font-semibold">1.0.0</p>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Status</p>
              <p className="text-emerald-400 text-lg font-semibold">Ativo</p>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg">
              <p className="text-gray-400 text-xs uppercase">
                Última Atualização
              </p>
              <p className="text-white text-lg font-semibold">Hoje</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Salvar Configurações
        </button>
        <button
          onClick={() =>
            addToast("⚙️ Configurações revertidas para padrão", "info")
          }
          className="flex items-center gap-2 px-6 py-3 bg-dark-border hover:bg-dark-border/80 text-gray-300 font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Restaurar Padrão
        </button>
      </div>
    </div>
  );
}
