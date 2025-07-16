// c:\Users\Fillipi\Desktop\Humming\hummingbird\app\api\categories\getByUserId\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/_lib/prisma';

export const dynamic = 'force-dynamic' 

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get('userId');  

        if (!userId) {
            return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
        }

        // Busque as categorias do usuário no banco de dados usando o Prisma
        const categories = await db.categoria.findMany({
            where: {
                user_id: userId,
                bool_active: true,
            },
            select: {
                category_id: true,
                str_categoryName: true,
                str_movimentType: true,
                bool_hasBudgetLimit: true,
                dbl_budgetLimit: true,
                str_image: true,
                bool_active: true,
            },
        });

        if (!categories || categories.length === 0) {
            return NextResponse.json([], { status: 200 }); // Retorna um array vazio se não houver categorias
        }

        return NextResponse.json(categories, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
    } 
}
