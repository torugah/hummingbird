import { z } from "zod";
import { db } from "@/app/_lib/prisma";
import { Prisma } from '@prisma/client';
import { NextResponse , NextRequest } from 'next/server';
import { TipoTransacao , TipoMovimento } from "@prisma/client";

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Desativa cache

//Define a schema for input validation
const transactionSchema = z
  .object({
    id: z.number().nullish(),
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

export async function POST(req: NextRequest) {
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

export async function GET(request: NextRequest) {
  try {
    // 1. Get userId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');  
    const transactionType = searchParams.get('transactionType'); 
    const date = searchParams.get('date'); // Formato esperado: YYYY-MM
    
    //Específico
    const betweenDate = searchParams.get('betweenDate'); // Novo parâmetro: data inicial (YYYY-MM)
    const andDate = searchParams.get('andDate'); // Novo parâmetro: data final (YYYY~MM)

    // 2. Check if userId was provided
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 }); // Bad Request
    }    

    // Parse da data
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    if (date) {
        const [year, month] = date.split('-').map(Number);
        startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
        endDate = new Date(year, month, 0); // Último dia do mês
    }

    // Intervalo personalizado (dataInicial e dataFinal)
    if (betweenDate && andDate) {
        const [startYear, startMonth] = betweenDate.split('~').map(Number);
        const [endYear, endMonth] = andDate.split('~').map(Number);
        
        startDate = new Date(startYear, startMonth - 1, 1); // Primeiro dia do mês inicial
        endDate = new Date(endYear, endMonth, 0); // Último dia do mês final
    } 

    // Fetch all records from the 'Trasacao' table
    const whereClause: any = {
      user_id: userId,
      bool_active: true,
    };

    // 3. Filter transactions by the logged-in user's ID and optionally by transaction type
    if (transactionType) {
      whereClause.str_transactionType = transactionType;
    }

    // Adicionar filtro de data se existir
    if (startDate && endDate) {
      whereClause.dtm_data = {
        gte: startDate,
        lte: endDate
      };
    }

    const transactions = await db.transacao.findMany({
      // 3. Filter transactions by the logged-in user's ID
      where: whereClause,
      /*orderBy: {
        dtm_data: 'desc',
      },*/
      include: { category: true , tipoPagamento: true }
      //include: { paymentMethod: true, card: { include: { bank: true } }, category: true }
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Return a more informative error response
    return NextResponse.json({ message: "Failed to fetch transactions", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        
        const validationResult = transactionSchema.safeParse(body);
        
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

export async function DELETE(req: NextRequest) {
    try {

        const body = await req.json();
        const { id , userId } = body;

        if (!id || typeof id !== 'number') {
            return NextResponse.json({ message: 'ID da transação é obrigatório e deve ser uma number.' }, { status: 400 });
        }

        // 1. Verificar se a Transação pertence ao usuário logado
        const categoryToDelete = await db.transacao.findUnique({
            where: { id: id },
        });

        if (!categoryToDelete) {
            return NextResponse.json({ message: 'Transação não encontrada.' }, { status: 404 });
        }

        // Assumindo que seu modelo Category tem um campo user_id
        if (categoryToDelete.user_id !== userId) {
            return NextResponse.json({ message: 'Não autorizado a remover esta transação.' }, { status: 403 });
        }

        // 3. Deletar a transação
        await db.transacao.delete({
            where: {
                id: id,
                user_id: userId, // Segurança adicional: garantir que só delete se pertencer ao usuário
            },
        });

        return NextResponse.json({ message: 'Transação removida com sucesso.' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao remover transação:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Transação não encontrada para remoção.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Erro interno do servidor ao tentar remover a transação.' }, { status: 500 });
    } 
}