"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import ActionsCell from "./actionsForColumns"; 
import { Button } from "@/components/ui/button";

// This type is used to define the shape of data.
export type Transaction = {
    id: number;
    category_id: number;
    str_name: string;
    dbl_valor: number;
    str_transactionType: string;
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
        str_categoryName: string
    }
    user_id: string;
}

export const outputColumns: ColumnDef<Transaction>[] = [

    {
        accessorKey: "str_name",
        //header: "Item",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Item
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "dbl_valor",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Valor
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Condição
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Forma
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const paymentFormNameFromType = row.original.tipoPagamento?.str_nomeTipoPgto;
            if (paymentFormNameFromType) {
                return <span>{paymentFormNameFromType}</span>;
            }
            return <span>{`"[Desconhecido]"`}</span>
        }
    },
    {
        accessorKey: "str_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Data
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("dtm_data") as Date;

            return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        }
    },
    {
        accessorKey: "category.str_categoryName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-1 rounded-full"
                >
                    Categoria
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
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
