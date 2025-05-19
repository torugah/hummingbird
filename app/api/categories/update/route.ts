import { NextResponse } from 'next/server';
import { db } from "@/app/_lib/prisma";
import { z } from 'zod';
// Assuming you have a database client setup, e.g., Prisma
// import prisma from '@/lib/prisma'; // Adjust the import path as needed

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
        console.log("Attempting to update category with data:", validatedData);

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

        console.log("Category updated successfully (simulated).");
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

// You might also want to add handlers for other HTTP methods if needed,
// but based on the frontend, only PUT is used for update.
// export async function GET(request: Request) {}
// export async function POST(request: Request) {}
// export async function DELETE(request: Request) {}