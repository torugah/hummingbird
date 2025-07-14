import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client'; // Import Prisma e tipos
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth'; // Ajuste o caminho se necessário
import { db } from "@/app/_lib/prisma";

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();
        const { categoryId } = body;

        if (!categoryId || typeof categoryId !== 'number') {
            return NextResponse.json({ message: 'ID da categoria é obrigatório e deve ser uma string.' }, { status: 400 });
        }

        // 1. Verificar se a categoria pertence ao usuário logado
        const categoryToDelete = await db.categoria.findUnique({
            where: { category_id: categoryId },
        });

        if (!categoryToDelete) {
            return NextResponse.json({ message: 'Categoria não encontrada.' }, { status: 404 });
        }

        // Assumindo que seu modelo Category tem um campo user_id
        if (categoryToDelete.user_id !== userId) {
            return NextResponse.json({ message: 'Não autorizado a remover esta categoria.' }, { status: 403 });
        }

        // 2. (IMPORTANTE) Verificar se existem transações associadas a esta categoria
        // Se existirem, você pode impedir a exclusão ou ter outra lógica de negócios
        // (ex: desassociar transações, permitir exclusão e deixar transações sem categoria, etc.)
        // Para este exemplo, vamos impedir a exclusão se houver transações.
        const relatedTransactionsCount = await db.transacao.count({ // Assumindo que seu modelo de transação é 'transaction'
            where: {
                str_category_id: categoryId, // E que ele tem um campo 'categoryId'
            },
        });

        if (relatedTransactionsCount > 0) {
            return NextResponse.json(
                { message: `Esta categoria não pode ser removida pois possui ${relatedTransactionsCount} transações associadas.` },
                { status: 409 } // 409 Conflict
            );
        }

        // 3. Deletar a categoria
        await db.categoria.delete({
            where: {
                category_id: categoryId,
                user_id: userId, // Segurança adicional: garantir que só delete se pertencer ao usuário
            },
        });

        return NextResponse.json({ message: 'Categoria removida com sucesso.' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao remover categoria:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Categoria não encontrada para remoção.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Erro interno do servidor ao tentar remover a categoria.' }, { status: 500 });
    } 
}