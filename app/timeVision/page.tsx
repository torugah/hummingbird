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
        <div className="flex flex-col items-center justify-between">
            <Header />
            <div className='max-lg:w-[95%] w-[75%]'>
                <div className='flex flex-row items-center mt-6'>
                    <FaRegCalendar /> 
                    <p className='font-bold text-2xl pl-1'>Calendário</p>   
                </div>
            </div>
                        
            <div className='flex flex-row justify-between max-lg:w-[95%] w-[75%] background bg-white py-6'>
                <div className="w-[50%] h-auto">
                    <CalendarioCustomizado onDateChange={setSelectedDate}/>
                </div>
                <div className='flex flex-row items-center justify-center w-[50%]'>
                    <ListaEventos selectedDate={selectedDate }/>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TimeVisionPage;