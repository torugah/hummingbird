"use client"

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Transaction } from "./variableExpensesColumns";

interface StackedAreaChartProps {
  transactions: Transaction[];
  currentDate: Date;
}

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function StackedAreaChart({ transactions, currentDate }: StackedAreaChartProps) {
  const [monthRange, setMonthRange] = useState<'3' | '6'>('3');

  // Filtra transações dos últimos N meses
  const filterTransactionsByDate = () => {

    
    console.log('1...Coleção de Transações:', transactions); 


    const cutoffDate = new Date(currentDate);
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(monthRange));
    cutoffDate.setDate(1); // Primeiro dia do mês

    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Último dia do mês atual
    endDate.setHours(23, 59, 59, 999); 
    console.log('2...Data de corte:', cutoffDate);
    console.log('3...Data final:', endDate);

    return transactions.filter(transaction => {
      const transactionDate = new Date(((transaction.dtm_data as unknown) as string).replace(' ', 'T'));
      return transactionDate >= cutoffDate && transactionDate <= endDate;
    });
  };

  // Agrupa dados por mês e categoria
  const processChartData = () => {
    const filteredTransactions = filterTransactionsByDate();
    console.log('Transações filtradas:', filteredTransactions); // Debug 1

    const monthData: Record<string, Record<string, number>> = {};
    const allCategories = [...new Set(filteredTransactions.map(t => t.category.str_categoryName))];
    console.log('Categorias únicas:', allCategories); // Debug 2

    for (let i = parseInt(monthRange); i >= 0; i--) {
      const date = new Date(currentDate);
      console.log(`Antes...`, date);
      date.setMonth(currentDate.getMonth() - i);
      console.log(`Depois...`, date);
      const monthKey = `${MONTHS[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`;
      console.log(`Processando mês ${i}:`, monthKey); // Debug 3

      monthData[monthKey] = {};
      allCategories.forEach(category => {
        monthData[monthKey][category] = 0;
      });
    }

    console.log('Estrutura inicializada:', monthData); // Debug 4

    // Preenche com os valores reais (agrupando por mês e categoria)
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.dtm_data);
      const monthKey = `${MONTHS[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`;
      const category = transaction.category.str_categoryName;

      if (monthData[monthKey] && category) {
        monthData[monthKey][category] = (monthData[monthKey][category] || 0) + transaction.dbl_valor;
      }
    });

    // Converte para o formato que o Recharts espera
    return Object.entries(monthData).map(([name, values]) => ({
      name,
      ...values
    }));
  };

  const chartData = processChartData();
  const categories = [...new Set(transactions.map(t => t.category.str_categoryName))];

  // Adicione este console.log para debug
  console.log('Dados do gráfico:', chartData);

  // Cores para as categorias
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#A4DE6C', '#D0ED57', '#FF6B6B',
    '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'
  ];

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          ))}
          <p className="font-bold mt-2">
            Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
              .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Despesas por Categoria (Últimos {monthRange} meses)</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMonthRange('3')}
            className={`px-3 py-1 rounded ${monthRange === '3' ? 'bg-[#01C14C] text-white' : 'bg-gray-200'}`}
          >
            3 meses
          </button>
          <button
            onClick={() => setMonthRange('6')}
            className={`px-3 py-1 rounded ${monthRange === '6' ? 'bg-[#01C14C] text-white' : 'bg-gray-200'}`}
          >
            6 meses
          </button>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) =>
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {categories.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}