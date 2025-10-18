import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </svg>
    ),
    text: "Dashboard",
    path: "/loja/dashboard",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7h18M5 7v11a2 2 0 002 2h10a2 2 0 002-2V7M9 7V5a3 3 0 016 0v2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </svg>
    ),
    text: "Fornecedores",
    path: "/loja/fornecedores",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7h18M3 12h18M3 17h10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </svg>
    ),
    text: "Pedidos",
    path: "/loja/pedidos",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </svg>
    ),
    text: "Cashback",
    path: "/loja/cashback",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </svg>
    ),
    text: "Perfil",
    path: "/loja/perfil",
  },
];

export default function LojaLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initials = (user?.nome || "L").substring(0, 2).toUpperCase();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#06060A] text-gray-200">
      <div className="flex min-h-screen">
        {/* Overlay mobile */}
        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
            aria-label="Fechar navegação"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/5 bg-[#0E0E15]/90 p-6 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 text-lg font-semibold text-white shadow-[0_10px_30px_rgba(255,115,29,0.35)]">
                CC
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
                  Central
                </p>
                <p className="text-lg font-semibold text-white">Compras</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary/90 via-orange-500/80 to-orange-400/70 text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.6)]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="rounded-lg bg-white/5 p-2 text-current transition group-hover:bg-white/10">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                  <svg
                    className="ml-auto h-4 w-4 text-transparent transition group-hover:text-white/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 via-white/0 to-white/0 p-5 text-sm text-gray-300">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Campanhas Ativas
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                Explore promoções exclusivas
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Condições especiais por estado, cashback extra e fretes
                diferenciados para sua rede.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_15px_35px_-20px_rgba(255,115,29,0.8)]">
                Ver campanhas
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
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
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0E0E15]/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:text-white lg:hidden"
                  aria-label="Abrir navegação"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 6h16M4 12h16M4 18h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Central de Compras
                  </p>
                  <h1 className="text-lg font-semibold text-white">
                    Painel do Lojista
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden lg:flex">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="search"
                    placeholder="Buscar fornecedores, pedidos..."
                    className="h-11 w-72 rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                <button
                  type="button"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:text-white"
                >
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-white">
                      {user?.nome || "Lojista"}
                    </p>
                    <p className="text-xs text-gray-500">Rede Parceira</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-400 text-sm font-semibold text-white">
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:text-white"
                    aria-label="Sair"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#08080C] via-[#0E0E15] to-[#161623]">
            <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-8 sm:px-6 lg:px-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
