'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from "date-fns/locale"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/components/hooks/use-toast"
import { useRouter } from "next/navigation"
import { NumericFormat } from 'react-number-format';
import { InstallmentHandler } from "../dashboard/_components/installmentHandler"
import Link from "next/link"
import { CardStatusAlert } from "../dashboard/_components/cardStatusAlert"

const FormSchema = z
    .object({
        itemName: z.string().min(3, "Mínimo de 3 caracteres.").max(50, "Máximo de 50 caracteres.").nonempty("Obrigatório"),
        itemValue: z.number().min(0.01, "Item não pode ser menor que R$0,01"),
        itemDescription: z.string(),
        category: z.number({ required_error: "Obrigatório" }).nullable(),
        boolInstallment: z.boolean().optional(),
        intInstallment: z.number().min(1, "This cannot be divided into zero or less"),
        cardID: z.number({ required_error: "Obrigatório" }).nonnegative("Obrigatório"),
        Installmentdate: z.date().optional(),
        paymentMethod: z.number({ required_error: "Obrigatório" }).nonnegative("Obrigatório"),
        date: z.date(),
        boolStatus: z.string({ required_error: "Obrigatório" })
    })
    .refine((data) => {
        // Se está parcelado, deve ter mais de 1 parcela
        if (data.boolInstallment) {
            return data.intInstallment > 1
        }
        return true
    }, {
        message: "Parcelamento deve ter pelo menos 2 parcelas",
        path: ["intInstallment"]
    });

interface Bank {
    bank_id: number;
    str_bankName: string;
}

interface Cartao {
    card_id: number;
    str_user_id: string; // ID do usuário
    str_bank_id: number; // ID do banco associado
    bank: Bank; // Relação com o banco
    dbl_creditLimit: number;
    str_lastNumbers: string;
    dtm_dueDate?: string; // Adicione esta linha
    int_bestDate?: number; // Adicione esta linha
}

interface PaymentMethod {
    id: number;
    str_nomeTipoPgto: string;
}

interface Categoria {
    category_id: number;
    str_categoryName: string;
    str_movimentType: string;
}

// Define o tipo das props que o componente vai receber
interface ChildComponentProps {
    userId: string | null | undefined;
    transactionType: string;
}

interface InstallmentData {
  installmentNumber: number
  value: number
  dueDate: Date
  status: string
}

const DialogDPV: React.FC<ChildComponentProps> = ({ userId, transactionType }) => {

    const router = useRouter();

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [categories, setCategories] = useState<Categoria[]>([]); //TODO: Alternar entre INPUT e OUTPUT

    const [installments, setInstallments] = useState<InstallmentData[]>([])

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

    useEffect(() => {
        const fetchCategories = async () => {
            if (!userId) return;
            try {

                const response = await fetch(`${baseUrl}/api/categories?userId=${userId}`, {
                    cache: 'no-store',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }

                );
                if (!response.ok) {
                    console.error(`Failed to fetch categories`);
                    return;
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchCategories();
    }, [userId]);

    const [cards, setCards] = useState<Cartao[]>([]);

    useEffect(() => {
        const fetchUserCards = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/cards?userId=${userId}`, {
                    cache: 'no-store',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error("Erro ao buscar cartões:", error);
            }
        };

        fetchUserCards();
    }, []);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);  // State for storing paymentMethod data

    useEffect(() => {

        const fetchPaymentMehtod = async () => {
            const response = await fetch("/api/getPaymentMethod");
            const paymentMethodData = await response.json();
            setPaymentMethod(paymentMethodData);
        };

        fetchPaymentMehtod();  // Fetch bank data when component mounts
    }, []);

    //Melhor digitação /Para não inserir acentos no banco de dados
    const formatPaymentName = (name: string) => {
        if (name === "dinheiro") return "Dinheiro em Espécie";
        if (name === "pix") return "PIX";
        if (name === "debito") return "Débito";
        if (name === "credito") return "Crédito";
        return name; // Padrão
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            itemName: "",
            itemValue: 0,
            itemDescription: "",
            boolInstallment: false,
            intInstallment: 1,
            paymentMethod: undefined,
            date: new Date(),
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {

        setIsLoading(true);

        const movimentType = transactionType === "Fixed" || "Variable" ? "Output" : "Input";

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

            // Se não está parcelado ou tem apenas 1 parcela, cria uma única transação
            if (!data.boolInstallment || data.intInstallment === 1) {
                const requestBody = {
                    userId: userId,
                    categoryId: data.category,
                    itemName: data.itemName,
                    itemValue: data.itemValue,
                    transactionalType: transactionType,
                    movimentType: movimentType,
                    itemDescription: data.itemDescription,
                    boolInstallment: false,
                    intInstallment: 1,
                    Installmentdate: data.Installmentdate ? data.Installmentdate : data.date,
                    cardID: data.cardID,
                    paymentMethod: data.paymentMethod,
                    boolStatus: data.boolStatus,
                    date: data.date,
                    boolActive: true
                }

                const response = await fetch(`${baseUrl}/api/transactions`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })

                if (!response.ok) {
                    throw new Error(`Failed to create transaction: ${response.status}`)
                }
            } else {
                // Cria múltiplas transações para cada parcela
                const installmentValue = data.itemValue / data.intInstallment
                
                for (let i = 0; i < data.intInstallment; i++) {
                    const dueDate = new Date(data.date)
                    dueDate.setMonth(data.date.getMonth() + i)
                    
                    const installmentDescription = data.intInstallment > 1 
                    ? `${data.itemDescription || data.itemName} (${i + 1}/${data.intInstallment})`
                    : data.itemDescription

                    const requestBody = {
                        userId: userId,
                        categoryId: data.category,
                        itemName: data.itemName,
                        itemValue: installmentValue,
                        transactionalType: transactionType,
                        movimentType: movimentType,
                        itemDescription: installmentDescription,
                        boolInstallment: data.boolInstallment,
                        intInstallment: data.intInstallment,
                        currentInstallment: i + 1,
                        Installmentdate: dueDate,
                        cardID: data.cardID,
                        paymentMethod: data.paymentMethod,
                        boolStatus: i === 0 ? data.boolStatus : 'emAberto', 
                        date: dueDate,
                        boolActive: true
                    }

                    const response = await fetch(`${baseUrl}/api/transactions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to create installment ${i + 1}: ${response.status}`)
                    }
                }
            }

            toast({
            title: "Sucesso!",
            description: data.boolInstallment && data.intInstallment > 1 
                ? `${data.intInstallment} parcelas criadas com sucesso!`
                : "Registro salvo!",
            })

            handleCancel()
            setIsOpen(false)
            router.refresh()

        } catch (error) {
            console.error('Error creating transaction:', error)
            toast({
            title: "Error",
            description: `Oops! Algo deu errado!`,
            variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    };

    const { reset } = form;

    // Função para resetar o formulário ao clicar em "Cancelar"
    const handleCancel = () => {
        reset(); 
    };

    const [isOpen, setIsOpen] = useState(false);
    // Função para lidar com a mudança de estado do diálogo (abrir/fechar)
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Se o diálogo estiver fechando (por qualquer motivo: X, clique fora, Esc, botão Cancelar)
            handleCancel();
        }
        setIsOpen(open);
    };

    const movimentType =
        transactionType === "Fixed" || transactionType === "Variable"
            ? "Output"
            : "Input";

    const hasCompatibleCategories = categories.some(
        (cat) => cat.str_movimentType === movimentType
    );

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button>Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-y-auto e max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {transactionType !== "Income" ? "Nova Despesa" : "Nova Receita"}
                        </DialogTitle>
                        <DialogDescription>
                            {transactionType === "Fixed" ?
                                "Inclua aqui suas despesas fixas, aluguel por exemplo 🏠 Clique em salvar quando preencher tudo 😉."
                                :
                                transactionType === "Variable" ?
                                    "Inclua aqui suas despesas variáveis, um jantar fora por exemplo 🥘 Abaixo salve as alterações 😉."
                                    :
                                    "Adicione cada um dos seus esforços em forma financeira! 💵 No fim salve as alterações 😉."
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form id="dialogForm" className="w-full space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>

                            {/* First Layer */}
                            <div className="flex flex-row space-x-2">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="itemName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="text" placeholder="Nome do Item" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="itemValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <NumericFormat
                                                        value={field.value} // O valor do campo
                                                        onValueChange={(values) => {
                                                            field.onChange(values.floatValue); // O valor sem formatação
                                                        }}
                                                        thousandSeparator="." // Separador de milhar
                                                        decimalSeparator="," // Separador decimal
                                                        prefix="R$ " // Prefixo de reais
                                                        fixedDecimalScale={true} // Mantém duas casas decimais
                                                        decimalScale={2} // Quantidade de casas decimais
                                                        allowLeadingZeros={true} // Permite zeros a esquerda
                                                        placeholder="R$ #.###,##" // Placeholder
                                                        customInput={Input} // Usa o componente Input como base
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Second Layer */}
                            <div>
                                <FormField
                                    control={form.control}
                                    name="itemDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" placeholder="Descrição do Item (Opcional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Third Layer */}
                            <div>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => {
                                        const handleChange = (val: string) => field.onChange(Number(val));

                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <Select onValueChange={handleChange} value={field.value?.toString()}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione uma categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-y-auto">
                                                            <SelectGroup>
                                                                <SelectLabel>Suas Categorias</SelectLabel>                                                
                                                                {hasCompatibleCategories ? (
                                                                    categories
                                                                        .filter((cat) => {
                                                                            return (
                                                                                cat.str_movimentType === movimentType
                                                                            );
                                                                        })
                                                                        .map((cat) => (
                                                                            <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                                                                {cat.str_categoryName}
                                                                            </SelectItem>
                                                                        ))
                                                                ) : (
                                                                    <SelectLabel className="text-muted-foreground">
                                                                        {`Nenhuma categoria disponível. `}
                                                                        <Link
                                                                            href="/categories?addNew=true"
                                                                            className="
                                                                            text-[#01C14C] 
                                                                            hover:underline"
                                                                            px-2
                                                                        >
                                                                            Adicionar?
                                                                        </Link>
                                                                    </SelectLabel>
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />

                            </div>

                            {/* Fourth Layer */}
                            {transactionType !== 'Income' && (
                                <div className={`flex items-center`}>
                                    <FormField
                                        control={form.control}
                                        name="boolInstallment"
                                        render={({ field }) => (
                                            <FormItem className={`flex items-center w-1/2`}>
                                                <FormControl>
                                                    <div className="flex items-center gap-2 content-center w-full">
                                                        <Switch
                                                            id="parcelado"
                                                            checked={field.value}
                                                            onCheckedChange={(checked) => {
                                                                field.onChange(checked);
                                                                form.setValue('intInstallment', 1);
                                                            }}
                                                        />
                                                        <Label htmlFor="parcelado">
                                                            Está parcelado?
                                                        </Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="intInstallment"
                                        render={({ field }) => (
                                            <FormItem className={`flex items-center w-1/2`}>
                                                <FormControl>
                                                    <div className={`flex items-center gap-2 w-full`}>
                                                        <Input
                                                            id="num-parcelas"
                                                            placeholder="Quantas Parcelas?"
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.target.value === "" ? undefined : parseFloat(e.target.value)
                                                                )
                                                            }
                                                            disabled={!form.watch('boolInstallment')}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {form.watch('boolInstallment') && (
                                <InstallmentHandler
                                    totalValue={form.watch('itemValue') || 0}
                                    installmentCount={form.watch('intInstallment') || 1}
                                    startDate={form.watch('date') || new Date()}
                                    onInstallmentsChange={setInstallments}
                                />
                            )}

                            {/* Fifth Layer */}

                            <div className="flex flex-row space-x-2">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="cardID"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value != null ? field.value.toString() : ""}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Escolha um cartão" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Seus Cartões</SelectLabel>
                                                                    {cards.length > 0 ? (
                                                                        cards.map((cartao, index) => {

                                                                            if (!cartao || cartao.card_id === undefined || cartao.card_id === null) {
                                                                                console.warn(`Cartão inválido na posição ${index}:`, cartao);
                                                                                return <p key={index}>Cartão inválido</p>;
                                                                            }

                                                                            return (
                                                                                <SelectItem key={cartao.card_id.toString()} value={cartao.card_id.toString()}>                                                                                    
                                                                                    {cartao.bank?.str_bankName ?? "Banco Desconhecido"} - Final {cartao.str_lastNumbers}

                                                                                </SelectItem>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <SelectLabel className="text-muted-foreground">
                                                                            {`Nenhum cartão disponível. `}
                                                                            <Link
                                                                                href="/cards?addNew=true"
                                                                                className="text-[#01C14C] hover:underline px-2"
                                                                            >
                                                                                Adicionar?
                                                                            </Link>
                                                                        </SelectLabel>
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>


                                {/*Forma de Pagamento*/}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))} // Captura o valor selecionado
                                                            value={field.value != null ? field.value.toString() : ""}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Forma paga?" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Opções:</SelectLabel>
                                                                    {paymentMethod.map((payment) => (
                                                                        <SelectItem key={payment.id} value={payment.id.toString()}>
                                                                            {formatPaymentName(payment.str_nomeTipoPgto)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Card Status Alert */} 
                            {/* 
                            TODO: Verificar por que o componente não está atualizando quando mudo a forma de pagamento.
                            */} 
                            <CardStatusAlert
                                selectedCardId={form.watch('cardID')}
                                selectedPaymentMethod={form.watch('paymentMethod')}
                                cards={cards}
                                paymentMethods={paymentMethod}
                                currentTransactionValue={form.watch('itemValue') || 0}
                            />
                            

                            {/* Sixth Layer */}
                            <div className="flex flex-row items-center justify-between space-x-2">
                                {/* Calendário com Popover */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Qual a data?</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            style={{ pointerEvents: 'auto' }}
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={(date) => {
                                                                    field.onChange(date);
                                                                }}
                                                                initialFocus
                                                                fixedWeeks={true}
                                                                locale={ptBR}
                                                                formatters={{
                                                                    formatCaption: (date, options) => {
                                                                        const month = format(date, "LLLL", { locale: options?.locale });
                                                                        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getFullYear()}`;
                                                                    }
                                                                }}                                                                
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Select de status de pagamento */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="boolStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Select
                                                            onValueChange={(value) => field.onChange(value)} // Captura o valor selecionado
                                                            value={field.value} // Vincula o valor ao campo do formulário
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="pago">Pago</SelectItem>
                                                                    <SelectItem value="emAberto">Em aberto</SelectItem>
                                                                    <SelectItem value="futura">Futura</SelectItem>
                                                                    <SelectItem value="atrasada">Atrasada</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" onClick={handleCancel} >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} form="dialogForm">
                            {isLoading ? "Carregando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default DialogDPV;