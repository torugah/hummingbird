import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions); // Passando authOptions 
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
        }

        const str_user_id = session.user.id;
        //console.log("ID do usuário:", str_user_id); // Print no console do servidor

        const userCards = await prisma.cartao.findMany({
            where: { 
                str_user_id,
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
