import Image from "next/image";

const Footer = () => {
    return ( 
        <div className="flex flex-row justify-around items-center w-full bg-secondary py-6 px-5 border-gray-100 border-2 background bg-white">
            <div>
                <p className="text-xs font-bold text-gray-300">© 2024 Hummingbird, Inc. All rights</p>
            </div>
            <div className="opacity-30 flex flex-row space-x-3.5">
                <Image src="/facebook.png" alt="FSW Barber" height={25} width={25} />
                <Image src="/twitter.png" alt="FSW Barber" height={25} width={25} />
                <Image src="/instagram.png" alt="FSW Barber" height={25} width={25} />
            </div>                        
        </div>
     );
}
 
export default Footer;