import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/tailwind.css";

// Suprimir warnings específicos do Recharts sobre dimensões
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("The width") ||
      args[0].includes("The height") ||
      args[0].includes("recharts") ||
      args[0].includes("resize listener"))
  ) {
    return;
  }
  originalWarn(...args);
};

const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("The width") ||
      args[0].includes("The height") ||
      args[0].includes("recharts") ||
      args[0].includes("resize listener"))
  ) {
    return;
  }
  originalError(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ Primeiro o BrowserRouter com future flags, depois o AuthProvider */}
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
