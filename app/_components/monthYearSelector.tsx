'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaRegCalendar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface MonthYearSelectorProps {
  initialDate: Date;
}

export const MonthYearSelector = ({ initialDate }: MonthYearSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  
  const months = Array.from({ length: 12 }, (_, i) => 
    format(new Date(2000, i, 1), 'MMMM', { locale: ptBR })
  );

  const years = Array.from({ length: 10 }, (_, i) => 
    new Date().getFullYear() - 5 + i
  );

  const updateDate = (newDate: Date) => {
    setSelectedDate(newDate);
    router.push(`?month=${newDate.getMonth() + 1}&year=${newDate.getFullYear()}`);
  };

  const changeMonth = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    updateDate(newDate);
    setShowPicker(false);
  };

  const changeYear = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    updateDate(newDate);
  };

  return (
    <div className="relative flex items-center">
      <button 
        onClick={() => setShowPicker(!showPicker)} 
        className="flex items-center focus:outline-none"
      >
        <FaRegCalendar className="text-2xl text-[#01C14C] mr-2" />
      </button>
      
      {showPicker && (
        <div className="absolute left-0 top-full z-10 bg-white p-4 shadow-lg rounded-md border border-gray-200 min-w-fit">
          <div className="grid grid-cols-3 gap-2 mb-3 w-[225px]">
            {months.map((month, idx) => (
              <button
                key={month}
                onClick={() => changeMonth(idx)}
                className={`p-2 text-sm rounded hover:bg-gray-100 ${
                  selectedDate.getMonth() === idx ? 'bg-[#01C14C] text-white' : ''
                }`}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
          <select
            value={selectedDate.getFullYear()}
            onChange={(e) => changeYear(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#01C14C] text-base"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};