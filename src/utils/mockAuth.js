export function login(email, password) {
  const tipos = {
    "admin@teste.com": "admin",
    "lojista@teste.com": "lojista",
    "fornecedor@teste.com": "fornecedor",
  };

  const tipo = tipos[email.toLowerCase()];
  if (tipo && password === "123") {
    localStorage.setItem("tipoUsuario", tipo);
    return true;
  }

  return false;
}

export function getUserType() {
  return localStorage.getItem("tipoUsuario");
}

export function logout() {
  localStorage.removeItem("tipoUsuario");
}
