import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../utils/api";

export default function ProdutosDoFornecedorModal({ open, onClose, fornecedor }) {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const fornecedorId = useMemo(() => {
    const raw =
      fornecedor?.id ??
      fornecedor?.id_fornecedor ??
      fornecedor?.tb_fornecedor_id ??
      fornecedor?.fornecedor_id;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [fornecedor]);

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      if (!open || !fornecedorId) return;
      setCarregando(true);
      setErro("");
      try {
        let lista;
        try {
          lista = await api(`/produtos?fornecedorId=${encodeURIComponent(fornecedorId)}`);
          if (!Array.isArray(lista)) throw new Error("Resposta inesperada (não é array).");
        } catch {
          lista = await api("/produtos");
          if (!Array.isArray(lista)) lista = [];
        }

        const normId = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        };
        const isDoFornecedor = (p) => {
          const a = normId(p?.id_fornecedor);
          const b = normId(p?.tb_fornecedor?.id);
          const c = normId(p?.fornecedor_id);
          const d = normId(p?.tb_fornecedor_id);
          return [a, b, c, d].some((x) => x !== null && x === fornecedorId);
        };

        const filtrados = (lista || []).filter(isDoFornecedor);

        const mapeados = filtrados.map((p) => ({
          id: p.id,
          nome: p.produto || p.descricao || p.nome || `Produto #${p.id}`,
          fornecedor:
            p.tb_fornecedor?.nome_fantasia ||
            p.fornecedor ||
            (p.id_fornecedor ? `Fornecedor #${p.id_fornecedor}` : "Fornecedor"),
          preco:
            typeof p.valor_produto === "number"
              ? p.valor_produto
              : Number(p.valor_produto ?? 0),
          estoque:
            typeof p.estoque === "number" ? p.estoque : Number(p.estoque ?? 0),
        }));

        if (!cancelado) setTodosProdutos(mapeados);
      } catch (e) {
        if (!cancelado) setErro("Não foi possível carregar os produtos.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => {
      cancelado = true;
    };
  }, [open, fornecedorId]);

  const titulo = useMemo(() => {
    const nome =
      fornecedor?.nome ||
      fornecedor?.nome_fantasia ||
      fornecedor?.razao_social ||
      `Fornecedor #${fornecedorId ?? "?"}`;
    return `Produtos – ${nome}`;
  }, [fornecedor, fornecedorId]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* fundo escuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />


      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a12]/95 shadow-[0_30px_120px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white">{titulo}</h2>
            <p className="text-xs text-gray-400">
              Visualize os produtos deste fornecedor.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 hover:text-white"
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="overflow-auto rounded-lg border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-gray-300">
                <tr>
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

                {!carregando && !erro && todosProdutos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                      Nenhum produto encontrado para este fornecedor.
                    </td>
                  </tr>
                )}

                {!carregando &&
                  !erro &&
                  todosProdutos.map((p) => (
                    <tr key={p.id} className="border-t border-white/10">
                      <td className="px-4 py-3">{p.nome}</td>
                      <td className="px-4 py-3">{p.fornecedor}</td>
                      <td className="px-4 py-3">R$ {Number(p.preco ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3">{p.estoque}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:border-white/20 hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
