import React from "react";
import DataCard from "../../components/shared/DataCard";
import { currencyBRL, formatDate } from "../../utils/format";

const transacoesMock = [
  { id: 1, data: "2024-09-15", tipo: "Crédito", origem: "Pedido PED001", valor: 785.5 },
  { id: 2, data: "2024-09-18", tipo: "Crédito", origem: "Pedido PED002", valor: 230.0 },
  { id: 3, data: "2024-09-20", tipo: "Resgate", origem: "Transferência", valor: -500.0 },
  { id: 4, data: "2024-09-22", tipo: "Crédito", origem: "Pedido PED003", valor: 150.0 },
];

export default function CashbackLojista() {
  const totalCredito = transacoesMock.filter((t) => t.valor > 0).reduce((a, b) => a + b.valor, 0);
  const totalResgatado = transacoesMock.filter((t) => t.valor < 0).reduce((a, b) => a + b.valor, 0) * -1;
  const disponivel = totalCredito - totalResgatado;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cashback</h1>
        <button className="btn-primary">Resgatar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard title="Disponível" value={currencyBRL(disponivel)} />
        <DataCard title="Créditos Acumulados" value={currencyBRL(totalCredito)} change={"+12%"} />
        <DataCard title="Resgatado" value={currencyBRL(totalResgatado)} />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Histórico</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-dark-text/70">
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Origem</th>
                <th className="px-4 py-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoesMock.map((t) => (
                <tr key={t.id} className="border-t border-dark-border">
                  <td className="px-4 py-3">{formatDate(t.data)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        t.valor > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {t.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3">{t.origem}</td>
                  <td className="px-4 py-3">{currencyBRL(t.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
