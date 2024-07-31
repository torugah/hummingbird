import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react"

const Header = () => {
    return (
        <div className="flex flex-row justify-around items-center w-full bg-secondary py-6 px-5 border-gray-100 border-2 background bg-white">
            <div>
                <Image  src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
            </div>
            <div className="justify-between">
                <Button variant={"ghost"} asChild>
                    <Link href="/" className="text-black">
                        Meu Fluxo 
                    </Link>
                </Button>
                <Button variant={"ghost"} asChild>
                    <Link href="/" className="text-black">
                        Meus Investimentos 
                    </Link>
                </Button>
                <Button variant={"ghost"} asChild>
                    <Link href="/" className="text-black">
                        Ajuda 
                    </Link>
                </Button>
                <Button variant={"ghost"} asChild>
                    <Link href="/" className="text-black">
                        Sobre Nós 
                    </Link>
                </Button>
            </div>
            <div>
                <Button variant={"ghost"} asChild>
                    <Link href="/dashboard" className="text-[#01C14C]">
                        Account <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
            
        </div>
    );
}

export default Header