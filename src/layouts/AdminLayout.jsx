import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ToastContainer from "../components/shared/ToastContainer";
import { useNotification } from "../hooks/useNotification";

const getInitial = (nome, email) =>
  (nome?.[0] || email?.[0] || "A").toUpperCase();

const MENU_ITEMS = [
  { path: "/admin", text: "Dashboard", end: true },
  { path: "/admin/lojas", text: "Lojas" },
  { path: "/admin/fornecedores", text: "Fornecedores" },
  { path: "/admin/produtos", text: "Produtos" },
  { path: "/admin/usuarios", text: "Usuários" },
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
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const StoreIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const UsersIcon = () => (
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
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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

const ChevronLeftIcon = ({ isCollapsed }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${
      isCollapsed ? "rotate-0" : "rotate-180"
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
  1: StoreIcon,
  2: SupplierIcon,
  3: ProductIcon,
  4: UsersIcon,
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toasts, addToast, removeToast } = useNotification();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <aside
        className={`hidden sm:flex flex-col bg-dark-surface border-r border-dark-border transition-all duration-300 ${
          menuCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="border-b border-dark-border flex flex-col items-center justify-center py-4 px-3 relative">
          <div
            className={`flex items-center justify-center transition-all duration-300 ${
              menuCollapsed
                ? "opacity-0 scale-75 absolute"
                : "opacity-100 scale-100"
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
              menuCollapsed
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 absolute"
            }`}
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <button
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            className="mt-2 p-1.5 hover:bg-dark-bg rounded-lg transition-all"
            title={menuCollapsed ? "Expandir" : "Colapsar"}
          >
            <ChevronLeftIcon isCollapsed={menuCollapsed} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-2 flex-1">
          {MENU_ITEMS.map((item, idx) => {
            const Icon = menuIcons[idx];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={menuCollapsed ? item.text : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-dark-bg hover:text-white"
                  } ${menuCollapsed ? "justify-center" : ""}`
                }
              >
                <span className={menuCollapsed ? "transform scale-125" : ""}>
                  <Icon />
                </span>
                {!menuCollapsed && <span className="text-sm">{item.text}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400 font-medium">
                {getInitial(user?.nome, user?.email)}
              </span>
            </div>
            {!menuCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.nome || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "admin@central.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
          <span className="text-sm text-gray-400">Painel Administrativo</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/configuracoes")}
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
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 text-sm font-medium">
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
        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ addToast }} />
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
