"use client"

import React, { useEffect, useState } from 'react';
import { Transaction } from './variableExpensesColumns';

interface Category {
    category_id: number;
    str_categoryName: string;
    str_movimentType: 'Input' | 'Output';
    bool_hasBudgetLimit: boolean;
    dbl_budgetLimit: number | null;
    str_image: string | null;
    bool_active: boolean;
}

interface CategoryBudgetAlertProps {
    variableTransactionsData: Transaction[];
    fixedTransactionsData: Transaction[];
    userId: string | null | undefined;
    currentMonth: number;
    currentYear: number;
}

interface BudgetAlert {
    categoryName: string;
    currentSpent: number;
    budgetLimit: number;
    percentage: number;
    isOverBudget: boolean;
    isNearLimit: boolean;
}

export function AlertCategoryLine({ 
    variableTransactionsData, 
    fixedTransactionsData, 
    userId,
    currentMonth,
    currentYear 
}: CategoryBudgetAlertProps) {
    const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkBudgetLimits() {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Buscar categorias
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/';
                const categoriesResponse = await fetch(`${baseUrl}/api/categories?userId=${userId}`, {
                    cache: 'no-store'
                });

                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const categories: Category[] = await categoriesResponse.json();

                // Filtrar apenas categorias com limite de orçamento
                const categoriesWithBudget = categories.filter(
                    category => category.bool_hasBudgetLimit && category.dbl_budgetLimit !== null
                );

                // Combinar todas as transações do mês atual
                const allTransactions = [...variableTransactionsData, ...fixedTransactionsData];
                
                // Filtrar transações do mês atual
                const currentMonthTransactions = allTransactions.filter(transaction => {
                    try {
                        const transactionDate = new Date(transaction.dtm_data);
                        return transactionDate.getMonth() === currentMonth && 
                               transactionDate.getFullYear() === currentYear;
                    } catch {
                        return false;
                    }
                });

                // Calcular gastos por categoria
                const categorySpending: Record<string, number> = {};
                
                currentMonthTransactions.forEach(transaction => {
                    const categoryName = transaction.category.str_categoryName;
                    categorySpending[categoryName] = (categorySpending[categoryName] || 0) + transaction.dbl_valor;
                });

                // Verificar limites
                const budgetAlerts: BudgetAlert[] = [];

                categoriesWithBudget.forEach(category => {
                    const spent = categorySpending[category.str_categoryName] || 0;
                    const limit = category.dbl_budgetLimit!;
                    const percentage = (spent / limit) * 100;

                    if (spent > limit) {
                        // Ultrapassou o limite
                        budgetAlerts.push({
                            categoryName: category.str_categoryName,
                            currentSpent: spent,
                            budgetLimit: limit,
                            percentage,
                            isOverBudget: true,
                            isNearLimit: false
                        });
                    } else if (percentage >= 85) {
                        // Próximo do limite (85% ou mais)
                        budgetAlerts.push({
                            categoryName: category.str_categoryName,
                            currentSpent: spent,
                            budgetLimit: limit,
                            percentage,
                            isOverBudget: false,
                            isNearLimit: true
                        });
                    }
                });

                setAlerts(budgetAlerts);
                setLoading(false);

            } catch (error) {
                console.error('Error checking budget limits:', error);
                setLoading(false);
            }
        }

        checkBudgetLimits();
    }, [variableTransactionsData, fixedTransactionsData, userId, currentMonth, currentYear]);

    if (loading) {
        return (
            <div className='mb-8 p-4 bg-gray-100 rounded-md justify-around flex flex-row'>
                <div>
                    <span className="text-gray-600 font-bold">Carregando alertas de orçamento...</span>
                </div>
            </div>
        );
    }

    if (alerts.length === 0) {
        return null; // Não mostra nada se não houver alertas
    }

    return (
        <div className='mb-8 p-4 bg-red-100 rounded-md flex flex-col gap-2'>
            <div className="font-bold text-red-600">Alertas de Orçamento:</div>
            {alerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2">
                    {alert.isOverBudget && (
                        <span className="text-red-600 font-bold">🛑 </span>
                    )}
                    {alert.isNearLimit && (
                        <span className="text-orange-600 font-bold">⚠️ </span>
                    )}
                    <span className="text-gray-700">
                        <strong>{alert.categoryName}</strong> - 
                        Gasto: {alert.currentSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | 
                        Limite: {alert.budgetLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | 
                        ({alert.percentage.toFixed(1)}%)
                    </span>
                </div>
            ))}
        </div>
    );
}