// Importar o Prisma Client
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Função para buscar os bancos
export async function GET() {
  const banks = await prisma.banco.findMany(); 
  return NextResponse.json(banks);
}
