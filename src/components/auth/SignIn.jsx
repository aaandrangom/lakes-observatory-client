import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgHome from "/images/bg-home.jpg";
import { useAuth } from '../../context/AuthContext';
import { Toaster, toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { signInAction } = useAuth();
    const { t } = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();

        toast.promise(
            (async () => {
                const response = await signInAction(email, password);

                if (response.status === 200) {
                    return response.data.body.user[0].full_name;
                }

                throw new Error(response.data?.details);

            })(),
            {
                loading: 'Iniciando sesión...',
                success: (nameFull) => `Bienvenido ${nameFull}!`,
                error: (err) => `${err.message}`
            }
        );
    };


    return (
        <div
            className="relative py-10 md:py-20 h-[70vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center"
            style={{
                backgroundImage: `url(${bgHome})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                    {t('sign-in')}
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-gray-600">
                            {t('email-address')}
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                placeholder={t('enter-email-address')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-gray-600">
                            {t('password')}
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                placeholder={t('enter-password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Mostrar u ocultar contraseña"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
                    >
                        {t('sign-in')}
                    </button>
                </form>

                <div className="flex justify-between items-center mt-4">
                    <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
                        {t('forgot-password')}
                    </Link>
                    <Link to="/register" className="text-sm text-red-600 hover:underline">
                        {t('sign-up')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
