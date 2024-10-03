import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Email } from '../../services/email';
import { Save, Trash2, Eye, EyeOff } from 'lucide-react';

const EmailConfig = () => {
    const [emailData, setEmailData] = useState(null);
    const [senderEmail, setSenderEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [decryptedPassword, setDecryptedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmailData();
    }, []);

    const fetchEmailData = async () => {
        try {
            const response = await Email.getOne();

            if (response.status === 200) {
                const emailInfo = response.data.body[0];
                setEmailData(emailInfo);
                setSenderEmail(emailInfo.sender_email);
                setSenderName(emailInfo.sender_name);
                setUsername(emailInfo.username);
                setPassword(emailInfo.password);
                await decryptPassword(emailInfo.password);
            }

            if (response.status === 404) {
                toast.error(response.data.message || 'No email sender config available');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching email data:', error);
            toast.error('Error al cargar los datos del correo.');
            setLoading(false);
        }
    };

    const decryptPassword = async (encryptedPassword) => {
        try {
            const response = await Email.decryptPassword(encryptedPassword);
            if (response.status === 200) {
                setDecryptedPassword(response.data.body);
            } else {
                throw new Error('Error al desencriptar la contraseña');
            }
        } catch (error) {
            console.error('Error decrypting password:', error);
            toast.error('Error al desencriptar la contraseña.');
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                sender_email: senderEmail,
                sender_name: senderName,
                username,
                password: showPassword ? password : decryptedPassword,
            };

            let response;
            if (emailData) {
                response = await Email.update(data, emailData.id);
            } else {
                response = await Email.post(data);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success('Configuración de correo guardada exitosamente!');
                fetchEmailData();
            } else {
                throw new Error('Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving email configuration:', error);
            toast.error('Error al guardar la configuración del correo.');
        }
    };

    const handleDelete = async () => {
        try {
            if (emailData) {
                const response = await Email.delete(emailData.id);
                if (response.status === 200) {
                    setSenderEmail('');
                    setSenderName('');
                    setUsername('');
                    setPassword('');
                    setDecryptedPassword('');
                    setEmailData(null);
                    toast.success('Configuración de correo eliminada exitosamente.');
                } else {
                    throw new Error('Error al eliminar la configuración');
                }
            } else {
                toast.error('No hay configuración para eliminar.');
            }
        } catch (error) {
            console.error('Error deleting email configuration:', error);
            toast.error('Error al eliminar la configuración del correo.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="bg-[#F3F4F8] py-16">
            <div className="w-4/5 mx-auto">
                <div className="heading mb-16 text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Configuración del Correo Emisor
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">
                        Configura el correo utilizado para enviar notificaciones y recuperar contraseñas.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-8">
                        <label htmlFor="sender-name" className="block text-lg font-medium text-gray-700 mb-2">
                            Nombre del Remitente
                        </label>
                        <input
                            type="text"
                            id="sender-name"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="sender-email" className="block text-lg font-medium text-gray-700 mb-2">
                            Correo del Remitente
                        </label>
                        <input
                            type="email"
                            id="sender-email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={showPassword ? password : decryptedPassword}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setShowPassword(true);
                                }}
                                className="block w-full border border-gray-300 rounded-md p-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="mr-2" size={16} />
                            Eliminar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="mr-2" size={16} />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfig;