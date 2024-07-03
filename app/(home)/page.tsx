"use client"

import Image from "next/image";
import Footer from "../_components/footer";
import { InputForm } from "../_components/signInForm";
import { FaGoogle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row border-[2px] border-gray-40 my-16 max-sm:w-[95%] w-3/5 h-[80vh]">

        <div className="max-md:w-full w-1/2 h-full bg-gray-100 p-12">
          <div className="flex flex-col space-y-1">
            <Image src="/tailwindIcon.png" alt="FSW Barber" height={50} width={50} />
            <h1 className="text-xl font-black">Sign in to your account</h1>
            <div className="flex flex-row">
              <p className="text-sm pb-5 pr-1">Or </p>
              <p className="text-sm pb-5 text-green-600 font-semibold underline cursor-pointer hover:underline-offset-2">don't have an accont?</p>
            </div>            
            <Button variant="outline" className="text-gray-400">
              <FaGoogle style={{ marginRight: '8px' }} /> Sign in with Google
            </Button>
            <div className="flex items-center py-2">
              <div className="flex-grow border-t-2 border-gray-300"></div>
              <span className="px-4 text-gray-500 text-xs">Or continue with</span>
              <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>
            <InputForm />
          </div>
        </div>
      
        <div className="max-md:hidden w-1/2 h-full bg-[url('/signUpSide.jpg')] bg-cover" />

      </div>
      <Footer />
    </div>
  );
}
