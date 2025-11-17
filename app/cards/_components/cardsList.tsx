'use server'

import React from 'react'
import DialogAddNewCard from './dialogAddNewCard'
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { formatCurrency } from '@/lib/utils';
import { BsCalendar2X, BsCalendarCheck, BsCalendarDate } from "react-icons/bs";
import { GoNumber } from "react-icons/go";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DialogEditDeleteCard from './dialogEditDeleteCard';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Cards {
  str_user_id: string;
  card_id: number;
  dbl_creditLimit: number;
  int_bestDate: number;
  dtm_dueDate: Date;
  str_lastNumbers: string;
  bool_active: boolean;
  bank: {
    bank_id: number;
    str_bankName: string;
    str_image: String;
  }
}

interface CardListProps {
  userId: string | null | undefined;
  showDialog: boolean;
}

async function getCards(userId: string | null | undefined): Promise<Cards[]> {
  if (!userId) {
    console.error("No user ID found, skipping category fetch.");
    return [];
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
    const response = await fetch(`${baseUrl}/api/cards?userId=${userId}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.error("No cards found for this user.");
        return [];
      }
      console.error(`Error in getCards:`, response.statusText);
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

const CardsList: React.FC<CardListProps> = async ({ userId , showDialog }) => {

  const cards = await getCards(userId);

  return (
    <>
      {cards
        .filter(card => card.bank.bank_id !== 22 && card.bank.str_bankName !== "personalFormUser")
        .map((card) => (
        <div key={card.card_id} className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg'>
          {/* Use category.str_image if available, otherwise a default */}

          <div className="flex flex-row items-center p-2 rounded-sm h-1/2">
            {/* Div quadrada (1:1) que se ajusta à altura do container pai */}
            <div
              className="relative aspect-square h-full min-w-[10px] max-w-[100px] rounded-lg bg-cover bg-center mr-3"
              style={{
                backgroundImage: `url(${card.bank.str_image})`
              }}
            />
            {/* Nome do banco (cresce dinamicamente) */}
            <div className='flex flex-col h-[100%] w-2/3'>

              <div className='flex flex-col text-end place-self-end h-[25%]'>
                {/* <CardEditCategory card={card} userId={userId} /> */}
                <DialogEditDeleteCard cardToEdit={card} userId={userId}/> 
              </div>

              <div className='text-start items-start h-[75%]'>
                <p className="text-clip text-xl font-bold">{card.bank.str_bankName}</p>                
              </div>

            </div>            
          </div>



          <div className='flex flex-row h-1/2 justify-between p-1'>
            <div className='flex flex-col justify-around'>

              {/* Display last card numbers */}
              <div className='flex flex-row items-center'>
                <GoNumber className='pr-2 h-4 w-6' />
                <p className="text-lg font-normal font-mono tracking-widest">XXXX XXXX XXXX {card.str_lastNumbers}</p>
              </div>

              {/* Display category name */}
              <div className='flex flex-row items-center w-full'>
                <div className="flex flex-col w-[50%]">
                  <TooltipProvider delayDuration={300}>
                      <Tooltip>
                          <TooltipTrigger asChild className='cursor-help'>
                              <div className='flex flex-row items-center'>
                                <BsCalendarCheck className='pr-2 h-4 w-6' />
                                <p className="font-normal">
                                  {card.int_bestDate ? "Dia " + card.int_bestDate : " --/-- "}
                                </p>
                              </div>  
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black p-2 rounded-md">
                              <p>Data de Vencimento da Fatura</p>
                          </TooltipContent>
                      </Tooltip>
                  </TooltipProvider>             
                </div>
                <div className="flex flex-col w-[50%] items-center">
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild className='cursor-help'>
                            <div className='flex flex-row items-center'>
                              <BsCalendar2X className='pr-2 h-4 w-6' />
                              <p className="font-normal">
                                {format(card.dtm_dueDate, 'MM/yyyy', { locale: ptBR })}
                              </p>
                            </div>
                          </TooltipTrigger>
                            <TooltipContent className="bg-white text-black p-2 rounded-md">
                              <p>Data de Validade deste Cartão</p>
                            </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>              
                </div>
              </div>

              {/* Display budget limit if applicable */}
              {card.dbl_creditLimit && card.dbl_creditLimit !== null && (
                <div className='flex flex-row items-center'>
                  <FaRegMoneyBill1 className='pr-2 h-4 w-6' />
                  {/* Format the budget limit */}
                  <p className='font-normal'>Limite deste cartão é {formatCurrency(card.dbl_creditLimit)}</p>
                </div>
              )}
              {!card.dbl_creditLimit && (
                <p className='font-normal text-gray-500'>Sem limite definido</p>
              )}

            </div>
          </div>
        </div>
      ))}
      <div className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg items-center justify-center'>
        <DialogAddNewCard userId={userId}/>
      </div>
    </>

  )
}

export default CardsList
