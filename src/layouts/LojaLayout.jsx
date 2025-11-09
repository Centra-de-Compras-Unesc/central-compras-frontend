import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout as mockLogout } from "../utils/mockAuth";

const STORAGE_KEY = "userProfile";

export default function LojaLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState("");

  // Carrega avatar salvo no perfil
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem(STORAGE_KEY);
      if (savedStr) {
        const savedObj = JSON.parse(savedStr);
        if (savedObj?.avatarUrl) {
          setAvatarUrl(savedObj.avatarUrl);
        }
      }
    } catch (e) {
      console.error("Erro ao ler perfil do localStorage", e);
    }
  }, []);

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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      text: "Dashboard",
      path: "/loja/dashboard",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      text: "Fornecedores",
      path: "/loja/fornecedores",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
      text: "Produtos",
      path: "/loja/produtos",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M5 8h14" />
        </svg>
      ),
      text: "Campanhas",
      path: "/loja/campanhas",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      text: "Pedidos",
      path: "/loja/pedidos",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Cashback",
      path: "/loja/cashback",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      text: "Perfil",
      path: "/loja/perfil",
    },
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      {/* Sidebar */}
      <div className="hidden sm:block w-64 bg-dark-surface border-r border-dark-border">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-dark-border">
          <h1 className="text-xl font-bold text-primary">Central de Compras</h1>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span className="ml-3">{item.text}</span>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold">Central de Compras</h1>
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
              <span className="text-sm text-dark-text/80">{user?.nome}</span>
              <button onClick={handleLogout} className="btn-primary bg-primary/90 hover:bg-primary">
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
          onClick={() => document.getElementById("mobile-drawer")?.classList.add("hidden")}
        ></div>
        <div className="absolute left-0 top-0 h-full w-64 bg-dark-surface border-r border-dark-border p-2">
          <div className="px-4 py-4 border-b border-dark-border flex items-center justify-between">
            <span className="text-primary font-semibold">Menu</span>
            <button
              aria-label="Fechar"
              className="p-2"
              onClick={() => document.getElementById("mobile-drawer")?.classList.add("hidden")}
            >
              ✕
            </button>
          </div>
          <nav className="mt-2 flex flex-col gap-1 px-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => document.getElementById("mobile-drawer")?.classList.add("hidden")}
                className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
              >
                {item.icon}
                <span className="ml-3">{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
