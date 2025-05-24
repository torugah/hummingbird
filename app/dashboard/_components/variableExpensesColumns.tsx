"use client"

import { ColumnDef } from "@tanstack/react-table"
import ActionsCell from "./actionsForColumns"; // Renomear a importação e o componente

// This type is used to define the shape of data.
export type Transaction = {
    id: number;
    category_id: number;
    str_name: string;
    dbl_valor: number;
    str_description: string;
    int_installmentCount: number;
    int_paymentForm: number;
    tipoPagamento?: {
        str_nomeTipoPgto?: string;
    };
    str_card_id: number;
    str_status: string;
    dtm_data: Date;
    category: {
        category_id: number;
        str_categoryName?: string
    }
    user_id: string;
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
        accessorKey: "tipoPagamento.str_nomeTipoPgto",
        header: "Forma",
        cell: ({ row }) => {
            const paymentFormNameFromType = row.original.tipoPagamento?.str_nomeTipoPgto;
            if (paymentFormNameFromType) {
                return <span>{paymentFormNameFromType}</span>;
            }
            return <span>"[Desconhecido]"</span>
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
        cell: ({ row }) => {
            const date = row.getValue("dtm_data") as Date;

            return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        }
    },
    {
        accessorKey: "category.str_categoryName",
        header: "Categoria",
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            return (
                <ActionsCell transaction={row.original} /> 
            )
        },
    },
]
