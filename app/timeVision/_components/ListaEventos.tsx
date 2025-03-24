import React from "react";

const eventosMockados = [
  { date: "2025-03-25", title: "Reunião de Equipe", description: "Discutir andamento do projeto." },
  { date: "2025-03-28", title: "Entrega de Relatório", description: "Finalizar e enviar relatório mensal." },
  { date: "2025-04-02", title: "Treinamento de Segurança", description: "Sessão sobre segurança da informação." }
];

interface ListaEventosProps {
  selectedDate: Date;
}

const ListaEventos: React.FC<ListaEventosProps> = ({ selectedDate }) => {
  const dataFormatada = selectedDate.toISOString().split("T")[0];

  const eventosDoDia = eventosMockados.filter(evento => evento.date === dataFormatada);

  return (
    <div className="relative w-full max-w-lg h-[70%] p-4 border border-gray-400 rounded-md">
      {/* Título sobrepondo a borda */}
      <div className="absolute -top-4 left-4 bg-white px-2 text-lg font-bold">Eventos</div>

      {/* Verifica se há eventos no dia */}
      {eventosDoDia.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {eventosDoDia.map((evento, index) => (
            <li key={index} className="p-2 border-b">
              <p className="font-bold">{evento.title}</p>
              <p className="text-sm text-gray-600">{evento.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-gray-500">Não há eventos nessa data.</p>
      )}
    </div>
  );
};

export default ListaEventos;
