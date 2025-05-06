import { Button } from "@/components/ui/button";
import Footer from "../_components/footer";
import Header from "../_components/header";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FaPen } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import DialogDPV from "../_components/dialogDespesaVariavel.";
import { DataTableVariableExpenses } from "./_components/dataTableVariableExpenses";
import { Transaction, columns } from "./_components/variableExpensesColumns";

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
    console.log(data)

    const invoices = [
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
        {
            invoice: "Algum Item",
            paymentStatus: "R$99,90",
            totalAmount: "1 de 3",
            paymentMethod: "Paid",
            date: "30/07/2024",
            type: "PIX - Banco Inter"
        },
    ]

    async function getDataMocked(): Promise<Transaction[]> {
        return [
            {
                id: 1234,
                category_id: 2,
                str_name: "MacDonalds",
                dbl_valor: 88.00,
                str_descricao: "Fui ao MacDonalds com a Lulu, e compramos dois Quarteirões",
                int_installmentCount: 1,
                int_paymentForm: 2,
                str_card_id: 7216,
                str_status: "Pago",
                dtm_data: new Date("April 6, 2025 15:24:00")
            },
        ]        
    }

    const userId = data?.user.id;

    // Function to fetch data from the new API endpoint
    async function getTransactions(userId: string | undefined): Promise<Transaction[]> {
        // If no userId, don't attempt to fetch
        if (!userId) {
            console.log("No user ID found, skipping transaction fetch.");
            return [];
        } 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/getTransactions?userId=${userId}`, {
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

    //const dataMocked = await getDataMocked();
    const transactionsData = await getTransactions(userId);

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
                        <DialogDPV userId={data?.user.id} />
                    </div>



                    <div className="my-6 bg-white rounded-md">
                        <DataTableVariableExpenses columns={columns} data={transactionsData} />
                    </div>




                </div>


                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Despesas Variáveis</h3>
                            <p>Inclua aqui suas variáveis, até aquele açaí do final de semana 👀</p>
                        </div>
                        <DialogDPV userId={data?.user.id} />
                    </div>



                    <div className="my-6 bg-white rounded-md">
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Identificador</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Nº da Parcela</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoice}>
                                        <TableCell>{invoice.invoice}</TableCell>
                                        <TableCell>{invoice.paymentStatus}</TableCell>
                                        <TableCell>{invoice.paymentMethod}</TableCell>
                                        <TableCell>{invoice.totalAmount}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.type}</TableCell>
                                        <TableCell><FaPen className="text-[#FF9D0D]" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={1}>Total</TableCell>
                                    <TableCell>$2,500.00</TableCell>
                                    <TableCell colSpan={5}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>




                </div>
                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Despesas Fixas</h3>
                            <p>Inclua aqui suas despesas fixas, aluguel por exemplo 🏠</p>
                        </div>
                        <DialogDPV userId={data?.user.id} />
                    </div>



                    <div className="my-6 bg-white rounded-md">
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Identificador</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Nº da Parcela</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoice}>
                                        <TableCell>{invoice.invoice}</TableCell>
                                        <TableCell>{invoice.paymentStatus}</TableCell>
                                        <TableCell>{invoice.paymentMethod}</TableCell>
                                        <TableCell>{invoice.totalAmount}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.type}</TableCell>
                                        <TableCell><FaPen className="text-[#FF9D0D]" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={1}>Total</TableCell>
                                    <TableCell>$2,500.00</TableCell>
                                    <TableCell colSpan={5}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>




                </div>
                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#01C14C]">Ganhos</h3>
                            <p>Cada um dos seus esforços em forma financeira! 💵</p>
                        </div>
                        <Button>
                            Adicionar
                        </Button>
                    </div>



                    <div className="my-6 bg-white rounded-md">
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Invoice</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoice}>
                                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                        <TableCell>{invoice.paymentStatus}</TableCell>
                                        <TableCell>{invoice.paymentMethod}</TableCell>
                                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={1}>Total</TableCell>
                                    <TableCell>$2,500.00</TableCell>
                                    <TableCell colSpan={5}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>




                </div>
            </div>

            <Footer />
        </div>
    );
}

export default InitialPage