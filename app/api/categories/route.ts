import { z } from "zod";
import { db } from "@/app/_lib/prisma";
import { Prisma } from '@prisma/client'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';
import { TipoMovimento } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0 

const categorySchema = z.object({	
    user_id: z.string(),
    str_categoryName: z.string(),	
    str_movimentType: z.nativeEnum(TipoMovimento),	
    bool_hasBudgetLimit: z.boolean(),	
    dbl_budgetLimit: z.number().nullable(),
    str_image: z.string().nullable(),
    bool_active: z.boolean(),	    
})

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const {
            user_id, 
            str_categoryName, 
            str_movimentType, 
            bool_hasBudgetLimit, 
            dbl_budgetLimit, 
            str_image,
            bool_active
        } = categorySchema.parse(body);

        const newCategory = await db.categoria.create({
            data: {
                str_categoryName: str_categoryName,
                str_movimentType: str_movimentType,
                bool_hasBudgetLimit: bool_hasBudgetLimit,
                dbl_budgetLimit: dbl_budgetLimit,
                str_image: str_image ?? "",
                bool_active: bool_active,
                user_id: user_id
            }, 
        });

        return NextResponse.json({newCategory: newCategory, message: "A new category has been created successfully" } ,{status: 201})
    } catch (error) {
        // console.log(error)
        return NextResponse.json({ message: "Something went wrong!"}, {status: 500});
    }
}

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

// Define the Zod schema for the expected request body
const updateCategorySchema = z.object({
    category_id: z.number().int(),
    user_id: z.string(),
    str_categoryName: z.string().min(3, "O nome da categoria deve ter pelo menos 3 caracteres.").max(80),
    str_movimentType: z.enum(["Input", "Output"], { errorMap: () => ({ message: "Tipo de movimentação inválido." }) }),
    bool_hasBudgetLimit: z.boolean(),
    // dbl_budgetLimit is nullable, but required if bool_hasBudgetLimit is true
    dbl_budgetLimit: z.number().nullable(),
}).refine(data => {
    // Custom validation: if hasBudgetLimit is true, budgetLimit must be a positive number
    if (data.bool_hasBudgetLimit) {
        return data.dbl_budgetLimit !== null && data.dbl_budgetLimit !== undefined && data.dbl_budgetLimit > 0;
    }
    return true; // If no budget limit, no validation needed for the value
}, {
    message: "O limite do orçamento deve ser um valor positivo quando habilitado.",
    path: ["dbl_budgetLimit"], // Point the error to the budget limit field
});

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validationResult = updateCategorySchema.safeParse(body);

        if (!validationResult.success) {
            // Return validation errors
            return NextResponse.json({
                message: 'Dados de entrada inválidos.',
                errors: validationResult.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const validatedData = validationResult.data;

        // --- Database Update Logic ---
        // Replace this section with your actual database update code
        // console.log("Attempting to update category with data:", validatedData);

        // Example using a hypothetical Prisma client:
        
        const updateCategory = await db.categoria.update({
            where: {
                category_id: validatedData.category_id,
                user_id: validatedData.user_id, // Ensure the category belongs to the user
            },
            data: {
                str_categoryName: validatedData.str_categoryName,
                str_movimentType: validatedData.str_movimentType,
                bool_hasBudgetLimit: validatedData.bool_hasBudgetLimit,
                // Set dbl_budgetLimit to null if bool_hasBudgetLimit is false
                dbl_budgetLimit: validatedData.bool_hasBudgetLimit ? validatedData.dbl_budgetLimit : null,
                // Add other fields if necessary, e.g., str_image, bool_active
            },
        });
        

        // Placeholder success response (replace with actual database result if needed)
        // If using Prisma, you might return NextResponse.json(updatedCategory, { status: 200 });

        // console.log("Category updated successfully (simulated).");
        return NextResponse.json({ message: 'Categoria atualizada com sucesso.', category: updateCategory }, { status: 200 });

        // --- End Database Update Logic ---

    } catch (error: any) {
        console.error('Error updating category:', error);

        // Handle specific database errors if possible (e.g., record not found)
        // Example with Prisma:
        if (error.code === 'P2025') { // Prisma error code for record not found
             return NextResponse.json({ message: 'Categoria não encontrada ou não pertence ao usuário.' }, { status: 404 });
        }

        // Generic error response
        return NextResponse.json({ message: 'Erro interno do servidor ao atualizar a categoria.', error: error.message }, { status: 500 });
    }
}

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