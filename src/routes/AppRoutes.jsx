import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { lojaRoutes } from "./LojaRoutes";
import AdminRoutes from "./AdminRoutes";
import FornecedorRoutes from "./FornecedorRoutes";
import { useAuth } from "../contexts/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  // 🔒 Se o usuário não estiver logado, vai direto pro login
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Determinar rota inicial baseada no perfil
  const getDefaultRoute = () => {
    const perfil = user.perfil || "loja";
    switch (perfil) {
      case "admin":
        return "/admin";
      case "fornecedor":
        return "/fornecedor";
      default:
        return "/loja/dashboard";
    }
  };

  // 🟢 Se o usuário está logado, renderiza rotas baseadas no perfil
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Rotas da Loja */}
      {lojaRoutes}

      {/* Rotas do Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Rotas do Fornecedor */}
      <Route path="/fornecedor/*" element={<FornecedorRoutes />} />

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}
