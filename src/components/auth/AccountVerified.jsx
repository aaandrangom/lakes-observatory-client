import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaExclamationCircle, FaHome, FaCheckCircle } from 'react-icons/fa';
import { Auth } from '../../services/auth.js';
import Loading from '../common/Loading.jsx';
import { toast } from 'sonner';

const AccountVerificationStatus = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [isLinkExpired, setIsLinkExpired] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isBadRequest, setIsBadRequest] = useState(false);

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const response = await Auth.accountVerified(token);
                if (response.status === 400) {
                    setIsBadRequest(true);
                    setIsLinkExpired(true);
                } else if (response.status !== 200 && response.data.details) {
                    const user_id = response.data.details.user_id;
                    setUserId(user_id);
                    setIsLinkExpired(true);
                } else {
                    setIsLinkExpired(false);
                }
            } catch (error) {
                setIsLinkExpired(true);
            } finally {
                setLoading(false);
            }
        };
        confirmUser();
    }, [token]);

    const handleSend = async () => {
        if (userId === null) {
            toast.error('No se pudo obtener el ID de usuario.');
            return;
        }

        toast.promise(
            (async () => {
                const userNoVerified = await Auth.getUserById(userId);
                const email = userNoVerified.data.body[0]?.email;
                const full_name = userNoVerified.data.body[0]?.full_name;

                if (!email || !full_name) {
                    throw new Error('No se pudo obtener el correo electrónico o nombre.');
                }

                const response = await Auth.sendEmailVerificationAgain(email, full_name, userId);

                if (response.status === 200) {
                    return response.data.body.msg;
                }

                throw new Error(response.data?.details);
            })(),
            {
                loading: 'Reenviando correo de verificación...',
                success: (ok) => ok,
                error: (err) => `${err.message}`,
            }
        );
    };

    if (loading) {
        return <Loading />;
    }

    if (isLinkExpired) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-200">
                <div className="text-center p-6 bg-white shadow-md rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                        <FaExclamationCircle className="text-red-600 text-6xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-red-600 mb-4">
                        {isBadRequest ? 'Enlace Expirado' : 'Enlace Expirado'}
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {isBadRequest ? '¡Lo sentimos!' : '¡Lo sentimos!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El enlace de verificación ha expirado. <br />
                        Por favor, vuelve a enviar el correo de verificación.
                    </p>


                    {!isBadRequest && (
                        <button
                            onClick={handleSend}
                            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
                        >
                            <FaHome size={20} className="mr-2" />
                            <span className="font-semibold">Reenviar correo de verificación</span>
                        </button>
                    )}

                    {isBadRequest && (
                        <Link
                            to="/"
                            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
                        >
                            <FaHome size={20} className="mr-2" />
                            <span className="font-semibold">Volver al Inicio</span>
                        </Link>
                    )}
                </div>
            </div>
        );
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

export default AccountVerificationStatus;
