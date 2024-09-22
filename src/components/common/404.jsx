import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="text-center p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página no encontrada</h2>
                <p className="text-gray-600 mb-6">Lo sentimos, pero la página que buscas no existe.</p>
                <Link
                    to="/"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                >
                    <FaHome className="mr-2" />
                    <span>Volver al Inicio</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
