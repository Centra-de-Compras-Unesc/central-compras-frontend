import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 Carrega o usuário do localStorage (mantém login ao atualizar a página)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (token && email) {
      setUser({ nome: email, token });
    }
  }, []);

  // ✅ Faz login e atualiza contexto + localStorage
  const login = (userData) => {
    if (userData?.token) localStorage.setItem("token", userData.token);
    if (userData?.nome) localStorage.setItem("userEmail", userData.nome);
    setUser(userData);
  };

  // ✅ Faz logout e limpa tudo
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
