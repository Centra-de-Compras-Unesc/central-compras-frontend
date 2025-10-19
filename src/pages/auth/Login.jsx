import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as mockLogin } from "../../utils/mockAuth";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const tipo = mockLogin(email, password);
    if (!tipo) {
      setError("Credenciais inválidas. Tente novamente.");
      return;
    }
    // popular contexto e persistir email se marcado
    login({ nome: email });
    if (remember) localStorage.setItem("userEmail", email);
    const homeByType = { admin: "/admin", lojista: "/loja", fornecedor: "/fornecedor" };
    navigate(homeByType[tipo] ?? "/");
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-[#1A1A1A] p-8 rounded-xl border border-dark-border shadow-lg">
        <div>
          <div className="flex justify-center mb-8">
            <img src="/logo.svg" alt="Central de Compras" className="h-12" />
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
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors pr-10"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  aria-label="Mostrar senha"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-text"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-primary" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Lembrar email
            </label>
            <div className="flex gap-2">
              <button type="button" className="text-primary hover:text-primary/90" onClick={() => { setEmail("lojista@teste.com"); setPassword("123"); }}>Lojista</button>
              <button type="button" className="text-primary hover:text-primary/90" onClick={() => { setEmail("admin@teste.com"); setPassword("123"); }}>Admin</button>
              <button type="button" className="text-primary hover:text-primary/90" onClick={() => { setEmail("fornecedor@teste.com"); setPassword("123"); }}>Fornecedor</button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
