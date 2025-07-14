import { db } from "@/app/_lib/prisma";
import { NextResponse , NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Get userId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');  
    const transactionType = searchParams.get('transactionType'); 
    const date = searchParams.get('date'); // Formato esperado: YYYY-MM

    // 2. Check if userId was provided
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 }); // Bad Request
    }    

    // Parse da data
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    if (date) {
        const [year, month] = date.split('-').map(Number);
        startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
        endDate = new Date(year, month, 0); // Último dia do mês
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

    // Adicionar filtro de data se existir
    if (startDate && endDate) {
      whereClause.dtm_data = {
        gte: startDate,
        lte: endDate
      };
    }

    const transactions = await db.transacao.findMany({
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