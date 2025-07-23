'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SheetContents from "./sheets";
import DropdownMenuPages from "./allMenuPages";
import { FaBars } from "react-icons/fa6";
import { useMediaQuery } from 'react-responsive';
import MobileSheets from "./ui/mobileSheets";

const Header = () => {

    const isMobile = useMediaQuery({ maxWidth: 768 });

    if (isMobile) {
        return (
            <div className="flex flex-row justify-between items-center w-full bg-secondary py-2 px-2 border-gray-100 border-2 background bg-white">
                <Link href="/dashboard">
                    <p className='font-candara text-[#01C14C] text-2xl font-bold'>Hummingbird</p>
                </Link>
                
                <div>
                    <MobileSheets />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row justify-around items-center w-full bg-secondary py-6 px-5 border-gray-100 border-2 background bg-white">
            <div>
                <Link href="/dashboard">
                    <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                </Link>
            </div>
            
            <div className="flex flex-row justify-between items-center">
                <Button variant={"ghost"} asChild>
                    <Link href="/calendar" className="text-black">Calendário</Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">Início</Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <DropdownMenuPages />       
                <b className="px-1 text-gray-200 text-xs">|</b>      
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">Sobre Nós</Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">Ajuda</Link>
                </Button>   
            </div>
            
            <div>
                <SheetContents />
            </div>
        </div>
    );
}

export default Header;