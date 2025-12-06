export const currencyBRL = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(n || 0)
  );

export const formatDate = (iso) =>
  new Intl.DateTimeFormat("pt-BR").format(iso ? new Date(iso) : new Date());

