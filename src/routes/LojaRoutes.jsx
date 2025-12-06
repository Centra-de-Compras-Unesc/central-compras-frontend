import React from "react";
import { Route } from "react-router-dom";

import LojaLayout from "../layouts/LojaLayout";
import Dashboard from "../pages/loja/Dashboard";
import Fornecedores from "../pages/loja/Fornecedores";
import Produtos from "../pages/loja/Produtos";
import Campanhas from "../pages/loja/Campanhas";
import PedidosHistorico from "../pages/loja/PedidosHistorico";
import Cashback from "../pages/loja/Cashback";
import Perfil from "../pages/loja/Perfil";
import Relatorios from "../pages/loja/Relatorios";
import Configuracoes from "../pages/loja/Configuracoes";

export const lojaRoutes = (
  <Route path="/loja" element={<LojaLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="fornecedores" element={<Fornecedores />} />
    <Route path="produtos" element={<Produtos />} />
    <Route path="campanhas" element={<Campanhas />} />
    <Route path="pedidos" element={<PedidosHistorico />} />
    <Route path="cashback" element={<Cashback />} />
    <Route path="perfil" element={<Perfil />} />
    <Route path="relatorios" element={<Relatorios />} />
    <Route path="configuracoes" element={<Configuracoes />} />
  </Route>
);
