import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

// Componentes auxiliares
const TabButton = ({ active, onClick, children }) => (
    <button
        className={`px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${active ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        onClick={onClick}
    >
        {children}
    </button>
);

const Card = ({ title, description, children }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600">
            <h3 className="font-bold text-xl mb-2 text-white">{title}</h3>
            {description && <p className="text-blue-100 text-sm">{description}</p>}
        </div>
        <div className="px-6 py-4">
            {children}
        </div>
    </div>
);

const Alert = ({ type, title, description }) => {
    const colors = {
        error: 'bg-red-100 border-red-500 text-red-700',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700',
    };

    return (
        <div className={`border-l-4 p-4 mb-4 ${colors[type]}`} role="alert">
            <p className="font-bold">{title}</p>
            <p>{description}</p>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
            <p className="text-2xl font-semibold text-gray-700">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("general");

    // Datos simulados para el dashboard
    const userStats = {
        totalUsers: 12500,
        activeUsers: 8750,
        newUsersThisMonth: 450,
    };

    const userCountryData = {
        labels: ['Ecuador', 'Colombia', 'Perú', 'Bolivia', 'Otros'],
        datasets: [{
            data: [6000, 2500, 2000, 1500, 500],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
    };

    const userActivityData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Usuarios Activos',
            data: [7500, 7800, 8200, 8100, 8400, 8750],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }],
    };

    const waterQualityData = {
        labels: ['Lago San Pablo', 'Lago Cuicocha', 'Lago Mojanda', 'Lago Yahuarcocha'],
        datasets: [
            {
                label: 'pH del Agua',
                data: [7.2, 6.8, 7.5, 7.0],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Oxígeno Disuelto (mg/L)',
                data: [8.2, 7.8, 9.0, 8.6],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Temperatura (°C)',
                data: [18, 16, 15, 19],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const precipitationData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Precipitación (mm)',
                data: [120, 150, 180, 100, 90, 110],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
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
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const contaminationData = {
        labels: ['Lago San Pablo', 'Lago Cuicocha', 'Lago Mojanda', 'Lago Yahuarcocha'],
        datasets: [
            {
                label: 'Nivel de Contaminación',
                data: [3, 7, 2, 5],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Dashboard Administrativo de Lagos Andinos</h1>

            <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <TabButton active={activeTab === "general"} onClick={() => setActiveTab("general")}>General</TabButton>
                <TabButton active={activeTab === "usuarios"} onClick={() => setActiveTab("usuarios")}>Usuarios</TabButton>
                <TabButton active={activeTab === "calidad-agua"} onClick={() => setActiveTab("calidad-agua")}>Calidad del Agua</TabButton>
                <TabButton active={activeTab === "clima"} onClick={() => setActiveTab("clima")}>Clima</TabButton>
                <TabButton active={activeTab === "biodiversidad"} onClick={() => setActiveTab("biodiversidad")}>Biodiversidad</TabButton>
            </div>

            {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <StatCard
                        title="Total Usuarios"
                        value={userStats.totalUsers.toLocaleString()}
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                    />
                    <StatCard
                        title="Usuarios Activos"
                        value={userStats.activeUsers.toLocaleString()}
                        icon={<svg className="w-6 h-6 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    />
                    <StatCard
                        title="Nuevos Usuarios (Mes)"
                        value={userStats.newUsersThisMonth.toLocaleString()}
                        icon={<svg className="w-6 h-6 text-yellow-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>}
                    />
                </div>
            )}

            {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Mapa de Localización de los Lagos">
                        <MapContainer center={[-0.3685, -78.1385]} zoom={8} style={{ height: '400px' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker position={[-0.223, -78.276]}><Popup>Lago San Pablo</Popup></Marker>
                            <Marker position={[-0.307, -78.441]}><Popup>Lago Cuicocha</Popup></Marker>
                            <Marker position={[-0.138, -78.238]}><Popup>Lago Mojanda</Popup></Marker>
                            <Marker position={[-0.330, -78.155]}><Popup>Lago Yahuarcocha</Popup></Marker>
                        </MapContainer>
                    </Card>

                    <Card title="Alertas Ambientales" description="Problemas actuales que requieren atención">
                        <Alert
                            type="error"
                            title="Contaminación en Lago Cuicocha"
                            description="Presencia de metales pesados detectada. Se requiere intervención inmediata."
                        />
                        <Alert
                            type="warning"
                            title="Erosión en Lago Yahuarcocha"
                            description="Degradación significativa de riberas observada. Plan de restauración en desarrollo."
                        />
                        <Alert
                            type="warning"
                            title="Especies invasoras en Lago San Pablo"
                            description="Presencia de tilapia afectando el ecosistema local. Monitoreo en curso."
                        />
                    </Card>
                </div>
            )}

            {activeTab === "usuarios" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Distribución de Usuarios por País">
                        <div style={{ height: '300px' }}>
                            <Doughnut data={userCountryData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </Card>
                    <Card title="Actividad de Usuarios">
                        <div style={{ height: '300px' }}>
                            <Line data={userActivityData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "calidad-agua" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Indicadores de Calidad del Agua">
                        <Bar data={waterQualityData} />
                    </Card>

                    <Card title="Nivel de Contaminación">
                        <Bar data={contaminationData} />
                    </Card>
                </div>
            )}

            {activeTab === "clima" && (
                <Card title="Datos de Precipitación">
                    <Line data={precipitationData} />
                </Card>
            )}

            {activeTab === "biodiversidad" && (
                <Card title="Especies Registradas">
                    <div className="flex justify-center">
                        <div style={{ width: '50%' }}>
                            <Pie data={speciesData} />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;