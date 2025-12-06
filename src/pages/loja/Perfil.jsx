import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";

const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const onlyDigits = (v = "") => String(v).replace(/\D/g, "");
const clamp = (s, n) => s.slice(0, n);
const isCepOk = (v = "") => onlyDigits(v).length === 8;

function formatCEP(digits) {
  const d = clamp(onlyDigits(digits), 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}
function formatCNPJ(digits) {
  const d = clamp(onlyDigits(digits), 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
    8,
    12
  )}-${d.slice(12)}`;
}
function formatPhoneBR(digits) {
  const d = clamp(onlyDigits(digits), 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function PerfilLojista() {
  const { user, login } = useAuth();

  const [profile, setProfile] = useState({
    nome: "",
    email: "",
    loja: "",
    telefone: "",
    cnpj: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    avatarUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cepStatus, setCepStatus] = useState("idle");
  const [cepMsg, setCepMsg] = useState("");
  const abortRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user?.id) {
          const response = await api(`/usuarios/${user.id}`);
          if (response && !response.error) {
            const cleanProfile = { ...response };
            delete cleanProfile.id;
            delete cleanProfile.id_conta;
            delete cleanProfile.ativo;
            delete cleanProfile.senha;
            delete cleanProfile.token;
            delete cleanProfile.tb_sistema_conta;

            setProfile((p) => ({ ...p, ...cleanProfile }));
          }
        }
      } catch (error) {
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;

    if (name === "cep") {
      const v = clamp(onlyDigits(value), 8);
      setProfile((p) => ({ ...p, cep: v }));
      return;
    }
    if (name === "cnpj") {
      const v = clamp(onlyDigits(value), 14);
      setProfile((p) => ({ ...p, cnpj: v }));
      return;
    }
    if (name === "telefone") {
      const v = clamp(onlyDigits(value), 11);
      setProfile((p) => ({ ...p, telefone: v }));
      return;
    }
    if (name === "numero") {
      const v = clamp(onlyDigits(value), 6);
      setProfile((p) => ({ ...p, numero: v }));
      return;
    }

    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleAvatar = (e) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX = 2 * 1024 * 1024;
    if (file.size > MAX) {
      alert("Imagem muito grande. Tente uma foto até 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfile((p) => ({ ...p, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    if (!isEditing) return;
    setProfile((p) => ({ ...p, avatarUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchViaCEP = async (cepDigits) => {
    const clean = onlyDigits(cepDigits);
    if (clean.length !== 8) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setCepStatus("loading");
      setCepMsg("Buscando endereço...");

      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Falha na consulta do CEP");
      const data = await res.json();
      if (data.erro) throw new Error("CEP não encontrado");

      setProfile((p) => ({
        ...p,
        cep: clean,
        endereco: p.endereco || data.logradouro || "",
        bairro: p.bairro || data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      setCepStatus("ok");
      setCepMsg("Endereço preenchido pelo CEP ✅");
    } catch (e) {
      if (e.name === "AbortError") return;
      setCepStatus("erro");
      setCepMsg("CEP inválido ou não encontrado.");
    } finally {
      setTimeout(() => {
        setCepStatus("idle");
        setCepMsg("");
      }, 1800);
    }
  };

  const handleCepBlur = () => {
    if (!isEditing) return;
    if (isCepOk(profile.cep)) fetchViaCEP(profile.cep);
    else if (profile.cep) {
      setCepStatus("erro");
      setCepMsg("Informe 8 dígitos para o CEP.");
      setTimeout(() => {
        setCepStatus("idle");
        setCepMsg("");
      }, 1500);
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    if (isCepOk(profile.cep)) fetchViaCEP(profile.cep);
  }, [profile.cep, isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (!user?.id) {
      alert("Erro: usuário não identificado");
      return;
    }
    try {
      const profileData = (() => {
        const { ...data } = profile;
        delete data.tb_sistema_conta;
        return data;
      })();

      await api(`/usuarios/${user.id}`, { method: "PUT", body: profileData });

      if (profileData.email) {
        login({ token: sessionStorage.getItem("token") });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (error) {
      alert("Erro ao salvar perfil: " + error.message);
    } finally {
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    if (user?.id) {
      api(`/usuarios/${user.id}`).then((response) => {
        if (response && !response.error) {
          const cleanProfile = { ...response };
          delete cleanProfile.id;
          delete cleanProfile.id_conta;
          delete cleanProfile.ativo;
          delete cleanProfile.senha;
          delete cleanProfile.token;
          delete cleanProfile.tb_sistema_conta;
          setProfile((p) => ({ ...p, ...cleanProfile }));
        }
      });
    }
    setIsEditing(false);
  };

  const telefoneMasked = formatPhoneBR(profile.telefone);
  const cnpjMasked = formatCNPJ(profile.cnpj);
  const cepMasked = formatCEP(profile.cep);
  const dis = (disabled) => (disabled ? "opacity-60 cursor-not-allowed" : "");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Perfil</h1>

      <form onSubmit={handleSave} className="card space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatarUrl || "/assets/avatar.jpg"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border border-white/20"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label
              className={`btn-secondary cursor-pointer ${dis(!isEditing)}`}
            >
              Trocar foto
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
                disabled={!isEditing}
              />
            </label>

            {isEditing && profile.avatarUrl && (
              <button
                type="button"
                className="btn-secondary bg-red-500/20 hover:bg-red-500/30 text-red-300"
                onClick={handleRemoveAvatar}
              >
                Remover foto
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-text/70 mb-1">
              Nome Usuário
            </label>
            <input
              name="nome"
              value={profile.nome}
              onChange={handleChange}
              className={`input-dark w-full ${dis(!isEditing)}`}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm text-dark-text/70 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className={`input-dark w-full ${dis(!isEditing)}`}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-text/70 mb-1">Loja</label>
            <input
              name="loja"
              value={profile.loja}
              onChange={handleChange}
              className={`input-dark w-full ${dis(!isEditing)}`}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-text/70 mb-1">
                Telefone
              </label>
              <input
                name="telefone"
                value={telefoneMasked}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                placeholder="(XX) 9XXXX-XXXX"
                inputMode="numeric"
                maxLength={15}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm text-dark-text/70 mb-1">
                CNPJ
              </label>
              <input
                name="cnpj"
                value={cnpjMasked}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                maxLength={18}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Endereço da Loja</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-dark-text/70 mb-1">
                CEP
              </label>
              <input
                name="cep"
                value={cepMasked}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className={`input-dark w-full ${dis(!isEditing)}`}
                inputMode="numeric"
                placeholder="00000-000"
                maxLength={9}
                disabled={!isEditing}
              />
              {cepStatus !== "idle" && (
                <span
                  className={
                    "text-xs block mt-1 " +
                    (cepStatus === "loading"
                      ? "text-blue-300"
                      : cepStatus === "ok"
                      ? "text-green-400"
                      : "text-red-400")
                  }
                >
                  {cepMsg}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-dark-text/70 mb-1">
                Endereço
              </label>
              <input
                name="endereco"
                value={profile.endereco}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                placeholder="Rua, Avenida..."
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-dark-text/70 mb-1">
                Número
              </label>
              <input
                name="numero"
                value={profile.numero}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                inputMode="numeric"
                placeholder="Ex.: 123"
                maxLength={6}
                disabled={!isEditing}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-dark-text/70 mb-1">
                Bairro
              </label>
              <input
                name="bairro"
                value={profile.bairro}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                placeholder="Bairro"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-dark-text/70 mb-1">
                Cidade
              </label>
              <input
                name="cidade"
                value={profile.cidade}
                onChange={handleChange}
                className="input-dark w-full opacity-60 cursor-not-allowed"
                placeholder="Cidade"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-dark-text/70 mb-1">
                Estado (UF)
              </label>
              <select
                name="estado"
                value={profile.estado}
                onChange={handleChange}
                className={`input-dark w-full ${dis(!isEditing)}`}
                disabled={!isEditing}
              >
                <option value="">Selecione</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">
            {isEditing ? "Salvar" : "Editar"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}

          {saved && <span className="text-green-400 text-sm">Salvo!</span>}
        </div>
      </form>
    </div>
  );
}
