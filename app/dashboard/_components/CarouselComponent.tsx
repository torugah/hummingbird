"use client";

import { Transaction } from './variableExpensesColumns';
import { EmblaCarousel } from './EmblaCarousel';

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
  return (
    <div className="w-full">
      <EmblaCarousel 
        variableTransactionsData={variableTransactionsData}
        fixedTransactionsData={fixedTransactionsData}
        incomeTransactionsData={incomeTransactionsData}
      />
    </div>
  );
}