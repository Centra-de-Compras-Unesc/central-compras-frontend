const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const token = sessionStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = res.statusText;

    try {
      const errorData = await res.json();
      // Extrai a mensagem do erro se existir
      errorMessage =
        errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
      // Se não conseguir parsear como JSON, tenta como texto
      try {
        errorMessage = (await res.text()) || res.statusText;
      } catch {
        // Mantém statusText
      }
    }

    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}
