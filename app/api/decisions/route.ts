import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient , Prisma } from '@prisma/client';
import { z } from "zod";
import { db } from "@/app/_lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
        }

        // Busque as categorias do usuário no banco de dados usando o Prisma
        const desires = await db.desicaoDeCompra.findMany({
            where: {
                str_user_id: userId
            }, 
            include: { wishList: true }
        });

        if (!desires || desires.length === 0) {
            return NextResponse.json([], { status: 200 }); // Retorna um array vazio se não houver categorias
        }

        return NextResponse.json(desires, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
    } 
}

const desireSchema = z.object({
    id: z.number().optional(),
    str_user_id: z.string().optional(),
    int_wishList_id: z.number().optional(),
    str_name: z.string().min(3, "Mínimo de 3 caracteres"),
    dbl_valor: z.number().min(0, "Valor deve ser positivo"), // Garante que é número e positivo
    str_brand: z.string().optional(),
    str_descriptionOrLink: z.string().optional(),
    bool_doIHaveMoney: z.boolean(),
    bool_doIReallyNeed: z.boolean(),
    bool_doIPlanned: z.boolean()
});

// API Create para Desejos
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // console.log("Received body:", body);

        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const validatedData = desireSchema.parse(body);
        // console.log("Validated data:", validatedData);

        const newCard = await db.desicaoDeCompra.create({
            data: {
                str_user_id: userId ? userId : '',
                int_wishList_id: validatedData.int_wishList_id,
                str_name: validatedData.str_name,
                dbl_valor: validatedData.dbl_valor,
                str_brand: validatedData?.str_brand,
                str_descriptionOrLink: validatedData.str_descriptionOrLink,
                bool_doIHaveMoney: validatedData.bool_doIHaveMoney,
                bool_doIReallyNeed: validatedData.bool_doIReallyNeed,
                bool_doIPlanned: validatedData.bool_doIPlanned
            },
        });

        return NextResponse.json(
            { newCard, message: "Decisão criada com sucesso" },
            { status: 201 }
        );

    } catch (error) {
        // console.log(error)
        return NextResponse.json({ message: "Something went wrong!", error }, { status: 500 });
    }
}

// API UPDATE para Cartões
export async function PUT(request: Request) {

    // console.log("Received request:", request);

    try {
        const body = await request.json();

        const validationResult = desireSchema.safeParse(body);

        if (!validationResult.success) {
            // console.log(validationResult.error.flatten().fieldErrors)
            return NextResponse.json({
                message: 'Dados de entrada inválidos.',
                errors: validationResult.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const validatedData = validationResult.data;

        if (validatedData.id === null || validatedData.id === undefined) {
            return NextResponse.json({
                message: `ID do cartão inválido. ${validatedData.id}`,
            }, { status: 400 });
        }

        const updatedCard = await db.desicaoDeCompra.update({
            where: {
                id: validatedData.id,
                str_user_id: validatedData.str_user_id,
            },
            data: {
                int_wishList_id: validatedData.int_wishList_id,
                str_name: validatedData.str_name,
                dbl_valor: validatedData.dbl_valor,
                str_brand: validatedData?.str_brand,
                str_descriptionOrLink: validatedData.str_descriptionOrLink,
                bool_doIHaveMoney: validatedData.bool_doIHaveMoney,
                bool_doIReallyNeed: validatedData.bool_doIReallyNeed,
                bool_doIPlanned: validatedData.bool_doIPlanned
            },
        });

        return NextResponse.json(
            { updatedCard, message: "Decisão atualizado com sucesso" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating this transaction:', error);

        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Decisão não encontrada ou não pertence ao usuário.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Erro interno do servidor ao atualizar a decisão.', error: error.message }, { status: 500 });
    }
}

// API DELETE para Cartões
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const body = await request.json();
        const decisionId = body.id;

        if (!decisionId || typeof decisionId !== 'number') {
            return NextResponse.json({ message: `ID do item é obrigatório e deve ser uma string. >${decisionId}<` }, { status: 400 });
        }

        // 1. Verificar se a cards pertence ao usuário logado
        const desireToDelete = await db.desicaoDeCompra.findUnique({
            where: { id: decisionId },
        });

        if (!desireToDelete) {
            return NextResponse.json({ message: 'Item não encontrado.' }, { status: 404 });
        }

        if (desireToDelete.str_user_id !== userId) {
            // console.log("IdFromAPI: ",desireToDelete.str_user_id, "IdFromClient: ", userId)
            return NextResponse.json({ message: 'Não autorizado a remover este item.' }, { status: 403 });
        }
        
        // const relatedItensCount = await db.desicaoDeCompra.count({ 
        //     where: {
        //         int_wishList_id: decisionId, 
        //     },
        // });

        // if (relatedItensCount > 0) {
        //     return NextResponse.json(
        //         { message: `Este desejo não pode ser removida pois possui ${relatedItensCount} itens associadas.` },
        //         { status: 409 } // 409 Conflict
        //     );
        // }

        // 3. Deletar o cartão
        await db.desicaoDeCompra.delete({
            where: {
                id: decisionId,
                str_user_id: userId, 
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