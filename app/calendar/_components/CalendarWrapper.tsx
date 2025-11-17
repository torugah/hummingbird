"use client"

import React, { useState } from 'react';
import Header from '../../_components/header';
import Footer from '../../_components/footer';
import { FaRegCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CalendarioCustomizado from './CalendarioCustomizado';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CalendarWrapperProps {
  userId?: string;
  searchParams: { month?: string; year?: string };
  incomeData: any[];
  fixedData: any[];
  variableData: any[];
}

interface MonthlySummary {
  month: string;
  year: string;
  allRevenues: number;
  allFixedExpenses: number;
  allVariableExpenses: number;
  balance: number;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

function CalendarWrapper({ 
  userId, 
  searchParams, 
  incomeData, 
  fixedData, 
  variableData 
}: CalendarWrapperProps) {
    const horaAtual = new Date();
    const currentMonth = searchParams.month ? parseInt(searchParams.month) - 1 : horaAtual.getMonth();
    const currentYear = searchParams.year ? parseInt(searchParams.year) : horaAtual.getFullYear();
    const currentViewDate = new Date(currentYear, currentMonth, 1);
    
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
      return searchParams.month && searchParams.year 
          ? new Date(
              parseInt(searchParams.year),
              parseInt(searchParams.month) - 1,
              1
          )
          : horaAtual;
    });

    const getDateUrl = (date: Date) => {
        return `?month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
    };

    const processMonthlyData = (): MonthlySummary[] => {
        const monthlySummaries: Record<string, MonthlySummary> = {};

        for (let i = 0; i < 12; i++) {
            const monthKey = `${i + 1}-${currentYear}`;
            monthlySummaries[monthKey] = {
                month: monthNames[i],
                year: currentYear.toString(),
                allRevenues: 0,
                allFixedExpenses: 0,
                allVariableExpenses: 0,
                balance: 0
            };
        }

        incomeData.forEach((transaction) => {
            const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
            const month = date.getMonth() + 1;
            const year = date.getFullYear().toString();
            const monthKey = `${month}-${year}`;
            
            if (monthlySummaries[monthKey]) {
                monthlySummaries[monthKey].allRevenues += transaction.dbl_valor;
            }
        });

        [...fixedData, ...variableData].forEach((transaction) => {
            const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
            const month = date.getMonth() + 1;
            const year = date.getFullYear().toString();
            const monthKey = `${month}-${year}`;
            
            if (monthlySummaries[monthKey]) {
                const amount = Math.abs(transaction.dbl_valor);
                if (transaction.str_transactionType === 'Fixed') {
                    monthlySummaries[monthKey].allFixedExpenses += amount;
                } else {
                    monthlySummaries[monthKey].allVariableExpenses += amount;
                }
            }
        });

        Object.values(monthlySummaries).forEach(summary => {
            summary.balance = summary.allRevenues - (summary.allFixedExpenses + summary.allVariableExpenses);
        });

        return Object.values(monthlySummaries).sort((a, b) => 
            monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
        );
    };

    const invoices = processMonthlyData();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 items-center">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-lg-w-full w-[74%]">
                
                <CalendarioCustomizado 
                    onDateChange={setSelectedDate}
                    incomeData={incomeData}
                    fixedData={fixedData}
                    variableData={variableData}
                    selectedDate={selectedDate}
                />
                
                {/* Seção de resumo anual (mantida igual) */}
                <div className='flex flex-box bg-white rounded-lg shadow mx-auto p-8 mb-8 w-[74%]'>
                    <div className="flex flex-col justify-between items-center w-full">    
                        <h2 className='text-xl font-semibold text-[#01C14C] mb-4'>
                            Controle do Ano - Mês por mês
                        </h2>

                        <div id='yearSelector' className='flex items-center gap-4 mb-6 text-2xl'>
                            <a 
                                href={getDateUrl(new Date(currentYear - 1, currentMonth, 15))}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <FaChevronLeft className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pl-[0.125rem] pr-1" />                        
                            </a>

                            <p className="text-3xl font-bold text-[#01C14C]">
                                {format(currentViewDate, 'yyyy', { locale: ptBR })}
                            </p>
        
                            <a 
                                href={getDateUrl(new Date(currentYear + 1, currentMonth, 15))}
                                className="p-1 hover:bg-gray-100 rounded"
                            >   
                                <FaChevronRight className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pr-[0.125rem] pl-1" />  
                            </a>        
                        </div>

                        <div id='showYearTable' className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Mês</TableHead>
                                        <TableHead>Ano</TableHead>
                                        <TableHead>Receita</TableHead>
                                        <TableHead>Gastos Fixos</TableHead>
                                        <TableHead>Gastos Variáveis</TableHead>
                                        <TableHead className="text-right">Saldo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{invoice.month}</TableCell>
                                            <TableCell>{invoice.year}</TableCell>
                                            <TableCell>{formatBRL(invoice.allRevenues)}</TableCell>
                                            <TableCell>{formatBRL(invoice.allFixedExpenses)}</TableCell>
                                            <TableCell>{formatBRL(invoice.allVariableExpenses)}</TableCell>
                                            <TableCell className={`text-right ${
                                                invoice.balance >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                {formatBRL(invoice.balance)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CalendarWrapper;