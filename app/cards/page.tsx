import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { FaRegCreditCard } from 'react-icons/fa'
import { ChevronRight } from 'lucide-react'
import Link from "next/link";

function CardPage() {
  return (
    <div className="flex flex-col items-center justify-between">

        <Header />

        <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

            <div className="flex flex-col ">
                <div className="flex flex-row items-center">
                    <FaRegCreditCard  className="h-5 w-6 pr-2"/>
                    <h1 className="text-2xl font-bold">Meus Cartões</h1>
                </div>
                <p>Adicione, denote limites e edite seus cartões!</p>
            </div>

            <div className="flex flex-col text-end">
                <Link href="/categories" className="text-black flex flex-row items-center justify-end">           
                    <h1 className="text-2xl font-bold ">Meus Categorias</h1>             
                    <ChevronRight className="h-6 w-8 pl-2" />
                </Link>               
                <p>Adicione e edite suas categorias</p>
            </div>            
        </div>

        <div className="flex max-lg:w-[95%] flex-row justify-around mt-16 w-[74%] p-1">

            <p>TODO: Criar um CRUD e Exibição dos Cartões do Usuário Aqui!</p>

        </div>

        <Footer />

    </div>
  )
}

export default CardPage