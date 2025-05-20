'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaPlusCircle } from 'react-icons/fa'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/hooks/use-toast"
import { cn } from "@/lib/utils"
import { NumericFormat } from 'react-number-format';
import { useRouter } from 'next/navigation';

const FormSchema = z
    .object({
        categoryName: z.string().min(2, "Item name must be at least 3 characters.").max(50),
        stringMovimentType: z.enum(["Input", "Output"], { errorMap: () => ({ message: "Selecione um tipo de movimentação." }) }),
        boolHasBudgetLimit: z.boolean(),
        doubleBudgetLimit: z.number().nullable(),
    }).refine(data => { // Adicionando refine similar ao de edição para consistência
        if (data.boolHasBudgetLimit && (data.doubleBudgetLimit === null || data.doubleBudgetLimit === undefined || data.doubleBudgetLimit <= 0)) return false;
        return true;
    }, { message: "O limite do orçamento deve ser um valor positivo quando habilitado.", path: ["doubleBudgetLimit"] });

interface ChildComponentProps {
    userId: string | null | undefined;
}

const DialogAddNewCategory : React.FC<ChildComponentProps> = ({ userId }) => {

    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do diálogo

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: "",
            stringMovimentType: "Output", // Definindo um valor padrão ("saída" ou "entrada")
            boolHasBudgetLimit: false,
            doubleBudgetLimit: null
        },
    })

    const { reset } = form;

    const { toast } = useToast();

    const handleCancel = () => {
        reset(); // Reseta os valores do formulário para os valores padrão
    };

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {

        setIsLoading(true);

        const requestBody = {
            user_id: userId,
            str_categoryName: data.categoryName,
            str_movimentType: data.stringMovimentType,
            bool_hasBudgetLimit: data.boolHasBudgetLimit,
            dbl_budgetLimit: data.doubleBudgetLimit,
            str_image: null,
            bool_active: true
        }

        console.log(requestBody)

        const response = await fetch('/api/categories/create', {
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
            });
            handleCancel(); // Reseta os valores do formulário
            setIsOpen(false); // Fecha o diálogo
            router.refresh();
        } else {
            toast({
                title: "Erro",
                description: "Oops! Algo deu errado!",
                variant: "destructive"
            })
        }
        setIsLoading(false);
    };

    // Função para lidar com a mudança de estado do diálogo (abrir/fechar)
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Se o diálogo estiver fechando (por qualquer motivo: X, clique fora, Esc, botão Cancelar)
            handleCancel();
        }
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <FaPlusCircle className="h-24 w-24 text-gray-400 hover:text-[#01C14C] hover:cursor-pointer
                                        hover:scale-105 transition-transform duration-200 ease-in-out"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Cartegoria</DialogTitle>
                    <DialogDescription>
                        Adicione as informações abaixo e salve-as.
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form id="dialogForm" className="w-full space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>

                        {/* First Layer */}
                        <div className="flex flex-row space-x-2">
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="categoryName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Categoria:</Label>
                                            <FormControl>
                                                <Input type="text" placeholder='Ex: Transaporte' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="stringMovimentType"
                                    render={({ field }) => (                                        
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='px-2 py-1'>Tipo de Movimentação:</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center space-x-2 px-3 py-1.5">
                                                    <Label
                                                        htmlFor="moviment-type-switch"
                                                        className={cn(
                                                            "cursor-pointer transition-colors py-2.5",
                                                            field.value === "Input" ? "text-gray-400" : "text-black dark:text-white"
                                                        )}
                                                    >
                                                        Saída
                                                    </Label>
                                                    <Switch
                                                        id="moviment-type-switch"
                                                        checked={field.value === "Input"} // "input" representa o estado "ligado"
                                                        onCheckedChange={(isChecked) => {
                                                            // Atualiza o valor do formulário com a string correspondente
                                                            field.onChange(isChecked ? "Input" : "Output");
                                                        }}
                                                        className="data-[state=unchecked]:bg-[#e95cb5]" // Cor vermelha quando desmarcado
                                                        aria-label="Tipo de Movimentação: Saída ou Entrada"
                                                    />
                                                    <Label
                                                        htmlFor="moviment-type-switch"
                                                        className={cn(
                                                            "cursor-pointer transition-colors",
                                                            field.value === "Output" ? "text-gray-400" : "text-black dark:text-white"
                                                        )}
                                                    >
                                                        Entrada
                                                    </Label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Second Layer */}
                        <FormField
                            control={form.control}
                            name="boolHasBudgetLimit"
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
                                                    <Label htmlFor="parcelado">Possui Limite?</Label>
                                                </div>

                                                {/* Campo condicional de número de parcelas com 50% */}
                                                <div className={`transition-opacity duration-300 ease-in-out ${field.value ? 'opacity-100 w-1/2' : 'opacity-0 w-0 pointer-events-none'}`}>
                                                    <FormField
                                                        control={form.control}
                                                        name="doubleBudgetLimit"
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
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading} form="dialogForm">
                        {isLoading ? "Carregando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogAddNewCategory;
