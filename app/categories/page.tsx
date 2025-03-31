'use client'

import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { ChevronRight } from "lucide-react"
import { FaRegEdit } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FaRegMoneyBill1 } from "react-icons/fa6";

export default function Categories() {    

    return (
        <div className="flex flex-col items-center justify-between">
            <Header />
            <div className="flex max-lg:w-[95%] flex-row justify-between mt-16 w-[74%]">

                <div className="flex flex-col ">
                    <div className="flex flex-row items-center">
                        <FaRegEdit className="h-5 w-6 pr-2"/>
                        <h1 className="text-2xl font-bold"> Editar Categorias</h1>
                    </div>
                    <p>Adicione, defina limites e edite suas categorias!</p>
                </div>

                <div className="flex flex-col text-end">
                    <div className="flex flex-row items-center justify-end">
                        <h1 className="text-2xl font-bold ">Meus Cartões</h1>
                        <ChevronRight className="h-6 w-8 pl-2" />
                    </div>
                    <p>Adicione e edite seus cartões</p>
                </div>

            </div>
            <div className="flex max-lg:w-[95%] flex-row justify-around mt-16 w-[74%] p-1">
                <div className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg'>
                    <div className="bg-[url('/Paisagem-1.jpg')] bg-cover h-5/6 rounded-sm">
                    </div>
                    <div className='flex flex-row h-2/6 justify-between p-1'>
                        <div className='flex flex-col justify-around'>
                            <p>Casa</p>
                            <div className='flex flex-row items-center'>
                                <FaRegMoneyBill1 className='pr-2 h-4 w-6'/>
                                <p className='text-xs'>Meu limite de gastos é R$3.500,00</p>
                            </div>
                            
                        </div>
                        <div className='flex flex-col text-end self-center'>
                            <PiDotsThreeOutlineVerticalFill />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg'>
                    <div className="bg-[url('/Paisagem-1.jpg')] bg-cover h-5/6 rounded-sm">
                    </div>
                    <div className='flex flex-row h-2/6 justify-between p-1'>
                        <div className='flex flex-col justify-around'>
                            <p>Casa</p>
                            <div className='flex flex-row items-center'>
                                <FaRegMoneyBill1 className='pr-2 h-4 w-6'/>
                                <p className='text-xs'>Meu limite de gastos é R$3.500,00</p>
                            </div>
                            
                        </div>
                        <div className='flex flex-col text-end self-center'>
                            <PiDotsThreeOutlineVerticalFill />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col p-[0.1rem] w-[32%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg'>
                    <div className="bg-[url('/Paisagem-1.jpg')] bg-cover h-5/6 rounded-sm">
                    </div>
                    <div className='flex flex-row h-2/6 justify-between p-1'>
                        <div className='flex flex-col justify-around'>
                            <p>Casa</p>
                            <div className='flex flex-row items-center'>
                                <FaRegMoneyBill1 className='pr-2 h-4 w-6'/>
                                <p className='text-xs'>Meu limite de gastos é R$3.500,00</p>
                            </div>
                            
                        </div>
                        <div className='flex flex-col text-end self-center'>
                            <PiDotsThreeOutlineVerticalFill />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
