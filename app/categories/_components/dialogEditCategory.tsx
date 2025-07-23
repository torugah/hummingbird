'use client'

import React, { useState, useEffect } from 'react'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/hooks/use-toast"
import { cn } from "@/lib/utils"
import { NumericFormat } from 'react-number-format';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { useRouter } from 'next/navigation';
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

// Interface da Categoria (consistente com categoryCardList.tsx)
interface Category {
    category_id: number;
    str_categoryName: string;
    str_movimentType: 'Input' | 'Output';
    bool_hasBudgetLimit: boolean;
    dbl_budgetLimit: number | null;
    str_image: string | null;
    bool_active: boolean;
}

const EditFormSchema = z.object({
    categoryName: z.string().min(3, "O nome da categoria deve ter pelo menos 3 caracteres.").max(80),
    stringMovimentType: z.enum(["Input", "Output"], { errorMap: () => ({ message: "Selecione um tipo de movimentação." }) }),
    boolHasBudgetLimit: z.boolean(),
    doubleBudgetLimit: z.number().nullable(),
}).refine(data => {
    if (data.boolHasBudgetLimit) {
        return data.doubleBudgetLimit !== null && data.doubleBudgetLimit > 0;
    }
    return true;
}, {
    message: "O limite do orçamento deve ser um valor positivo quando habilitado.",
    path: ["doubleBudgetLimit"],
});

type EditFormValues = z.infer<typeof EditFormSchema>;

interface DialogEditCategoryProps {
    category: Category;
    // isOpen: boolean;
    // onOpenChange: (open: boolean) => void;
    // onCategoryUpdated: () => void;
    userId: string | null | undefined;
}

const DialogEditCategory: React.FC<DialogEditCategoryProps> = ({
    category,
    // isOpen,
    // onOpenChange,
    // onCategoryUpdated,
    userId
}) => {
    const form = useForm<EditFormValues>({
        resolver: zodResolver(EditFormSchema),
        // Usar 'values' para props que podem mudar. React Hook Form lidará com a atualização.
        // Isso é geralmente mais eficaz do que useEffect + reset para sincronizar com props.
        values: {
            categoryName: category.str_categoryName,
            stringMovimentType: category.str_movimentType,
            boolHasBudgetLimit: category.bool_hasBudgetLimit,
            doubleBudgetLimit: category.dbl_budgetLimit,
        },
    });

    const { setValue, watch, formState: { isDirty } } = form;
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const watchedHasBudgetLimit = watch("boolHasBudgetLimit");
    useEffect(() => {
        // if (!watchedHasBudgetLimit && isOpen) { // isOpen check to avoid running on initial mount if dialog not open
        if (!watchedHasBudgetLimit) { // isOpen check to avoid running on initial mount if dialog not open
        }
        setValue("doubleBudgetLimit", null);
    }, [watchedHasBudgetLimit, setValue]);
    // }, [watchedHasBudgetLimit, setValue, isOpen]);

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do diálogo

    const { reset } = form;

    const onSubmit = async (data: EditFormValues) => {
        setIsLoading(true);

        const requestBody = {
            category_id: category.category_id,
            user_id: userId,
            str_categoryName: data.categoryName,
            str_movimentType: data.stringMovimentType,
            bool_hasBudgetLimit: data.boolHasBudgetLimit,
            dbl_budgetLimit: data.boolHasBudgetLimit ? data.doubleBudgetLimit : null
        };

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
            const response = await fetch(`${baseUrl}/api/categories`, { // Endpoint para atualização
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                toast({ title: "Sucesso!", description: "Categoria atualizada!" });
            } else {
                const errorData = await response.json().catch(() => ({ message: "Erro ao processar a resposta do servidor." }));
                toast({ title: "Erro", description: errorData.message || "Oops! Algo deu errado.", variant: "destructive" });
            }
            setIsOpen(false); // Fecha o diálogo
            router.refresh();
        } catch (error) {
            toast({ title: "Erro de Rede", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        setIsDeleting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
            const response = await fetch(`${baseUrl}/api/categories`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryId: category.category_id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover categoria.');
            }

            toast({
                title: "Sucesso!",
                description: `Categoria "${category.str_categoryName}" removida.`,
            });
            setIsDeleteDialogOpen(false);
            router.refresh(); // Atualiza os dados da página (Server Component)
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Oops! Algo deu errado ao remover a categoria.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        reset(); // Reseta os valores do formulário para os valores padrão
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Se o diálogo estiver fechando (por qualquer motivo: X, clique fora, Esc, botão Cancelar)
            handleCancel();
        }
        setIsOpen(open);
    };

    return ( 
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button type="button" variant={"secondary"} aria-label="Abrir ações da categoria" className="p-1 rounded-md">
                        <PiDotsThreeOutlineVerticalFill className="text-gray-700 hover:text-[#01C14C] h-5 w-5" /> {/* Ajuste o tamanho e cor conforme necessário */}
                    </Button>
                </DialogTrigger>    
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogDescription>
                            Modifique as informações abaixo e salve as alterações.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form id="editCategoryForm" className="w-full space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-row space-x-2">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="categoryName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Categoria:</Label>
                                                <FormControl><Input type="text" placeholder='Ex: Transporte' {...field} /></FormControl>
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
                                                        <Label htmlFor="edit-moviment-type-switch" className={cn("cursor-pointer transition-colors py-2.5", field.value === "Input" ? "text-gray-400" : "text-black dark:text-white")}>Saída</Label>
                                                        <Switch id="edit-moviment-type-switch" checked={field.value === "Input"} onCheckedChange={(isChecked) => field.onChange(isChecked ? "Input" : "Output")} className="data-[state=unchecked]:bg-[#e95cb5]" />
                                                        <Label htmlFor="edit-moviment-type-switch" className={cn("cursor-pointer transition-colors", field.value === "Output" ? "text-gray-400" : "text-black dark:text-white")}>Entrada</Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="boolHasBudgetLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className={`flex items-center transition-all duration-300 ease-in-out`}>
                                                <div className={`flex items-center justify-between w-full`}>
                                                    <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${field.value ? 'w-1/2' : 'w-full justify-center'}`}>
                                                        <Switch id="edit-has-budget-limit" checked={field.value} onCheckedChange={field.onChange} />
                                                        <Label htmlFor="edit-has-budget-limit">Possui Limite?</Label>
                                                    </div>
                                                    <div className={`transition-opacity duration-300 ease-in-out ${field.value ? 'opacity-100 w-1/2' : 'opacity-0 w-0 pointer-events-none'}`}>
                                                        <FormField
                                                            control={form.control}
                                                            name="doubleBudgetLimit"
                                                            render={({ field: budgetField }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <NumericFormat value={budgetField.value} onValueChange={(values) => budgetField.onChange(values.floatValue)} thousandSeparator="." decimalSeparator="," prefix="R$ " fixedDecimalScale={true} decimalScale={2} placeholder="R$ #.###,##" customInput={Input} disabled={!form.getValues("boolHasBudgetLimit")} />
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
                            <Button type="button" variant="ghost">Cancelar</Button> 
                        </DialogClose>
                        <Button type="submit" disabled={isLoading || !isDirty} form="editCategoryForm">
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
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
                            {`Tem certeza que deseja remover a categoria "${category.str_categoryName}"? Esta ação não pode ser desfeita e removerá uma categoria que pode estar vinculada a transações existentes.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Removendo..." : "Remover"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DialogEditCategory;