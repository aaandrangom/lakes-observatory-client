import React from 'react';

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
}) => {
    return (
        <div className="overflow-x-auto">
            <table {...getTableProps()} className="min-w-full bg-white rounded-lg shadow-md">
                <thead {...getTableProps()}>
                    {headerGroups.map(headerGroup => {
                        const headerGroupProps = headerGroup.getHeaderGroupProps();
                        const headerGroupKey = headerGroupProps.key;
                        delete headerGroupProps.key;
                        return (
                            <tr key={headerGroupKey} {...headerGroupProps}>
                                {headerGroup.headers.map(column => {
                                    const columnProps = column.getHeaderProps();
                                    const columnKey = columnProps.key;
                                    delete columnProps.key;
                                    return (
                                        <th key={columnKey} {...columnProps} className="text-center px-4 py-2 text-gray-700 font-semibold">
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
                        const rowProps = row.getRowProps();
                        const rowKey = rowProps.key;
                        delete rowProps.key;
                        return (
                            <tr key={rowKey} {...rowProps} className="border-t">
                                {row.cells.map((cell) => {
                                    const cellProps = cell.getCellProps();
                                    const cellKey = cellProps.key;
                                    delete cellProps.key;
                                    return (
                                        <td key={cellKey} {...cellProps} className=" text-center px-4 py-2 text-gray-600">
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
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
