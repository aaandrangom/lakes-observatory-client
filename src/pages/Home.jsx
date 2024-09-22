import React from "react";
import bgHome from "/images/bg-home.jpg";
import { useTranslation } from "react-i18next";
import Layout from "../components/common/Layout";

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <section
                className='relative py-10 md:py-20 h-[70vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center'
                style={{
                    backgroundImage: `url(${bgHome})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    textShadow: '1px 1px 5px rgba(0,0,0,0.7)'
                }}
            >
                {/* Capa oscura */}
                <div className='absolute inset-0 bg-black opacity-50' />

                {/* Contenido */}
                <div className='relative z-10 text-center px-4 md:px-8'>
                    <div className='flex flex-col items-center'>
                        <div className='w-full md:w-1/2'>
                            <h1 className='text-3xl md:text-4xl lg:text-5xl leading-tight font-semibold'>
                                {t('home-title1')} <br /> {t('home-title2')}
                            </h1>
                            <h3 className='text-base md:text-lg lg:text-xl mt-3 font-light'>
                                {t('home-description1')}
                            </h3>
                            <span className='text-base md:text-lg lg:text-xl mt-3 font-light'>
                                {t('home-description2')}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default HomePage;
