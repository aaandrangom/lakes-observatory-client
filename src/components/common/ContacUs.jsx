import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ContactUs = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success(t('messageSent'));
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error(t('messageFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-10 bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-red-600">{t('contactUs')}</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        {t('name')}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        {t('email')}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="message">
                        {t('message')}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
                        rows="4"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? t('sending') : t('send')}
                </button>
            </form>
        </div>
    );
};

export default ContactUs;
