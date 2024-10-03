import React, { useState } from 'react';
import { X, Edit, Save } from 'lucide-react';
import { useTable } from 'react-table';

const MeasurementDetailsModal = ({ measurement, onClose, onSave }) => {
    const [editableValues, setEditableValues] = useState(
        measurement.values.map(value => ({
            ...value,
            isEditing: false,
        }))
    );

    const handleEditToggle = (id) => {
        setEditableValues(editableValues.map(value =>
            value.measurement_value_id === id
                ? { ...value, isEditing: !value.isEditing }
                : value
        ));
    };

    const handleChange = (id, newValue) => {
        setEditableValues(editableValues.map(value =>
            value.measurement_value_id === id
                ? { ...value, value: newValue }
                : value
        ));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(editableValues);
        }
        onClose();
    };

    const columns = React.useMemo(() => [
        {
            Header: 'Parámetro',
            accessor: 'parameter_name',
            id: 'parameter_name'
        },
        {
            Header: 'Valor',
            accessor: 'value',
            id: 'value',
            Cell: ({ row }) => (
                row.original.isEditing ? (
                    <input
                        type="text"
                        value={row.original.value}
                        onChange={(e) => handleChange(row.original.measurement_value_id, e.target.value)}
                        className="border border-gray-300 rounded-md p-1 w-full"
                        autoFocus
                    />
                ) : (
                    `${row.original.value}`
                )
            )
        },
        {
            Header: 'Símbolo',
            accessor: 'parameter_symbol',
            id: 'parameter_symbol'
        },
        {
            Header: 'Acción',
            id: 'action',
            Cell: ({ row }) => (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={() => handleEditToggle(row.original.measurement_value_id)}
                        className="text-blue-600 hover:text-blue-800 transition"
                    >
                        {row.original.isEditing ? <Save size={16} /> : <Edit size={16} />}
                    </button>
                </div>
            )
        }
    ], [editableValues]);

    const data = React.useMemo(() => editableValues, [editableValues]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data }
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
                <button
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Detalles de la medición #{measurement.measurement_id} en {measurement.lake_name}
                </h2>
                <p className="text-lg mb-4 text-center">Fecha: {new Date(measurement.measurement_date).toLocaleDateString()}</p>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-center" {...getTableProps()}>
                        <thead className="bg-gray-100">
                            {headerGroups.map((headerGroup, index) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={`header-${index}`}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            key={`header-col-${index}`}
                                            className="py-2 px-4 text-gray-600 font-medium"
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200" {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={`row-${row.id}`}>
                                        {row.cells.map(cell => (
                                            <td
                                                {...cell.getCellProps()}
                                                key={`cell-${cell.column.id}-${row.id}`}
                                                className="py-2 px-4"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-4 space-x-4">
                    <button
                        onClick={handleSave}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Guardar cambios
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeasurementDetailsModal;
