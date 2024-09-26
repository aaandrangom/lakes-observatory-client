import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { FaWater, FaWind, FaThermometerHalf, FaTint } from 'react-icons/fa';
import { GiWaterDrop, GiChemicalDrop } from 'react-icons/gi';
import { Lakes } from '../../services/lakes';
import { Link } from 'react-router-dom';

const MainData = () => {
    const variables = [
        { name: 'Clorofila', icon: <GiWaterDrop className="text-green-500" /> },
        { name: 'Transparencia Secchi', icon: <FaWater className="text-blue-500" /> },
        { name: 'Temperatura Superficial', icon: <FaThermometerHalf className="text-red-500" /> },
        { name: 'Temperatura Profundidad', icon: <FaThermometerHalf className="text-purple-500" /> },
        { name: 'Oxígeno Disuelto Superficial', icon: <GiChemicalDrop className="text-cyan-500" /> },
        { name: 'Oxígeno Disuelto Profundidad', icon: <GiChemicalDrop className="text-teal-500" /> },
        { name: 'Conductividad', icon: <FaWind className="text-yellow-500" /> },
        { name: 'Acidez', icon: <FaTint className="text-indigo-500" /> },
        { name: 'Fósforo Total', icon: <GiChemicalDrop className="text-orange-500" /> },
        { name: 'Nitrógeno Total', icon: <GiChemicalDrop className="text-pink-500" /> },
    ];

    const [lakes, setLakes] = useState([]);

    const fetchLakes = async () => {
        try {
            const response = await Lakes.getAll();
            if (response.status === 200) {
                setLakes(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching lakes:', error);
        }
    };

    useEffect(() => {
        fetchLakes();
    }, []);

    const getMarkerIcon = () => {
        return new Icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#3498db" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          `),
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
        });
    };

    return (
        <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="w-1/2 p-4 overflow-y-auto flex flex-col" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                <div className="bg-white p-4 rounded-lg shadow" style={{ height: 'calc(100vh - 6rem)' }}>
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">Parámetros Físicoquímicos de Calidad del Agua</h1>
                    <h2 className="text-1lg text-gray-600 mb-4">Información sobre las variables clave para evaluar la calidad del agua</h2>
                    <p className="mb-4 text-gray-700">
                        La red de monitoreo de la UTN proporciona información detallada sobre los parámetros físicoquímicos que son cruciales para evaluar la calidad del agua en los ecosistemas alto-andinos. Estos parámetros ayudan a caracterizar las condiciones del agua y su impacto en el entorno.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {variables.map((variable, index) => (
                            <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow" style={{ height: '4rem' }}>
                                <span className="text-3xl mr-3">{variable.icon}</span>
                                <span className="text-lg">{variable.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Link to="/data/repositories">
                            <button className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300">
                                Ir a Repositorios
                            </button>
                        </Link>
                    </div>



                </div>
            </div>

            <div className="w-1/2 p-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                <div className="bg-white p-4 rounded-lg shadow flex-grow" style={{ height: 'calc(100vh - 6rem)' }}>
                    <h3 className="text-lg font-bold text-orange-500 mb-4">Estaciones de Monitoreo de Calidad del Agua</h3>
                    <div className="relative" style={{ height: '80%', zIndex: 0, overflow: 'hidden' }}>
                        <MapContainer center={[0.3565, -78.1307]} zoom={8} style={{ height: '100%', width: '100%' }} className="leaflet-container">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {lakes.map((lake) => (
                                <Marker key={lake.id} position={[lake.latitude, lake.longitude]} icon={getMarkerIcon()}>
                                    <Popup>
                                        <div className="flex flex-col items-center">
                                            <img src={lake.image_url} alt={lake.name} className="w-32 h-20 object-cover mb-2" />
                                            <h4 className="font-bold">{lake.name}</h4>
                                            <p>{lake.city}, {lake.province}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainData;
