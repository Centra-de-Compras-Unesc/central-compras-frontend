import React from "react";

const CAMPANHAS = [
  {
    id: 1,
    titulo: "Campanha de Verão",
    imagem: "/assets/natal.jpg",
    resumo: "Descontos e cashback",
  },
  {
    id: 2,
    titulo: "Liquidação",
    imagem: "/assets/blackfriday.jpg",
    resumo: "Black Friday",
  },
  {
    id: 3,
    titulo: "Promoção Escritório",
    imagem: "/assets/blackfriday.jpg",
    resumo: "Ofertas",
  },
];

export default function Campanhas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campanhas</h1>
        <button className="btn-primary">Nova Campanha</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAMPANHAS.map((c) => (
          <div key={c.id} className="card overflow-hidden p-0">
            <img
              src={c.imagem}
              alt={c.titulo}
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{c.titulo}</h3>
              <p className="text-sm text-dark-text/70 mb-3">{c.resumo}</p>
              <button className="btn-primary">Saiba mais</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
