import { NextResponse } from 'next/server';
import { db } from "@/app/_lib/prisma";
import { z } from 'zod';
import { TipoTransacao , TipoMovimento } from "@prisma/client";
import { id } from 'date-fns/locale';

const updateTransactionSchema = z
  .object({
    id: z.number(),
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

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        
        const validationResult = updateTransactionSchema.safeParse(body);
        
        if (!validationResult.success) {
            // Return validation errors
            return NextResponse.json({
                message: 'Dados de entrada inválidos.',
                errors: validationResult.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const validatedData = validationResult.data;

        if (validatedData.id === null || validatedData.id === undefined){
            return NextResponse.json({
                message: `ID da categoria inválido. ${validatedData.id}`,
            }, { status: 400 });
        }

        //console.log("Attempting to update category with data:", validatedData);

        const updateCategory = await db.transacao.update({
            where: {
                id: validatedData.id,
                user_id: validatedData.userId,
            },
            data: {
                str_category_id: validatedData.categoryId,
                str_name: validatedData.itemName,
                str_description: validatedData.itemDescription,
                dbl_valor: validatedData.itemValue,
                bool_installment: validatedData.boolInstallment,
                int_installmentCount: validatedData.intInstallment,
                int_paymentForm: validatedData.paymentMethod,
                str_card_id: validatedData.cardID,
                str_status: validatedData.boolStatus,
                dtm_data: validatedData.date,
                bool_active: validatedData.boolActive,
            },
        });
        
        console.log("Category updated successfully.");
        return NextResponse.json({ message: 'Categoria atualizada com sucesso.', category: updateCategory }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error updating this transaction:', error);

        // Handle specific database errors if possible (e.g., record not found)
        // Example with Prisma:
        if (error.code === 'P2025') { // Prisma error code for record not found
             return NextResponse.json({ message: 'Transação não encontrada ou não pertence ao usuário.' }, { status: 404 });
        }

        // Generic error response
        return NextResponse.json({ message: 'Erro interno do servidor ao atualizar a transação.', error: error.message }, { status: 500 });
    }
}    