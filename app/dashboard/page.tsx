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

const InitialPage = async () => {

    {/* Talvez um background nesta cor? #9ACD32 */ }

    const horaAtual = new Date();
    const hora = horaAtual.getHours();

    // Determina a saudação com base na hora
    let saudacao;

    if (hora >= 5 && hora < 12) {
        saudacao = 'Bom dia';
    } else if (hora >= 12 && hora < 18) {
        saudacao = 'Boa tarde';
    } else {
        saudacao = 'Boa noite';
    }

    // Formatar a data para "8 de Abril, 2024"
    const dataFormatada = format(horaAtual, "d 'de' MMMM, yyyy", { locale: ptBR });

    // Obter o dia da semana "Segunda-Feira"
    const diaDaSemanaNone = format(horaAtual, 'eeee', { locale: ptBR });

    // Capitalizando a primeira letra do dia da semana
    const diaDaSemana = diaDaSemanaNone.charAt(0).toUpperCase() + diaDaSemanaNone.slice(1);

    const data = await getServerSession(authOptions);  

    const userId = data?.user.id;

    // Function to fetch data from the new API endpoint
    async function getVariableTransactions(userId: string | undefined): Promise<Transaction[]> {
        // If no userId, don't attempt to fetch
        if (!userId) {
            console.log("No user ID found, skipping transaction fetch.");
            return [];
        } 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/transactions/getTransactions?userId=${userId}&transactionType=Variable`, {
            //const response = await fetch(`/api/getTransactions`, {
                cache: 'no-store', 
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error in getTransactions:", error);
            return []; // Return empty array on error
        }
    }

    async function getFixedTransactions(userId: string | undefined): Promise<Transaction[]> {
        // If no userId, don't attempt to fetch
        if (!userId) {
            console.log("No user ID found, skipping transaction fetch.");
            return [];
        } 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/transactions/getTransactions?userId=${userId}&transactionType=Fixed`, {
            //const response = await fetch(`/api/getTransactions`, {
                cache: 'no-store', 
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error in getTransactions:", error);
            return []; // Return empty array on error
        }
    }

    async function getIncomeTransactions(userId: string | undefined): Promise<Transaction[]> {
        // If no userId, don't attempt to fetch
        if (!userId) {
            console.log("No user ID found, skipping transaction fetch.");
            return [];
        } 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/transactions/getTransactions?userId=${userId}&transactionType=Income`, {
            //const response = await fetch(`/api/getTransactions`, {
                cache: 'no-store', 
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error in getTransactions:", error);
            return []; // Return empty array on error
        }
    }

    const variableTransactionsData = await getVariableTransactions(userId);
    const fixedTransactionsData = await getFixedTransactions(userId);
    const incomeTransactionsData = await getIncomeTransactions(userId);

    return (
        <div className="flex flex-col items-center justify-between">
            <Header />

            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

                <div className="flex flex-col ">
                    <h1 className="text-2xl font-bold">{saudacao + ", " + data?.user?.name || data?.user?.username}!</h1>
                    <p>Que bom vê-lo novamente!</p>
                </div>

                <div className="flex flex-col text-end">
                    <h1 className="text-2xl font-bold">{dataFormatada}</h1>
                    <p>{diaDaSemana}</p>
                </div>

            </div>

            <div className="my-16 max-lg:w-[95%] max-lg:h-fit w-9/12 h-auto">

                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Despesas Variáveis</h3>
                            <p>Inclua aqui suas variáveis, até aquele açaí do final de semana 👀</p>
                        </div>
                        <DialogDPV userId={data?.user.id} transactionType="Variable"/>
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
                        <DialogDPV userId={data?.user.id} transactionType="Fixed"/>
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
                        <DialogDPV userId={data?.user.id} transactionType="Income"/>
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

export default InitialPage