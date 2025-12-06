import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar sua solicitação");
      }

      setMessage(
        "✅ Verifique seu email! Um link de recuperação foi enviado para você."
      );
      setTimeout(() => navigate("/", { replace: true }), 3000);
    } catch (err) {
      setError(err.message || "Erro ao processar sua solicitação");
    } finally {
      setLoading(false);
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

      {/* Card */}
      <div className="max-w-md w-full space-y-6 bg-[#1A1A1A]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div>
          <div className="flex justify-center mb-2">
            <img
              src="/assets/centraldecompras.png"
              alt="Central de Compras"
              className="h-35"
            />
          </div>
          <h2 className="text-2xl font-semibold text-dark-text text-center mb-2">
            Recuperar Senha
          </h2>
          <p className="text-center text-sm text-gray-400">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500 text-green-400 text-sm">
              {message}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25"
          >
            {loading ? "Enviando..." : "Enviar Link"}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 transition-colors"
          >
            <IoArrowBack size={16} />
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
