import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaGlobe, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../services/auth';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [nationality, setNationality] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const countries = async () => {
            try {
                const response = await Auth.fetchCountries();
                if (response.status === 200) {
                    setCountries(response.data.body);
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        countries();
    }, []);


    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error(t('Passwords do not match'));
            return;
        }

        const user = {
            email: email,
            password: password,
            full_name: fullName,
            nationality: nationality,
            status: 4,
            verification_code: '',
            role_id: 2
        };

        toast.promise(
            (async () => {
                const response = await Auth.signUp(user);
                if (response.status === 200) {

                    setFullName("");
                    setEmail("");
                    setNationality("");
                    setPassword("");
                    setConfirmPassword("");
                    return response.data?.msg;
                }

                throw new Error(response.data?.details);
            })(),
            {
                loading: 'Registrando...',
                success: (msg) => `${msg}!`,
                error: (err) => `${err.message}`
            }
        );


    };

    return (
        <div
            className="relative py-10 md:py-20 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('/images/bg-home.jpg')`, height: '100vh' }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                    {t('Register')}
                </h2>

                <form onSubmit={handleRegister} className="flex flex-col space-y-6">
                    <div>
                        <label htmlFor="full-name" className="text-gray-600 font-medium">
                            {t('Full Name')}
                        </label>
                        <div className="relative mt-2">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="full-name"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                placeholder={t('Enter full name')}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Segunda Fila: Email y Nationality */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex-1">
                            <label htmlFor="email" className="text-gray-600 font-medium">
                                {t('Email Address')}
                            </label>
                            <div className="relative mt-2">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                    placeholder={t('Enter email address')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="nationality" className="text-gray-600 font-medium">
                                {t('Nationality')}
                            </label>
                            <div className="relative mt-2">
                                <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    id="nationality"
                                    className="py-3 px-8 w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                >
                                    <option value="" disabled >{t('Seleccionar tu nacionalidad')}</option>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tercera Fila: Password y Confirm Password */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex-1">
                            <label htmlFor="password" className="text-gray-600 font-medium">
                                {t('Password')}
                            </label>
                            <div className="relative mt-2">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                    placeholder={t('Enter password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <div className="flex-1">
                            <label htmlFor="confirm-password" className="text-gray-600 font-medium">
                                {t('Confirm Password')}
                            </label>
                            <div className="relative mt-2">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
                                    placeholder={t('Confirm password')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Show or hide confirm password"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón de Registro (ocupa toda la fila) */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
                        >
                            {t('Register')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
