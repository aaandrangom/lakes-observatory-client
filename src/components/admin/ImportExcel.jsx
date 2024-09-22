import React, { useState, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { Imports } from '../../services/import';
import { Lakes } from "../../services/lakes";

const ExcelImport = () => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [lakes, setLakes] = useState([]);
    const [selectedLake, setSelectedLake] = useState('');

    useEffect(() => {
        const fetchLakes = async () => {
            try {
                const response = await Lakes.getAll();
                setLakes(response.data.body);
            } catch (error) {
                console.error('Error fetching lakes:', error);
                toast.error('Error al cargar los lagos.');
            }
        };

        fetchLakes();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            toast.success('Archivo seleccionado con éxito!');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || droppedFile.type === 'application/vnd.ms-excel')) {
            setFile(droppedFile);
            toast.success('Archivo arrastrado y seleccionado con éxito!');
        } else {
            toast.error('Solo se permiten archivos Excel (.xlsx, .xls)');
        }
    };

    const handleUpload = async () => {
        if (file && selectedLake) {
            const formData = new FormData();
            formData.append('excelFile', file);
            formData.append('lake_id', selectedLake);

            try {
                const response = await Imports.uploadExcel(formData);
                if (response.status === 200) {
                    toast.success('Archivo importado exitosamente!');
                } else {
                    toast.error('Error al importar el archivo.');
                }
            } catch (error) {
                toast.error('Error al importar el archivo.');
            }
        } else {
            toast.error('Por favor, selecciona un archivo y un lago.');
        }
    };

    return (
        <div className="bg-[#F3F4F8] py-16">
            <div className="w-4/5 mx-auto">
                <div className="heading mb-16 text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">
                        Importar Datos de Lagos desde Excel
                    </h1>
                    <p className="text-lg mt-2 text-gray-600">
                        Seleccione un archivo Excel para importar información de lagos.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-8">
                        <label htmlFor="lake-select" className="block text-lg font-medium text-gray-700 mb-2">
                            Seleccionar Lago
                        </label>
                        <select
                            id="lake-select"
                            value={selectedLake}
                            onChange={(e) => setSelectedLake(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2 mb-4"
                        >
                            <option value="">Seleccione un lago</option>
                            {lakes.map((lake) => (
                                <option key={lake.id} value={lake.id}>{lake.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">
                            Seleccionar archivo Excel
                        </label>
                        <div
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragging ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                                    >
                                        <span>Seleccionar archivo</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept=".xlsx, .xls"
                                        />
                                    </label>
                                    <p className="pl-1">o arrastrar y soltar</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Solo archivos Excel (.xlsx, .xls)
                                </p>
                            </div>
                        </div>
                    </div>

                    {file && (
                        <div className="mb-4 text-center text-sm text-gray-700">
                            <p><strong>Archivo seleccionado:</strong> {file.name}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            <X className="mr-2" size={16} />
                            Cancelar
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${file && selectedLake ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                            disabled={!file || !selectedLake}
                            onClick={handleUpload}
                        >
                            <Upload className="mr-2" size={16} />
                            Importar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelImport;
