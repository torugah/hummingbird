import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { TipoTransacao , TipoMovimento } from "@prisma/client";

//Define a schema for input validation
const transactionSchema = z
  .object({
    userId: z.string(),
    categoryId: z.number(),
    itemName: z.string(),
    itemValue: z.number(),
    transactionalType: z.nativeEnum(TipoTransacao),
    movimentType: z.nativeEnum(TipoMovimento),
    itemDescription: z.string().nullish(),
    boolInstallment: z.boolean(),
    intInstallment: z.number().nullish(),
    Installmentdate: z.coerce.date().nullish(),
    paymentMethod: z.number(),
    cardID: z.number(),      
    boolStatus: z.string(),
    date: z.coerce.date(),
    boolActive: z.boolean(),
  })

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { 
        userId, categoryId, itemName, itemValue, transactionalType, 
        movimentType, itemDescription, boolInstallment, intInstallment, 
        Installmentdate, paymentMethod, cardID, boolStatus, date, 
        boolActive 
      } = transactionSchema.parse(body);

      const newTransaction = await db.transacao.create({
        data: {
          user_id: userId,
          str_category_id: categoryId,
          str_name: itemName,
          dbl_valor: itemValue,
          str_transactionType: transactionalType,
          str_movimentType: movimentType,
          str_description: itemDescription,
          bool_installment: boolInstallment,
          int_installmentCount: intInstallment,
          dtm_currentInstallmentDate: Installmentdate,
          int_paymentForm: paymentMethod, 
          str_card_id: cardID,
          str_status: boolStatus,
          dtm_data: date,
          bool_active: boolActive,
        }
      })
      
      return NextResponse.json({ newTransaction: newTransaction, message: "A new transaction has been created successfully" }, {status: 201})
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message: "Something went wrong!"}, {status: 500});
    }
}