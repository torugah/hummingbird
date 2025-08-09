"use client"

import React, { useState } from 'react'
import Header from '../_components/header';
import Footer from '../_components/footer';
import { FaRegCalendar } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CalendarioCustomizado from './_components/CalendarioCustomizado';
import ListaEventos from './_components/ListaEventos';
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InitialPageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

interface MonthlySummary {
  month: string;
  year: any;
  allRevenues: number;
  allFixedExpenses: number;
  allVariableExpenses: number;
  balance: number;
}

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
    }
    user_id: string;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

async function TimeVisionPage({ searchParams }: InitialPageProps) {

    const horaAtual = new Date();
    const data = await getServerSession(authOptions);
    const userId = data?.user.id;

    const currentMonth = searchParams.month ? parseInt(searchParams.month) - 1 : horaAtual.getMonth();
    const currentYear = searchParams.year ? parseInt(searchParams.year) : horaAtual.getFullYear();
    const currentViewDate = new Date(currentYear, currentMonth, 1);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const getDateUrl = (date: Date) => {
        return `?month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
    };     

    // const getInvoices = () => {
    //     return [
    //         {
    //             index: "1",
    //             month: "Janeiro",
    //             year: "2025",
    //             allRevenues: "R$ 2.000,00",
    //             allFixedExpenses: "R$ 1.000,00",
    //             allVariableExpenses: "R$ 500,00",
    //             balance: "R$ 500,00",
    //         },
    //         {
    //             index: "2",
    //             month: "Fevereiro",
    //             year: "2025",
    //             allRevenues: "R$ 2.000,00",
    //             allFixedExpenses: "R$ 1.000,00",
    //             allVariableExpenses: "R$ 500,00",
    //             balance: "R$ 500,00",
    //         },
    //         {
    //             index: "3",
    //             month: "Março",
    //             year: "2025",
    //             allRevenues: "R$ 2.000,00",
    //             allFixedExpenses: "R$ 1.000,00",
    //             allVariableExpenses: "R$ 500,00",
    //             balance: "R$ 500,00",
    //         },
    //     ];
    // }

    // const invoices = getInvoices();

    // Função para formatar valores em BRL
    const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
    };

    async function getTransactionsInterval(type: 'Variable' | 'Fixed' | 'Income') {
        if (!userId) {
            console.error("Sem Usuário!");
            return [];
        };
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

            const response = await fetch(
                `${baseUrl}/api/transactions?userId=${userId}&transactionType=${type}` +
                `&betweenDate=${currentYear}~1` +
                `&andDate=${currentYear}~12`, 
                { cache: 'no-store' }    
            );

            console.log(`URL de busca: ${response.url}`)

            if (!response.ok) {
                console.error(`Erro ao usar a API ${type}, status: ${response.status}`)
                throw new Error(`Failed to fetch ${type} transactions. Status: ${response.status}`);                
            } 
            return await response.json();
        } catch (error) {
            console.error(`Error in get${type}Transactions:`, error);
            return [];
        }
    }

    const [incomeData, fixedData, variableData] = await Promise.all([
        getTransactionsInterval('Income'),
        getTransactionsInterval('Fixed'),
        getTransactionsInterval('Variable')
    ]);
    
    // Processar os dados para criar o resumo mensal
  const processMonthlyData = (): MonthlySummary[] => {
    const monthlySummaries: Record<string, MonthlySummary> = {};

    // Inicializar todos os meses
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 6 + i + 12) % 12; // Garante que estamos pegando os 12 meses corretamente
      const monthKey = `${monthIndex + 1}-${currentYear}`; // +1 porque meses são 1-12
      
      monthlySummaries[monthKey] = {
        month: monthNames[monthIndex],
        year: currentYear,
        allRevenues: 0,
        allFixedExpenses: 0,
        allVariableExpenses: 0,
        balance: 0
      };
    }

    // Processar receitas (Income)
    incomeData.forEach((transaction: Transaction) => {
      const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
      const month = date.getMonth() + 1; // getMonth() retorna 0-11
      const year = date.getFullYear().toString();
      const monthKey = `${month}-${year}`;
      
      if (monthlySummaries[monthKey]) {
        monthlySummaries[monthKey].allRevenues += transaction.dbl_valor; // Usar valor direto para receitas
      }
    });

    // Processar gastos fixos (Fixed)
    fixedData.forEach((transaction: Transaction) => {
      const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString();
      const monthKey = `${month}-${year}`;
      
      if (monthlySummaries[monthKey]) {
        monthlySummaries[monthKey].allFixedExpenses += Math.abs(transaction.dbl_valor); // Usar valor absoluto para gastos
      }
    });

    // Processar gastos variáveis (Variable)
    variableData.forEach((transaction: Transaction) => {
      const date = new Date(transaction.dtm_currentInstallmentDate || transaction.dtm_data);
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString();
      const monthKey = `${month}-${year}`;
      
      if (monthlySummaries[monthKey]) {
        monthlySummaries[monthKey].allVariableExpenses += Math.abs(transaction.dbl_valor); // Usar valor absoluto para gastos
      }
    });

    // Calcular saldo para cada mês
    Object.keys(monthlySummaries).forEach(key => {
      const summary = monthlySummaries[key];
      summary.balance = summary.allRevenues - (summary.allFixedExpenses + summary.allVariableExpenses);
    });

    // Converter o objeto em array e ordenar por mês
    return Object.values(monthlySummaries).sort((a, b) => {
      const monthA = monthNames.indexOf(a.month);
      const monthB = monthNames.indexOf(b.month);
      return monthA - monthB;
    });
  };

  const invoices = processMonthlyData();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-lg-w-full w-[74%]">
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Seção do Calendário */}
                    <div className="lg:w-3/5">
                        <div className="flex items-center gap-2 mb-4">
                            <FaRegCalendar className="text-xl" />
                            <h1 className="text-2xl font-bold">Calendário</h1>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-between">
                            <CalendarioCustomizado onDateChange={setSelectedDate}/>
                        </div>
                    </div>
                    
                    {/* Seção de Eventos e Descrição */}
                    <div className="lg:w-2/5 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <ListaEventos selectedDate={selectedDate}/>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Descrição</h2>
                            <div className="space-y-2">
                                <p>MXRF11 - 698 Cotass - R$67,45</p>
                                <p>VPLG11 - 51 Cotas - R$52,63</p>
                                <p>AGRX11 - 296 Cotas - R$26,37</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-box bg-grey-100 rounded-md mx-auto p-8 mb-8 w-[74%]'>
                    <div className="flex flex-col justify-between items-center">    
                        
                        <h2 className='text-xl font-semibold text-[#01C14C]'>
                            Controle do Ano - Mês por mês
                        </h2>

                        <div className='flex flex-col items-start'>                            
                            <a 
                                href={getDateUrl(new Date(currentYear, currentMonth - 1, 1))}
                                className="ml-1 p-1 hover:bg-gray-100 rounded"
                            >
                                <FaChevronLeft className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pl-[0.125rem] pr-1" />                        
                            </a>

                            <p className="text-3xl font-bold text-[#01C14C]">
                                {format(currentViewDate, 'yyyy', { locale: ptBR })}.
                            </p>
        
                            <a 
                                href={getDateUrl(new Date(currentYear, currentMonth + 1, 1))}
                                className="ml-0 p-1 hover:bg-gray-100 rounded"
                            >   
                                <FaChevronRight className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pr-[0.125rem] pl-1" />  
                            </a>        
                        </div>

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
                                {invoices.map((invoice : any) => (
                                <TableRow key={invoice.index}>
                                    <TableCell className="font-medium">{invoice.month}</TableCell>
                                    <TableCell>{invoice.year}</TableCell>
                                    <TableCell>{formatBRL(invoice.allRevenues)}</TableCell>
                                    <TableCell>{formatBRL(invoice.allFixedExpenses)}</TableCell>
                                    <TableCell>{formatBRL(invoice.allVariableExpenses)}</TableCell>
                                    <TableCell className="text-right">{formatBRL(invoice.balance)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default TimeVisionPage;