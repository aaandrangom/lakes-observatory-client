import React, { useEffect, useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { Measurements } from '../../services/measurements';
import { Info, Loader } from 'lucide-react';
import { toast } from 'sonner';
import MeasurementDetailsModal from './DetailMeasurements';
import DateFilter from '../common/DateFilter';
import Table from '../common/Table';

const MeasurementsGrid = () => {
    const [measurements, setMeasurements] = useState([]);
    const [filteredMeasurements, setFilteredMeasurements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMeasurements = async () => {
        try {
            setIsLoading(true);
            const response = await Measurements.getAll();
            if (response.status === 200) {
                setMeasurements(response.data.body);
                setFilteredMeasurements(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching measurements:', error);
            setError('Failed to load measurements. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const handleFilterByDate = (startDate, endDate) => {
        const filtered = measurements.filter(measurement => {
            const measurementDate = new Date(measurement.measurement_date);
            return (!startDate || measurementDate >= new Date(startDate)) &&
                (!endDate || measurementDate <= new Date(endDate));
        });
        setFilteredMeasurements(filtered);
    };

    const handleOpenModal = (measurement) => {
        setSelectedMeasurement(measurement);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMeasurement(null);
    };

    const handleUpdateMeasurement = async (updatedValues) => {
        toast.promise(
            (async () => {
                const updatePromises = updatedValues.map(async (value) => {
                    const response = await Measurements.update(value.measurement_value_id, { value: value.value });
                    if (response.status === 200) {
                        return response;
                    } else {
                        throw new Error(response.data?.message || 'Error al actualizar el valor');
                    }
                });

                const responses = await Promise.all(updatePromises);
                const allSuccessful = responses.every(res => res.status === 200);

                if (allSuccessful) {
                    const updatedMeasurements = measurements.map(m => {
                        if (m.measurement_id === selectedMeasurement.measurement_id) {
                            return { ...m, values: updatedValues };
                        }
                        return m;
                    });
                    setMeasurements(updatedMeasurements);
                    setFilteredMeasurements(updatedMeasurements);

                    return 'Valores de la medición actualizados con éxito';
                } else {
                    throw new Error('Algunos valores no pudieron actualizarse');
                }
            })(),
            {
                loading: 'Actualizando valores...',
                success: (msg) => `${msg}!`,
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'measurement_id',
        },
        {
            Header: 'Lago',
            accessor: 'lake_name',
        },
        {
            Header: 'Fecha',
            accessor: 'measurement_date',
            Cell: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            Header: 'Acciones',
            Cell: ({ row }) => (
                <button onClick={() => handleOpenModal(row.original)} className="action-button">
                    <Info size={20} />
                </button>
            ),
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        { columns, data: filteredMeasurements, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Loader className="animate-spin text-red-600" size={48} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 p-4 bg-gray-100">{error}</div>;
    }

    return (
        <section className="bg-[#F3F4F8] py-16">
            <div className="w-4/5 mx-auto">
                <div className="heading mb-16 text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">Gestión de Mediciones</h1>
                    <p className="text-lg mt-2 text-gray-600">Filtre y explore las mediciones por fecha.</p>
                </div>

                <DateFilter onFilter={handleFilterByDate} />

                <Table
                    getTableProps={getTableProps}
                    getTableBodyProps={getTableBodyProps}
                    headerGroups={headerGroups}
                    page={page}
                    prepareRow={prepareRow}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                />

                {isModalOpen && selectedMeasurement && (
                    <MeasurementDetailsModal
                        measurement={selectedMeasurement}
                        onClose={handleCloseModal}
                        onSave={handleUpdateMeasurement}
                    />
                )}
            </div>
        </section>
    );
};

export default MeasurementsGrid;
