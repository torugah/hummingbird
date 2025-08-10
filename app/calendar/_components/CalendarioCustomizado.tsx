// app/calendar/_components/CalendarioCustomizado.tsx
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './customCalendar.module.css';
import { ptBR } from "date-fns/locale";

type Transaction = {
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
}

const CalendarioCustomizado: React.FC<CalendarioCustomizadoProps> = ({
  onDateChange,
  incomeData,
  fixedData,
  variableData
}) => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Função para verificar se um dia tem transações e de que tipo
  const getDayTransactions = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const allTransactions = [...incomeData, ...fixedData, ...variableData];
    
    const dayTransactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
      return (
        transactionDate.getDate() === day &&
        transactionDate.getMonth() + 1 === month &&
        transactionDate.getFullYear() === year
      );
    });

    if (dayTransactions.length === 0) return null;

    const hasIncome = dayTransactions.some(t => t.str_transactionType === 'Income');
    const hasExpense = dayTransactions.some(t => t.str_transactionType !== 'Income');

    if (hasIncome && hasExpense) return 'both';
    if (hasIncome) return 'income';
    if (hasExpense) return 'expense';
    
    return null;
  };

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    setSelected(day);
    onDateChange(day);

    if (day.getMonth() !== currentMonth.getMonth() || day.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(day);
    }
  };

  // Componente personalizado para cada dia do calendário
  const DayComponent = (props: any) => {
    const date = props.date;
    const transactionsType = getDayTransactions(date);
    const isSelected = selected && date.toDateString() === selected.toDateString();

    return (
      <div className="relative flex flex-col items-center">
        <div 
          {...props} 
          className={`${props.className} ${isSelected ? '!bg-[#01C14C] !text-white' : ''}`}
        />
        {transactionsType && (
          <div className="flex justify-center w-full mt-1">
            <div 
              className={`h-1 rounded-full ${
                transactionsType === 'income' ? 'bg-green-500' :
                transactionsType === 'expense' ? 'bg-red-500' :
                'bg-gradient-to-r from-green-500 to-red-500'
              }`}
              style={{ width: '80%' }}
            />
          </div>
        )}
        {/* Espaçamento para dias sem transações */}
        {!transactionsType && <div className="h-1 mt-1" />}
      </div>
    );
  };

  return (
    <div className={styles.dayPickerWrapper}>
      <DayPicker
        mode="single"
        selected={selected}        
        onSelect={handleSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={ptBR}
        className={styles.rdp}
        showOutsideDays
        fixedWeeks
        components={{
          Day: DayComponent
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
        }}
        modifiersStyles={{
          selected: {
            backgroundColor: "#01C14C",
            color: "white",
            borderRadius: "50%",
          },
          outside: {
            color: "#b0b0b0",
            opacity: 0.5,
          },
        }}
      />
    </div>
  );
};

export default CalendarioCustomizado;