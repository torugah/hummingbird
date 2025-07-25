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
import { useSession } from "next-auth/react";
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
import type { Transaction } from "./variableExpensesColumns"; // Importar o tipo
import DialogEditDespesaVariavel from "./dialogEditDespesaVariavel";// Ajuste o caminho se necessário

interface ActionsCellProps {
    transaction: Transaction;
    user_id?: string | null | undefined; // Adicionado para passar ao diálogo de edição
}



const ActionsCell: React.FC<ActionsCellProps> = ({ transaction, user_id }) => {
    const router = useRouter(); // Mover useRouter para o nível superior do componente
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { data: session } = useSession();

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleDelete = async () => { 
        setIsDeleting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
            const response = await fetch(`${baseUrl}/api/transactions`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: transaction.id , userId: session?.user.id})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover transação.');
            }

            toast({
                title: "Sucesso!",
                description: `Transação "${transaction.str_name}" removida.`,
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
                     <TooltipContent 
                        className="bg-white text-black p-2 rounded-md max-w-[90vw] sm:max-w-[400px] dialog-scroll-container"
                        sideOffset={5}
                    >
                        <p className="line-clamp-4 overflow-y-auto max-h-[6rem]">
                            {transaction.str_description || "Sem descrição."}
                        </p>
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
                            {`Tem certeza que deseja remover a transação "${transaction.str_name}"? Esta ação não pode ser desfeita.`}
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

            {isEditDialogOpen && transaction && (
                <DialogEditDespesaVariavel
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    transactionToEdit={transaction}
                    userId={transaction.user_id}
                />
            )}
        </div>
    )
}

export default ActionsCell;