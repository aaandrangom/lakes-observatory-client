import axios from 'axios';
const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new Event('unauthorizedAccess'));
        }
        return Promise.reject(error);
    }
);

export default apiClient;