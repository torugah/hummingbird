'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useToast } from "@/components/hooks/use-toast";
import { useState, useRef } from "react";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { NumericFormat } from 'react-number-format';
import { Desires } from "./DesiresListServer";
import { Upload } from 'lucide-react';
import { ImageCropperDialog } from './ImageCropperDialog';

const EditFormSchema = z.object({
    str_wishName: z.string().min(3, "Mínimo de 3 caracteres"),
    str_wishDescription: z.string().optional(),
    dbl_wishValue: z.string().refine(val => {
        const numericValue = val.replace(/[^0-9]/g, "");
        return numericValue.length > 0;
    }, "Valor inválido"),
    str_image: z.string().optional()
});

type EditFormValues = z.infer<typeof EditFormSchema>;

const DialogEditDeleteWish: React.FC<{ desiresToEdit: Desires, userId: string | null | undefined }> = ({ desiresToEdit, userId }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(EditFormSchema),
        values: {
            str_wishName: desiresToEdit.str_wishName,
            str_wishDescription: desiresToEdit?.str_wishDescription ?? undefined,
            dbl_wishValue: desiresToEdit.dbl_wishValue.toString(),
            str_image: desiresToEdit.str_image ?? undefined
        },
    });

    const { reset } = form;

    const handleCancel = () => {
        reset();
        setSelectedImageFile(null);
    };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Erro",
                description: "Por favor, selecione um arquivo de imagem válido.",
                variant: "destructive",
            });
            return;
        }

        setSelectedImageFile(file);
        setCropperOpen(true);
    };

    const handleUploadAvatarImage = async (croppedImage: Blob) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", croppedImage, selectedImageFile?.name || 'image.jpg');
            formData.append("userId", userId || "");

            const response = await fetch("/api/uploadImageNOPE", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Falha ao enviar imagem");
            }

            const data = await response.json();
            form.setValue("str_image", data.imageUrl);
            toast({
                title: "Sucesso!",
                description: "Imagem atualizada com sucesso!",
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao enviar a imagem.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setSelectedImageFile(null);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${baseUrl}/api/desires?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: desiresToEdit.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover item.');
            }

            toast({
                title: "Sucesso!",
                description: `Item "${desiresToEdit.str_wishName}" removido.`,
            });
            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Oops! Algo deu errado ao remover este item.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const onSubmit = async (data: EditFormValues) => {
        setIsLoading(true);
        const rawValue = data.dbl_wishValue.replace(/[^0-9]/g, "");
        const numericValue = parseFloat(rawValue) / 100;

        const requestBody = {
            id: desiresToEdit.id,
            str_wishName: data.str_wishName,
            str_wishDescription: data.str_wishDescription,
            dbl_wishValue: numericValue,
            str_image: data.str_image
        };

        try {
            const response = await fetch(`${baseUrl}/api/desires?userId=${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                toast({ title: "Sucesso!", description: "Item atualizado!" });
            } else {
                const errorData = await response.json().catch(() => ({ message: "Erro ao processar a resposta do servidor." }));
                toast({ title: "Erro", description: errorData.message || "Oops! Algo deu errado.", variant: "destructive" });
            }
            router.refresh();
        } catch (error) {
            toast({ title: "Erro de Rede", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" variant={"secondary"} aria-label="Abrir ações do cartão" className="p-1 rounded-md">
                        <PiDotsThreeOutlineVerticalFill className="text-gray-700 hover:text-[#01C14C] h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Item</DialogTitle>
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
                            <div className="flex flex-row max-lg:flex-col space-x-2">
                                <div className="w-1/2 max-lg-w-[100%]">
                                    <FormField
                                        control={form.control}
                                        name="str_wishName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Item</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nome do item"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2 max-lg-w-[100%]">
                                    <FormField
                                        control={form.control}
                                        name="dbl_wishValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor do Item</FormLabel>
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
                                name="str_wishDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Descrição do item"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-center items-center pt-2">
                                <label htmlFor="upload" className="cursor-pointer flex flex-col items-center justify-center w-2/3 h-fit aspect-video bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition">
                                    <Upload className="w-10 h-10 mb-2" />
                                    {selectedImageFile ? selectedImageFile.name : "Carregar imagem"}
                                </label>
                                <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg, image/jpg, image/gif, image/png, image/webp"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} form="editCardForm">
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting}>
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
                            Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.
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

            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageFile={selectedImageFile}
                onCropComplete={handleUploadAvatarImage}
                aspect={16/9}
            />
        </>
    );
};

export default DialogEditDeleteWish;