import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { IoMdGift } from "react-icons/io";
import { TbTargetArrow } from "react-icons/tb";
import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'
import { Button } from '@/components/ui/button';
import DesiresListServer from './_components/DesiresListServer';
import { DataTableDecisionList } from './_components/dataTableDecisionList';
import { DesicaoDeCompra, outputColumns } from "./_components/DecisionColumns";
import DialogAddNewDecision from './_components/dialogAddNewDecision';

export default async function page() {

  const data = await getServerSession(authOptions);
  const userId = data?.user.id;

  async function getDecisions(userId: string | undefined): Promise<DesicaoDeCompra[]> {
    // If no userId, don't attempt to fetch
    if (!userId) {
      console.log("No user ID found, skipping transaction fetch.");
      return [];
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

      const response = await fetch(`${baseUrl}/api/decisions?userId=${userId}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in getTransactions:", error);
      return []; // Return empty array on error
    }
  }

  const decisionRows = await getDecisions(userId);

  return (
    <div className="flex flex-col items-center justify-between">
      <Header />
      <div className="flex max-lg-w-[95%] flex-col justify-between mt-16 w-[74%]">

        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <IoMdGift className="h-5 w-6 pr-2" />
            <h1 className="text-2xl font-bold">Lista de Desejos</h1>
          </div>
          <p>Liste seus desejos para o futuro!</p>
        </div>

        {/* Container para os cards de categoria */}
        <div className="flex flex-row max-lg:flex-nowrap flex-wrap max-lg:w-[95%] justify-start my-16 w-full p-1 gap-4">
          <DesiresListServer userId={userId} />
        </div>

        <hr className="border-t-2 border-gray-300 my-4" />

        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <TbTargetArrow className="h-5 w-6 pr-2" />
            <h1 className="text-2xl font-bold">Decisão de Compra</h1>
          </div>
          <p>Escolhas seus itens e decida quando comprá-los!</p>
        </div>

        <div className="flex flex-row flex-wrap max-lg:w-[95%] justify-center my-16 w-full p-1 gap-4">

          <div className="flex flex-col w-full bg-gray-100 rounded-md p-8 mb-8">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-[#01C14C]">Lista de Itens</h3>
                <p>Comprar ou não comprar?</p>
              </div>
              <DialogAddNewDecision userId={userId}/>
            </div>

            <div className="my-6 bg-white rounded-md">
              {/* Teste */}
              <DataTableDecisionList columns={outputColumns} data={decisionRows} />
            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  )
}
