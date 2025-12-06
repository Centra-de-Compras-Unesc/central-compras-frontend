import React from "react";
import { Routes, Route } from "react-router-dom";
import FornecedorLayout from "../layouts/FornecedorLayout";

import Dashboard from "../pages/fornecedor/Dashboard";
import Pedidos from "../pages/fornecedor/Pedidos";
import Produtos from "../pages/fornecedor/Produtos";
import Campanhas from "../pages/fornecedor/Campanhas";
import Condicoes from "../pages/fornecedor/Condicoes";
import Configuracoes from "../pages/fornecedor/Configuracoes";

const FornecedorRoutes = () => {
  return (
    <Routes>
      <Route element={<FornecedorLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="campanhas" element={<Campanhas />} />
        <Route path="condicoes" element={<Condicoes />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
};

export default FornecedorRoutes;
