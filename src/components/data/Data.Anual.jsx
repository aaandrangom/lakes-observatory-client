import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { Lakes } from "../../services/lakes";
import { Parameters } from "../../services/parameter";
import { Measurements } from "../../services/measurements";
import { Imports } from '../../services/import';
import BarChart from '../graphics/BarChart';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const LakeDataDashboard = () => {
    const { id } = useParams();
    const [lakes, setLakes] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedLake, setSelectedLake] = useState(id || "");
    const [selectedParameter, setSelectedParameter] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [measurementData, setMeasurementData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const lakesResponse = await Lakes.getAll();
                setLakes(lakesResponse.data.body);

                const parametersResponse = await Parameters.getAll();
                setParameters(parametersResponse.data.body);

                const yearsResponse = await Measurements.getYears();
                setYears(yearsResponse.data.body);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchMeasurementData = async () => {
            if (selectedLake && selectedParameter && selectedYear) {
                try {
                    const response = await Measurements.getValuesByYear(selectedLake, selectedParameter, selectedYear);
                    if (response.data.body) {
                        setMeasurementData(response.data.body);
                    } else {
                        setMeasurementData([]);
                    }
                } catch (error) {
                    console.error("Error fetching measurement data:", error);
                    setMeasurementData([]);
                }
            }
        };

        fetchMeasurementData();
    }, [selectedLake, selectedParameter, selectedYear]);

    const columns = React.useMemo(() => [
        {
            Header: 'Mes',
            accessor: 'measurement_date',
        },
        {
            Header: 'Valor',
            accessor: 'value',
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: measurementData });

    const chartData = {
        x: measurementData.map(d => d.measurement_date),
        y: measurementData.map(d => d.value),
        color: 'skyblue',
    };

    const getParameterName = (id) => {
        const parameter = parameters.find(param => param.id === Number(id));
        return parameter ? parameter.name : 'Nombre no encontrado';
    };

    const parameterName = getParameterName(selectedParameter);

    const chartLayout = {
        title: {
            text: `<b>${parameterName}</b>`,
            font: {
                size: 25,
            },
        },
        xaxis: { title: 'Mes' },
        yaxis: { title: 'Valor' },
    };

    const chartConfig = {
        responsive: true,
    };

    const handleDownloadExcel = async () => {
        try {
            await Imports.generateExcel(selectedLake, selectedParameter, selectedYear);
        } catch (error) {
            toast.error('Error generating excel file');
            console.error('Error al generar el Excel:', error);
        }
    };

    return (
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Datos de Lagos Andinos
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Visualiza los datos de los lagos andinos seleccionando una laguna, un parámetro y un año.
                    </p>
                </div>

                <div className="mb-8 flex justify-center gap-4">
                    <select
                        value={selectedLake}
                        onChange={(e) => setSelectedLake(e.target.value)}
                        className="py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona una laguna</option>
                        {lakes.map((lake) => (
                            <option key={lake.id} value={lake.id}>{lake.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedParameter}
                        onChange={(e) => setSelectedParameter(e.target.value)}
                        className="py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un parámetro</option>
                        {parameters.map((param) => (
                            <option key={param.id} value={param.id}>{param.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un año</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleDownloadExcel}
                    className="mb-8 py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                    Descargar Excel
                </button>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : measurementData.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No hay datos disponibles para la selección actual.</p>
                ) : (

                    <div className="flex flex-row gap-8">
                        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg max-w-lg">
                            <h3 className="text-xl font-bold text-blue-600 mb-4">
                                Tabla de Datos
                            </h3>
                            <table {...getTableProps()} className="w-full">
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={`header-${headerGroup.id}`}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                    className="text-left text-gray-800 font-semibold py-2 border-b"
                                                    key={`header-col-${column.id}`}
                                                >
                                                    {column.render('Header')}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={`row-${row.id}`} className="hover:bg-gray-100">
                                                {row.cells.map(cell => (
                                                    <td {...cell.getCellProps()} className="py-2 border-b" key={`cell-${cell.row.id}-${cell.column.id}`}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-blue-600 mb-4">
                                Gráfico de Datos
                            </h3>
                            <BarChart
                                data={chartData}
                                layout={chartLayout}
                                config={chartConfig}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LakeDataDashboard;
