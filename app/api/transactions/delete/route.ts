import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma e tipos
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth'; // Ajuste o caminho se necessário

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();
        const { id } = body;

        if (!id || typeof id !== 'number') {
            return NextResponse.json({ message: 'ID da transação é obrigatório e deve ser uma number.' }, { status: 400 });
        }

        // 1. Verificar se a Transação pertence ao usuário logado
        const categoryToDelete = await prisma.transacao.findUnique({
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
        await prisma.transacao.delete({
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
    } finally {
        await prisma.$disconnect();
    }
}