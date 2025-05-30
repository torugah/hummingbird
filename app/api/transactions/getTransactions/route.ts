import { PrismaClient } from '@prisma/client';
import { NextResponse , NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 1. Get userId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');  
    const transactionType = searchParams.get('transactionType'); 

    // 2. Check if userId was provided
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 }); // Bad Request
    }    

    // Fetch all records from the 'Trasacao' table
    const whereClause: any = {
      user_id: userId,
      bool_active: true,
    };

    // 3. Filter transactions by the logged-in user's ID and optionally by transaction type
    if (transactionType) {
      whereClause.str_transactionType = transactionType;
    }

    const transactions = await prisma.transacao.findMany({
      // 3. Filter transactions by the logged-in user's ID
      where: whereClause,
      /*orderBy: {
        dtm_data: 'desc',
      },*/
      include: { category: true , tipoPagamento: true }
      //include: { paymentMethod: true, card: { include: { bank: true } }, category: true }
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Return a more informative error response
    return NextResponse.json({ message: "Failed to fetch transactions", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}