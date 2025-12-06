import React, { useEffect, useState } from "react";

export default function ProductFormModal({ open, onClose, onSubmit, initialData, fornecedores = [] }) {
  const [form, setForm] = useState({
    nome: "",
    id_fornecedor: "",
    preco: "",
    estoque: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        nome: initialData?.nome || "",
        id_fornecedor: "",
        preco: initialData?.preco != null ? String(initialData.preco) : "",
        estoque: initialData?.estoque != null ? String(initialData.estoque) : "",
      });
    }
  }, [open, initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const precoNum = Number(String(form.preco).replace(",", "."));
    const estoqueNum = parseInt(form.estoque || "0", 10);

    if (!form.nome.trim()) return alert("Informe o nome do produto.");
    if (!form.id_fornecedor) return alert("Selecione um fornecedor.");
    if (Number.isNaN(precoNum)) return alert("Preço inválido.");
    if (Number.isNaN(estoqueNum)) return alert("Estoque inválido.");

    onSubmit({
      produto: form.nome.trim(),
      id_fornecedor: Number(form.id_fornecedor),
      valor_produto: precoNum,
      estoque: estoqueNum,
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#0F0F10" }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-[#222327] bg-[#17181A] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Adicionar Produto</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-[#1F2124] hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Nome do produto *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#1F2124] border border-[#2A2C31] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
              placeholder="Ex.: Parafusadeira 12V"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Fornecedor *</label>
            <select
              name="id_fornecedor"
              value={form.id_fornecedor}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#1F2124] border border-[#2A2C31] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
              required
            >
              <option value="">Selecione...</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome_fantasia || f.nome || `Fornecedor #${f.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Preço (R$) *</label>
              <input
                name="preco"
                type="number"
                step="0.01"
                value={form.preco}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1F2124] border border-[#2A2C31] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                placeholder="Ex.: 199.90"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Estoque *</label>
              <input
                name="estoque"
                type="number"
                min="0"
                step="1"
                value={form.estoque}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#1F2124] border border-[#2A2C31] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                placeholder="Ex.: 25"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-[#2A2C31] px-4 py-2 text-sm text-gray-300 hover:bg-[#1F2124]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
