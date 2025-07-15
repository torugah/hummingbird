import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/app/_lib/prisma";

export const dynamic = 'force-dynamic' // Desativa Static Site Generation
export const revalidate = 0 // Desativa cache

// API Read para Cartões
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
        }
        //console.log("ID do usuário:", userId); // Print no console do servidor

        const userCards = await db.cartao.findMany({
            where: {
                str_user_id: userId,
                bool_active: true // Retornará apenas cartões ativos!
            },
            include: {
                bank: true,
            },
        });

        //console.log("Cartões encontrados:", userCards);


        return NextResponse.json(userCards, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar cartões:", error);
        return NextResponse.json({ error: "Erro ao buscar cartões" }, { status: 500 });
    }
}

const cardSchema = z.object({
    card_id: z.number().optional(),
    str_user_id: z.string(),
    str_bank_id: z.number().min(1, "Selecione um banco"),
    dbl_creditLimit: z.number(),
    dtm_dueDate: z.string().transform(str => new Date(str)), // Converte string para Date
    str_lastNumbers: z.string().min(4).max(4)
})

// API Create para Cartões
export async function POST(request: Request) {
    try {
        const body = await request.json(); // Corrigido - chamando o método
        console.log("Received body:", body);

        const validatedData = cardSchema.parse(body);
        console.log("Validated data:", validatedData);

        const newCard = await db.cartao.create({
            data: {
                str_user_id: validatedData.str_user_id,
                str_bank_id: validatedData.str_bank_id,
                str_transaction_id: 0, // Valor padrão
                dbl_creditLimit: validatedData.dbl_creditLimit,
                dtm_dueDate: validatedData.dtm_dueDate,
                str_lastNumbers: validatedData.str_lastNumbers,
                bool_active: true
            },
        });

        return NextResponse.json(
            { newCard, message: "Cartão criado com sucesso" },
            { status: 201 }
        );

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong!",error}, {status: 500});
    }
}

// API UPDATE para Cartões
export async function PUT(request: Request) {

    try {
        const body = await request.json();

        const validationResult = cardSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                message: 'Dados de entrada inválidos.',
                errors: validationResult.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const validatedData = validationResult.data;

        if (validatedData.card_id === null || validatedData.card_id === undefined) {
            return NextResponse.json({
                message: `ID do cartão inválido. ${validatedData.card_id}`,
            }, { status: 400 });                    
        }

        const updatedCard = await db.cartao.update({
            where: {
                card_id: validatedData.card_id,
                str_user_id: validatedData.str_user_id,
            },
            data: {
                str_bank_id: validatedData.str_bank_id, 
                dbl_creditLimit: validatedData.dbl_creditLimit,
                dtm_dueDate: validatedData.dtm_dueDate,
                str_lastNumbers: validatedData.str_lastNumbers,
            },
        });

        return NextResponse.json(
            { updatedCard, message: "Cartão atualizado com sucesso" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating this transaction:', error);

        if (error.code === 'P2025') { 
             return NextResponse.json({ message: 'Transação não encontrada ou não pertence ao usuário.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Erro interno do servidor ao atualizar a transação.', error: error.message }, { status: 500 });
    }
}

// API DELETE para Cartões
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const body = await request.json();
        const cardId = body.id;

        if (!cardId || typeof cardId !== 'number') {
            return NextResponse.json({ message: `ID do cartão é obrigatório e deve ser uma string. >${cardId}<` }, { status: 400 });
        }

        // 1. Verificar se a cards pertence ao usuário logado
        const cardToDelete = await db.cartao.findUnique({
            where: { card_id: cardId },
        });

        if (!cardToDelete) {
            return NextResponse.json({ message: 'Cartão não encontrada.' }, { status: 404 });
        }

        // Assumindo que seu modelo Category tem um campo user_id
        if (cardToDelete.str_user_id !== userId) {
            return NextResponse.json({ message: 'Não autorizado a remover este cartão.' }, { status: 403 });
        }

        // 2. (IMPORTANTE) Verificar se existem transações associadas a este cartão
        // Se existirem, você pode impedir a exclusão ou ter outra lógica de negócios
        // (ex: desassociar transações, permitir exclusão e deixar transações sem cartão, etc.)
        // Para este exemplo, vamos impedir a exclusão se houver transações.
        const relatedTransactionsCount = await db.transacao.count({ // Assumindo que seu modelo de transação é 'transaction'
            where: {
                str_card_id: cardId, // E que ele tem um campo 'cardId'
            },
        });

        if (relatedTransactionsCount > 0) {
            return NextResponse.json(
                { message: `Este cartão não pode ser removida pois possui ${relatedTransactionsCount} transações associadas.` },
                { status: 409 } // 409 Conflict
            );
        }

        // 3. Deletar o cartão
        await db.cartao.delete({
            where: {
                card_id: cardId,
                str_user_id: userId, // Segurança adicional: garantir que só delete se pertencer ao usuário
            },
        });

        return NextResponse.json({ message: 'Categoria removida com sucesso.' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao remover este cartão:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Categoria não encontrada para remoção.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Erro interno do servidor ao tentar remover o cartão.' }, { status: 500 });
    } 
}
