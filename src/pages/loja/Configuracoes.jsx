import { useState, useEffect } from "react";

const CONFIG_KEY = "sistemConfig";

const defaultConfig = {
  tema: "escuro",
  notificacoes: true,
  som: false,
};

export default function Configuracoes() {
  const [config, setConfig] = useState(defaultConfig);
  const [salvo, setSalvo] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState("escuro");

  // Carregar config do localStorage e aplicar tema inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const configSalva = JSON.parse(saved);
        setConfig(configSalva);
        setTemaAtivo(configSalva.tema);
        aplicarTema(configSalva.tema);
      } else {
        setTemaAtivo("escuro");
      }
    } catch {
      console.error("Erro ao carregar configurações");
    }
  }, []);

  // Aplicar tema dinamicamente
  const aplicarTema = (tema) => {
    const html = document.documentElement;
    if (tema === "claro") {
      html.classList.add("light-mode");
      html.classList.remove("dark-mode");
      html.style.backgroundColor = "#ffffff";
      html.style.color = "#111827";
      document.body.style.backgroundColor = "#f9fafb";
      document.body.style.color = "#111827";
    } else {
      html.classList.remove("light-mode");
      html.classList.add("dark-mode");
      html.style.backgroundColor = "#0a0a0f";
      html.style.color = "#e5e7eb";
      document.body.style.backgroundColor = "#0a0a0f";
      document.body.style.color = "#e5e7eb";
    }
  };

  // Salvar config
  const handleSalvar = () => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));

      // Aplicar tema
      aplicarTema(config.tema);
      setTemaAtivo(config.tema);

      // Mostrar notificação
      setSalvo(true);

      // Som (se ativado)
      if (config.som) {
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg=="
          );
          audio.play().catch(() => {});
        } catch {
          // Audio não disponível
        }
      }

      setTimeout(() => setSalvo(false), 3000);
    } catch {
      alert("Erro ao salvar configurações");
    }
  };

  const handleToggle = (key) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    if (key === "tema") {
      aplicarTema(value);
      setTemaAtivo(value);
    }
  };

  // Cores dinâmicas baseadas no tema
  const colors = {
    cardBg: temaAtivo === "claro" ? "bg-white" : "bg-[#0f0f15]",
    cardBorder: temaAtivo === "claro" ? "border-gray-200" : "border-gray-800",
    itemBg: temaAtivo === "claro" ? "bg-gray-50" : "bg-[#1a1a22]",
    itemBorder: temaAtivo === "claro" ? "border-gray-200" : "border-gray-700",
    textPrimary: temaAtivo === "claro" ? "text-gray-900" : "text-white",
    textSecondary: temaAtivo === "claro" ? "text-gray-600" : "text-gray-400",
    inputBg: temaAtivo === "claro" ? "bg-gray-50" : "bg-[#25252d]",
    inputBorder: temaAtivo === "claro" ? "border-gray-300" : "border-gray-700",
  };

  return (
    <>
      {/* NOTIFICAÇÃO FIXA NO TOPO */}
      {salvo && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 shadow-lg animate-pulse">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">
            ✓ Configurações alteradas com sucesso!
          </span>
        </div>
      )}

      <div className={`max-w-3xl mx-auto space-y-6 px-4 py-6`}>
        {/* HEADER */}
        <div className="mb-6">
          <h1 className={`font-bold text-3xl mb-2 ${colors.textPrimary}`}>
            ⚙️ Configurações
          </h1>
          <p className={`text-sm ${colors.textSecondary}`}>
            Personalize sua experiência no sistema
          </p>
        </div>

        {/* SEÇÃO 1: APARÊNCIA */}
        <div
          className={`${colors.cardBg} border-2 ${colors.cardBorder} rounded-xl p-5 shadow-md`}
        >
          <h2
            className={`${colors.textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
          >
            🎨 Aparência
          </h2>

          <div className="space-y-3">
            {/* Tema */}
            <div
              className={`flex items-center justify-between rounded-lg p-3 ${colors.itemBg} border ${colors.itemBorder} hover:border-orange-400 transition-all`}
            >
              <div className="flex-1">
                <p className={`${colors.textPrimary} font-medium text-sm`}>
                  Tema
                </p>
                <p className={`${colors.textSecondary} text-xs`}>
                  Claro ou Escuro
                </p>
              </div>
              <select
                value={config.tema}
                onChange={(e) => handleChange("tema", e.target.value)}
                className={`${colors.inputBg} ${colors.inputBorder} border rounded-lg px-3 py-2 text-sm ${colors.textPrimary} font-medium transition-colors hover:border-orange-400`}
              >
                <option value="escuro">🌙 Escuro</option>
                <option value="claro">☀️ Claro</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: NOTIFICAÇÕES */}
        <div
          className={`${colors.cardBg} border-2 ${colors.cardBorder} rounded-xl p-5 shadow-md`}
        >
          <h2
            className={`${colors.textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
          >
            🔔 Notificações
          </h2>

          <div className="space-y-3">
            {/* Notificações Visuais */}
            <div
              className={`flex items-center justify-between rounded-lg p-3 ${colors.itemBg} border ${colors.itemBorder} hover:border-orange-400 transition-all`}
            >
              <div className="flex-1">
                <p className={`${colors.textPrimary} font-medium text-sm`}>
                  Notificações Visuais
                </p>
                <p className={`${colors.textSecondary} text-xs`}>
                  Alertas na tela
                </p>
              </div>
              <button
                onClick={() => handleToggle("notificacoes")}
                className={`relative inline-flex items-center rounded-full h-6 w-11 transition-colors ${
                  config.notificacoes ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    config.notificacoes ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Som */}
            <div
              className={`flex items-center justify-between rounded-lg p-3 ${colors.itemBg} border ${colors.itemBorder} hover:border-orange-400 transition-all`}
            >
              <div className="flex-1">
                <p className={`${colors.textPrimary} font-medium text-sm`}>
                  Som
                </p>
                <p className={`${colors.textSecondary} text-xs`}>
                  Efeitos sonoros
                </p>
              </div>
              <button
                onClick={() => handleToggle("som")}
                className={`relative inline-flex items-center rounded-full h-6 w-11 transition-colors ${
                  config.som ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    config.som ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: SISTEMA */}
        <div
          className={`${colors.cardBg} border-2 ${colors.cardBorder} rounded-xl p-5 shadow-md`}
        >
          <h2
            className={`${colors.textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
          >
            ℹ️ Sistema
          </h2>

          <div className="space-y-2 text-sm">
            <div
              className={`flex justify-between rounded-lg p-2.5 ${colors.itemBg} border ${colors.itemBorder}`}
            >
              <span className={`${colors.textSecondary}`}>Versão</span>
              <span className={`${colors.textPrimary} font-medium`}>1.0.0</span>
            </div>
            <div
              className={`flex justify-between rounded-lg p-2.5 ${colors.itemBg} border ${colors.itemBorder}`}
            >
              <span className={`${colors.textSecondary}`}>Ambiente</span>
              <span className={`${colors.textPrimary} font-medium`}>
                Produção
              </span>
            </div>
            <div
              className={`flex justify-between rounded-lg p-2.5 ${colors.itemBg} border ${colors.itemBorder}`}
            >
              <span className={`${colors.textSecondary}`}>API</span>
              <span className={`${colors.textPrimary} font-medium text-xs`}>
                localhost:3000
              </span>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSalvar}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            💾 Salvar Configurações
          </button>
          <button
            onClick={() => {
              setConfig(defaultConfig);
              aplicarTema("escuro");
              setTemaAtivo("escuro");
            }}
            className={`flex-1 font-semibold py-3 rounded-lg transition-all shadow-lg ${
              temaAtivo === "claro"
                ? "bg-gray-300 hover:bg-gray-400 text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            🔄 Restaurar Padrão
          </button>
        </div>

        {/* DICA */}
        <div
          className={`border rounded-lg p-4 text-sm ${
            temaAtivo === "claro"
              ? "bg-blue-50 border-blue-300 text-blue-900"
              : "bg-blue-500/10 border-blue-500/50 text-blue-200"
          }`}
        >
          <strong>💡 Dica:</strong> Suas configurações são salvas localmente no
          navegador e serão lembradas na próxima vez que você acessar
        </div>
      </div>
    </>
  );
}
