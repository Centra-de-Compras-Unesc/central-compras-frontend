import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ToastContainer from "../components/shared/ToastContainer";
import { useNotification } from "../hooks/useNotification";

const getInitial = (nome, email) =>
  (nome?.[0] || email?.[0] || "L").toUpperCase();

const MENU_ITEMS = [
  { to: "/loja/dashboard", label: "Dashboard", end: true },
  { to: "/loja/relatorios", label: "Relatórios" },
  { to: "/loja/fornecedores", label: "Fornecedores" },
  { to: "/loja/produtos", label: "Produtos" },
  { to: "/loja/campanhas", label: "Campanhas" },
  { to: "/loja/pedidos", label: "Pedidos" },
  { to: "/loja/cashback", label: "Cashback" },
  { to: "/loja/perfil", label: "Perfil" },
];

const DashboardIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const ReportsIcon = () => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const SupplierIcon = () => (
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
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const ProductIcon = () => (
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
      d="M3 7h18M3 12h18M3 17h18"
    />
  </svg>
);

const CampaignIcon = () => (
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
      d="M9 12h6m-7 4h8M5 8h14"
    />
  </svg>
);

const OrdersIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const CashbackIcon = () => (
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
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ProfileIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronLeftIcon = ({ isMinimized }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
      isMinimized ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const menuIcons = {
  0: DashboardIcon,
  1: ReportsIcon,
  2: SupplierIcon,
  3: ProductIcon,
  4: CampaignIcon,
  5: OrdersIcon,
  6: CashbackIcon,
  7: ProfileIcon,
};

export default function LojaLayout() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useNotification();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      <aside
        className={`${
          isMinimized ? "w-20" : "w-64"
        } bg-dark-surface border-r border-dark-border flex flex-col transition-all duration-300`}
      >
        <div className="p-4 border-b border-dark-border flex flex-col items-center gap-2">
          <div
            className={`flex items-center justify-center transition-all duration-300 ${
              isMinimized ? "hidden" : "block"
            }`}
          >
            <img
              src="/assets/centraldecompras.png"
              alt="Central de Compras"
              className="h-16 object-contain"
            />
          </div>
          <div
            className={`flex items-center justify-center transition-all duration-300 ${
              isMinimized ? "block" : "hidden"
            }`}
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg bg-dark-bg hover:bg-dark-border transition-colors"
            title={isMinimized ? "Expandir" : "Colapsar"}
          >
            <ChevronLeftIcon isMinimized={isMinimized} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {MENU_ITEMS.map((item, idx) => {
            const Icon = menuIcons[idx];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-dark-border"
                  } ${isMinimized ? "justify-center" : ""}`
                }
                title={isMinimized ? item.label : undefined}
              >
                <span className={isMinimized ? "transform scale-125" : ""}>
                  <Icon />
                </span>
                {!isMinimized && <span className="text-sm">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-400 font-medium">
                {getInitial(user?.nome, user?.email)}
              </span>
            </div>
            {!isMinimized && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.nome || user?.email || "Loja"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "loja@central.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-8">
          <span className="text-sm text-gray-400">Painel da Loja</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/loja/configuracoes")}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
              title="Configurações"
            >
              <SettingsIcon />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-dark-bg rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-sm font-medium">
                    {getInitial(user?.nome, user?.email)}
                  </span>
                </div>
                <ChevronDownIcon isOpen={showUserMenu} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-bg transition-colors"
                  >
                    <LogoutIcon />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet context={{ addToast }} />
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
