"use client"

import React, { useState } from 'react'
import Header from '../_components/header';
import Footer from '../_components/footer';
import { FaRegCalendar } from "react-icons/fa6";
import CalendarioCustomizado from './_components/CalendarioCustomizado';
import ListaEventos from './_components/ListaEventos';

function TimeVisionPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-lg-w-full w-[74%]">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Seção do Calendário */}
                    <div className="lg:w-3/5">
                        <div className="flex items-center gap-2 mb-4">
                            <FaRegCalendar className="text-xl" />
                            <h1 className="text-2xl font-bold">Calendário</h1>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-between">
                            <CalendarioCustomizado onDateChange={setSelectedDate}/>
                        </div>
                    </div>
                    
                    {/* Seção de Eventos e Descrição */}
                    <div className="lg:w-2/5 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <ListaEventos selectedDate={selectedDate}/>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Descrição</h2>
                            <div className="space-y-2">
                                <p>MXRF11 - 698 Cotass - R$67,45</p>
                                <p>VPLG11 - 51 Cotas - R$52,63</p>
                                <p>AGRX11 - 296 Cotas - R$26,37</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default TimeVisionPage;