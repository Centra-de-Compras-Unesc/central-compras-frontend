// Formatadores

/**
 * Formata CNPJ enquanto digita: 00.000.000/0000-00
 */
export const formatCNPJ = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(
    /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/
  );
  if (!match) return value;
  const [, p1, p2, p3, p4, p5] = match;
  if (p5) return `${p1}.${p2}.${p3}/${p4}-${p5}`;
  if (p4) return `${p1}.${p2}.${p3}/${p4}`;
  if (p3) return `${p1}.${p2}.${p3}`;
  if (p2) return `${p1}.${p2}`;
  return p1;
};

/**
 * Formata telefone enquanto digita: (00) 00000-0000 ou (00) 0000-0000
 */
export const formatTelefone = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
    7,
    11
  )}`;
};

/**
 * Formata CEP enquanto digita: 00000-000
 */
export const formatCEP = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};

// Validadores

/**
 * Valida CNPJ usando o algoritmo oficial
 * Retorna true se válido, false caso contrário
 */
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  const cleaned = cnpj.replace(/\D/g, "");

  // CNPJ deve ter exatamente 14 dígitos
  if (cleaned.length !== 14) return false;

  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  // Calcula primeiro dígito verificador
  const calcDigit = (digits, weights) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Pesos para o primeiro dígito (12 primeiros dígitos)
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = calcDigit(cleaned, weights1);

  // Pesos para o segundo dígito (13 primeiros dígitos)
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondDigit = calcDigit(cleaned, weights2);

  return (
    parseInt(cleaned[12]) === firstDigit &&
    parseInt(cleaned[13]) === secondDigit
  );
};

/**
 * Valida email
 * Retorna true se válido, false caso contrário
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida telefone
 * Retorna true se válido (10 ou 11 dígitos), false caso contrário
 */
export const isValidTelefone = (telefone) => {
  if (!telefone) return false;
  const cleaned = telefone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida URL/site
 * Retorna true se válido, false caso contrário
 */
export const isValidSite = (site) => {
  if (!site) return true; // Campo opcional
  try {
    // Tenta criar uma URL
    new URL(site.startsWith("http") ? site : `https://${site}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida CEP
 * Retorna true se válido (8 dígitos), false caso contrário
 */
export const isValidCEP = (cep) => {
  if (!cep) return false;
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8;
};
