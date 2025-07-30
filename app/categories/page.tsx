'use server'

import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { ChevronRight } from "lucide-react"
import { FaRegEdit } from "react-icons/fa";
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'
import CategoryCardList from './_components/categoryCardList'

export default async function Categories({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}
) {

    const data = await getServerSession(authOptions);
    const userId = data?.user.id;
    const showDialog = searchParams.addNew === "true";

    // TODO: Alerta de gasto nas categorias.
    // TODO: Desabilitar categorias e lista de categorias desabilitadas.
    // TODO: Habilitar forma de pagamento dependendo se for dinheiro oou cartão.
    // TODO: Reajustar o layout do dialog.

    return (
        <div className="flex flex-col items-center justify-between">
            <Header />
            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

                <div className="flex flex-col ">
                    <div className="flex flex-row items-center">
                        <FaRegEdit className="h-5 w-6 pr-2" />
                        <h1 className="text-2xl font-bold"> Editar Categorias</h1>
                    </div>
                    <p>Adicione, defina limites e edite suas categorias!</p>
                </div>

                <div className="flex flex-col text-end">
                    <Link href="/cards" className="text-black flex flex-row items-center justify-end">
                        <h1 className="text-2xl font-bold ">Meus Cartões</h1>
                        <ChevronRight className="h-6 w-8 pl-2" />
                    </Link>
                    <p>Adicione e edite seus cartões</p>
                </div>

            </div>
            {/* Container para os cards de categoria */}
            <div className="flex flex-row flex-wrap max-lg:w-[95%] justify-center my-16 w-[74%] gap-2">
                <CategoryCardList userId={userId} showDialog={showDialog} />
            </div>
            <Footer />
        </div>
    )
}
