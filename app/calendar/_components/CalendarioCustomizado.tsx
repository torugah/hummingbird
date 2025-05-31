import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './customCalendar.module.css';
import { ptBR } from "date-fns/locale";

const eventosMockados = [
  { date: "2025-03-25", title: "Dividendos - HCTR11", description: "Entrada de dividendos mensais da HCTR11." },
  { date: "2025-03-28", title: "Serviço Externo", description: "Rendimento através de serviços de desmontagem." },
  { date: "2025-03-31", title: "Depósito Bancário", description: "Realizei um depósito bancário para minha mãe." }
];

const CalendarioCustomizado: React.FC<{ onDateChange: (date: Date) => void}> = ({onDateChange}) => {

  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    setSelected(day);
    onDateChange(day);

    // Se o mês selecionado for diferente do mês atual, atualiza o calendário
    if (day.getMonth() !== currentMonth.getMonth() || day.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(day);
    }
  };


  return (
    <div>
      <div className={styles.dayPickerWrapper}>
        <DayPicker
          mode="single"
          selected={selected}        
          onSelect={handleSelect}
          month={currentMonth} // Define o mês atual no calendário
          onMonthChange={setCurrentMonth} // Permite mudança manual pelo usuário
          locale={ptBR} // Define o idioma como português do Brasil
          className={styles.rdp}
          showOutsideDays
          fixedWeeks
          styles={{
            head_cell: { 
              padding: "8px" , 
              fontSize: "1.1rem" , 
              width: "100%",
              textTransform: "capitalize",
            }, // Espaçamento nos cabeçalhos dos dias (SU, MO, TU...)
            row: { marginBottom: "10px" }, // Espaçamento entre as linhas da tabela
            cell: {  
              padding: "8px" , 
              fontSize: "1.2rem" , 
              textAlign: "center"
            },  // Aumenta o tamanho do número            
            caption: {
              textTransform: "capitalize",
            },
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "#01C14C",
              color: "white",
              borderRadius: "50%", // Mantém o círculo ao redor da data selecionada
            },
            outside: { // Deixa os dias de outro mês mais apagados
              color: "#b0b0b0", // Cinza mais fraco
              opacity: 0.5, // Deixa meio transparente
            },
          }}
        />
      </div>
    </div>
  );
};

export default CalendarioCustomizado;
