import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import PainelAdmin from "../pages/Admin";
import PainelLojista from "../pages/Lojista";
import PainelFornecedor from "../pages/Fornecedor";
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

  const routes = {
    admin: <PainelAdmin />,
    lojista: <PainelLojista />,
    fornecedor: <PainelFornecedor />,
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${userType}`} />} />
      <Route path="/admin" element={routes.admin} />
      <Route path="/lojista" element={routes.lojista} />
      <Route path="/fornecedor" element={routes.fornecedor} />
      <Route path="*" element={<Navigate to={`/${userType}`} />} />
    </Routes>
  );
};

export default AppRoutes;
