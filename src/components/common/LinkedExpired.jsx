import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const LinkExpired = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="text-center p-6 bg-white shadow-md rounded-lg">
                <div className="flex items-center justify-center mb-4">
                    <FaExclamationTriangle className="text-red-600 text-6xl" />
                </div>
                <h1 className="text-4xl font-bold text-red-600 mb-4">Enlace Expirado</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lo sentimos</h2>
                <p className="text-gray-600 mb-6">El enlace ha expirado. <br />Por favor, vuelve a intentarlo nuevamente. <br />
                    Procura hacerlo en el menor tiempo posible.</p>
                <Link
                    to="/sign-in"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                >
                    <span>Volver a intentar</span>
                </Link>
            </div>
        </div>
    );
};

export default LinkExpired;
