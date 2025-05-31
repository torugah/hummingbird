import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { IoIosGift , IoMdGift } from "react-icons/io";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-between">
      <Header />
      <div className="flex max-lg:w-[95%] flex-col justify-between mt-16 w-[74%]">

        <div className="flex flex-col ">
          <div className="flex flex-row items-center">
            <IoIosGift className="h-5 w-6 pr-2" />
            <h1 className="text-2xl font-bold">Lista de Desejos</h1>
          </div>
          <p>Liste seus desejos para o futuro!</p>
        </div>

        <hr className="border-t-2 border-gray-300 my-4" />

        <div className="flex flex-col ">
          <div className="flex flex-row items-center">
            <IoMdGift className="h-5 w-6 pr-2" />
            <h1 className="text-2xl font-bold">Decisão de Compra</h1>
          </div>
          <p>Escolhas seus itens e decida quando comprá-los!</p>
        </div>

      </div>
      <Footer />
    </div>
  )
}
