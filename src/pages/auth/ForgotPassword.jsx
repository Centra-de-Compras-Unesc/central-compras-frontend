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
      // Chamada ao backend para solicitar recuperação de senha
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
      console.error("Erro:", err);
      setError(err.message || "Erro ao processar sua solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-[#1A1A1A] p-8 rounded-xl border border-dark-border shadow-lg">
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
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Digite seu email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
