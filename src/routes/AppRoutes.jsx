import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import { lojaRoutes } from "./LojaRoutes";
import { useAuth } from "../contexts/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  // 🔒 Se o usuário não estiver logado, vai direto pro login
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 🟢 Se o usuário está logado, renderiza o conjunto de rotas da loja
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loja/dashboard" replace />} />
      {lojaRoutes}
      <Route path="*" element={<Navigate to="/loja/dashboard" replace />} />
    </Routes>
  );
}
