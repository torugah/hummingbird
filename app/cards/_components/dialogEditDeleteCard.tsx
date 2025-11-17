'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation';
import { Cards } from "@/app/cards/_components/cardsList"
import { NumericFormat } from 'react-number-format'

interface DialogEditCardsProps {
    cardToEdit: Cards;
    userId: string | null | undefined;
}

const EditFormSchema = z.object({
    bank_id: z.number().min(1, "Selecione um banco"),
    dbl_creditLimit: z.string().refine(val => {
        // Remove todos os caracteres não numéricos
        const numericValue = val.replace(/[^0-9]/g, "");
        // Verifica se tem pelo menos 1 dígito (já que min(1) já faz isso)
        return numericValue.length > 0;
    }, "Valor inválido"),
    int_bestDate: z.number()
    .min(1, "Dia inválido")
    .max(31, "Dia inválido")
    .refine(val => {
      const dayNum = val
      return dayNum >= 1 && dayNum <= 31
    }, "Dia inválido"),
    str_dueDate: z.string()
        .min(5, "Data inválida")
        .refine(val => {
            const [month, year] = val.split('/')
            const monthNum = parseInt(month)
            const yearNum = parseInt(year)
            return monthNum >= 1 && monthNum <= 12 && yearNum >= 0 && yearNum <= 99
        }, "Data inválida"),
    str_lastNumbers: z.string().min(4, "Coloque os 4 últimos números").max(4, "Apenas os últimos 4 números")
})

type EditFormValues = z.infer<typeof EditFormSchema>;

const DialogEditDeleteCard: React.FC<DialogEditCardsProps> = ({ cardToEdit, userId }) => {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    interface Bank {
        bank_id: number;
        str_bankName: string;
        str_image: string;
    }

    const [banks, setBanks] = useState<Bank[]>([])
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch("/api/getBanks")
                if (!response.ok) throw new Error('Failed to fetch banks')
                const data = await response.json()
                setBanks(data)
            } catch (error) {
                console.error('Error fetching banks:', error)
            }
        }
        fetchBanks()
    }, [])

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(EditFormSchema),
        // Usar 'values' para props que podem mudar. React Hook Form lidará com a atualização.
        // Isso é geralmente mais eficaz do que useEffect + reset para sincronizar com props.

        values: {
            bank_id: cardToEdit.bank.bank_id,
            dbl_creditLimit: cardToEdit.dbl_creditLimit.toString(),
            int_bestDate: cardToEdit.int_bestDate,
            str_dueDate: new Date(cardToEdit.dtm_dueDate).toLocaleDateString('pt-BR', {
                month: '2-digit',
                year: '2-digit'
            }),
            str_lastNumbers: cardToEdit.str_lastNumbers
        },
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            
            const response = await fetch(`/api/cards?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: cardToEdit.card_id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover transação.');
            }

            toast({
                title: "Sucesso!",
                description: `Cartão "${cardToEdit.bank.str_bankName}" com final "${cardToEdit.str_lastNumbers}" removido.`,
            });
            setIsDeleteDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Oops! Algo deu errado ao remover o cartão.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            router.refresh();
        }
    };

    const onSubmit = async (data: EditFormValues) => {
        setIsLoading(true);

        // Format due date to MM/YY
        const [month, year] = data.str_dueDate.split('/')
        const fullYear = `20${year}` // Assuming 21st century
        const dueDate = new Date(parseInt(fullYear), parseInt(month) - 1, 1)

        // Format credit limit. This handles the bug where non-interacted values were divided.
        let numericValue;
        const initialValueString = cardToEdit.dbl_creditLimit.toString();
        const submittedValue = data.dbl_creditLimit;

        if (submittedValue === initialValueString) {
            numericValue = cardToEdit.dbl_creditLimit; // Use the original value if unchanged
        } else {
            // If changed, the value is a numeric string from NumericFormat (in cents)
            const rawValue = submittedValue.replace(/[^0-9]/g, "");
            numericValue = parseFloat(rawValue) / 100;
        }

        const requestBody = {
            card_id: cardToEdit.card_id,
            str_user_id: userId,
            str_bank_id: data.bank_id,
            dbl_creditLimit: numericValue,
            int_bestDate: data.int_bestDate,
            dtm_dueDate: dueDate.toISOString(), // Converta para ISO string
            str_lastNumbers: data.str_lastNumbers,
        };

        try {
            const response = await fetch(`/api/cards?userId=${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                toast({ title: "Sucesso!", description: "Cartão atualizado!" });
                setIsOpen(false);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Erro ao processar a resposta do servidor." }));
                toast({ title: "Erro", description: errorData.message || "Oops! Algo deu errado.", variant: "destructive" });
            }            
        } catch (error) {
            toast({ title: "Erro de Rede", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setIsOpen(false);
            router.refresh();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button type="button" variant={"secondary"} aria-label="Abrir ações do cartão" className="p-1 rounded-md">
                        <PiDotsThreeOutlineVerticalFill className="text-gray-700 hover:text-[#01C14C] h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Cartão</DialogTitle>
                        <DialogDescription>
                            Modifique as informações abaixo e salve as alterações.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            id="editCardForm"
                            className="w-full space-y-4 py-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >

                            {/* Bank Select */}
                            <FormField
                                control={form.control}
                                name="bank_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Banco</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um banco" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {banks
                                                    .filter(bank => bank.bank_id !== 22 && bank.str_bankName !== "personalFormUser")
                                                    .map((bank) => (
                                                    <SelectItem key={bank.bank_id} value={bank.bank_id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                src={bank.str_image}
                                                                alt={bank.str_bankName}
                                                                width={24}
                                                                height={24}
                                                                className="w-6 h-6 object-contain"
                                                                unoptimized
                                                            />
                                                            <span>{bank.str_bankName}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Credit Limit Input */}
                            <FormField
                                control={form.control}
                                name="dbl_creditLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Limite do Cartão</FormLabel>
                                        <FormControl>
                                            <NumericFormat
                                                value={field.value}
                                                onValueChange={(values) => {
                                                    field.onChange(values.value)
                                                }}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                placeholder="R$ 0,00"
                                                customInput={Input}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Last 4 Digits */}
                            <FormField
                                control={form.control}
                                name="str_lastNumbers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Últimos 4 Dígitos</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ex: 1234"
                                                maxLength={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Due Date */}
                            <div className="flex flex-row space-x-2">
                                <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="int_bestDate"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vencimento da Fatura</FormLabel>
                                        <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ex: Todo dia 15"
                                            maxLength={31}
                                            onChange={(e) => {
                                                const value = e.target.value                                              
                                                field.onChange(Number(value))
                                            }}
                                            type="number"
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />                
                                </div>
                
                                <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="str_dueDate"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Validade</FormLabel>
                                        <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            onChange={(e) => {
                                            const value = e.target.value
                                            if (value.length === 2 && !field.value.includes('/')) {
                                                field.onChange(value + '/')
                                            } else {
                                                field.onChange(value)
                                            }
                                            }}                                            
                                        />
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
                        <Button type="submit" disabled={isLoading} form="editCardForm">
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting} >
                            {isDeleting ? "Apagando..." : "Apagar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover este cartão? Esta ação não pode ser desfeita e removerá um cartão que pode estar vinculado a transações existentes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Removendo..." : "Remover"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DialogEditDeleteCard
