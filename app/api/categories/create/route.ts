import { db } from "@/app/_lib/prisma";
import { TipoMovimento } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(req: Request){
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
        console.log(error)
        return NextResponse.json({ message: "Something went wrong!"}, {status: 500});
    }
}