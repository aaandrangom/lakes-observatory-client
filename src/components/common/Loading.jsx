import React from 'react';
import Logo from '/images/logo-cargar.png';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="relative flex justify-center items-center">
                <div className="absolute">
                    <img
                        src={Logo}
                        alt="Loading"
                        className="animate-pulse w-30 h-20"
                    />
                </div>
                <div className="w-60 h-60 border-8 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
}

export default Loading;