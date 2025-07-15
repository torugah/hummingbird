import Footer from "../_components/footer";
import Header from "../_components/header";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import DialogDPV from "../_components/dialogDespesaVariavel";
import { DataTableVariableExpenses } from "./_components/dataTableVariableExpenses";
import { Transaction, outputColumns } from "./_components/variableExpensesColumns";
import { incomeColumns } from "./_components/incomeRecipiesColumns";
import { PieChartByCategory } from "./_components/resumeAllChart";
import EmblaCarousel from "./_components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MonthYearSelector } from "../_components/monthYearSelector";
import { useToast } from "@/components/hooks/use-toast";

interface InitialPageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

export const dynamic = 'force-dynamic'

export default async function InitialPage({ searchParams }: InitialPageProps) {
    const horaAtual = new Date();
    const hora = horaAtual.getHours();
    const data = await getServerSession(authOptions);
    const userId = data?.user.id;
    const { toast } = useToast();

    // Determina o mês/ano a ser visualizado
    const currentMonth = searchParams.month ? parseInt(searchParams.month) - 1 : horaAtual.getMonth();
    const currentYear = searchParams.year ? parseInt(searchParams.year) : horaAtual.getFullYear();
    const currentViewDate = new Date(currentYear, currentMonth, 1);

    // Função para gerar URL com parâmetros de data
    const getDateUrl = (date: Date) => {
        return `?month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
    };

    // Funções para buscar transações
    async function getTransactions(type: 'Variable' | 'Fixed' | 'Income') {
        if (!userId) {
            toast({
                title: "Sem Usuário!",
                description: `Não foi possível encontrar um usuário... Data: ${data}`,
            })
            return [];
        };
        try {
            const response = await fetch(
                `/api/transactions/getTransactions?userId=${userId}&transactionType=${type}&date=${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`, 
                { cache: 'no-store' }
            );
            if (!response.ok) throw new Error(`Failed to fetch ${type} transactions. Status: ${response.status}`);
            return await response.json() as Transaction[];
        } catch (error) {
            console.error(`Error in get${type}Transactions:`, error);
            return [];
        }
    }

    const [variableTransactionsData, fixedTransactionsData, incomeTransactionsData] = await Promise.all([
        getTransactions('Variable'),
        getTransactions('Fixed'),
        getTransactions('Income')
    ]);

    const chartComponents = [
        <PieChartByCategory 
            key="variable-transactions" 
            transactions={variableTransactionsData} 
        />,
        <PieChartByCategory 
            key="fixed-transactions" 
            transactions={fixedTransactionsData} 
        />,
        <PieChartByCategory 
            key="income-transactions" 
            transactions={incomeTransactionsData} 
        />
    ];

    const OPTIONS: EmblaOptionsType = { loop: true };

    // Determina a saudação com base na hora
    const saudacao = hora >= 5 && hora < 12 ? 'Bom dia' : 
                    hora >= 12 && hora < 18 ? 'Boa tarde' : 'Boa noite';

    // Função para formatar valores em BRL
    const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
    };

    // Calcula o total a pagar (todas as despesas)
    const totalAPagar = [...variableTransactionsData, ...fixedTransactionsData]
    //.filter(transaction => transaction.str_status !== 'futura' )
    .reduce((sum, transaction) => sum + transaction.dbl_valor, 0);

    // Calcula o total já pago (despesas com status "Pago")
    const totalJaPaguei = [...variableTransactionsData, ...fixedTransactionsData]
    .filter(transaction => transaction.str_status === 'pago' )
    .filter(transaction => transaction.str_status !== 'futura')
    .reduce((sum, transaction) => sum + transaction.dbl_valor, 0);

    // Calcula o total de rendimentos
    const totalRendimentos = incomeTransactionsData
    .reduce((sum, transaction) => sum + transaction.dbl_valor, 0);

    // Calcula o restante (rendimentos - total a pagar)
    const restante = totalRendimentos - totalAPagar;

    // Calcula o VRC (rendimentos - já pago)
    const vrc = totalRendimentos - totalJaPaguei;                

    return (
        <div className="flex flex-col items-center justify-between">
            <Header />

            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%] text-gray-700">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{saudacao + ", " + data?.user?.name || data?.user?.username}!</h1>
                    <p>Que bom vê-lo novamente!</p>
                </div>

                <div className="flex flex-col text-end">
                    <h1 className="text-2xl font-bold">{format(horaAtual, "d 'de' MMMM, yyyy", { locale: ptBR })}</h1>
                    <p>{format(horaAtual, 'eeee', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}</p>
                </div>
            </div>

            <div className="my-16 max-lg:w-[95%] justify-center max-lg:h-fit w-9/12 h-auto">
                <div className='mb-8 pl-2 text-2xl justify-start flex flex-row items-center'>
                    <MonthYearSelector initialDate={currentViewDate} />

                    

                    <p className="text-3xl font-bold text-[#01C14C]">
                        Visualizando {format(currentViewDate, 'MMMM, yyyy', { locale: ptBR })}.
                    </p>

                    <a 
                        href={getDateUrl(new Date(currentYear, currentMonth - 1, 1))}
                        className="ml-1 p-1 hover:bg-gray-100 rounded"
                    >
                        <FaChevronLeft className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pl-[0.125rem] pr-1" />                        
                    </a>
                    <a 
                        href={getDateUrl(new Date(currentYear, currentMonth + 1, 1))}
                        className="ml-0 p-1 hover:bg-gray-100 rounded"
                    >   
                        <FaChevronRight className="text-[#01C14C] border-[#01C14C] border-2 rounded-full py-1 pr-[0.125rem] pl-1" />  
                    </a>                            
                    
                </div>
                
                <div className='mb-8 p-4 bg-gray-100 rounded-md justify-around flex flex-row'>
                <div>
                    <span className="text-[#01C14C] font-bold">A pagar: </span>
                    <span className="text-gray-700">{formatBRL(totalAPagar)}</span>
                </div>
                <div>
                    <span className="text-[#01C14C] font-bold">Já paguei: </span>
                    <span className="text-gray-700">{formatBRL(totalJaPaguei)}</span>
                </div>
                <div>
                    <span className="text-[#01C14C] font-bold">Restante: </span>
                    <span className={`${restante < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                    {formatBRL(restante)}
                    </span>
                </div>
                <div>
                    <span className="text-[#01C14C] font-bold">VRC: </span>
                    <span className={`${vrc < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                    {formatBRL(vrc)}
                    </span>
                </div>
                </div>

                <div className="pb-8">
                    <EmblaCarousel components={chartComponents} options={OPTIONS} />
                </div>

                {/* Restante do seu código permanece igual */}
                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Despesas Variáveis</h3>
                            <p>Inclua aqui suas variáveis, até aquele açaí do final de semana 👀</p>
                        </div>
                        <DialogDPV userId={data?.user.id} transactionType="Variable" />
                    </div>

                    <div className="my-6 bg-white rounded-md">
                        <DataTableVariableExpenses columns={outputColumns} data={variableTransactionsData} />
                    </div>
                </div>

                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Despesas Fixas</h3>
                            <p>Inclua aqui suas despesas fixas, aluguel por exemplo 🏠</p>
                        </div>
                        <DialogDPV userId={data?.user.id} transactionType="Fixed" />
                    </div>

                    <div className="my-6 bg-white rounded-md">
                        <DataTableVariableExpenses columns={outputColumns} data={fixedTransactionsData} />
                    </div>
                </div>

                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Ganhos</h3>
                            <p>Cada um dos seus esforços em forma financeira! 💵</p>
                        </div>
                        <DialogDPV userId={data?.user.id} transactionType="Income" />
                    </div>

                    <div className="my-6 bg-white rounded-md">
                        <DataTableVariableExpenses columns={incomeColumns} data={incomeTransactionsData} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}