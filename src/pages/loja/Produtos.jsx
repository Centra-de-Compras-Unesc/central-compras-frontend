import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";

export default function Produtos() {
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [params] = useSearchParams();
  const fornecedorIdParam = params.get("fornecedorId");
  const fornecedorNomeParam = params.get("fornecedorNome");

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        // Backend: GET /produtos (inclui tb_fornecedor e tb_categoria)
        const produtos = await api("/produtos");

        // Mapeia para o formato do layout atual
        const mapeados = (Array.isArray(produtos) ? produtos : []).map((p) => ({
          id: p.id,
          nome: p.produto || p.descricao || p.nome || `Produto #${p.id}`,
          fornecedor:
            p.tb_fornecedor?.nome_fantasia ||
            p.fornecedor ||
            (p.id_fornecedor ? `Fornecedor #${p.id_fornecedor}` : "Fornecedor"),
          id_fornecedor: p.tb_fornecedor?.id ?? p.id_fornecedor ?? null,
          preco:
            typeof p.valor_produto === "number"
              ? p.valor_produto
              : Number(p.valor_produto ?? 0),
          estoque:
            typeof p.estoque === "number"
              ? p.estoque
              : Number(p.estoque ?? 0), // se não houver no banco, fica 0
        }));

        if (!cancelado) setLista(mapeados);
      } catch (e) {
        if (!cancelado) setErro("Não foi possível carregar os produtos.");
        console.error("Erro ao buscar /produtos:", e);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  // Aplica filtro por fornecedor (se veio na URL) e por busca de texto
  const itens = useMemo(() => {
    let base = [...lista];

    if (fornecedorIdParam) {
      const idNum = Number(fornecedorIdParam);
      base = base.filter((p) => Number(p.id_fornecedor) === idNum);
    }

    if (busca.trim()) {
      const term = busca.toLowerCase();
      base = base.filter(
        (p) =>
          String(p.nome).toLowerCase().includes(term) ||
          String(p.fornecedor).toLowerCase().includes(term)
      );
    }

    return base;
  }, [lista, busca, fornecedorIdParam]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            {fornecedorNomeParam
              ? `Produtos – ${fornecedorNomeParam}`
              : "Produtos"}
          </h1>
          <p className="text-sm text-gray-400">
            {fornecedorNomeParam
              ? "Listagem dos produtos deste fornecedor."
              : "Pesquise e navegue pelos produtos disponíveis."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-auto rounded-lg border border-dark-border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-dark-bg/30 text-gray-300">
                <th className="px-4 py-3 text-left">Produto</th>
                <th className="px-4 py-3 text-left">Fornecedor</th>
                <th className="px-4 py-3 text-left">Preço</th>
                <th className="px-4 py-3 text-left">Estoque</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {carregando && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              )}

              {!carregando && erro && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-red-300">
                    {erro}
                  </td>
                </tr>
              )}

              {!carregando && !erro && itens.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}

              {!carregando &&
                !erro &&
                itens.map((p) => (
                  <tr key={p.id} className="border-t border-dark-border">
                    <td className="px-4 py-3">{p.nome}</td>
                    <td className="px-4 py-3">{p.fornecedor}</td>
                    <td className="px-4 py-3">
                      R$ {Number(p.preco ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{p.estoque}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Análise de Vendas</h2>
        <div className="h-48 bg-dark-bg/40 border border-dark-border rounded-lg flex items-end gap-2 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-primary w-6"
              style={{ height: `${20 + (i % 5) * 12}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
