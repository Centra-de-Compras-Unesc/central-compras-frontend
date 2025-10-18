import React from "react";
import { Routes, Route } from "react-router-dom";
import FornecedorLayout from "../layouts/FornecedorLayout";

const FornecedorRoutes = () => {
  return (
    <Routes>
      <Route element={<FornecedorLayout />}>
        {/* Add fornecedor routes here */}
      </Route>
    </Routes>
  );
};

export default FornecedorRoutes;
