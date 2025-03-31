import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma"; 

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const userId = formData.get("userId") as string;
        const newNickname = formData.get("nickname") as string;

        if (!newNickname || !userId){
            return NextResponse.json({ error: "Não há qualquer texto!"}, {status: 400})
        }
            
        console.log(`ID do usuário: ${userId} - Apelido: ${newNickname}`)    

        await db.user.update({
            where: { id: userId },
            data: { username: newNickname},
        });

        return NextResponse.json({ message: "Novo apelido salvo!"});
    } catch (error) {
        console.error("Erro ao salvar um novo apelido.", error);
        return NextResponse.json({ error: "Erro interno no servidor."}, {status: 500});
    }
}