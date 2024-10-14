import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Chat } from '../../services/chat';

const ChatFloat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim()) {
            const userMessage = inputValue;
            setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
            setInputValue('');

            try {
                const response = await Chat.chat(userMessage);
                console.log('response', response)
                const botMessage = response.data.body.response || 'No se pudo obtener una respuesta.';
                setMessages(prev => [...prev, { role: 'model', text: botMessage }]);
            } catch (error) {
                console.error("Error al obtener respuesta:", error);
                setMessages(prev => [...prev, { role: 'model', text: 'Error al obtener respuesta.' }]);
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-red-500 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-105 hover:bg-red-600"
                >
                    <MessageCircle size={24} />
                </button>
            )}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col">
                    <div className="bg-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Chat con Anthony (asistente virtual)</h3>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Escribe un mensaje..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatFloat;