import React, { useState, useEffect } from 'react';
import { X, Droplets } from 'lucide-react';
import { Parameters } from '../../services/parameter';

const InfoParameter = ({ isOpen, onClose, parameterId, onSave, refreshParameters }) => {
    const [formData, setFormData] = useState({
        name: '',
        unit: '',
        symbol: '',
        abbreviation: ''
    });

    useEffect(() => {
        if (parameterId && isOpen) {
            const fetchParameter = async () => {
                try {
                    const response = await Parameters.getById(parameterId);
                    if (response.status === 200) {
                        const parameterData = response.data.body[0];
                        setFormData({
                            name: parameterData.name || '',
                            unit: parameterData.unit || '',
                            symbol: parameterData.symbol || '',
                            abbreviation: parameterData.abbreviation || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching parameter details:', error);
                }
            };
            fetchParameter();
        } else if (!parameterId && isOpen) {
            setFormData({
                name: '',
                unit: '',
                symbol: '',
                abbreviation: ''
            });
        }
    }, [parameterId, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await onSave(parameterId, formData);
            refreshParameters();
        } catch (error) {
            console.error('Error saving parameter data:', error);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-md overflow-hidden">
                <div className="relative">
                    <div className="p-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {parameterId ? 'Editar Parámetro' : 'Crear Nuevo Parámetro'}
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad:</label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Símbolo:</label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Abreviación:</label>
                                <input
                                    type="text"
                                    name="abbreviation"
                                    value={formData.abbreviation}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center text-sm"
                                >
                                    <Droplets size={16} className="mr-2" />
                                    {parameterId ? 'Guardar Cambios' : 'Crear Parámetro'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                        onClick={onClose}
                    >
                        <X size={20} className='text-black' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoParameter;
