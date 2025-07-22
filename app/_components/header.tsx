import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SheetContents from "./sheets";
import DropdownMenuPages from "./allMenuPages";
import { FaBars } from "react-icons/fa6";

const Header = () => {
    return (
        <div className="flex flex-row justify-between items-center w-full bg-secondary py-6 px-5 border-gray-100 border-2 background bg-white">
            {/* Logo/Texto - alterna entre versões */}
            <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center">
                    {/* Logo - visível apenas em desktop */}
                    <div className="hidden md:block">
                        <Image 
                            src="/hummingBirdLogo.png" 
                            alt="Hummingbird Logo" 
                            height={50} 
                            width={50}
                        />
                    </div>
                    
                    {/* Texto Hummingbird - visível apenas em mobile */}
                    <p className='md:hidden font-candara text-[#01C14C] text-md font-bold'>
                        Hummingbird
                    </p>
                </Link>
            </div>

            {/* Menu principal - visível apenas em desktop */}
            <div className="hidden md:flex flex-row justify-between items-center">
                <Button variant={"ghost"} asChild>
                    <Link href="/calendar" className="text-black">
                        Calendário 
                    </Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Início 
                    </Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <DropdownMenuPages />       
                <b className="px-1 text-gray-200 text-xs">|</b>      
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Sobre Nós 
                    </Link>
                </Button>
                <b className="px-1 text-gray-200 text-xs">|</b>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Ajuda 
                    </Link>
                </Button>   
            </div>

            {/* Controles do lado direito */}
            <div className="flex items-center">
                {/* Ícone de menu - visível apenas em mobile */}
                <div className="md:hidden">
                    <button className="text-black p-2">
                        <FaBars size={24} />
                    </button>
                    <SheetContents />
                </div>
                
                {/* Versão desktop do SheetContents (se necessário) */}
                <div className="hidden md:block">
                    <SheetContents />
                </div>
            </div>
        </div>
    );
}

export default Header;