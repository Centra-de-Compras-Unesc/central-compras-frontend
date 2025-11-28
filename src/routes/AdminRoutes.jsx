import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Lojas from "../pages/admin/Lojas";
import Fornecedores from "../pages/admin/Fornecedores";
import Produtos from "../pages/admin/Produtos";
import Usuarios from "../pages/admin/Usuarios";
import Configuracoes from "../pages/admin/Configuracoes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="lojas" element={<Lojas />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
