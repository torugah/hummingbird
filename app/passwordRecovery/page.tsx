'use client'

import React from 'react'
import Footer from '../_components/footer'
import { IoMdKey } from "react-icons/io";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import background from '@/public/img/hummingForBackground.png';
import { toast } from "@/components/hooks/use-toast";
import { Button } from '@/components/ui/button';

export default function page() {

    const handleFalseAlert = () => {         
        toast({
            title: "Solicitação enviada",
            description: "Em alguns instantes chegará um e-mail para que você redefina sua senha.",
        });
    };

    return (
        <div style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.90), rgba(255, 255, 255, 0.90)), url(${background.src})`}}
            className="flex flex-col flex-grow min-h-screen items-center justify-between bg-center bg-repeat bg-opacity-15"
        >
            <div className="flex flex-row justify-around items-center w-full bg-secondary py-3 px-5 border-gray-100 border-2 background bg-white">
                <Link href="/">
                    <p className='font-candara text-[#01C14C] text-4xl font-bold'>Hummingbird</p>
                </Link>
            </div>

            <div className="flex flex-row items-center justify-between">
                <div className='flex flex-col w-[540px] h-min-[280px] h-fit border-2  max-lg:w-[95%] mx-1
                                border-grey-100 rounded-xl my-16 bg-white bg-opacity-50 backdrop-blur-sm'>
                    <div className='flex h-fit pt-8 pb-2 justify-center'>
                        <div className='flex  h-20 w-20 bg-[#E0F8E9] rounded-full items-center justify-center'>
                            <div className='h-16 w-16 bg-[#C0F0D3] rounded-full flex items-center justify-center '>
                                <IoMdKey className='scale-x-[-1] rotate-[-45deg] h-14 w-14 text-[#01C14C]' />
                            </div>
                        </div>
                    </div>
                    <div className='font-candara font-semibold text-2xl text-center w-full'>Esqueceu a senha?</div>
                    <p className='text-center text-sm text-gray-500'>enviaremos as instruções atualizadas em breve.</p>
                    <div className="flex w-full h-fit items-center justify-center pt-8">
                        <div className='max-lg:w-[5%] w-[40%]'></div>
                        <div className='flex flex-col items-center justify-center w-full'>
                            <div className='w-full text-start'>
                                <Label htmlFor="email" className='float-start pb-2 pl-2'>Email</Label>
                            </div>

                            <Input type="email" id="email" placeholder="someone@email.com" />
                            <Button className='mt-4' type='button' onClick={handleFalseAlert}><p>Solicitar</p></Button>
                        </div>
                        <div className='max-lg:w-[5%] w-[40%]'></div>
                    </div>
                    <div className='h-fit w-fit pl-2 py-2 cursor-pointer 
                                    text-gray-400 text-left 
                                    hover:text-[#01C14C]'>
                        <TooltipProvider delayDuration={300}>
                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/" className='flex flex-row'>
                                            <ChevronLeft className='h-4 w-4' />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black p-2 rounded-md">
                                        <p>Voltar</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}
