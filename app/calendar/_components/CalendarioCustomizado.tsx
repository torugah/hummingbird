// app/calendar/_components/CalendarioCustomizado.tsx
import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './customCalendar.module.css';
import { ptBR } from "date-fns/locale";
import { format } from 'date-fns';

export type Transaction = {
    id: number;
    category_id: number;
    str_name: string;
    dbl_valor: number;
    str_transactionType: string;
    str_description: string;
    int_installmentCount: number;
    dtm_currentInstallmentDate: Date | null;
    int_paymentForm: number;
    tipoPagamento?: {
        str_nomeTipoPgto?: string;
    };
    str_card_id: number;
    str_status: string;
    dtm_data: Date;
    category: {
        category_id: number;
        str_categoryName: string
        str_movimentType: string
    }
    user_id: string;
}

interface CalendarioCustomizadoProps {
  onDateChange: (date: Date) => void;
  incomeData: Transaction[];
  fixedData: Transaction[];
  variableData: Transaction[];
  selectedDate: Date;
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const CalendarioCustomizado: React.FC<CalendarioCustomizadoProps> = ({
  onDateChange,
  incomeData,
  fixedData,
  variableData,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const transactionsByDay = useMemo(() => {
    const days: Record<string, {income: boolean, expense: boolean}> = {};
    
    [...incomeData, ...fixedData, ...variableData].forEach(transaction => {
      const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!days[dayKey]) {
        days[dayKey] = {income: false, expense: false};
      }
      
      if (transaction.str_transactionType === 'Income') {
        days[dayKey].income = true;
      } else {
        days[dayKey].expense = true;
      }
    });
    
    return days;
  }, [incomeData, fixedData, variableData]);

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    onDateChange(day);

    if (day.getMonth() !== currentMonth.getMonth() || day.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(day);
    }
  };

  // Componente para renderizar os dias personalizados
  const DayComponent = (props: any) => {
    const date = props.date;
    const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const dayTransactions = transactionsByDay[dayKey];
    
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth() && 
                          date.getFullYear() === currentMonth.getFullYear();

    return (
      <div className="relative flex flex-col items-center w-full">
        <button
          {...props}
          type="button"
          className={`${props.className} w-8 h-8 flex items-center justify-center rounded-full ${
            isSelected ? 'bg-[#01C14C] text-white' : ''
          } ${
            !isCurrentMonth ? 'opacity-30' : ''
          } hover:bg-gray-100 cursor-pointer`}
        >
          {date.getDate()}
        </button>
        {dayTransactions && (
          <div className={`flex justify-center w-full mt-1 ${!isCurrentMonth ? 'opacity-10' : ''}`}>
            <div className="flex justify-center w-[80%] gap-[1px]">
              {dayTransactions.income && (
                <div className="h-1 bg-green-500 flex-1 rounded-l-full" />
              )}
              {dayTransactions.expense && (
                <div className={`h-1 bg-red-500 ${dayTransactions.income ? 'rounded-r-full' : 'rounded-full'}`} style={{
                  flex: dayTransactions.income ? 1 : 2
                }} />
              )}
            </div>
          </div>
        )}
        {!dayTransactions && <div className="h-1 mt-1" />}
      </div>
    );
  };

  // Função para filtrar eventos do dia selecionado
  const eventosDoDia = useMemo(() => {
    const formatarData = (date: Date) => format(date, "yyyy-MM-dd");
    const dataSelecionada = formatarData(selectedDate);

    return [...incomeData, ...fixedData, ...variableData]
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
  }, [selectedDate, incomeData, fixedData, variableData]);

  return (
    <div className="flex flex-col w-full">
      <div className={styles.dayPickerWrapper}>
        <DayPicker
          mode="single"
          selected={selectedDate}        
          onSelect={handleSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={ptBR}
          className={styles.rdp}
          showOutsideDays
          fixedWeeks
          components={{
            Day: (dayProps) => {
              const dayKey = `${dayProps.date.getFullYear()}-${dayProps.date.getMonth() + 1}-${dayProps.date.getDate()}`;
              return (
                <DayComponent
                  date={dayProps.date}
                  displayMonth={currentMonth}
                  selected={selectedDate}
                  onSelect={handleSelect}
                  transactions={transactionsByDay[dayKey] || {income: false, expense: false}}
                />
              );
            }
          }}
          styles={{
            head_cell: { 
              padding: "8px",
              fontSize: "1rem",
              width: "100%",
              textTransform: "capitalize",
            },
            row: { marginBottom: "8px" },
            cell: {  
              padding: "8px",
              fontSize: "1rem",
              textAlign: "center",
              height: "40px"
            },
            caption: {
              textTransform: "capitalize",
              fontSize: "1.2rem",
              marginBottom: "1rem"
            },
            day: {
              margin: "auto", 
              transition: "all 0.2s ease" 
            }
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "transparent", 
              color: "white",
            },
            outside: {
              color: "#b0b0b0",
              opacity: 0.5,
            },
          }}
        />
      </div>

      {/* Seção de Eventos - agora integrada */}
      <div className="mt-6 space-y-4">
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
    </div>
  );
};

export default CalendarioCustomizado;