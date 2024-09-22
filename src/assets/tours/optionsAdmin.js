import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const initializeDriver = () => {
    const driverObj = driver({
        showProgress: true,
        steps: [
            {
                element: '#welcome',
                popover: {
                    title: 'Bienvenida',
                    description: 'Bienvenido a la administración!',
                    side: "top",
                    align: 'start'
                }

            },
            {
                element: '#dashboard',
                popover: {
                    title: 'Panel Principal',
                    description: 'Aquí puedes ver un resumen de las métricas clave, como la cantidad de datos cargados recientemente, visualizaciones de tendencia de los datos (como la temperatura o calidad del agua), y alertas o notificaciones relevantes.'
                }
            },
            {
                element: '#upload-data',
                popover: {
                    title: 'Subir datos',
                    description: 'Página para cargar nuevos datos en formato CSV.'
                }
            },
            {
                element: '#manage-data',
                popover: {
                    title: 'Gestionar datos',
                    description: 'Lista de todos los datos cargados con opciones de filtrado'
                }
            },
            {
                element: '#charts-and-reports',
                popover: {
                    title: 'Gráficos y reportes',
                    description: 'Generar y personalizar gráficos y reportes.'
                }
            },
            {
                element: '#user-management',
                popover: {
                    title: 'Gestión de usuarios',
                    description: 'Administrar las cuentas de usuario del sitio.'
                }
            },
            {
                element: '#settings',
                popover: {
                    title: 'Configuraciones',
                    description: 'Ajustes de configuración del sitio web.'
                }
            },
            {
                element: '#activity-log',
                popover: {
                    title: 'Historial de actividades',
                    description: 'Ver un registro de las actividades realizadas por los administradores y usuarios.'
                }
            },
            {
                element: '#notifications-and-alerts',
                popover: {
                    title: 'Notificaciones y alertas',
                    description: 'Ver y configurar notificaciones del sistema.'
                }
            },
            {
                element: '#export-data',
                popover: {
                    title: 'Exporta data',
                    description: 'Opción para descargar los datos del sistema en formato CSV u otros.'
                }
            },
        ]
    });

    return driverObj;
};

export const shouldShowTour = () => {
    const tourShown = localStorage.getItem('driverTourShown');
    return tourShown !== 'true';
};

export const markTourAsShown = () => {
    localStorage.setItem('driverTourShown', 'true');
};