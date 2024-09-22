import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight, HiOutlineSearch } from "react-icons/hi";
import { Lakes } from "../../services/lakes";

const Repositories = () => {
    const [lakes, setLakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLakes = async () => {
            try {
                const response = await Lakes.getAll();
                setLakes(response.data.body);
            } catch (error) {
                console.error("Error fetching lakes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLakes();
    }, []);

    const filteredLakes = lakes.filter(lake =>
        lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lake.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lake.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Datos de Lagos Andinos
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        La Universidad Técnica del Norte se distingue por su compromiso con la investigación y conservación de los lagos andinos en el norte del Ecuador, contribuyendo al conocimiento y preservación de la biodiversidad regional.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, provincia o ciudad"
                            className="w-full py-3 px-4 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredLakes.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No se encontraron lagos que coincidan con la búsqueda.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredLakes.map((lake) => (
                            <div key={lake.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                                <div className="relative overflow-hidden h-48">
                                    <img
                                        src={lake.image_url}
                                        alt={lake.name}
                                        className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-110"
                                    />
                                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                                        <div className="flex gap-2">
                                            <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded">
                                                {lake.province}
                                            </span>
                                            <span className="text-xs font-semibold bg-pink-600 text-white px-2 py-1 rounded">
                                                {lake.city}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{lake.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Descubre los datos científicos de este lago andino.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-blue-600">Datos Privados</span>
                                        <Link
                                            to={`/data/repositories/${lake.id}`}
                                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                                        >
                                            Consultar
                                            <HiOutlineArrowNarrowRight className="ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Repositories;