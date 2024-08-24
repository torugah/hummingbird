"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import Footer from "../_components/footer";
import Header from '../_components/header';
import { SignInForm } from "../_components/signInForm";
import { SignUpForm } from "../_components/signUpForm";
import { FaGoogle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export default function Home() {
  const [isMoved, setIsMoved] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { data: session } = useSession()

  const horaAtual = new Date();
    const hora = horaAtual.getHours();

    // Determina a saudação com base na hora
    let saudacao;

    if (hora >= 5 && hora < 12) {
        saudacao = 'Bom dia';
    } else if (hora >= 12 && hora < 18) {
        saudacao = 'Boa tarde';
    } else {
        saudacao = 'Boa noite';
    }

    // Formatar a data para "8 de Abril, 2024"
  const dataFormatada = format(horaAtual, "d 'de' MMMM, yyyy", { locale: ptBR });

  // Obter o dia da semana "Segunda-Feira"
  const diaDaSemana = format(horaAtual, 'eeee', { locale: ptBR });

    const { data } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Ajuste o valor conforme necessário para definir o que é "grande"
    };

    handleResize(); // Verifica o tamanho da tela na montagem
    window.addEventListener('resize', handleResize); // Adiciona o listener de redimensionamento

    return () => {
      window.removeEventListener('resize', handleResize); // Remove o listener na desmontagem
    };
  }, []);

  const handleClickMoveWindow = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowNewContent(!showNewContent);
      setFadeOut(false);
      if (isLargeScreen) {
        setIsMoved(!isMoved);
      }
    }, 500); // Tempo para a animação de fade-out
  }

  return (
    
    <div className="flex min-h-screen flex-col items-center justify-between">
      {/*<Header />*/}
      <div className="flex flex-row justify-around items-center w-full bg-secondary py-3 px-5 border-gray-100 border-2 background bg-white">
        <p className='font-candara text-[#01C14C] text-4xl font-bold'>Hummingbird</p>  
      </div>

      <div className="flex flex-row border-[2px] bg-[url('/fullSignInOnImage.jpg')] bg-cover border-gray-40 my-16 max-lg:w-[95%] max-lg:h-fit w-3/5 h-[80vh] ">

        <div className={`max-lg:w-full w-1/2 h-full bg-gray-100 p-10 transition-transform duration-500 ${isMoved ? 'transform translate-x-full' : ''}`}>
          <div className={`transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {!showNewContent ? (
              <div className="flex flex-col space-y-1">
                <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                <h1 className="text-xl font-black">Sign in to your account</h1>
                <div className="flex flex-row">
                  <p className="text-sm pb-5 pr-1">Or </p>
                  <p className="text-sm pb-5 text-[#01C14C] font-semibold underline cursor-pointer hover:underline-offset-2" onClick={handleClickMoveWindow}>don't have an account?</p>
                </div>            
                <Button variant="outline" className="text-gray-400">
                  <FaGoogle style={{ marginRight: '8px' }} /> Sign in with Google
                </Button>
                <div className="flex items-center py-2">
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-xs">Or continue with</span>
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                </div>
                <SignInForm />
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                <h1 className="text-xl font-black">Create your account</h1>
                <div className="flex flex-row">
                  <p className="text-sm pb-5 pr-1">Or </p>
                  <p className="text-sm pb-5 text-[#01C14C] font-semibold underline cursor-pointer hover:underline-offset-2" onClick={handleClickMoveWindow}>you already have an account?</p>
                </div>                            
                <SignUpForm />                
                <div className="flex items-center py-2">
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-xs">Or continue with</span>
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                </div>
                <Button variant="outline" className="text-gray-400">
                  <FaGoogle style={{ marginRight: '8px' }} /> Sign Up with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*<div>
        {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
      </div>*/}
      <Footer />
    </div>
  );
}
