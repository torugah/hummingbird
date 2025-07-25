"use client"

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction } from "./variableExpensesColumns";

interface PieDataItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57'];
const GRAY_SCALE = ['#e5e7eb', '#d1d5db', '#9ca3af']; // Tons de cinza para o estado vazio

// Componente de Tooltip que segue o mouse
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="rounded-lg border bg-background p-4 shadow-sm"
        style={{
          position: 'absolute',
          left: coordinate?.x + 10,
          top: coordinate?.y + 10,
          maxWidth: '200px'
        }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground overflow-hidden">
            <div className="truncate hover:translate-x-2 hover:transition-transform hover:duration-300 hover:ease-in-out">
              {data.name}
            </div>
          </span>
          <span className="text-lg font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Tradutor de tipos de transação
const translateTransactionType = (type: string | undefined) => {
  if (!type) return 'Transações';
  
  switch(type.toLowerCase()) {
    case 'income':
      return 'Receitas';
    case 'variable':
      return 'Despesas Variáveis';
    case 'fixed':
      return 'Despesas Fixas';
    case 'investmentos':
      return 'Investimentos';
    case 'dividendreturn':
      return 'Dividendos';
    default:
      return 'Resumo';
  }
};

interface PieChartByCategoryProps {
  transactions: Transaction[];
}

export function PieChartByCategory({ transactions }: PieChartByCategoryProps) {
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Dados para quando não houver transações
  const emptyData = [
    { name: 'Sem dados 1', value: 30, color: GRAY_SCALE[0], percentage: 30 },
    { name: 'Sem dados 2', value: 15, color: GRAY_SCALE[1], percentage: 15 },
    { name: 'Sem dados 3', value: 55, color: GRAY_SCALE[2], percentage: 55 }
  ];

  // Verificar se há transações
  const hasTransactions = transactions && transactions.length > 0;
  
  // Processar os dados reais se houver transações
  const totalValue = hasTransactions 
    ? transactions.reduce((sum, item) => sum + item.dbl_valor, 0)
    : 100; // Valor total fictício para o estado vazio

  const groupedData = hasTransactions
    ? transactions.reduce((acc: PieDataItem[], item) => {
        const categoryName = item.category.str_categoryName || 'Sem categoria';
        const existingCategory = acc.find(group => group.name === categoryName);
        
        if (existingCategory) {
          existingCategory.value += item.dbl_valor;
          existingCategory.percentage = (existingCategory.value / totalValue) * 100;
        } else {
          acc.push({ 
            name: categoryName,
            value: item.dbl_valor,
            color: COLORS[acc.length % COLORS.length],
            percentage: (item.dbl_valor / totalValue) * 100
          });
        }
        return acc;
      }, [])
    : emptyData;

  // Ordenar por porcentagem (maior para menor)
  const sortedData = [...groupedData].sort((a, b) => b.percentage - a.percentage);

  // Obter e traduzir o tipo de transação
  const chartTitle = translateTransactionType(
    hasTransactions ? transactions[0]?.str_transactionType : undefined
  );

  return (
    <div className="flex flex-col h-full justify-center gap-4 w-full">
      {/* Título dinâmico traduzido */}
      <h2 className="text-gray-700 text-2xl font-semibold text-left">
        Resumo - {chartTitle}
      </h2>

      <hr className='h-[4px] text-gray-500'/>
      
      <div className="flex flex-1 gap-3">
        <div className="w-[60%]">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart
              onMouseMove={(e) => {
                if (e.activeCoordinate) {
                  setTooltipPos({
                    x: e.activeCoordinate.x,
                    y: e.activeCoordinate.y
                  });
                }
              }}
            >
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                animationDuration={500}
                label={false}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="var(--background)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              {hasTransactions && (
                <Tooltip 
                  content={<CustomTooltip/>} 
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex w-[40%] flex-col justify-center gap-4">
          {!hasTransactions ? (
            <>
              <div className="flex items-center gap-3">
                <span className="w-16 text-right text-sm text-muted-foreground">
                  &nbsp;
                </span>
                <div className="flex-shrink-0">
                  <div className="h-4 w-4 rounded-full bg-transparent" />
                </div>
                <span className="ml-2 flex-1 truncate text-sm font-medium text-gray-400">
                  Não há informação
                </span>
              </div>
              {[1, 2, 3].map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center gap-3">
                  <span className="w-16 text-right text-sm text-muted-foreground">
                    &nbsp;
                  </span>
                  <div className="flex-shrink-0">
                    <div className="h-4 w-4 rounded-full bg-gray-200" />
                  </div>
                  <span className="ml-2 flex-1 truncate">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </span>
                </div>
              ))}
            </>
          ) : (
            sortedData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-16 text-right text-sm text-muted-foreground">
                  {item.percentage.toFixed(2)}%
                </span>
                <div className="flex-shrink-0">
                  <div 
                    className="h-4 w-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="ml-2 flex-1 truncate text-sm font-medium">
                  {item.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}