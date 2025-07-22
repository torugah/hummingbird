'use client'

import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserIcon, LogInIcon } from "lucide-react";
import { FaGear, FaDoorClosed, FaDoorOpen } from "react-icons/fa6";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";

function MobileSheets() {

    const { data } = useSession();
    
    const handleLogoutClick = () => signOut();

    const handleLoginClick = () => signIn("google");

    const [hovered, setHovered] = useState(false);

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant={"ghost"}>
                        {/*<Link href="/dashboard" className="text-[#01C14C]">*/}
                            <FaBars size={24} />
                        {/*</Link>*/}
                    </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                    <SheetHeader className="text-left border-b border-solid border-secondary p-5">
                        <SheetTitle>Minha conta</SheetTitle>
                    </SheetHeader>

                    {data?.user ? (
                        <div className="flex justify-between px-5 py-6 items-center">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={data.user?.image ?? "/profile-user-icon.jpg"} />
                                </Avatar>

                                <h2 className="font-bold">{data.user.name}</h2>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onMouseEnter={() => setHovered(true)}  // Quando o mouse entra
                                onMouseLeave={() => setHovered(false)} // Quando o mouse sai
                                onClick={handleLogoutClick}
                            >
                                {hovered ? (
                                    <FaDoorOpen />
                                ) : (
                                    <FaDoorClosed />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col px-5 py-6 gap-3">
                            <div className="flex items-center gap-2">
                                <UserIcon size={32} />
                                <h2 className="font-bold">Olá, faça seu login!</h2>
                            </div>
                            <Button variant="secondary" className="w-full justify-start" onClick={handleLoginClick}>
                                <LogInIcon className="mr-2" size={18} />
                                Fazer Login
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 px-5">
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href="/configurations">
                                <FaGear size={18} className="mr-2" />
                                Configurações
                            </Link>
                        </Button>
                    </div>

                    <p className='text-2xl'>Páginas</p>
                    
                    <div className="flex flex-row justify-between items-center">
                        <Button variant={"ghost"} asChild className='w-full justify-start'>
                            <Link href="/calendar" className="text-black">Calendário</Link>
                        </Button>
                        <Button variant={"ghost"} asChild className='w-full justify-start'>
                            <Link href="/dashboard" className="text-black">Início</Link>
                        </Button>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/categories" className="text-black">
                                Minhas Categorias 
                            </Link>
                        </Button>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/cards" className="text-black">
                                Meus Cartões 
                            </Link>
                        </Button>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/desiresAndDecisions" className="text-black">
                                Desejos e Decisões 
                            </Link>
                        </Button>      
                        <Button variant={"ghost"} asChild className='w-full justify-start'>
                            <Link href="/dashboard" className="text-black">Sobre Nós</Link>
                        </Button>
                        <Button variant={"ghost"} asChild className='w-full justify-start'>
                            <Link href="/dashboard" className="text-black">Ajuda</Link>
                        </Button>   
                    </div>

                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileSheets