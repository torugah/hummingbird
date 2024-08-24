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
            <div className="justify-between">
                <Button variant={"ghost"} asChild>
                    <Link href="/timeVision" className="text-black">
                        Meu Fluxo 
                    </Link>
                </Button>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Meus Investimentos 
                    </Link>
                </Button>
                <DropdownMenuPages />
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Ajuda 
                    </Link>
                </Button>                
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-black">
                        Sobre Nós 
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