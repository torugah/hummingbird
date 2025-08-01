"use client";

import EmblaCarousel from './EmblaCarousel';
import { PieChartByCategory } from './resumeAllChart';
import { StackedAreaChart } from './StackedAreaChart';
import { Transaction } from './variableExpensesColumns';

interface CarouselProps {
  variableTransactionsData: Transaction[];
  fixedTransactionsData: Transaction[];
  incomeTransactionsData: Transaction[];
  allTransactions: Transaction[];
}

export function CarouselComponent({ 
  variableTransactionsData, 
  fixedTransactionsData, 
  incomeTransactionsData,
  allTransactions 
}: CarouselProps) {
  const components = [
    <PieChartByCategory key="variable" transactions={variableTransactionsData} />,
    <PieChartByCategory key="fixed" transactions={fixedTransactionsData} />,
    <PieChartByCategory key="income" transactions={incomeTransactionsData} />,
    <StackedAreaChart key="stacked" transactions={allTransactions} />
  ]

  return (
    <div className="w-full">
      <EmblaCarousel components={components} />
    </div>
  )
}