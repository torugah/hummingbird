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
    const cutoffDate = new Date(currentDate);
    cutoffDate.setMonth(cutoffDate.getMonth() - (parseInt(monthRange) - 1));
    cutoffDate.setDate(1);
    cutoffDate.setHours(0, 0, 0, 0);

    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    // console.log('Filtrando transações entre:', cutoffDate, 'e', endDate);

    return transactions.filter(transaction => {
      try {
        const transactionDate = new Date(transaction.dtm_data);
        return transactionDate >= cutoffDate && transactionDate <= endDate;
      } catch (e) {
        console.error('Erro ao processar data da transação:', transaction.dtm_data, e);
        return false;
      }
    });
  };

  // Agrupa dados por mês e categoria
  const processChartData = () => {
    // console.log('Data recebida: ', currentDate);

    const filteredTransactions = filterTransactionsByDate();

    const monthData: Record<string, Record<string, number>> = {};
    const allCategories = [...new Set(filteredTransactions.map(t => t.category.str_categoryName))];

    // Corrigido: iterar de 0 até monthRange (inclusive)
    for (let i = 0; i < parseInt(monthRange); i++) {
      const date = new Date(currentDate);
      date.setUTCDate(15);
      date.setUTCMonth(currentDate.getMonth() - i);
      const monthKey = `${MONTHS[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`;

      monthData[monthKey] = {};
      allCategories.forEach(category => {
        monthData[monthKey][category] = 0;
      });
    }

    // console.log('Dados mensais antes de preencher:', monthData);

    // Preencher com valores reais
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.dtm_data);
      const monthKey = `${MONTHS[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`;
      const category = transaction.category.str_categoryName;

      if (monthData[monthKey] && category) {
        monthData[monthKey][category] = (monthData[monthKey][category] || 0) + transaction.dbl_valor;
      }
    });

    // Ordenar os meses corretamente (do mais antigo para o mais recente)
    const sortedMonths = Object.keys(monthData).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      const dateA = new Date(parseInt(`20${yearA}`), MONTHS.indexOf(monthA));
      const dateB = new Date(parseInt(`20${yearB}`), MONTHS.indexOf(monthB));
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(month => ({
      name: month,
      ...monthData[month]
    }));
  };

  const chartData = processChartData();

  // console.log('Dados do gráfico processados:', chartData);

  const categories = [...new Set(transactions.map(t => t.category.str_categoryName))];

  // Adicione este console.log para debug
  // console.log('Dados do gráfico:', chartData);

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