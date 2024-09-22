import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DateFilter = ({ onFilter }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        onFilter(startDate, endDate);
    };

    return (
        <div className="mb-12 flex space-x-4">
            <div className="relative">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
            <div className="relative">
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
            <button
                onClick={handleFilter}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
                Filtrar
            </button>
        </div>
    );
};

export default DateFilter;
