import React from "react";
import { BsApple, BsGooglePlay } from "react-icons/bs";
import logoPrincipal from '/images/letters.png';

const Footer = () => {
    return (
        <>
            <section className='app w-4/5 m-auto rounded-lg shadow-shadow2 text-white flex md:flex-col bg-red-600 mt-16 relative z-10'>
                <div className='left w-[60%] md:w-full p-10'>
                    <h1 className='text-4xl font-semibold leading-tight'>
                        Start learning by <br /> Downloading Apps.
                    </h1>
                </div>
                <div className='right w-[40%] md:w-full flex items-center px-5 rounded-r-lg rounded-bl-[500px] gap-8 bg-gray-800 md:bg-transparent md:p-8'>
                    <div className='box flex gap-2 items-center px-5 py-3 border text-white border-gray-50 hover:bg-white hover:text-black shadow-shadow1 rounded-sm'>
                        <BsApple />
                        <label className='text-sm'>App Store</label>
                    </div>
                    <div className='box flex gap-2 items-center px-5 py-3 bg-white text-black shadow-shadow1 rounded-sm'>
                        <BsGooglePlay />
                        <label className='text-sm'>Play Store</label>
                    </div>
                </div>
            </section>
            <footer className='bg-[#6E6E6D] py-10 pt-32 -mt-24'>
                <div className='container flex flex-col items-center'>
                    <div className='logo mb-5'>
                        <img src={logoPrincipal} alt='logImg' className='h-20' />
                    </div>
                    <div className='flex gap-5 mb-5'>
                        <div className='flex gap-2 items-center px-5 py-3 border text-white border-gray-50 hover:bg-white hover:text-black shadow-shadow1 rounded-sm'>
                            <BsApple />
                            <label className='text-sm'>App Store</label>
                        </div>
                        <div className='flex gap-2 items-center px-5 py-3 bg-white text-black shadow-shadow1 rounded-sm'>
                            <BsGooglePlay />
                            <label className='text-sm'>Play Store</label>
                        </div>
                    </div>
                    <span className='text-white text-[14px]'>Todos los derechos reservados © Copyright
                        {' ' + new Date().getFullYear()} | Políticas de privacidad | Universidad Técnica del Norte</span>
                </div>
            </footer>
        </>
    );
}

export default Footer;
