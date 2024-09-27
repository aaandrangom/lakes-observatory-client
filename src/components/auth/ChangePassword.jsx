import React, { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgHome from '/images/bg-home.jpg';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../services/auth';
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../common/Loading';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await Auth.isTokenExpired(token);
                if (response.status === 200) {
                    const isExpired = response.data.body;
                    if (isExpired) {
                        navigate("/link-expired", { replace: true });
                    } else {
                        setLoading(false);
                    }
                } else {
                    navigate("/link-expired", { replace: true });
                }
            } catch (error) {
                navigate("/link-expired", { replace: true });
            }
        };
        verifyToken();
    }, [token, navigate]);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error(t('Passwords do not match'));
            return;
        }

        toast.promise(
            (async () => {
                const response = await Auth.recoverPassword(token, newPassword);
                if (response.status === 200) {
                    return response.data?.msg;
                }

                throw new Error(response.data?.details);
            })(),
            {
                loading: 'Cambiando contraseña...',
                success: (msg) => `${msg}!`,
                error: (err) => `${err.message}`
            }
        );
    };

    if (loading) {
        return <Loading></Loading>;
    }

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
                    {t('Change Password')}
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="new-password" className="text-gray-600">
                            {t('New Password')}
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="new-password"
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                placeholder={t('Enter new password')}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Show or hide password"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm-password" className="text-gray-600">
                            {t('Confirm Password')}
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirm-password"
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                placeholder={t('Confirm new password')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Show or hide password"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
                    >
                        {t('Change Password')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
