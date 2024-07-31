"use client"

import React, { useState } from 'react'
import Header from '../_components/header';
import Footer from '../_components/footer';
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from 'date-fns/locale';
import '../styles/customCalendar.css';
import { FaRegCalendar } from "react-icons/fa6";

function TimeVisionPage() {

    const [date, setDate] = React.useState<Date | undefined>(new Date())
    
    return (
        <div className="flex flex-col items-center justify-between">
            <Header />
            <div className='flex flex-row items-center mt-6'>
                <FaRegCalendar /> 
                <p className='font-bold text-lg pl-1'>Calendário</p>   
            </div>
            
            <div className='flex flex-row justify-center max-lg:w-[95%] w-[75%] background bg-white py-6'>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    className="shadow-md rounded-lg calendar-custom"                    
                />
            </div>
            <Footer />
        </div>
    )
}

export default TimeVisionPage;