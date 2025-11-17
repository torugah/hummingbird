import { db } from "@/app/_lib/prisma";
import { NextResponse , NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams;
    const cardId = searchParams.get('cardId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const paymentMethod = searchParams.get('paymentMethod');

    // Validar parâmetros obrigatórios
    if (!cardId || !startDate || !endDate) {
      return NextResponse.json(
        { message: "cardId, startDate e endDate são parâmetros obrigatórios" }, 
        { status: 400 }
      );
    }

    // Converter datas
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validar datas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { message: "Datas inválidas. Use formato ISO 8601" }, 
        { status: 400 }
      );
    }

    // Construir cláusula where
    const whereClause: any = {
      str_card_id: parseInt(cardId),
      bool_active: true,
      dtm_data: {
        gte: start,
        lte: end
      }
    };

    // Filtrar por método de pagamento se especificado
    if (paymentMethod) {
      // Primeiro, buscar o ID do método de pagamento 'credito'
      const creditPaymentMethod = await db.tipoPagamento.findFirst({
        where: {
          str_nomeTipoPgto: 'credito'
        }
      });

      if (creditPaymentMethod) {
        whereClause.int_paymentForm = creditPaymentMethod.id;
      }
    }

    // Buscar transações
    const transactions = await db.transacao.findMany({
      where: whereClause,
      select: {
        dbl_valor: true,
        str_name: true,
        dtm_data: true,
        str_status: true,
        tipoPagamento: {
          select: {
            str_nomeTipoPgto: true
          }
        }
      },
      orderBy: {
        dtm_data: 'asc'
      }
    });

    // Formatar resposta
    const formattedTransactions = transactions.map(transaction => ({
      value: transaction.dbl_valor,
      name: transaction.str_name,
      date: transaction.dtm_data,
      status: transaction.str_status,
      paymentMethod: transaction.tipoPagamento?.str_nomeTipoPgto
    }));

    return NextResponse.json(
      { 
        transactions: formattedTransactions,
        total: formattedTransactions.reduce((sum, t) => sum + t.value, 0),
        count: formattedTransactions.length
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch credit transactions", 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}