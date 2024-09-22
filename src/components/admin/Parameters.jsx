import React, { useEffect, useState } from 'react';
import { Parameters } from '../../services/parameter';
import { Info, Loader, Search, Plus, Trash } from 'lucide-react';
import Modal from './InfoParameters';
import { toast } from 'sonner';

const ParametersGrid = () => {
    const [parameters, setParameters] = useState([]);
    const [filteredParameters, setFilteredParameters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParameterId, setSelectedParameterId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchParameters = async () => {
        try {
            setIsLoading(true);
            const response = await Parameters.getAll();
            if (response.status === 200) {
                setParameters(response.data.body);
                setFilteredParameters(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching parameters:', error);
            setError('Failed to load parameters. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParameters();
    }, []);

    useEffect(() => {
        const handleSearch = () => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = parameters.filter(param => {
                const name = param.name?.toLowerCase() || '';
                const unit = param.unit?.toLowerCase() || '';
                const abbreviation = param.abbreviation?.toLowerCase() || '';
                return name.includes(lowercasedTerm) || unit.includes(lowercasedTerm) || abbreviation.includes(lowercasedTerm);
            });
            setFilteredParameters(filtered);
        };
        handleSearch();
    }, [searchTerm, parameters]);

    const handleOpenModal = (parameterId = null) => {
        setSelectedParameterId(parameterId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedParameterId(null);
    };

    const handleSave = async (parameterId, updatedData) => {
        if (parameterId) {
            toast.promise(
                (async () => {
                    const response = await Parameters.update(parameterId, updatedData);
                    if (response.status === 200) {
                        const updatedParameters = parameters.map(param =>
                            param.id === parameterId ? { ...param, ...updatedData } : param
                        );
                        setParameters(updatedParameters);
                        setFilteredParameters(updatedParameters.filter(param =>
                            param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            param.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            param.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
                        ));
                        fetchParameters();
                        return response.data?.msg;
                    }
                    throw new Error(response.data?.details);
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
                    const response = await Parameters.create(updatedData);
                    if (response.status === 200) {
                        const newParameter = response.data.body[0];
                        if (newParameter) {
                            const updatedParameters = [...parameters, newParameter];
                            setParameters(updatedParameters);
                            setFilteredParameters(updatedParameters.filter(param =>
                                param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                param.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                param.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
                            ));
                        }
                        fetchParameters();
                        return response.data?.msg;
                    }
                    throw new Error(response.data?.details);
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

    const handleDelete = async (parameterId) => {
        toast.promise(
            (async () => {
                const response = await Parameters.delete(parameterId);
                if (response.status === 200) {
                    const updatedParameters = parameters.filter(param => param.id !== parameterId);
                    setParameters(updatedParameters);
                    setFilteredParameters(updatedParameters.filter(param =>
                        param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        param.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        param.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
                    ));
                    return response.data?.msg;
                }
                throw new Error(response.data?.details);
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
                        Gestión de Parámetros
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">
                        Gestione, actualice y elimine los registros de parámetros en el sistema.
                    </p>
                </div>

                <div className="mb-12 flex justify-between items-center">
                    <div className="relative w-full max-w-3xl">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, unidad o abreviatura"
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

                {filteredParameters.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <p className="text-center text-gray-600 text-lg">
                            No se encontraron parámetros con esos criterios de búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredParameters.map((param, index) => (
                            <div key={param.id || `param-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{param.name}</h3>
                                    <p className="text-lg text-gray-600 mb-2">Unidad: {param.unit}</p>
                                    <p className="text-lg text-gray-600">Abreviatura: {param.abbreviation}</p>

                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            onClick={() => handleOpenModal(param.id)}
                                            className="inline-flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Info size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(param.id)}
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
                parameterId={selectedParameterId}
                onSave={handleSave}
                refreshParameters={fetchParameters}
            />
        </section>
    );
};

export default ParametersGrid;
