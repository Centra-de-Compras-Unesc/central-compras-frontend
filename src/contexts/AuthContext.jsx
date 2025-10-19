import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUser({ nome: email });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem("userEmail");
    } finally {
      setUser(null);
    }
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
