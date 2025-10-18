import React from "react";
import DataCard from "../../components/shared/DataCard";

const dadosGerais = [
  {
    id: 1,
    titulo: "Total Pedidos",
    valor: "532",
    variacao: "+8%",
  },
  {
    id: 2,
    titulo: "Cashback Disponível",
    valor: "R$ 2.580,30",
    variacao: "+15%",
  },
  {
    id: 3,
    titulo: "Pedidos em Andamento",
    valor: "16",
    variacao: null,
  },
];

const campanhas = [
  {
    id: 1,
    titulo: "Campanha de Verão",
    descricao: "Todas as marcas de discos têm 5% de cashback extra",
    duracao: "05/03/2024",
    imagem: "/campanhas/verao.jpg",
    fornecedor: "Quartzlit",
  },
  {
    id: 2,
    titulo: "Ofertas de Eletrodomésticos",
    descricao: "Liquidação com até 30% de cashback",
    duracao: "20/04/2024",
    imagem: "/campanhas/eletro.jpg",
    fornecedor: "Office Plus",
  },
];

const ultimosPedidos = [
  {
    id: "123456",
    data: "2023-10-18",
    fornecedor: "Quartzlit",
    status: "Em andamento",
    valor: 1580.0,
  },
  {
    id: "123455",
    data: "2023-10-17",
    fornecedor: "Gerdau",
    status: "Entregue",
    valor: 2340.0,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Novo Pedido
          </button>
        </div>
      </div>

      {/* Cards de Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dadosGerais.map((dado) => (
          <DataCard
            key={dado.id}
            title={dado.titulo}
            value={dado.valor}
            change={dado.variacao}
          />
        ))}
      </div>

      {/* Gráfico de Desempenho */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Histórico de Pedidos</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          {/* Aqui será implementado o gráfico real */}
          <p className="text-gray-500">
            Gráfico de linha mostrando tendência de pedidos por mês
          </p>
        </div>
      </div>

      {/* Campanhas em Destaque */}
      <h2 className="text-xl font-semibold mb-4">Campanhas em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campanhas.map((campanha) => (
          <div
            key={campanha.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={campanha.imagem}
                alt={campanha.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  Até {campanha.duracao}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{campanha.titulo}</h3>
              <p className="text-gray-600 mb-4">{campanha.descricao}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {campanha.fornecedor}
                </span>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Saiba mais
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimos Pedidos */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Últimos Pedidos</h2>
          <button className="text-orange-500 hover:text-orange-700">
            Ver Todos
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pedido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fornecedor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ultimosPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{pedido.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(pedido.data).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pedido.fornecedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pedido.status === "Entregue"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {pedido.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-500 hover:text-orange-700">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
