import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../utils/api";

export const AuthContext = createContext({});

function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (token) {
          const decoded = decodeToken(token);

          if (decoded?.id) {
            try {
              const response = await api(`/usuarios/${decoded.id}`);
              if (response && !response.error) {
                const userData = {
                  id: decoded.id,
                  email: response.email || decoded.email,
                  nome: response.nome,
                  perfil: decoded.perfil || "loja",
                  perfis: decoded.perfis || [],
                  token,
                  ...response,
                };
                setUser(userData);
              }
            } catch (error) {
              setUser({
                id: decoded.id,
                email: decoded.email,
                nome: decoded.nome,
                perfil: decoded.perfil || "loja",
                perfis: decoded.perfis || [],
                token,
              });
            }
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    if (userData?.token) {
      sessionStorage.setItem("token", userData.token);
      const decoded = decodeToken(userData.token);

      if (decoded?.id) {
        try {
          const response = await api(`/usuarios/${decoded.id}`);
          if (response && !response.error) {
            const userObj = {
              id: decoded.id,
              email: response.email || decoded.email,
              nome: response.nome,
              perfil: decoded.perfil || userData.perfil || "loja",
              perfis: decoded.perfis || [],
              token: userData.token,
              ...response,
            };
            setUser(userObj);
          }
        } catch (error) {
          const userObj = {
            id: decoded.id,
            email: decoded.email,
            nome: userData.nome || decoded.nome,
            perfil: decoded.perfil || userData.perfil || "loja",
            perfis: decoded.perfis || [],
            token: userData.token,
          };
          setUser(userObj);
        }
      }
    } else {
      setUser(userData);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
