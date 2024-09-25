import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { Auth } from '../../services/auth.js';
import Loading from '../common/Loading.jsx';

const AccountVerified = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const response = await Auth.accountVerified(token);
                console.log('response2', response);
                if (response.status !== 200) {
                    navigate("/link-expired");
                } else {
                    setLoading(false);
                }
            } catch (error) {
                navigate("/link-expired");
            }
        }
        confirmUser();
    }, [token, navigate]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="text-center p-6 bg-white shadow-md rounded-lg">
                <div className="flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-red-600 text-6xl" />
                </div>
                <h1 className="text-4xl font-bold text-red-600 mb-4">Cuenta Verificada</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">¡Éxito!</h2>
                <p className="text-gray-600 mb-6">Tu cuenta ha sido verificada con éxito.</p>
                <Link
                    to="/"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                >
                    <FaHome className="mr-2" />
                    <span>Volver al Inicio</span>
                </Link>
            </div>
        </div>
    );
};

export default AccountVerified;