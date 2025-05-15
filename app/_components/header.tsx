import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SheetContents from "./sheets";
import DropdownMenuPages from "./allMenuPages";

const Header = () => {
    return (
        <div className="flex flex-row justify-around items-center w-full bg-secondary py-6 px-5 border-gray-100 border-2 background bg-white">
            <div>
                <Link href="/dashboard">
                    <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                </Link>
            </div>
            <div className="flex flex-row justify-between items-center">
                <Button variant={"ghost"} asChild>
                    <Link href="/timeVision" className="text-black">
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
            <div>
                <SheetContents />
            </div>
            
        </div>
    );
}

export default Header;