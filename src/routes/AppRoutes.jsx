import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminRoutes from "./AdminRoutes";
import LojaRoutes from "./LojaRoutes";
import FornecedorRoutes from "./FornecedorRoutes";
import { getUserType } from "../utils/mockAuth";

const AppRoutes = () => {
  const userType = getUserType(); // retorna "admin", "lojista", "fornecedor" ou null

  if (!userType) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const homePathByType = {
    admin: "/admin",
    lojista: "/loja",
    fornecedor: "/fornecedor",
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homePathByType[userType]} />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/loja/*" element={<LojaRoutes />} />
      <Route path="/fornecedor/*" element={<FornecedorRoutes />} />
      <Route path="*" element={<Navigate to={homePathByType[userType]} />} />
    </Routes>
  );
};

export default AppRoutes;
