import React from "react";

const eventosMockados = [
  { date: "2025-04-05", title: "Recebimento de Salário", description: "" },
  { date: "2025-04-17", title: "Recebimento de Dividendos", description: "" },
  { date: "2025-04-19", title: "Vencimento da Fatura do Cartão Inter", description: "" },
  { date: "2025-04-22", title: "Reservar dinheiro futuro", description: "" },
  { date: "2025-04-08", title: "Compra de novas lâmpadas", description: "Cancelado" }
];

interface ListaEventosProps {
  selectedDate: Date;
}

const ListaEventos: React.FC<ListaEventosProps> = ({ selectedDate }) => {
  const dataFormatada = selectedDate.toISOString().split("T")[0];
  const eventosDoDia = eventosMockados.filter(evento => evento.date === dataFormatada);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Eventos</h2>
      
      {eventosDoDia.length > 0 ? (
        <ul className="space-y-3">
          {eventosDoDia.map((evento, index) => (
            <li key={index} className="pb-2 border-b border-gray-200 last:border-0">
              <p className="font-medium">
                {evento.date.split('-')[2]} - {evento.title}
                {evento.description && <span className="text-gray-500 ml-2">({evento.description})</span>}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Não há eventos nessa data.</p>
      )}
    </div>
  );
};

export default ListaEventos;