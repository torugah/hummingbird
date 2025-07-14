"use client";

import EmblaCarousel from './EmblaCarousel';
import { PieChartByCategory } from './resumeAllChart';
import { Transaction } from './variableExpensesColumns';

interface CarouselProps {
  variableTransactionsData: Transaction[];
  fixedTransactionsData: Transaction[];
  incomeTransactionsData: Transaction[];
}

export function CarouselComponent({ 
  variableTransactionsData, 
  fixedTransactionsData, 
  incomeTransactionsData 
}: CarouselProps) {
  const components = [
    <PieChartByCategory key="variable" transactions={variableTransactionsData} />,
    <PieChartByCategory key="fixed" transactions={fixedTransactionsData} />,
    <PieChartByCategory key="income" transactions={incomeTransactionsData} />
  ]

  return (
    <div className="w-full">
      <EmblaCarousel components={components} />
    </div>
  )
}