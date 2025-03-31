import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/app/_lib/prisma"; // Importando a instância correta do Prisma

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "Arquivo ou ID do usuário ausente." }, { status: 400 });
    }

    // Converta o arrayBuffer em Buffer e depois para um Uint8Array
    const buffer = Buffer.from(await file.arrayBuffer());
    const uint8Array = new Uint8Array(buffer);

    const fileExtension = path.extname(file.name);
    //console.log(`Extensão do Arquivo é: ${fileExtension}`)
    const fileName = `${userId}${fileExtension}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // Agora, use uint8Array para o writeFile
    await writeFile(filePath, uint8Array);

    const imageUrl = `http://localhost:3000/uploads/${fileName}`; // URL relativa para acessar a imagem

    // Atualizando o usuário no banco de dados
    await db.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ message: "Imagem enviada com sucesso!", imageUrl });
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
