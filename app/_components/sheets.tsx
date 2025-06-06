"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SideMenu from "./ui/side-menu";
import { ChevronRight } from "lucide-react"

const SheetContents = () => {
  
  return (
    <>
    <Sheet>
        <SheetTrigger asChild>
            <Button variant={"ghost"}>
                {/*<Link href="/dashboard" className="text-[#01C14C]">*/}
                    Conta <ChevronRight className="h-4 w-4" />
                {/*</Link>*/}
            </Button>
        </SheetTrigger>
        <SheetContent className="p-0">
        <SideMenu />
        </SheetContent>
    </Sheet>
    </>
  );
};

export default SheetContents;