import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-black p-4">
      <h1 className="text-orange-500 text-xl font-bold mb-6">
        Central de Compras
      </h1>
      <nav className="flex flex-col gap-4">
        <NavLink to="/loja/dashboard" className="hover:text-orange-300">
          Dashboard
        </NavLink>
        <NavLink to="/loja/fornecedores" className="hover:text-orange-300">
          Fornecedores
        </NavLink>
        <NavLink to="/loja/pedidos" className="hover:text-orange-300">
          Pedidos
        </NavLink>
        <NavLink to="/loja/cashback" className="hover:text-orange-300">
          Cashback
        </NavLink>
        <NavLink to="/loja/perfil" className="hover:text-orange-300">
          Perfil
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
