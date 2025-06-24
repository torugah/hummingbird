'use client'

import React, { useState } from 'react'
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { formatCurrency } from '@/lib/utils';
import DialogEditDeleteWish from './dialogEditDeleteWish';
import DialogAddNewWish from './dialogAddNewWish';
import { Desires } from './DesiresListServer';

interface DesireListClientProps {
  desires: Desires[];
  userId: string | null | undefined;
}

const DesiresListClient: React.FC<DesireListClientProps> = ({ desires, userId }) => {

  return (
    <>
      {desires.map((desire) => (
        <div key={desire.id} className='flex flex-col p-[0.1rem] w-[32%] h-fit bg-gray-100 border-gray-300 border-2 rounded-lg'>

          <div className={`flex flex-row items-center p-2 rounded-sm w-full h-fit aspect-video bg-cover 
                            bg-center ${(desire.str_image && desire.str_image !== 'none') 
                            ? `bg-[url('${process.env.NEXT_PUBLIC_API_URL || ''}${desire.str_image}')]` 
                            : `bg-[url('/img/NoDesireImage2.png')]`} justify-center`}>
          </div>

          <div className='flex flex-row h-fit justify-between p-2'>
            <div className='flex flex-col justify-around'>
                <p className="font-semibold">{desire.str_wishName}</p>
                {desire.dbl_wishValue !== null && desire.dbl_wishValue > 0 && (
                    <div className='flex flex-row items-center'>
                        <FaRegMoneyBill1 className='pr-2 h-4 w-6'/>
                        <p className='text-xs'>Meu limite de gastos é {formatCurrency(desire.dbl_wishValue)}</p>
                    </div>
                )}
                {!desire.dbl_wishValue && (
                    <p className='text-xs text-gray-500'>Sem limite definido</p>
                )}
            </div>
            <div className='flex flex-col text-end self-center'> 
                <DialogEditDeleteWish desiresToEdit={desire} userId={userId}/>
            </div>
          </div>
        </div>
      ))}
      
      <div className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg items-center justify-center'>
        <DialogAddNewWish userId={userId}/>
      </div>
    </>
  );
};

export default DesiresListClient;