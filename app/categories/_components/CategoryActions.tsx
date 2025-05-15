'use client';

import React, { useState } from 'react';
import { FaPen, FaTrashCan } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Certifique-se de ter este componente (shadcn/ui add alert-dialog)
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from 'next/navigation';

// Interface simplificada para a categoria, contendo apenas o necessário para este componente
interface Category {
    category_id: number;
    str_categoryName: string;
    // Adicione outros campos se forem relevantes para as ações aqui
}

interface CategoryActionsProps {
    category: Category;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({ category }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDeleteCategory = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/categories/delete', {
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

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {/* Envolvemos o ícone em um botão para garantir a interatividade correta */}
                    <button type="button" aria-label="Abrir ações da categoria" className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1">
                        <PiDotsThreeOutlineVerticalFill className="text-gray-700 hover:text-[#01C14C] h-5 w-5" /> {/* Ajuste o tamanho e cor conforme necessário */}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem disabled> {/* Desabilitado por enquanto */}
                            <FaPen className="text-[#FF9D0D] mr-2" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 hover:!text-red-600 hover:!bg-red-100">
                            <FaTrashCan className="mr-2" />
                            <span>Remover</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a categoria "{category.str_categoryName}"? Esta ação não pode ser desfeita e removerá uma categoria que pode estar vinculada a transações existentes.
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
    );
};

export default CategoryActions;