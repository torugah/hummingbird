import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Transaction } from "./CalendarioCustomizado";

interface ListaEventosProps {
  selectedDate: Date;
  incomeData: Transaction[];
  fixedData: Transaction[];
  variableData: Transaction[];
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ListaEventos: React.FC<ListaEventosProps> = ({ 
  selectedDate,
  incomeData,
  fixedData,
  variableData
}) => {
  const formatarData = (date: Date) => format(date, "yyyy-MM-dd");
  const dataSelecionada = formatarData(selectedDate);

  const eventosDoDia = [...incomeData, ...fixedData, ...variableData]
    .filter(transaction => {
      const transactionDate = transaction.dtm_currentInstallmentDate || transaction.dtm_data;
      return formatarData(new Date(transactionDate)) === dataSelecionada;
    })
    .map(transaction => ({
      date: formatarData(new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data)),
      title: transaction.str_name,
      value: transaction.dbl_valor,
      type: transaction.str_transactionType
    }));

  return (
    <div className="space-y-4 h-full">
      <h2 className="text-xl font-bold">Eventos - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</h2>
      
      {eventosDoDia.length > 0 ? (
        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {eventosDoDia.map((evento, index) => (
            <li key={index} className="pb-2 border-b border-gray-200 last:border-0">
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {evento.title}
                </p>
                <span className={`font-semibold ${
                  evento.type === 'Income' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatBRL(evento.value)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Não há transações nesta data.</p>
      )}
    </div>
  );
};

export default ListaEventos;