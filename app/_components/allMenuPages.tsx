import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

const DropdownMenuPages = () => {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">Páginas</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">                    
                    <DropdownMenuItem>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/categories" className="text-black">
                                Minhas Categorias 
                            </Link>
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/cards" className="text-black">
                                Meus Cartões 
                            </Link>
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button variant={"ghost"} className="w-full justify-start" asChild>
                            <Link href="/desiresAndDecisions" className="text-black">
                                Desejos e Decisões 
                            </Link>
                        </Button>
                    </DropdownMenuItem>
                    
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default DropdownMenuPages;
