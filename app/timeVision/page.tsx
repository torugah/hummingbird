"use client"

import React, { useState } from 'react'
import Header from '../_components/header';
import Footer from '../_components/footer';
import { FaRegCalendar } from "react-icons/fa6";
import CalendarioCustomizado from './_components/CalendarioCustomizado';

function TimeVisionPage() {
    
    return (
        <div className="flex flex-col items-center justify-between">
            <Header />
            <div className='max-lg:w-[95%] w-[75%]'>
                <div className='flex flex-row items-center mt-6'>
                    <FaRegCalendar /> 
                    <p className='font-bold text-lg pl-1'>Calendário</p>   
                </div>
            </div>
                        
            <div className='flex flex-row justify-center max-lg:w-[95%] w-[75%] background bg-white py-6'>
                <CalendarioCustomizado />
            </div>
            <Footer />
        </div>
    )
}

export default TimeVisionPage;