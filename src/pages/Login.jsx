import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Central de Compras
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
