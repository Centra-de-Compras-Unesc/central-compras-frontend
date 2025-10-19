import React, { useState } from "react";

const MOCK = [
  { id: 1, nome: "Smartphone X", fornecedor: "Supplier A", preco: 7835, estoque: 100 },
  { id: 2, nome: "Laptop Pro", fornecedor: "Supplier B", preco: 1000, estoque: 20 },
  { id: 3, nome: "Headphones", fornecedor: "Supplier C", preco: 755, estoque: 100 },
];

export default function Produtos() {
  const [busca, setBusca] = useState("");

  const itens = MOCK.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <button className="btn-primary">Novo Produto</button>
      </div>

      <div className="card">
        <div className="mb-4">
          <input
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-dark w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-dark-text/70">
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Fornecedor</th>
                <th className="px-4 py-2">Preço</th>
                <th className="px-4 py-2">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((p) => (
                <tr key={p.id} className="border-t border-dark-border">
                  <td className="px-4 py-3">{p.nome}</td>
                  <td className="px-4 py-3">{p.fornecedor}</td>
                  <td className="px-4 py-3">R$ {p.preco.toFixed(2)}</td>
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
            <div key={i} className="bg-primary w-6" style={{ height: `${20 + (i % 5) * 12}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

