// components/cardStatusAlert.tsx
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Calendar, CreditCard } from "lucide-react"

interface Cartao {
  card_id: number;
  str_user_id: string;
  str_bank_id: number;
  bank: {
    bank_id: number;
    str_bankName: string;
  };
  dbl_creditLimit: number;
  str_lastNumbers: string;
  dtm_dueDate?: string; 
  int_bestDate?: number; 
}

interface CardStatusAlertProps {
  selectedCardId: number | null;
  selectedPaymentMethod: number | null;
  cards: Cartao[];
  paymentMethods: Array<{ id: number; str_nomeTipoPgto: string }>;
  currentTransactionValue?: number; 
}

export function CardStatusAlert({ 
  selectedCardId, 
  selectedPaymentMethod, 
  cards, 
  paymentMethods, 
  currentTransactionValue = 0
}: CardStatusAlertProps) {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const calculateAlerts = async () => {
      const newAlerts: string[] = [];
  
      if (selectedCardId) {
        const selectedCard = cards.find(card => card.card_id === selectedCardId);
        const isCredit = paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.str_nomeTipoPgto === 'Cartão de Crédito';
        const valueLimit = cards.find(card => card.card_id === selectedCardId)?.dbl_creditLimit || 0;
        
        if (selectedCard) {
          // Verificar se o cartão está vencido
          if (selectedCard.dtm_dueDate) {
            const dueDate = new Date(selectedCard.dtm_dueDate);
            const today = new Date();
            
            if (dueDate < today) {
              newAlerts.push("Este cartão já não é mais válido. Vencido em " + dueDate.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }) + ".");
            }
          }
  
          // Verificar se é crédito com fatura fechada
          if (selectedCard.int_bestDate && selectedPaymentMethod) {
            const selectedPayment = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
            const isCreditCard = selectedPayment?.str_nomeTipoPgto === 'Cartão de Crédito';
            
            if (isCreditCard) {
              const today = new Date();
              const currentDay = today.getDate();
              const bestDay = selectedCard.int_bestDate;
              
              if (currentDay > bestDay) {
                newAlerts.push("Item em crédito num cartão com fatura fechada neste mês no dia " + bestDay + ". Note que esta transação deverá ser efetivamente paga no próximo fechamento da fatura.");
              }
            }
          }
  
          // ALERTA DE LIMITE: Aguarda a verificação de limite de crédito
          if (selectedCard.dbl_creditLimit && isCredit) {
            const limitExceeded = await checkCreditLimit(selectedCard, currentTransactionValue, isCredit);
            if (limitExceeded) {
              newAlerts.push(`O valor desta compra ultrapassa o limite de R$${valueLimit.toFixed(2)} disponível no cartão selecionado.`);
            }
          }          
        }
      }
  
      setAlerts(newAlerts);
    };

    calculateAlerts();
  }, [selectedCardId, selectedPaymentMethod, cards, paymentMethods, currentTransactionValue]);

  // Função para verificar o limite de crédito
  const checkCreditLimit = async (card: Cartao, currentValue: number, isCredit: boolean): Promise<boolean> => {
    if (!isCredit || !card.dbl_creditLimit || !card.int_bestDate) {
      return false;
    }

    try {
      // Calcular período da fatura
      const { startDate, endDate } = calculateBillingPeriod(card.int_bestDate);
      
      // Buscar transações do período
      const transactions = await fetchCreditTransactionsInPeriod(card.card_id, startDate, endDate);
      
      // Somar todas as transações + transação atual
      const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.value, 0) + currentValue;

      console.log(`Total gasto no período da fatura: R$${totalSpent.toFixed(2)} (Limite: R$${card.dbl_creditLimit.toFixed(2)})`);
      
      // Verificar se ultrapassa o limite
      return totalSpent > card.dbl_creditLimit;
    } catch (error) {
      console.error("Erro ao verificar limite:", error);
      return false;
    }
  };

  // Função para calcular o período da fatura
  const calculateBillingPeriod = (bestDay: number): { startDate: Date; endDate: Date } => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let startDate: Date;
    let endDate: Date;

    if (currentDay <= bestDay) {
      // Período: vencimento do mês anterior até vencimento atual
      startDate = new Date(currentYear, currentMonth - 1, bestDay);
      endDate = new Date(currentYear, currentMonth, bestDay);
    } else {
      // Período: vencimento atual até vencimento próximo mês
      startDate = new Date(currentYear, currentMonth, bestDay);
      endDate = new Date(currentYear, currentMonth + 1, bestDay);
    }

    return { startDate, endDate };
  };

  // Função para buscar transações de crédito no período
  const fetchCreditTransactionsInPeriod = async (cardId: number, startDate: Date, endDate: Date): Promise<Array<{ value: number }>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/';
      
      const response = await fetch(
        `${baseUrl}/api/transactions/creditTransactions?creditLimitCheck=true&cardId=${cardId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar transações');
      }
      
      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return [];
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  if (alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (alert: string) => {
    if (alert.includes("não é mais válido")) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (alert.includes("fatura fechada")) {
      return <CreditCard className="h-5 w-5 text-amber-500" />;
    }
    return <Calendar className="h-5 w-5 text-blue-500" />;
  };

  // TODO: Deixar espaço entre ícones e textos, e formatar texto para "Justificado".
  return (
    <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-3">
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className="flex-shrink-0 w-5 pt-0.5">
                {getAlertIcon(alert)}
              </div>
              <span className="flex-1 text-amber-800 dark:text-amber-200 text-justify">
                {alert}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}