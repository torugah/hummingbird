'use client'

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
import { useSession } from 'next-auth/react';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const InitialPage = () => {

    const { data: session } = useSession()

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
  const diaDaSemana = format(horaAtual, 'eeee', { locale: ptBR });

    const { data } = useSession();

    const invoices = [
        {
          invoice: "INV001",
          paymentStatus: "Paid",
          totalAmount: "$250.00",
          paymentMethod: "Credit Card",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV002",
          paymentStatus: "Pending",
          totalAmount: "$150.00",
          paymentMethod: "PayPal",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV003",
          paymentStatus: "Unpaid",
          totalAmount: "$350.00",
          paymentMethod: "Bank Transfer",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV004",
          paymentStatus: "Paid",
          totalAmount: "$450.00",
          paymentMethod: "Credit Card",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV005",
          paymentStatus: "Paid",
          totalAmount: "$550.00",
          paymentMethod: "PayPal",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV006",
          paymentStatus: "Pending",
          totalAmount: "$200.00",
          paymentMethod: "Bank Transfer",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
        {
          invoice: "INV007",
          paymentStatus: "Unpaid",
          totalAmount: "$300.00",
          paymentMethod: "Credit Card",
          date: "30/07/2024",
          type: "PIX - Banco Inter"
        },
      ]

    return (
        <div className="flex flex-col items-center justify-between">
            <Header />

            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

                <div className="flex flex-col ">
                    <h1 className="text-2xl font-bold">{saudacao + ", " + data?.user?.name}!</h1>
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
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
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
                        <Button>
                            Adicionar
                        </Button>
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
                                    <TableCell><FaPen className="text-[#FF9D0D]"/></TableCell> 
                                </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell>$2,500.00</TableCell>
                                <TableCell colSpan={3}></TableCell>
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
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
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