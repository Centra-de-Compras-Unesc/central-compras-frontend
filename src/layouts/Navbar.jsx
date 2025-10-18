import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Central de Compras</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/login" className="nav-link">
          Login & Cadastro
        </Link>
        <Link to="/lojista" className="nav-link">
          Lojista
        </Link>
        <Link to="/fornecedor" className="nav-link">
          Fornecedor
        </Link>
        <Link to="/administrador" className="nav-link">
          Administrador
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
