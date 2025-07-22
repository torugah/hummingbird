'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import type { Transaction } from "./variableExpensesColumns"

// Schema pode ser o mesmo, mas valide se todos os campos são necessários/editáveis
const FormSchema = z
    .object({
        itemName: z.string().min(3, "Item name must be at least 3 characters.").max(50),
        itemValue: z.number().min(0.01, "Item não pode ser menor que R$0,01"),
        itemDescription: z.string().optional(), // Tornar opcional se puder ser vazio
        category: z.number().nullable(),
        boolInstallment: z.boolean(),
        intInstallment: z.number().min(1, "Não pode ser menor que 1 parcela"),
        cardID: z.number().nonnegative("Obrigatório"),
        Installmentdate: z.date().optional(), // Se este campo não existe no seu modelo de Transaction, pode ser problemático
        paymentMethod: z.number().nonnegative("Obrigatório"),
        date: z.date(),
        boolStatus: z.string()
    });

interface Bank {
    bank_id: number;
    str_bankName: string;
}

interface Cartao {
    card_id: number;
    str_user_id: string;
    str_bank_id: number;
    bank: Bank;
    str_lastNumbers: string;
}

interface PaymentMethod {
    id: number;
    str_nomeTipoPgto: string;
}

interface Categoria {
    category_id: number;
    str_categoryName: string;
}

interface DialogEditDPVProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    transactionToEdit: Transaction | null;
    userId: string | null | undefined;
}

const DialogEditDespesaVariavel: React.FC<DialogEditDPVProps> = ({ isOpen, onOpenChange, transactionToEdit, userId }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [cards, setCards] = useState<Cartao[]>([]);
    const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethod[]>([]);

    // Valores padrão para o formulário (quando não está editando ou limpando)
    const defaultFormValues = {
        itemName: "",
        itemValue: 0,
        itemDescription: "",
        category: 0,
        boolInstallment: false,
        intInstallment: 1,
        cardID: undefined as number | undefined, 
        Installmentdate: new Date(),
        paymentMethod: undefined as number | undefined, 
        date: new Date(),
        boolStatus: ""
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (isOpen && transactionToEdit) {
            form.reset({
                itemName: transactionToEdit.str_name,
                itemValue: transactionToEdit.dbl_valor,
                itemDescription: transactionToEdit.str_description || "",
                category: transactionToEdit.category.category_id,
                boolInstallment: transactionToEdit.int_installmentCount > 1,
                intInstallment: transactionToEdit.int_installmentCount,
                cardID: transactionToEdit.str_card_id, // Assumindo que str_card_id é o ID numérico
                paymentMethod: transactionToEdit.int_paymentForm, // Assumindo que int_paymentForm é o ID numérico
                date: new Date(transactionToEdit.dtm_data),
                boolStatus: transactionToEdit.str_status,
            });
        } else if (!isOpen) {
            // Limpa o formulário quando o diálogo é fechado
            form.reset();
        }
    }, [isOpen, transactionToEdit, form]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            if (!userId || !isOpen) return; // Só busca se o diálogo estiver aberto e tiver userId
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
                const response = await fetch(`${baseUrl}/api/categories/getByUserId?userId=${userId}`);
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
    }, [userId, isOpen]);

    // Fetch Cards
    useEffect(() => {
        const fetchUserCards = async () => {
            if (!isOpen) return; 
            try {
                const response = await fetch(`/api/cards?userId=${userId}`, {
                                                cache: 'no-store',
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            }); 
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error("Erro ao buscar cartões:", error);
            }
        };
        fetchUserCards();
    }, [isOpen]);

    // Fetch Payment Methods
    useEffect(() => {
        const fetchPaymentMethod = async () => {
            if (!isOpen) return;             
            const response = await fetch("/api/getPaymentMethod");
            const data = await response.json();
            setPaymentMethodData(data);
        };
        fetchPaymentMethod();
    }, [isOpen]);

    const formatPaymentName = (name: string) => {
        if (name === "dinheiro") return "Dinheiro em Espécie";
        if (name === "pix") return "PIX";
        if (name === "debito") return "Débito";
        if (name === "credito") return "Crédito";
        return name;
    };

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!transactionToEdit) {
            toast({ title: "Erro", description: "Nenhuma transação para editar.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        const requestBody = {
            id: transactionToEdit.id, // ID da transação para o backend saber qual atualizar
            userId: userId,
            categoryId: data.category,
            itemName: data.itemName,
            itemValue: data.itemValue,
            transactionalType: 'Variable', 
            movimentType: 'Output', 
            str_description: data.itemDescription,
            boolInstallment: data.boolInstallment,
            intInstallment: data.intInstallment,
            Installmentdate: data.Installmentdate,
            cardID: data.cardID,
            paymentMethod: data.paymentMethod,
            boolStatus: data.boolStatus,
            date: data.date,
            boolActive: true // Assumindo que este campo é relevante para update
        };

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
        const response = await fetch(`${baseUrl}/api/transactions`, { 
            method: 'PUT', // ou PATCH
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            toast({
                title: "Sucesso!",
                description: "Registro atualizado!",
            });
            onOpenChange(false); // Fecha o diálogo
            router.refresh();
        } else {
            const errorData = await response.json().catch(() => ({})); // Tenta pegar o JSON do erro
            toast({
                title: "Erro",
                description: errorData.message || `Oops! Algo deu errado! Status: ${response.status}`,
                variant: "destructive"
            });
        }

        setIsLoading(false);
    };

    const handleDialogClose = () => {
        onOpenChange(false);
        // O useEffect já cuida do form.reset() quando isOpen muda para false
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Despesa</DialogTitle>
                    <DialogDescription>
                        Modifique os dados da sua despesa e clique em salvar.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    {/* Use um ID de formulário diferente para evitar conflitos se ambos os dialogs estiverem no DOM */}
                    <form id="dialogFormEdit" className="w-full space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* First Layer - Nome do Item e Valor */}
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
                                                {/* (Talvez resolvido) NumericFormat causando problemas: 
                                                                                                    
                                                app-index.js:33 Warning: Function components cannot be given refs. 
                                                Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
                                                */}
                                                <NumericFormat
                                                    value={field.value || 0}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    allowLeadingZeros={true}
                                                    placeholder="R$ #.###,##"
                                                    customInput={Input}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Second Layer - Descrição */}
                        <div>
                            <FormField
                                control={form.control}
                                name="itemDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" placeholder="Descrição do Item (Opcional)" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Third Layer - Categoria */}
                        <div>
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select
                                                onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                                                value={field.value?.toString() ?? ""}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Escolha a categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Suas Categorias</SelectLabel>
                                                        {categories.length > 0 ? (
                                                            categories.map((cat) => (
                                                                <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                                                    {cat.str_categoryName}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem disabled value="no-categories">
                                                                Nenhuma categoria disponível
                                                            </SelectItem>
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Fourth Layer - Parcelamento */}
                        {transactionToEdit?.str_transactionType !== 'Income' && (
                            <div className={`flex items-center`}>
                                <FormField
                                    control={form.control}
                                    name="boolInstallment"
                                    render={({ field }) => (
                                        <FormItem className={`flex items-center w-1/2`}>
                                            <FormControl>
                                                <div className="flex items-center gap-2 content-center w-full">
                                                    <Switch
                                                        id="parceladoEdit" // ID diferente
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <Label htmlFor="parceladoEdit">
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
                                                        id="num-parcelasEdit" // ID diferente
                                                        placeholder="Quantas Parcelas?"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value === "" ? 1 : parseFloat(e.target.value) // Default to 1 if empty
                                                            )
                                                        }
                                                        disabled={!form.watch("boolInstallment")} // Desabilita se não estiver parcelado
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Fifth Layer - Cartão e Forma de Pagamento */}
                        <div className="flex flex-row space-x-2">
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="cardID"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                                    value={field.value != null ? field.value.toString() : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Escolha um cartão" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Seus Cartões</SelectLabel>
                                                            {cards.length > 0 ? (
                                                                cards.map((cartao) => (
                                                                    <SelectItem key={cartao.card_id.toString()} value={cartao.card_id.toString()}>
                                                                        {cartao.bank?.str_bankName ?? "Banco Desconhecido"} - Final {cartao.str_lastNumbers}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectItem disabled value="no-cards">
                                                                    Nenhum cartão disponível
                                                                </SelectItem>
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                                    value={field.value != null ? field.value.toString() : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Forma paga?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Opções:</SelectLabel>
                                                            {paymentMethodData.map((payment) => (
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
                                    )}
                                />
                            </div>
                        </div>

                        {/* Sixth Layer - Data e Status */}
                        <div className="flex flex-row items-center justify-between space-x-2">
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
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="boolStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => field.onChange(value)}
                                                    value={field.value}
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
                        <Button type="button" variant="ghost">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading} form="dialogFormEdit">
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogEditDespesaVariavel;
