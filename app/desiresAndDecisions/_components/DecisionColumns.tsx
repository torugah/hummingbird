'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import ActionsCell from "./actionsForColumns"

export type DesicaoDeCompra = {
    id: number;
    str_user_id: string;
    wishList: {
        id: number;
        str_wishName: string
    }
    int_wishList_id: number;
    str_name: string;
    dbl_valor: number;
    str_brand: string;
    str_descriptionOrLink: string;
    bool_doIHaveMoney: boolean;
    bool_doIReallyNeed: boolean;
    bool_doIPlanned: boolean;
    dtm_createAt: Date;
    dtm_updateAt: Date;
}

const getDecisionText = (
    hasMoney: boolean,
    reallyNeed: boolean,
    planned: boolean
): string => {
    if (hasMoney && reallyNeed && planned) return "Comprar agora!";
    if (hasMoney && reallyNeed) return "Pode comprar";
    if (reallyNeed && planned) return "Planeje como adquirir";
    if (hasMoney && planned) return "Avalie se realmente precisa";
    if (reallyNeed) return "Considere economizar para comprar";
    if (planned) return "Não é prioridade no momento";
    return "Não comprar";
};

export const outputColumns: ColumnDef<DesicaoDeCompra>[] = [
    {
        accessorKey: "str_name",
        header: "Item",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue("str_name")}
            </div>
        )
    },
    {
        accessorKey: "wishList.str_wishName",
        header: "Categoria",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.original.wishList?.str_wishName || '-'}
            </div>
        )
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
            return <div className="whitespace-nowrap">{formatted}</div>
        }
    },
    {
        accessorKey: "str_brand",
        header: "Marca",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue("str_brand") || '-'}
            </div>
        )
    },
    {
        accessorKey: "str_descriptionOrLink",
        header: "Link",
        cell: ({ row }) => {
            const value = row.getValue("str_descriptionOrLink") as string;
            const isLink = value?.startsWith('http://') || value?.startsWith('https://');

            return (
                <div className="whitespace-nowrap">
                    {isLink ? (
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline hover:text-blue-600 whitespace-nowrap"
                        >
                            Link
                        </a>
                    ) : (
                        value || '-'
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "bool_doIHaveMoney",
        header: "Tenho dinheiro?",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                <Checkbox
                    checked={row.getValue("bool_doIHaveMoney")}
                    disabled
                />
            </div>
        ),
    },
    {
        accessorKey: "bool_doIReallyNeed",
        header: "Realmente preciso?",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                <Checkbox
                    checked={row.getValue("bool_doIReallyNeed")}
                    disabled
                />
            </div>
        ),
    },
    {
        accessorKey: "bool_doIPlanned",
        header: "Está planejado?",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                <Checkbox
                    checked={row.getValue("bool_doIPlanned")}
                    disabled
                />
            </div>
        ),
    },
    {
        id: "str_decision",
        header: "Decisão",
        cell: ({ row }) => {
            const hasMoney = row.getValue("bool_doIHaveMoney") as boolean;
            const reallyNeed = row.getValue("bool_doIReallyNeed") as boolean;
            const planned = row.getValue("bool_doIPlanned") as boolean;
            const decision = getDecisionText(hasMoney, reallyNeed, planned);

            return <div className="font-medium whitespace-nowrap">{decision}</div>;
        },
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                <ActionsCell purchaseDecision={row.original} user_id={row.original.str_user_id} />
            </div>
        ),
    },
]