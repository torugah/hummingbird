"use client";

import { FaTrashAlt } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaPen } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useState } from "react";
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
import type { DesicaoDeCompra } from "./DecisionColumns"; 
import DialogEditDecisions from "./dialogEditDecisions";


interface ActionsCellProps {
    purchaseDecision: DesicaoDeCompra;
    user_id?: string | null | undefined; 
}

const ActionsCell: React.FC<ActionsCellProps> = ({ purchaseDecision, user_id }) => {
    const router = useRouter(); // Mover useRouter para o nível superior do componente
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = () => {
        if (!purchaseDecision.str_user_id) {
            console.log("ID do usuário não encontrado para edição.", purchaseDecision.str_user_id)
            toast({ title: "Erro", description: "ID do usuário não encontrado para edição.", variant: "destructive" });
        }
        setIsEditDialogOpen(true);
    };

    const handleDelete = async () => { 
        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/decisions?userId=${user_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: purchaseDecision.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover transação.');
            }

            toast({
                title: "Sucesso!",
                description: `Transação "${purchaseDecision.str_name}" removida.`,
            });
            setIsDeleteDialogOpen(false);
            router.refresh(); // Atualiza os dados da página (Server Component)
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Oops! Algo deu errado ao remover a transação.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center space-x-1">
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-200 p-1">
                            <IoInformationCircleOutline className="h-4 w-4 text-blue-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black p-2 rounded-md">
                        <p>{purchaseDecision.str_descriptionOrLink.startsWith('http') ? "Sem descrição." : !purchaseDecision.str_descriptionOrLink.trim() ? "Sem descrição." : purchaseDecision.str_descriptionOrLink }</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" onClick={handleEdit} className="hover:bg-gray-200 p-1">
                <FaPen className="h-4 w-4 text-[#FFD103]" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)} className="hover:bg-gray-200 p-1">
                <FaTrashAlt className="h-4 w-4 text-red-600" />
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a transação "{purchaseDecision.str_name}"? Esta ação não pode ser desfeita.
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

            {isEditDialogOpen && purchaseDecision && (
                <DialogEditDecisions
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    decisionToEdit={purchaseDecision}
                    userId={user_id}
                />
            )}
        </div>
    )
}

export default ActionsCell;