import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './customCalendar.module.css';
import { ptBR } from "date-fns/locale";

const CalendarioCustomizado: React.FC<{ onDateChange: (date: Date) => void}> = ({onDateChange}) => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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