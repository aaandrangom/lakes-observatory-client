import React, { useEffect, useState } from 'react';
import { Lakes } from '../../services/lakes';
import { MapPin, Info, Loader, Search, Plus, Trash } from 'lucide-react';
import Modal from './InfoLakes';
import { toast } from 'sonner';

const LakesGrid = () => {
    const [lakes, setLakes] = useState([]);
    const [filteredLakes, setFilteredLakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLakeId, setSelectedLakeId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchLakes = async () => {
        try {
            setIsLoading(true);
            const response = await Lakes.getAll();
            if (response.status === 200) {
                setLakes(response.data.body);
                setFilteredLakes(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching lakes:', error);
            setError('Failed to load lakes. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLakes();
    }, []);

    useEffect(() => {
        const handleSearch = () => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = lakes.filter(lake => {
                const name = lake.name?.toLowerCase() || '';
                const province = lake.province?.toLowerCase() || '';
                const city = lake.city?.toLowerCase() || '';

                return name.includes(lowercasedTerm) || province.includes(lowercasedTerm) || city.includes(lowercasedTerm);
            });
            setFilteredLakes(filtered);
        };
        handleSearch();
    }, [searchTerm, lakes]);


    const handleOpenModal = (lakeId = null) => {
        setSelectedLakeId(lakeId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLakeId(null);
    };

    const handleSave = async (lakeId, updatedData) => {
        if (lakeId) {
            toast.promise(
                (async () => {
                    const response = await Lakes.update(lakeId, updatedData);
                    console.log(response);
                    if (response.status === 200) {
                        const updatedLakes = lakes.map(lake =>
                            lake.id === lakeId ? {
                                ...lake,
                                ...updatedData,
                                image_url: response.data.body.image_url
                            } : lake
                        );
                        setLakes(updatedLakes);
                        setFilteredLakes(updatedLakes.filter(lake =>
                            lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lake.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lake.city.toLowerCase().includes(searchTerm.toLowerCase())
                        ));
                        fetchLakes();
                        return response.data?.message;
                    }

                    throw new Error(response.data?.message);
                })(),
                {
                    loading: 'Actualizando...',
                    success: (msg) => `${msg}!`,
                    error: (err) => `${err.message}`
                }
            );
        } else {
            toast.promise(
                (async () => {
                    const response = await Lakes.create(updatedData);

                    if (response.status === 200) {
                        const newLakes = response.data.body;
                        const newLake = newLakes[0];

                        if (newLake) {
                            const updatedLakes = [...lakes, newLake];
                            setLakes(updatedLakes);
                            setFilteredLakes(updatedLakes.filter(lake =>
                                lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                lake.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                lake.city.toLowerCase().includes(searchTerm.toLowerCase())
                            ));
                        }
                        fetchLakes();
                        return response.data?.message;
                    }

                    throw new Error(response.data?.message);
                })(),
                {
                    loading: 'Creando...',
                    success: (msg) => `${msg}!`,
                    error: (err) => `${err.message}`
                }
            );
        }

        handleCloseModal();
    };

    const handleDelete = async (lakeId) => {
        toast.promise(
            (async () => {
                const response = await Lakes.delete(lakeId);

                if (response.status === 200) {
                    const updatedLakes = lakes.filter(lake => lake.id !== lakeId);
                    setLakes(updatedLakes);
                    setFilteredLakes(updatedLakes.filter(lake =>
                        lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lake.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lake.city.toLowerCase().includes(searchTerm.toLowerCase())
                    ));
                    return response.data?.message;
                }

                throw new Error(response.data?.message);
            })(),
            {
                loading: 'Eliminando...',
                success: (msg) => `${msg}!`,
                error: (err) => `${err.message}`
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Loader className="animate-spin text-red-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4 bg-gray-100">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <section className="bg-[#F3F4F8] py-16">
            <div className="w-4/5 mx-auto">
                <div className="heading mb-16 text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Lagos Andinos del Norte del Ecuador
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">
                        Gestione, actualice y elimine los registros de lagos en el sistema.
                    </p>
                </div>

                <div className="mb-12 flex justify-between items-center">
                    <div className="relative w-full max-w-3xa">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, provincia o ciudad"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-3 pl-10 w-full border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        />
                        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
                    </div>

                    <button
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition ml-4"
                    >
                        <Plus className="mr-2" size={20} />
                        Nuevo
                    </button>
                </div>

                {filteredLakes.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <p className="text-center text-gray-600 text-lg">
                            No se encontraron lagos con esos criterios de búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredLakes.map((lake, index) => (
                            <div key={lake.id || `lake-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">

                                <div className="relative overflow-hidden h-60">
                                    <img
                                        src={lake.image_url}
                                        alt={lake.name}
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                                    />
                                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg">
                                        {lake.province}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{lake.name}</h3>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="mr-2" size={20} />
                                        <p>{lake.city}</p>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            onClick={() => handleOpenModal(lake.id)}
                                            className="inline-flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Info size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lake.id)}
                                            className="inline-flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                lakeId={selectedLakeId}
                onSave={handleSave}
                refreshCard={fetchLakes}
            />
        </section>
    );
};

export default LakesGrid;
