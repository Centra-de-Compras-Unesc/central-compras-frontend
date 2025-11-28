import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400"
        >
          Email corporativo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nome@empresa.com"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua senha"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_20px_45px_-20px_rgba(255,115,29,0.7)] transition hover:shadow-[0_28px_60px_-24px_rgba(255,115,29,0.85)]"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
