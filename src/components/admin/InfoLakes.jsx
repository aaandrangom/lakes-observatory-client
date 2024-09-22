import React, { useState, useEffect } from 'react';
import { Lakes } from '../../services/lakes';
import { X, Camera, Droplets } from 'lucide-react';

const Modal = ({ isOpen, onClose, lakeId, onSave, refreshCard }) => {
    const [formData, setFormData] = useState({
        name: '',
        province: '',
        city: '',
        image: '',
        longitude: '',
        latitude: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    const fetchProvinces = async () => {
        try {
            const response = await Lakes.getProvinces();
            if (response.status === 200) {
                setProvinces(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchCities = async (provinceId) => {
        try {
            const response = await Lakes.getCities(provinceId);
            if (response.status === 200) {
                setCities(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (lakeId && isOpen) {
            const fetchLake = async () => {
                try {
                    const response = await Lakes.getById(lakeId);
                    if (response.status === 200) {
                        const lakeData = response.data.body[0];
                        setFormData({
                            name: lakeData.name || '',
                            province: lakeData.province || '',
                            city: lakeData.city || '',
                            image: '',
                            longitude: lakeData.longitude || '',
                            latitude: lakeData.latitude || ''
                        });
                        setImagePreview(lakeData.image_url || '');

                        if (lakeData.province) {
                            const province = provinces.find(p => p.province === lakeData.province);
                            if (province) {
                                await fetchCities(province.id);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching lake details:', error);
                }
            };
            fetchLake();
        } else if (!lakeId && isOpen) {
            setFormData({
                name: '',
                province: '',
                city: '',
                image: '',
                longitude: '',
                latitude: ''
            });
            setImagePreview('');
            setCities([]);
        }
    }, [lakeId, isOpen, provinces]);

    useEffect(() => {
        if (formData.province) {
            const province = provinces.find(p => p.province === formData.province);
            if (province) {
                fetchCities(province.id);
            }
        } else {
            setCities([]);
        }
    }, [formData.province, provinces]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData(prevFormData => ({
                ...prevFormData,
                image: file
            }));
        }
    };

    const handleSave = async () => {
        const lakeData = new FormData();
        lakeData.append('name', formData.name);
        lakeData.append('province', formData.province);
        lakeData.append('city', formData.city);
        lakeData.append('longitude', formData.longitude);
        lakeData.append('latitude', formData.latitude);

        if (formData.image && formData.image instanceof File) {
            lakeData.append('image', formData.image);
        }

        try {
            await onSave(lakeId, lakeData);
            refreshCard();
        } catch (error) {
            console.error('Error saving lake data:', error);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-md overflow-hidden">
                <div className="relative">
                    {/* Image Section */}
                    <div className="w-full h-48 bg-red-50 relative">
                        <img
                            src={imagePreview || '/placeholder-image.jpg'}
                            alt="Lake Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-end justify-end p-2">
                            <label className="cursor-pointer bg-white p-2 rounded-full border border-gray-300 shadow-md hover:bg-red-100 transition-colors duration-300">
                                <Camera size={20} className="text-red-600" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                            onClick={onClose}
                        >
                            <X size={20} className='text-black' />
                        </button>
                    </div>
                    {/* Form Section */}
                    <div className="p-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {lakeId ? 'Editar Detalles del Lago' : 'Crear Nuevo Lago'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia:</label>
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                >
                                    <option value="">Selecciona una provincia</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.province}>
                                            {province.province}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                    disabled={!formData.province}
                                >
                                    <option value="">Selecciona una ciudad</option>
                                    {cities.map((city) => (
                                        <option key={city.canton_id} value={city.canton_name}>
                                            {city.canton_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitud:</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitud:</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                    />
                                </div>
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
                                    {lakeId ? 'Guardar Cambios' : 'Crear Lago'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;