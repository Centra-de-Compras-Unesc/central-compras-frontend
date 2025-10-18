import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
      <Outlet />
    </div>
  );
}
