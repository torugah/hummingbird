// Importar o Prisma Client
import { db } from "@/app/_lib/prisma";
import { NextResponse } from 'next/server';

// Função para buscar os bancos
export async function GET() {
  const paymentMethod = await db.tipoPagamento.findMany(); 
  return NextResponse.json(paymentMethod);
}