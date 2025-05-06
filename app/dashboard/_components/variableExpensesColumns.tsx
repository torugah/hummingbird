"use client"

import { ColumnDef } from "@tanstack/react-table"
import internal from "stream"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
    id: number
    category_id: number
    str_name: string
    dbl_valor: number
    str_descricao: string
    int_installmentCount: number
    int_paymentForm: number
    str_card_id: number
    str_status: string
    dtm_data: Date
}

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "str_name",
        header: "Item",
    },
    {
        accessorKey: "dbl_valor",
        header: "Valor",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("dbl_valor"))

            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount)

            return <div>{formatted}</div>
        }
        
    },
    {
        accessorKey: "int_installmentCount",
        header: "Condição",
        cell: ({ row }) => {
            const installmentCount = row.getValue("int_installmentCount") as number;

            if (installmentCount === 1) {
                return <span>À Vista</span>; // Or "case 1" as in your example
            } else if (installmentCount > 1) {
                return <span>{`1 de ${installmentCount}`}</span>; // Or "case 2", or format as needed
            }
            return <span>-</span>; // Handle other cases if necessary (e.g., 0 or null)
        }
    },
    {
        accessorKey: "int_paymentForm",
        header: "Forma",
        cell: ({ row }) => {
            const paymentForm = row.getValue("int_paymentForm") as number;

            if (paymentForm === 1) {
                return <span>Dinheiro</span>; 
            } else if (paymentForm === 2) {
                return <span>PIX</span>;   
            } else if (paymentForm === 3) {
                return <span>Débito</span>;                    
            } else if (paymentForm === 4) {
                return <span>Crédito</span>;
            }    
            return <span>-</span>;
        }    
    },
    {
        accessorKey: "str_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("str_status") as string;
            // Simple uppercase
            // return <span>{status.toUpperCase()}</span>;
            // Or capitalize the first letter only
            return <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
        }
    },
    {
        accessorKey: "dtm_data",
        header: "Data",
        cell: ({row}) => {
            const date = row.getValue("dtm_data") as Date;

            return new Date(date).toLocaleDateString('pt-BR' , { timeZone: 'UTC' })
        }
    },
    {
        accessorKey: "category_id",
        header: "Categoria",
    },
]
