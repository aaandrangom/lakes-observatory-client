import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Users, Activity, Droplet, CloudRain, Fish, AlertTriangle, Bell, ArrowUp, ArrowDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const TabButton = ({ active, onClick, icon: Icon, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 ${active ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-200'} transition rounded-lg`}
    >
        <Icon className="h-5 w-5 mr-2" />
        {children}
    </button>
);

const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <Icon className="h-7 w-7 text-red-600" />
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-1">
                {trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <p className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{description}</p>
            </div>
        </div>
    </div>
);

const CustomAlert = ({ children }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {children}
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [showAlerts, setShowAlerts] = useState(true);

    const userStats = {
        totalUsers: 12500,
        activeUsers: 8750,
        newUsersThisMonth: 450,
    };

    const userCountryData = {
        labels: ['Ecuador', 'Colombia', 'Perú', 'Bolivia', 'Otros'],
        datasets: [{
            data: [6000, 2500, 2000, 1500, 500],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        }],
    };

    const userActivityData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Usuarios Activos',
            data: [7500, 7800, 8200, 8100, 8400, 8750],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
        }],
    };

    const waterQualityData = {
        labels: ['Lago San Pablo', 'Lago Cuicocha', 'Lago Mojanda', 'Lago Yahuarcocha'],
        datasets: [
            {
                label: 'pH del Agua',
                data: [7.2, 6.8, 7.5, 7.0],
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
            },
            {
                label: 'Oxígeno Disuelto (mg/L)',
                data: [8.2, 7.8, 9.0, 8.6],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
            },
            {
                label: 'Temperatura (°C)',
                data: [18, 16, 15, 19],
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
            },
        ],
    };

    const precipitationData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Precipitación (mm)',
                data: [120, 150, 180, 100, 90, 110],
                borderColor: '#0EA5E9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const speciesData = {
        labels: ['Peces', 'Aves', 'Anfibios', 'Plantas'],
        datasets: [
            {
                label: 'Especies',
                data: [45, 80, 30, 120],
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
            },
        ],
    };

    const contaminationData = {
        labels: ['Lago San Pablo', 'Lago Cuicocha', 'Lago Mojanda', 'Lago Yahuarcocha'],
        datasets: [
            {
                label: 'Nivel de Contaminación',
                data: [3, 7, 2, 5],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
        ],
    };

    return (
        <div className="bg-[#F3F4F8] min-h-screen py-16">
            <div className="w-11/12 mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-red-800">Dashboard de Lagos Andinos</h1>
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                    >
                        <Bell className="h-5 w-5 text-red-600" />
                    </button>
                </div>

                {showAlerts && (
                    <CustomAlert>
                        Se ha detectado un aumento en los niveles de contaminación en el Lago Cuicocha.
                    </CustomAlert>
                )}

                <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                    <TabButton active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={Activity}>General</TabButton>
                    <TabButton active={activeTab === "usuarios"} onClick={() => setActiveTab("usuarios")} icon={Users}>Usuarios</TabButton>
                    <TabButton active={activeTab === "calidad-agua"} onClick={() => setActiveTab("calidad-agua")} icon={Droplet}>Calidad del Agua</TabButton>
                    <TabButton active={activeTab === "clima"} onClick={() => setActiveTab("clima")} icon={CloudRain}>Clima</TabButton>
                    <TabButton active={activeTab === "biodiversidad"} onClick={() => setActiveTab("biodiversidad")} icon={Fish}>Biodiversidad</TabButton>
                </div>

                {activeTab === "general" && (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <StatCard title="Total Usuarios" value={userStats.totalUsers.toLocaleString()} icon={Users} description="4% más que el mes pasado" trend="up" />
                            <StatCard title="Usuarios Activos" value={userStats.activeUsers.toLocaleString()} icon={Activity} description="12% más que el mes pasado" trend="up" />
                            <StatCard title="Nuevos Usuarios" value={userStats.newUsersThisMonth.toLocaleString()} icon={Users} description="2% menos que el mes pasado" trend="down" />
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Mapa de Lagos Andinos</h3>
                            <div style={{ height: '400px', width: '100%' }}>
                                <MapContainer center={[-0.225219, -78.5248]} zoom={6} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[-0.225219, -78.5248]}>
                                        <Popup>Quito, Ecuador</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "usuarios" && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribución de Usuarios por País</h3>
                            <div style={{ height: '340px' }}>
                                <Doughnut data={userCountryData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Actividad de Usuarios</h3>
                            <div style={{ height: '340px' }}>
                                <Line data={userActivityData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "calidad-agua" && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Parámetros de Calidad del Agua</h3>
                            <div style={{ height: '340px' }}>
                                <Bar data={waterQualityData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Nivel de Contaminación</h3>
                            <div style={{ height: '340px' }}>
                                <Bar data={contaminationData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "clima" && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Precipitación Mensual</h3>
                        <div style={{ height: '340px' }}>
                            <Line data={precipitationData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                )}

                {activeTab === "biodiversidad" && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Especies en los Lagos</h3>
                        <div style={{ height: '340px' }}>
                            <Pie data={speciesData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;