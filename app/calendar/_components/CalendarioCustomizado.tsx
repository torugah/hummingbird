// app/calendar/_components/CalendarioCustomizado.tsx
import React, { useMemo } from 'react';
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
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
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

  const DayComponent = (props: any) => {
    const date = props.date;
    const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const dayTransactions = transactionsByDay[dayKey];
    
    const isSelected = selected && date.toDateString() === selected.toDateString();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth() && 
                          date.getFullYear() === currentMonth.getFullYear();

    return (
      <div className="relative flex flex-col items-center">
        <div 
          {...props} 
          className={`${props.className} ${isSelected ? '!bg-[#01C14C] !text-white' : ''} ${
            !isCurrentMonth ? 'opacity-30' : ''
          }`}
        >
          {date.getDate()}
        </div>
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

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    setSelected(day);
    onDateChange(day);

    if (day.getMonth() !== currentMonth.getMonth() || day.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(day);
    }
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