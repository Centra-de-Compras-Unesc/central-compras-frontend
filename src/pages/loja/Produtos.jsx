import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../utils/api";

export default function Produtos() {
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [graficoVendas, setGraficoVendas] = useState([]);

  const [params] = useSearchParams();
  const fornecedorIdParam = params.get("fornecedorId");
  const fornecedorNomeParam = params.get("fornecedorNome");

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const produtos = await api("/produtos");
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
            typeof p.estoque === "number" ? p.estoque : Number(p.estoque ?? 0),
        }));

        if (!cancelado) {
          setLista(mapeados);
          processarGraficoVendas(mapeados);
        }
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
  }, []);

  function processarGraficoVendas(produtos) {
    const top5 = produtos
      .sort((a, b) => b.preco - a.preco)
      .slice(0, 5)
      .map((p) => ({
        nome: p.nome,
        vendas: Math.floor(Math.random() * 100) + 10,
      }));
    setGraficoVendas(top5);
  }

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

  async function handleDeleteProduto() {
    if (!showDeleteConfirm) return;
    try {
      await api(`/produtos/${showDeleteConfirm}`, { method: "DELETE" });
      setLista(lista.filter((p) => p.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
      alert("Produto deletado com sucesso!");
    } catch (e) {
      alert("Erro ao deletar produto");
    }
  }

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

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produto..."
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />
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
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {carregando && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Carregando...
                  </td>
                </tr>
              )}

              {!carregando && erro && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-red-300"
                  >
                    {erro}
                  </td>
                </tr>
              )}

              {!carregando && !erro && itens.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}

              {!carregando &&
                !erro &&
                itens.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-dark-border hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{p.nome}</td>
                    <td className="px-4 py-3">{p.fornecedor}</td>
                    <td className="px-4 py-3">
                      R$ {Number(p.preco ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{p.estoque}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(p.id)}
                        className="px-3 py-1 rounded text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 transition"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Análise de Vendas
        </h2>
        <div style={{ width: "100%", height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graficoVendas}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="nome" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                }}
              />
              <Legend />
              <Bar dataKey="vendas" fill="#ff7324" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2">
              Confirmar Exclusão
            </h2>
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja excluir este produto? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduto}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
