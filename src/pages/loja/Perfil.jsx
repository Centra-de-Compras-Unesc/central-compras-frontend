import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const STORAGE_KEY = "userProfile";

export default function PerfilLojista() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ nome: "", email: "", loja: "", telefone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProfile(JSON.parse(saved));
    else if (user?.nome) setProfile((p) => ({ ...p, nome: user.nome }));
  }, [user?.nome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    if (profile.email) login({ nome: profile.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Perfil</h1>

      <form onSubmit={handleSave} className="card space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm text-dark-text/70 mb-1">Nome</label>
          <input name="nome" value={profile.nome} onChange={handleChange} className="input-dark w-full" />
        </div>
        <div>
          <label className="block text-sm text-dark-text/70 mb-1">Email</label>
          <input name="email" type="email" value={profile.email} onChange={handleChange} className="input-dark w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-text/70 mb-1">Loja</label>
            <input name="loja" value={profile.loja} onChange={handleChange} className="input-dark w-full" />
          </div>
          <div>
            <label className="block text-sm text-dark-text/70 mb-1">Telefone</label>
            <input name="telefone" value={profile.telefone} onChange={handleChange} className="input-dark w-full" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">Salvar</button>
          {saved && <span className="text-green-400 text-sm">Salvo!</span>}
        </div>
      </form>
    </div>
  );
}
