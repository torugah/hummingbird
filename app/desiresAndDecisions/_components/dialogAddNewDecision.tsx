'use client'

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/hooks/use-toast"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { NumericFormat } from 'react-number-format';
import { Checkbox } from '@/components/ui/checkbox';

const FormSchema = z
    .object({
        str_name: z.string().min(3, "Mínimo de 3 caracteres"),
        dbl_valor: z.string().refine(val => {
            const numericValue = val.replace(/[^0-9]/g, "");
            return numericValue.length > 0;
        }, "Valor inválido"),
        int_wishList_id: z.number().nullable(),
        str_brand: z.string().optional(),
        str_descriptionOrLink: z.string().optional(),
        bool_doIHaveMoney: z.boolean(),
        bool_doIReallyNeed: z.boolean(),
        bool_doIPlanned: z.boolean(),
    });

interface ListaDeDesejos {
    id: number;
    str_wishName: string;
}

interface ChildComponentProps {
    userId: string | null | undefined;
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

const DialogAddNewDecision: React.FC<ChildComponentProps> = ({ userId }) => {

    const [isLoading, setIsLoading] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    const [wishes, setWishes] = useState<ListaDeDesejos[]>([]);

    const [isOpen, setIsOpen] = useState(false); 
    // Função para lidar com a mudança de estado do diálogo (abrir/fechar)
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Se o diálogo estiver fechando (por qualquer motivo: X, clique fora, Esc, botão Cancelar)
            handleCancel();
        }
        setIsOpen(open);
    };

    useEffect(() => {
        const fetchWishes = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/desires?userId=${userId}`);
                if (!response.ok) {
                    console.error(`Failed to fetch categories`);
                    return;
                }
                const data = await response.json();
                setWishes(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        fetchWishes();
    }, [userId]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            str_name: "",
            dbl_valor: "0.0",
            str_brand: "",
            str_descriptionOrLink: "",
            bool_doIHaveMoney: false,
            bool_doIReallyNeed: false,
            bool_doIPlanned: false
        }

    })

    const { reset } = form

    const handleCancel = () => {
        reset()
    }

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true)

        // Format credit limit
        const rawValue = data.dbl_valor.replace(/[^0-9]/g, "")
        const numericValue = parseFloat(rawValue) / 100

        const requestBody = {
            str_user_id: userId,
            int_wishList_id: data.int_wishList_id,
            str_name: data.str_name,
            dbl_valor: numericValue,
            str_brand: data.str_brand,
            str_descriptionOrLink: data.str_descriptionOrLink,
            bool_doIHaveMoney: data.bool_doIHaveMoney,
            bool_doIReallyNeed: data.bool_doIReallyNeed,
            bool_doIPlanned: data.bool_doIPlanned
        }

        try {
            console.log("Request body before send:", JSON.stringify(requestBody, null, 2));

            const response = await fetch(`/api/decisions?userId=${userId}`, {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (response.ok) {
                toast({
                    title: "Sucesso!",
                    description: "Registro salvo!",
                })
                handleCancel()
                router.refresh()
            } else {
                throw new Error('Falha ao salvar')
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Oops! Algo deu errado!",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
            handleCancel();
            setIsOpen(false);
            router.refresh();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button>Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-y-auto e max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Adicionar Decisão</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            id='addDecisionForm'
                            className='w-full space-y-4 py-4'
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-row space-x-2">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="str_name"
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
                                        name="dbl_valor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <NumericFormat
                                                        value={field.value}
                                                        onValueChange={(values) => {
                                                            field.onChange(values.value);
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
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="int_wishList_id"
                                render={({ field }) => {
                                    const handleChange = (val: string) => field.onChange(Number(val));

                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Select onValueChange={handleChange} value={field.value?.toString()}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Escolha o desejo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Seus desejos</SelectLabel>
                                                            {wishes?.length > 0 ? (
                                                                wishes.map((ws) => (
                                                                    <SelectItem key={ws.id} value={ws.id.toString()}>
                                                                        {ws.str_wishName}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectLabel className="text-muted-foreground">
                                                                    Nenhum desejo adicionado.
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
                            <FormField
                                control={form.control}
                                name="str_brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Marca do Item (Opcional)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="str_descriptionOrLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Link ou Descrição (Opcional)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='pt-4'>
                                <FormLabel>Agora se pergunte:</FormLabel>
                            </div>
                            <FormField
                                control={form.control}
                                name="bool_doIHaveMoney"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Tenho dinheiro neste momento?
                                            </FormLabel>
                                            <FormMessage /> {/* Exibe erros de validação */}
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bool_doIPlanned"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Eu planejei isto?
                                            </FormLabel>
                                            <FormMessage /> {/* Exibe erros de validação */}
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bool_doIReallyNeed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Preciso ou é necessidade?
                                            </FormLabel>
                                            <FormMessage /> {/* Exibe erros de validação */}
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="pt-4">
                                <FormLabel>Sua decisão:</FormLabel>
                                <div className="mt-2 rounded-lg bg-green-200 p-4 text-center">
                                    <p className="font-medium text-green-900">
                                        {getDecisionText(
                                            form.watch("bool_doIHaveMoney"),
                                            form.watch("bool_doIReallyNeed"),
                                            form.watch("bool_doIPlanned")
                                        )}
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} form="addDecisionForm">
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DialogAddNewDecision;
