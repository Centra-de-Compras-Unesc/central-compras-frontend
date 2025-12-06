import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { IoEye, IoEyeOffSharp } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha: password,
          id_conta: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao realizar login");
      }

      await login({ token: data.token, perfil: data.perfil });

      const perfil = data.perfil || "loja";
      let redirectPath = "/loja/dashboard";

      if (perfil === "admin") {
        redirectPath = "/admin";
      } else if (perfil === "fornecedor") {
        redirectPath = "/fornecedor";
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Styles */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(50px, -50px) rotate(90deg); }
            50% { transform: translate(0, -100px) rotate(180deg); }
            75% { transform: translate(-50px, -50px) rotate(270deg); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-60px, 60px) scale(1.1); }
            66% { transform: translate(60px, -30px) scale(0.9); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-80px, -80px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      {/* Gradient Background */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(-45deg, #0a0a0f, #1a1a2e, #16213e, #1a0a1a, #0f3460)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 15s ease infinite",
          zIndex: -10,
        }}
      />

      {/* Floating Orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "10%",
          left: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,69,0,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "float1 20s ease-in-out infinite, pulse 4s ease-in-out infinite",
          zIndex: -5,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "10%",
          right: "10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,144,255,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "float2 25s ease-in-out infinite, pulse 5s ease-in-out infinite",
          zIndex: -5,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "50%",
          right: "20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(138,43,226,0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "float3 18s ease-in-out infinite, pulse 6s ease-in-out infinite",
          zIndex: -5,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "30%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,127,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "float1 22s ease-in-out infinite reverse, pulse 7s ease-in-out infinite",
          zIndex: -5,
        }}
      />

      {/* Login Card */}
      <div className="max-w-md w-full space-y-6 bg-[#1A1A1A]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div>
          <div className="flex justify-center">
            <img
              src="/assets/centraldecompras.png"
              alt="Central de Compras"
              className="h-35"
            />
          </div>
          <h2 className="text-2xl font-semibold text-dark-text text-center mb-2">
            Login
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg/80 border border-dark-border rounded-lg text-dark-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="Digite seu email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg/80 border border-dark-border rounded-lg text-dark-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pr-10 transition-all duration-300"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-text transition-colors"
                >
                  {showPassword ? (
                    <IoEyeOffSharp size={20} />
                  ) : (
                    <IoEye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Lembrar email
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
