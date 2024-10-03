import React, { useState, useEffect } from 'react';

const Table = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    pageIndex,
    pageOptions,
    setPageSize,
    pageSize,
    renderRowSubComponent
}) => {
    const [isCompact, setIsCompact] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById('table-container');
            if (container) {
                setContainerWidth(container.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const totalColumnsWidth = headerGroups[0]?.headers.reduce((total, header) => {
            return total + (header.width || 150); // Asumimos un ancho por defecto de 150px si no se especifica
        }, 0);

        setIsCompact(totalColumnsWidth > containerWidth);
    }, [headerGroups, containerWidth]);

    return (
        <div id="table-container" className="overflow-x-auto">
            <table {...getTableProps()} className={`w-full bg-white rounded-lg shadow-md ${isCompact ? 'table-fixed' : 'table-auto'}`}>
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...headerGroupProps}>
                                {headerGroup.headers.map(column => {
                                    const { key, ...columnProps } = column.getHeaderProps();
                                    return (
                                        <th key={key} {...columnProps} className={`text-center px-4 py-2 text-gray-700 font-semibold ${isCompact ? 'truncate' : ''}`}>
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        const { key, ...rowProps } = row.getRowProps();
                        return (


                            <React.Fragment key={row.id}>
                                <tr key={key} {...rowProps} className="border-t">
                                    {row.cells.map((cell) => {
                                        const { key, ...cellProps } = cell.getCellProps();
                                        return (
                                            <td key={key} {...cellProps} className={`text-center px-4 py-2 text-gray-600 ${isCompact ? 'truncate' : ''}`}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {row.isExpanded && (
                                    <tr>
                                        <td colSpan={row.cells.length}>
                                            {renderRowSubComponent({ row })}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <button onClick={previousPage} disabled={!canPreviousPage} className={`p-2 bg-gray-300 rounded-lg ${!canPreviousPage && 'opacity-50 cursor-not-allowed'}`}>
                        Anterior
                    </button>
                    <button onClick={nextPage} disabled={!canNextPage} className={`p-2 bg-gray-300 rounded-lg ${!canNextPage && 'opacity-50 cursor-not-allowed'}`}>
                        Siguiente
                    </button>
                </div>
                <div className="text-sm">
                    Página <strong>{pageIndex + 1} de {pageOptions.length}</strong>
                </div>
                <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    {[5, 10, 20].map(size => (
                        <option key={size} value={size}>
                            Mostrar {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Table;