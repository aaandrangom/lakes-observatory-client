import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const UnderConstruction = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <motion.main
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md w-full mx-4"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                >
                    <span className="text-6xl" role="img" aria-label="Construcción">🚧</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Página en Desarrollo</h1>
                <p className="text-gray-600 mb-8">
                    Esta página aún está en construcción. Vuelve pronto para ver las novedades.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    <Wrench className="mr-2 h-5 w-5" />
                    <span>Volver al Inicio</span>
                </Link>
            </motion.main>
        </div>
    );
};

export default UnderConstruction;