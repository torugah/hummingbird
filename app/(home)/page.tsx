"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import Footer from "../_components/footer";
import { SignUpForm } from "../_components/signUpForm";
import { FcGoogle } from 'react-icons/fc';
import SignInForm from '../_components/signInForm';
import GoogleSignInButton from '../_components/GoogleSignInButton';


export default function Home() {
  const [isMoved, setIsMoved] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

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
      
      <div className="flex flex-row justify-around items-center w-full bg-secondary py-3 px-5 border-gray-100 border-2 background bg-white">
        <p className='font-candara text-[#01C14C] text-4xl font-bold'>Hummingbird</p>  
      </div>

      <div className="flex flex-row border-[2px] bg-[url('/fullSignInOnImage.jpg')] bg-cover border-gray-40 my-16 max-lg:w-[95%] max-lg:h-fit w-3/5 h-fit ">

        <div className={`max-lg:w-full w-1/2 h-full bg-gray-100 p-10 transition-transform duration-500 ${isMoved ? 'transform translate-x-full' : ''}`}>
          <div className={`transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {!showNewContent ? (
              <div className="flex flex-col space-y-1">
                <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                <h1 className="text-xl font-black">Entre em sua conta</h1>
                <div className="flex flex-row">
                  <p className="text-sm pb-5 pr-1">Ou </p>
                  <p className="text-sm pb-5 text-[#01C14C] font-semibold underline cursor-pointer hover:underline-offset-2" onClick={handleClickMoveWindow}>{`Não possui uma conta?`}</p>
                </div>            
                <GoogleSignInButton>
                  <FcGoogle style={{  
                    marginRight: '8px', 
                    backgroundColor: '#eeeeee', 
                    padding: '5px', 
                    borderRadius: '100%' ,
                    width: '25px',
                    height: '25px'
                  }} /> Entrar com Google
                </GoogleSignInButton>
                <div className="flex items-center py-2">
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-xs">Ou continue com</span>
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                </div>
                <SignInForm /> 
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <Image src="/hummingBirdLogo.png" alt="Hummingbird Logo" height={50} width={50} />
                <h1 className="text-xl font-black">Crie sua conta</h1>
                <div className="flex flex-row">
                  <p className="text-sm pb-5 pr-1">Ou </p>
                  <p className="text-sm pb-5 text-[#01C14C] font-semibold underline cursor-pointer hover:underline-offset-2" onClick={handleClickMoveWindow}>Você já possui uma conta?</p>
                </div>                            
                <SignUpForm />                
                <div className="flex items-center py-2">
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-xs">Ou continue com</span>
                  <div className="flex-grow border-t-2 border-gray-300"></div>
                </div>
                <GoogleSignInButton>
                  <FcGoogle style={{  
                    marginRight: '8px', 
                    backgroundColor: '#eeeeee', 
                    padding: '5px', 
                    borderRadius: '100%' ,
                    width: '25px',
                    height: '25px'
                  }} /> Inscreva-se com Google
                </GoogleSignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
