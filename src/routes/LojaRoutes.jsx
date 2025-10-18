import React from "react";
import { Routes, Route } from "react-router-dom";

import LojaLayout from "../layouts/LojaLayout";
import Dashboard from "../pages/loja/Dashboard";
import Fornecedores from "../pages/loja/Fornecedores";
import PedidosHistorico from "../pages/loja/PedidosHistorico";
import Cashback from "../pages/loja/Cashback";
import Perfil from "../pages/loja/Perfil";

const LojaRoutes = () => {
  return (
    <Routes>
      <Route element={<LojaLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="pedidos" element={<PedidosHistorico />} />
        <Route path="cashback" element={<Cashback />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
};

export default LojaRoutes;
