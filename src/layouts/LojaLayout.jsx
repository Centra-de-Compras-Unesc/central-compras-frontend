import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout as mockLogout } from "../utils/mockAuth";
import SystemIcon from "../components/shared/SystemIcon";

export default function LojaLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [menuColapsed, setMenuColapsed] = useState(false);

  const showFullMenu = !menuColapsed;

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  const handleLogout = () => {
    try {
      mockLogout();
    } finally {
      if (typeof logout === "function") logout();
      navigate("/");
    }
  };

  const menuItems = [
    {
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      text: "Dashboard",
      path: "/loja/dashboard",
    },
    {
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      text: "Relatórios",
      path: "/loja/relatorios",
    },
    {
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      text: "Fornecedores",
      path: "/loja/fornecedores",
    },
    {
      icon: (
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
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      ),
      text: "Produtos",
      path: "/loja/produtos",
    },
    {
      icon: (
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
            d="M9 12h6m-7 4h8M5 8h14"
          />
        </svg>
      ),
      text: "Campanhas",
      path: "/loja/campanhas",
    },
    {
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      text: "Pedidos",
      path: "/loja/pedidos",
    },
    {
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      text: "Cashback",
      path: "/loja/cashback",
    },
    {
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      text: "Perfil",
      path: "/loja/perfil",
    },
    {
      icon: (
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
      ),
      text: "Configurações",
      path: "/loja/configuracoes",
    },
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      {/* Sidebar */}
      <div
        className={`hidden sm:flex flex-col bg-dark-surface border-r border-dark-border transition-all duration-300 ${
          showFullMenu ? "w-64" : "w-20"
        }`}
      >
        {/* Logo / Ícone */}
        <div
          className={`border-b border-dark-border flex items-center justify-between ${
            showFullMenu ? "px-6" : "px-0"
          } py-5`}
        >
          {showFullMenu ? (
            <h1 className="text-lg font-bold text-primary">Central</h1>
          ) : (
            <span className="text-lg font-bold text-primary text-center w-full">
              C
            </span>
          )}
          <button
            onClick={() => setMenuColapsed(!menuColapsed)}
            className="p-1 hover:bg-dark-bg rounded transition"
            title={menuColapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                menuColapsed ? "rotate-0" : "rotate-180"
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
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1 px-2 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={menuColapsed ? item.text : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-dark-bg hover:text-white"
                } ${menuColapsed ? "justify-center" : ""}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {showFullMenu && (
                <span className="text-sm font-medium">{item.text}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-dark-surface border-b border-dark-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="Abrir menu"
                className="sm:hidden p-2 rounded bg-dark-bg border border-dark-border"
                onClick={() => {
                  const el = document.getElementById("mobile-drawer");
                  if (el) el.classList.remove("hidden");
                }}
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <img
                src="/assets/centraldecompras.png"
                alt="Central de Compras"
                className="h-14"
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Avatar ao lado do botão sair */}
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Avatar do usuário"
                  className="w-8 h-8 rounded-full object-cover border border-dark-border"
                />
              )}
              <span className="text-sm text-dark-text/80">
                {user?.nome || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-primary bg-primary/90 hover:bg-primary"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <div id="mobile-drawer" className="hidden fixed inset-0 z-50 sm:hidden">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() =>
            document.getElementById("mobile-drawer")?.classList.add("hidden")
          }
        ></div>
        <div className="absolute left-0 top-0 h-full w-64 bg-dark-surface border-r border-dark-border p-2">
          <div className="px-4 py-4 border-b border-dark-border flex items-center justify-between">
            <span className="text-primary font-semibold">Menu</span>
            <button
              aria-label="Fechar"
              className="p-2"
              onClick={() =>
                document
                  .getElementById("mobile-drawer")
                  ?.classList.add("hidden")
              }
            >
              ✕
            </button>
          </div>
          <nav className="mt-2 flex flex-col gap-1 px-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  document
                    .getElementById("mobile-drawer")
                    ?.classList.add("hidden")
                }
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "active" : ""}`
                }
              >
                {item.icon}
                {showFullMenu && <span className="ml-3">{item.text}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
