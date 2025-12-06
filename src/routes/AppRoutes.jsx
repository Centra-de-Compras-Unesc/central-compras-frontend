import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { lojaRoutes } from "./LojaRoutes";
import AdminRoutes from "./AdminRoutes";
import FornecedorRoutes from "./FornecedorRoutes";
import { useAuth } from "../contexts/AuthContext";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  // Mostra loading enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

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

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {lojaRoutes}

      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route path="/fornecedor/*" element={<FornecedorRoutes />} />

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}
