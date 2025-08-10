"use server"

import React, { useState } from 'react'
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import CalendarWrapper from './_components/CalendarWrapper';

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

async function getTransactionsInterval(type: 'Variable' | 'Fixed' | 'Income', userId: string) {
    if (!userId) {
        console.error("Sem Usuário!");
        return [];
    };
    
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/';
        const response = await fetch(
            `${baseUrl}/api/transactions?userId=${userId}&transactionType=${type}` +
            `&betweenDate=${new Date().getFullYear()}~1` +
            `&andDate=${new Date().getFullYear()}~12`, 
            { cache: 'no-store' }    
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch ${type} transactions. Status: ${response.status}`);                
        } 
        return await response.json() as Transaction[];
    } catch (error) {
        console.error(`Error in get${type}Transactions:`, error);
        return [];
    }
}

async function TimeVisionPage({
    searchParams
}: {
    searchParams: { month?: string; year?: string }
}) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    
    const [incomeData, fixedData, variableData] = await Promise.all([
        getTransactionsInterval('Income', userId || ''),
        getTransactionsInterval('Fixed', userId || ''),
        getTransactionsInterval('Variable', userId || '')
    ]);

    return (
        <CalendarWrapper 
            userId={userId}
            searchParams={searchParams}
            incomeData={incomeData}
            fixedData={fixedData}
            variableData={variableData}
        />
    );
}

export default TimeVisionPage;