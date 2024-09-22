import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import bgHome from "/images/bg-home.jpg";
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../services/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        toast.promise(
            (async () => {
                const response = await Auth.forgotPassword(email);

                if (response.status === 200) {
                    setEmail("")
                    return response.data?.msg;
                }

                throw new Error(response.data?.details);
            })(),
            {
                loading: 'Enviando correo...',
                success: (msg) => `${msg}!`,
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
                    {t('forgot-password')}
                </h2>

                <form onSubmit={handleForgotPassword} className="space-y-6">
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

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
                    >
                        {t('send-email')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
