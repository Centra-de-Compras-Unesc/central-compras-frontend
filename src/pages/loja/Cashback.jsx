import React, { useState, useEffect } from "react";
import DataCard from "../../components/shared/DataCard";
import { api } from "../../utils/api";

const currencyBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

export default function Cashback() {
  const [cashbackData, setCashbackData] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [showResgatarModal, setShowResgatarModal] = useState(false);
  const [valorResgate, setValorResgate] = useState("");
  const [resgatando, setResgatando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const mockCashback = {
        disponivel: 2850.75,
        acumulado: 5320.5,
        resgatado: 2469.75,
      };

      const mockTransacoes = [
        {
          id: 1,
          data: "2025-11-20",
          tipo: "Crédito",
          origem: "Pedido PED001",
          valor: 785.5,
        },
        {
          id: 2,
          data: "2025-11-18",
          tipo: "Crédito",
          origem: "Pedido PED002",
          valor: 230.0,
        },
        {
          id: 3,
          data: "2025-11-15",
          tipo: "Resgate",
          origem: "Transferência",
          valor: -500.0,
        },
        {
          id: 4,
          data: "2025-11-12",
          tipo: "Crédito",
          origem: "Pedido PED003",
          valor: 150.0,
        },
        {
          id: 5,
          data: "2025-11-10",
          tipo: "Resgate",
          origem: "Transferência",
          valor: -1969.75,
        },
      ];

      setCashbackData(mockCashback);
      setTransacoes(mockTransacoes);
    } catch (error) {
    } finally {
      setCarregando(false);
    }
  }

  async function handleResgate() {
    if (!valorResgate || Number(valorResgate) <= 0) {
      alert("Digite um valor válido");
      return;
    }

    if (Number(valorResgate) < 10) {
      alert("Valor mínimo para resgate é R$ 10,00");
      return;
    }

    if (Number(valorResgate) > (cashbackData?.disponivel || 0)) {
      alert("Valor superior ao cashback disponível");
      return;
    }

    try {
      setResgatando(true);
      const resultado = await api("/cashback/resgatar", {
        method: "POST",
        body: {
          id_loja: 1,
          valor: Number(valorResgate),
          conta_bancaria: "Conta Bancária",
        },
      });

      if (resultado.saldo) {
        setCashbackData({
          disponivel: resultado.saldo.saldo_disponivel,
          acumulado: resultado.saldo.saldo_acumulado,
          resgatado: resultado.saldo.saldo_resgatado,
        });
      }

      const novaTransacao = {
        id: transacoes.length + 1,
        data: new Date().toISOString().split("T")[0],
        tipo: "Resgate",
        origem: "Transferência",
        valor: -Number(valorResgate),
      };

      setTransacoes([novaTransacao, ...transacoes]);
      setShowResgatarModal(false);
      setValorResgate("");
      alert(
        `✅ Resgate solicitado com sucesso!\n\n💳 Será processado em até 2 dias úteis.\nValor: R$ ${Number(
          valorResgate
        ).toFixed(2)}`
      );
    } catch (error) {
      alert("Erro ao processar resgate. Tente novamente.");
    } finally {
      setResgatando(false);
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  if (carregando) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando dados de cashback...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Cashback</h1>
        <button
          onClick={() => setShowResgatarModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2 text-sm font-medium text-white transition"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 5v14m-7-7h14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Resgatar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard
          title="Disponível"
          value={currencyBRL(cashbackData?.disponivel || 0)}
        />
        <DataCard
          title="Créditos Acumulados"
          value={currencyBRL(cashbackData?.acumulado || 0)}
          change={"+12%"}
        />
        <DataCard
          title="Resgatado"
          value={currencyBRL(cashbackData?.resgatado || 0)}
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Como Funciona o Cashback
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#15151c] border border-gray-700">
            <div className="font-semibold text-orange-500 mb-2">1. Compre</div>
            <p className="text-sm text-gray-300">
              Realize suas compras com nossos fornecedores parceiros
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#15151c] border border-gray-700">
            <div className="font-semibold text-orange-500 mb-2">
              2. Ganhe Cashback
            </div>
            <p className="text-sm text-gray-300">
              Receba créditos em cashback conforme as campanhas ativas
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#15151c] border border-gray-700">
            <div className="font-semibold text-orange-500 mb-2">3. Resgate</div>
            <p className="text-sm text-gray-300">
              Transfira seus créditos para sua conta bancária
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-white">Histórico</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-300 bg-[#15151c]">
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Origem</th>
                <th className="px-4 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-gray-800 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-sm">{formatDate(t.data)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.valor > 0
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {t.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{t.origem}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {currencyBRL(t.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showResgatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#111118] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Resgatar Cashback
              </h2>
              <button
                type="button"
                onClick={() => setShowResgatarModal(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/50">
                <p className="text-sm text-orange-200">
                  Saldo disponível:{" "}
                  <span className="font-bold">
                    {currencyBRL(cashbackData?.disponivel || 0)}
                  </span>
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-200">
                  Valor do Resgate (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={cashbackData?.disponivel || 0}
                  value={valorResgate}
                  onChange={(e) => setValorResgate(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#1b1c22] px-3 py-2 text-sm text-gray-100"
                  placeholder="Mínimo R$ 10,00"
                />
              </div>

              <div className="p-4 rounded-lg bg-[#15151c] border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">
                  Informações do resgate:
                </p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Tempo de processamento: até 2 dias úteis</li>
                  <li>• Transferência para conta bancária registrada</li>
                  <li>• Sem taxa ou desconto</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:border-gray-400"
                  onClick={() => setShowResgatarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={resgatando || !valorResgate}
                  onClick={handleResgate}
                  className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {resgatando ? "Processando..." : "Confirmar Resgate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
