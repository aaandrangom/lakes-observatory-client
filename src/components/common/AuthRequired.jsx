import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaLock, FaSignInAlt } from "react-icons/fa";

const AuthRequired = () => {
    const location = useLocation();
    const from = location.state?.from || '/';

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md w-full">
                <FaLock className="text-6xl text-red-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Autenticación Requerida</h1>
                <p className="text-gray-600 mb-8">
                    Para acceder a esta página, necesitas iniciar sesión.
                    El contenido que intentas ver es privado y requiere autenticación.
                </p>
                <Link
                    to="/sign-in"
                    state={{ from: from }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-300 ease-in-out"
                >
                    <FaSignInAlt className="mr-2" />
                    <span>Iniciar Sesión</span>
                </Link>
            </div>
        </div>
    );
};

export default AuthRequired;