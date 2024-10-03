import React, { useState } from 'react';
import { toast } from 'sonner';
import { Email } from '../../services/email';
import { Send } from 'lucide-react';

const EmailTest = () => {
    const [testEmail, setTestEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleTestEmail = async (e) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const data = {
                email: testEmail,
                subject: subject
            };

            const response = await Email.testEmail(data);

            if (response.status === 200) {
                toast.success('Correo de prueba enviado exitosamente!');
            } else {
                throw new Error(response.data.msg || 'Error al enviar el correo de prueba');
            }
        } catch (error) {
            console.error('Error sending test email:', error);
            toast.error(error.message || 'Error al enviar el correo de prueba');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-[#F3F4F8] py-16">
            <div className="w-4/5 mx-auto">
                <div className="heading mb-16 text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Probar Configuración de Correo
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">
                        Envía un correo de prueba para verificar la configuración del correo emisor.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleTestEmail}>
                        <div className="mb-8">
                            <label htmlFor="test-email" className="block text-lg font-medium text-gray-700 mb-2">
                                Correo de Prueba
                            </label>
                            <input
                                type="email"
                                id="test-email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">
                                Asunto
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSending}
                                className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSending ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSending ? (
                                    'Enviando...'
                                ) : (
                                    <>
                                        <Send className="mr-2" size={16} />
                                        Enviar Correo de Prueba
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmailTest;