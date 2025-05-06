"use client";

import React, { useState } from 'react'
import Footer from '../_components/footer'
import Header from '../_components/header'
import { FaGear, FaPen } from "react-icons/fa6";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getSession, useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

export default function Configurations() {

    const { data: session } = useSession();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogName, setOpenDialogName] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedNickname, setSelectedNickname] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // Função para abrir o Dialog
    const openModal = () => setOpenDialog(true);
    const closeModal = () => setOpenDialog(false);
    const openModalNickname = () => setOpenDialogName(true);
    const closeModalNickname = () => setOpenDialogName(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
    };

    const handleUploadAvatarImage = async () => {
        if (!selectedFile) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", session?.user?.id || "");

        const response = await fetch("/api/uploadImage", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        //console.log("Imagem salva em:", data.imageUrl);
        setIsLoading(false);
        closeModal()
    };

    const formDataNickname = new FormData();        
        formDataNickname.append("userId", session?.user?.id || "");
        formDataNickname.append("nickname", selectedNickname || "");

    const handleUpdateNickname = async () => {
        setIsLoading(true);

        console.log("Enviando requisição para API...");

        const response = await fetch('/api/user/editNickname', {
            method: 'POST',
            body: formDataNickname,
            headers: {
                "Accept": "application/json"
            }
        })

        console.log("Requisição enviada, aguardando resposta...");

        const data = await response.json();
        console.log("Resposta da API:", data);

        setIsLoading(false);
        closeModalNickname()
    }


    return (
        <div className="flex flex-col items-center justify-between">
            <Header />

            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

                <div className="flex flex-col ">
                    <div className="flex flex-row items-center">
                        <FaGear className="h-6 w-8 pr-2" />
                        <h1 className="text-2xl font-bold"> Configurações</h1>
                    </div>
                </div>

            </div>

            <div className="my-16 max-lg:w-[95%] max-lg:h-fit w-9/12 h-auto">
                <div className="flex flex-col bg-gray-100 rounded-md p-8 mb-8">
                    <div className="flex flex-row items-center">
                        <div className="relative group">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={session?.user?.image ?? "/profile-user-icon.jpg"} alt="User Avatar" />
                            </Avatar>

                            {/* Efeito de hover */}
                            <div
                                className="rounded-full absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 bg-gray-700 bg-opacity-50 text-white text-lg font-semibold cursor-pointer"
                                onClick={openModal}
                            >
                                Editar
                            </div>
                        </div>

                        <p className="pl-4 pr-2 text-xl font-semibold">{session?.user?.username ?? session?.user?.name ?? "Sem Nome"}</p>
                        <FaPen className="cursor-pointer" onClick={openModalNickname}/>

                        {/* Dialog do Shadcn */}
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTitle />
                            <DialogContent className='w-fit'>
                                <DialogHeader className='font-bold'>Editar Avatar</DialogHeader>

                                {/* Botão de Upload estilizado */}
                                <label htmlFor="upload" className="cursor-pointer flex flex-col items-center justify-center w-56 h-56 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition">
                                    <Upload className="w-10 h-10 mb-2" />
                                    {selectedFile ? selectedFile.name : "Enviar imagem"}
                                </label>
                                <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg, image/jpg, image/gif, image/png, image/webp"
                                onChange={handleFileChange} 
                                />
                                {/* Botão de salvar */}
                                <DialogFooter>
                                    <Button type="submit" disabled={isLoading} onClick={handleUploadAvatarImage}>
                                        {isLoading ? "Salvando..." : "Salvar"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openDialogName} onOpenChange={setOpenDialogName}>
                            <DialogTitle />
                            <DialogContent className='w-fit' aria-describedby='dialogNicknameUpdater'>
                                <DialogHeader className='font-bold'>Editar Apelido</DialogHeader>

                                {/* Botão de Upload estilizado */}
                                <label >
                                    Digite seu novo apelido:
                                </label>
                                <Input 
                                    type="text" 
                                    placeholder="Nick Jones" 
                                    value={selectedNickname || ""}
                                    onChange={(e) => setSelectedNickname(e.target.value)}/>
                                {/* Botão de salvar */}
                                <DialogFooter>
                                    <Button type="submit" disabled={isLoading} onClick={handleUpdateNickname}>
                                        {isLoading ? "Salvando..." : "Salvar"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}
