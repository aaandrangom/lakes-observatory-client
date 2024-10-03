import React, { useEffect, useState, useMemo } from 'react';
import Table from '../common/Table.jsx';
import { Logs } from '../../services/logs.js';
import { useTable, usePagination, useExpanded } from 'react-table';
import { Loader, ChevronDown, ChevronRight } from 'lucide-react';

const LogsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = async (page, pageSize) => {
        setLoading(true);
        setError(null);
        try {
            const response = await Logs.getAll(null, pageSize, page);
            if (response.status === 200 && response.data && response.data.body) {
                setData(response.data.body.logs);
                setPageCount(response.data.body.totalPages);
                setTotalCount(response.data.body.totalCount);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('Failed to load logs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const columns = useMemo(
        () => [
            {
                id: 'expander',
                Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                        {isAllRowsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                ),
                Cell: ({ row }) => (
                    <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                ),
                width: '5%',
            },
            { Header: 'ID', accessor: 'id', width: '10%' },
            { Header: 'Usuario', accessor: 'user_id', width: '15%' },
            { Header: 'Método', accessor: 'method', width: '15%' },
            { Header: 'Estado', accessor: 'status', width: '15%' },
            {
                Header: 'Fecha',
                accessor: 'created_at',
                Cell: ({ value }) => new Date(value).toLocaleString(),
                width: '40%',
            },
        ],
        []
    );

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
            <div className="p-4 bg-gray-100">
                <h3 className="font-bold mb-2">Detalles adicionales:</h3>
                <p><strong>URL:</strong> {row.original.url}</p>
                <p><strong>Tiempo de Respuesta:</strong> {row.original.response_time}</p>
                <p><strong>IP Anonimizada:</strong> {row.original.anonymized_ip}</p>
            </div>
        ),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount: controlledPageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
            manualPagination: true,
            pageCount,
            autoResetPage: false,
        },
        useExpanded,
        usePagination
    );

    useEffect(() => {
        fetchData(pageIndex + 1, pageSize);
    }, [pageIndex, pageSize]);

    if (loading) {
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
                    <h1 className="text-4xl font-semibold text-gray-900">Gestión de Logs</h1>
                    <p className="text-lg mt-2 text-gray-600">Explore los logs del sistema.</p>
                </div>

                <div className="max-w-full overflow-x-auto">
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
                        pageCount={controlledPageCount}
                        gotoPage={gotoPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        renderRowSubComponent={renderRowSubComponent}
                    />
                    <div className="mt-2 text-sm text-gray-600 text-right">
                        Total de registros: {totalCount}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LogsTable;