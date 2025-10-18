import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>{/* Add admin routes here */}</Route>
    </Routes>
  );
};

export default AdminRoutes;
