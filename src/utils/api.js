const BASE_URL = import.meta.env.VITE_API_URL ?? "";

/**
 * Wrapper simples para chamadas à API do backend.
 * Usa VITE_API_URL como base (ex.: http://localhost:3000).
 */
export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${txt || res.statusText}`);
  }

  // pode retornar vazio (204)
  try {
    return await res.json();
  } catch {
    return {};
  }
}
