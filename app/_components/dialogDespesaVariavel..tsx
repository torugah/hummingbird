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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import React, { useEffect , useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/components/hooks/use-toast"
import { useRouter } from "next/navigation"
import { NumericFormat } from 'react-number-format';
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

const FormSchema = z
    .object({
        itemName: z.string().min(2, "Item name must be at least 3 characters.").max(50),
        itemValue: z.number().min(0.01, "Item cannot be less than R$0.01").optional(),
        itemDescription: z.string(),
        boolInstallment: z.boolean(),
        intInstallment: z.number().min(1, "This cannot be divided into zero or less"),
        cardID: z.string().optional(), 
        Installmentdate: z.date().optional(),
        paymentMethod: z.string().optional(),
        date: z.date(),
        boolStatus: z.boolean()
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
    str_lastNumbers: string;
}

interface PaymentMethod {
    id: number;
    str_nomeTipoPgto: string;
}

// Define o tipo das props que o componente vai receber
interface ChildComponentProps {
    userId: string | null | undefined;
}

const DialogDPV : React.FC<ChildComponentProps> = ({ userId }) => {

    const [isParcelado, setIsParcelado] = useState(false);
    const [isStatusPago, setIsStatusPago] = useState(false);
    const [date, setDate] = React.useState<Date>()

    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            itemName: "",
            itemValue: undefined,
            itemDescription: "",
            boolInstallment: false,
            intInstallment: 1,
            cardID: undefined,
            Installmentdate: undefined,
            paymentMethod: undefined,
            date: new Date(),
            boolStatus: false
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {

        setIsLoading(true);

        //const session = await getServerSession(authOptions);

        const response = await fetch('/api/expenses/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId : userId,
                categoryId: 1,
                itemName: data.itemName,
                itemValue: data.itemValue,
                transactionalType: 'Variable',
                movimentType: 'Input',
                itemDescription: data.itemDescription,
                boolInstallment: data.boolInstallment,
                intInstallment: data.intInstallment,
                Installmentdate: data.Installmentdate,            
                paymentMethod: data.paymentMethod,
                cardID: data.cardID,            
                boolStatus: data.boolStatus,
                date: data.date,
                boolActive: true
            })
        })

        if (response.ok) {
            toast({
                title: "Sucesso!",
                description: "Registro salvo!",
            })
        } else {
            toast({
                title: "Error",
                description: "Oops! Something when wrong!",
                variant: "destructive"
            })
        }

        try {
            
            console.log("Form Data:", data);

        
        } catch (error) {
            console.error("Validation error:", error); 
        } finally {
            setIsLoading(false);
            handleCancel;
        }
    };

    const { reset } = form;

    // Função para resetar o formulário ao clicar em "Cancelar"
    const handleCancel = () => {
        reset(); // Reseta os valores do formulário para os valores padrão
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nova Despesa</DialogTitle>
                        <DialogDescription>
                            Inclua aqui suas despesas fixas, aluguel por exemplo 🏠 Clique em salver quando preencher tudo 😉.
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
                            <FormField
                                control={form.control}
                                name="boolInstallment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className={`flex items-center transition-all duration-300 ease-in-out`}>
                                                {/* Container que irá controlar a posição do Switch e do Input */}
                                                <div className={`flex items-center justify-between w-full`}>
                                                    {/* Switch e Label */}
                                                    <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${field.value ? 'w-1/2' : 'w-full justify-center'}`}>
                                                        <Switch
                                                            id="parcelado"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                        <Label htmlFor="parcelado">Está parcelado?</Label>
                                                    </div>

                                                    {/* Campo condicional de número de parcelas com 50% */}
                                                    <div className={`transition-opacity duration-300 ease-in-out ${field.value ? 'opacity-100 w-1/2' : 'opacity-0 w-0 pointer-events-none'}`}>
                                                        <FormField
                                                            control={form.control}
                                                            name="intInstallment"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            id="num-parcelas"
                                                                            placeholder="Quantas Parcelas?"
                                                                            type="number"
                                                                            {...field || 1}
                                                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            {/* Fourth Layer */}
                            <div className="flex flex-row space-x-2">     
                                {/* CHATGPT MODIFIQUE APENAS ESTA DIV */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => {
                                            const [cards, setCards] = useState<Cartao[]>([]);

                                            useEffect(() => {
                                                const fetchUserCards = async () => {
                                                    try {
                                                        const response = await fetch("/api/getUserCards");
                                                        const data = await response.json();
                                                        setCards(data);
                                                    } catch (error) {
                                                        console.error("Erro ao buscar cartões:", error);
                                                    }
                                                };

                                                fetchUserCards();
                                            }, []);

                                            return (                                                

                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(value)}
                                                            value={field.value ? field.value.toString() : undefined} // Evita string vazia
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Escolha um cartão" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Seus Cartões</SelectLabel>                                                                    
                                                                    {cards.length > 0 ? (
                                                                        cards.map((cartao, index) => {
                                                                            console.log(`Cartão na posição ${index}:`, cartao);
                                                                            console.log(`Banco associado:`, cartao.bank);

                                                                            if (!cartao || cartao.card_id === undefined || cartao.card_id === null) {
                                                                                console.warn(`Cartão inválido na posição ${index}:`, cartao);
                                                                                return <p key={index}>Cartão inválido</p>;
                                                                            }

                                                                            return (
                                                                                <SelectItem key={cartao.card_id.toString()} value={cartao.card_id.toString()}>
                                                                                    {/*{cartao?.bank?.str_bankName ?? "Banco Desconhecido"} - Cartão {cartao.card_id}*/}
                                                                                    {cartao.bank?.str_bankName ?? "Banco Desconhecido"} - Final {cartao.str_lastNumbers}

                                                                                </SelectItem>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <p>Nenhum cartão disponível</p>
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
                                {/* FIM DA MODIFICAÇÃO */}

           

                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="cardID"
                                        render={({ field }) => {

                                            const [paymentMethod, setPaymentMehtod] = useState<PaymentMethod[]>([]);  // State for storing paymentMethod data

                                            useEffect(() => {
                                                
                                                const fetchPaymentMehtod = async () => {
                                                    const response = await fetch("/api/getPaymentMethod");
                                                    const paymentMethodData = await response.json();
                                                    setPaymentMehtod(paymentMethodData);
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

                                            return(

                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(value)} // Captura o valor selecionado
                                                            value={field.value} // Vincula o valor ao campo do formulário
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Forma paga?" />
                                                            </SelectTrigger>
                                                            <SelectContent>                                                                
                                                                <SelectGroup>
                                                                    <SelectLabel>Opções:</SelectLabel>
                                                                    {/*paymentMethod.map((paymentMethod) => (
                                                                        <SelectItem key={paymentMethod.id} value={paymentMethod.id?.toString()}>
                                                                            {paymentMethod.str_nomeTipoPgto}
                                                                        </SelectItem>
                                                                    ))*/}
                                                                    {paymentMethod.map((payment) => (
                                                                        <SelectItem key={payment.id} value={payment.id?.toString()}>
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

                            {/* Fifth Layer */}
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
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
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

                                {/* Switch de status de pagamento */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="boolStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Switch
                                                            id="isStatusPago"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange} // Sincroniza o estado do switch
                                                        />
                                                        <Label htmlFor="isStatusPago">Pago?</Label>
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

                    {<div /* className="grid gap-4 py-4" */>
                        {/* <div className="flex items-center space-x-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    id="identificador"
                                    placeholder="Nome do Item"
                                    className="col-span-3"
                                    type="text"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="itemValue"
                                    placeholder="R$ #.###,##"
                                    className="col-span-3"
                                    type="text"
                                />
                            </div>
                        </div> 
                        <div>
                            <Input
                                id="description"
                                placeholder="Descrição (Opcional)"
                                className="col-span-3 w-full"
                                type="text"
                            />
                        </div>*/}
                        {/* <div className={`flex items-center justify-${isParcelado ? 'between' : 'center'} space-x-2 transition-all duration-300 ease-in-out`}>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="parcelado"
                                    checked={isParcelado}
                                    onCheckedChange={setIsParcelado} // Atualiza o estado com o valor do switch
                                />
                                <Label htmlFor="parcelado">Está parcelado?</Label>
                            </div> */}

                        {/* Campo condicional que aparece suavemente se isParcelado for true */}
                        {/* <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isParcelado ? 'opacity-100 w-3/6' : 'opacity-0 max-w-0'}`}>
                                <Input
                                    id="num-parcelas"
                                    placeholder="Quantas Parcelas?"
                                    className="col-span-3 w-full"
                                    type="number"
                                />
                            </div>
                        </div> */}

                        {/* <div className="flex flex-row items-center justify-between space-x-2">
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Em qual conta?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Seus bancos</SelectLabel>
                                        <SelectItem value="1">Banco do Brasil</SelectItem> */} {/*Values serão alterados posteriomente*/}
                        {/* <SelectItem value="2">Itaú Unibanco</SelectItem>
                                        <SelectItem value="3">Nubank</SelectItem>
                                        <SelectItem value="4">Inter</SelectItem>
                                        <SelectItem value="5">Next</SelectItem>
                                        <SelectItem value="6">Bradesco</SelectItem> */}
                        {/*Deverá também ter forma de pagamento com dinhero físico*/}
                        {/* </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Forma Paga?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Formas de Pagamento</SelectLabel>
                                        <SelectItem value="1">Débito</SelectItem>
                                        <SelectItem value="2">Crédito</SelectItem>
                                        <SelectItem value="3">PIX Débito</SelectItem>
                                        <SelectItem value="4">PIX Crédito</SelectItem>
                                        <SelectItem value="5">Boleto</SelectItem>
                                        <SelectItem value="6">Outro</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div> */}

                        {/* {<div className="flex flex-row items-center justify-between space-x-2">
                            <div className="w-1/2">
                                <Popover >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "dd/MM/yyyy") : <span>Qual a data?</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-1/2">
                                <Switch
                                    id="parcelado"
                                    checked={isStatusPago}
                                    onCheckedChange={setIsStatusPago} // Atualiza o estado com o valor do switch
                                />
                                <Label htmlFor="parcelado">Pago?</Label>
                            </div>
                        </div> */}
                    </div>}
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