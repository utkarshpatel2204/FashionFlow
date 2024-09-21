import React, { useState } from 'react';
import axios from 'axios';

const NewOrder = (props) => {
    const [error, setError] = useState('');
    const [rows, setRows] = useState([
        { id: 1, item_name: '', total_quantity: '', totalPrice: 0 }
    ]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;

        

        // Calculate totalPrice based on pieces and pricePerSet
        if (name === 'item_name') {
            updatedRows[index].totalPrice = value * updatedRows[index].pricePerSet;
        }

        setRows(updatedRows);
    };

   

    const addRow = () => {
        setRows([...rows, { id: rows.length + 1, item_name: '', pieces: '', pricePerSet: 0, totalPrice: 0 }]);
    };

    const deleteRow = (index) => {
        const updatedRows = rows.filter((row, i) => i !== index);
        setRows(updatedRows.map((row, i) => ({ ...row, id: i + 1 }))); // Reassign IDs after deletion
    };
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/stock/neworder', { email: props.Email }, {
                withCredentials: true,
            });
            console.log('Stocks added:', response.data);
        } catch (error) {
            setError('Error adding stocks');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6">New Order</h1>

            {/* Search Field for Filtering */}
            <div className="relative w-full mb-4">
                {/* Add any search or filter input here if needed */}
            </div>

            {/* Order Table */}
            <div className="overflow-x-auto">
                <div className="relative max-h-80 overflow-y-scroll">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Sr No.</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Item Name</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Quantity</th>
                                 <th className="py-3 px-4 border-r border-gray-300 text-center">Total Price</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-200 transition duration-300 ease-in-out">
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{row.id}</td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="text"
                                            name="item_name"
                                            placeholder='Item Name'
                                            value={row.item_name}
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="number"
                                            name="quantity"
                                            min={0}
                                            value={row.total_quantity}
                                            placeholder='Quantity'
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                        />
                                    </td>
                                 
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{row.totalPrice}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => deleteRow(index)} className="bg-red-500 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between mt-4">
            <button onClick={addRow} className="bg-gray-700 hover:bg-teal-800 text-white px-4 py-2 mt-4 rounded">
                Add Row
            </button>
            <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white px-8 py-2 mt-4 rounded mr-8"
                >
                    Save
                </button>
                </div>
        </div>
    );
};

export default NewOrder;
