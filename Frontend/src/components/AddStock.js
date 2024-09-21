import React, { useState } from 'react';
import axios from 'axios';

const AddStock = (props) => {
    const [stocks, setStocks] = useState([{ design_no: '', quantity: 0, color: '', price: 0 }]);
    const [error, setError] = useState('');

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newStocks = [...stocks];
        newStocks[index][name] = value;
        setStocks(newStocks);

        if (name === 'design_no') {
            fetchProductDetails(index, value);
        }
    };

    const fetchProductDetails = async (index, designNo) => {
        try {
            const response = await axios.get(`http://localhost:8000/${designNo}/`);
            const { color, price } = response.data;

            const newStocks = [...stocks];
            newStocks[index].color = color;
            newStocks[index].price = price;
            setStocks(newStocks);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Product not found');
        }
    };

    const handleAddRow = () => {
        setStocks([...stocks, { design_no: '', quantity: 0, color: '', price: 0 }]);
    };

    const handleRemoveRow = (index) => {
        const newStocks = [...stocks];
        newStocks.splice(index, 1);
        setStocks(newStocks);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/stock/addstock', { email: props.Email, stocks }, {
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
            <h1 className="text-3xl font-bold mb-6">Add Stock</h1>
            
            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Stock Table */}
            <div className="overflow-x-auto">
                <div className="relative max-h-80 overflow-y-scroll">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white sticky top-0 z-10">
                            <tr>
                            <th  className="py-3 px-4 border-r border-gray-300 text-center">SrNo.</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Design No</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Quantity (Set)</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Color</th>
                                <th className="py-3 px-4 border-r border-gray-300 text-center">Price</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {stocks.map((stock, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-300 ease-in-out">
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{index + 1}</td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="text"
                                            name="design_no"
                                            value={stock.design_no}
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                            placeholder="Design No"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="number"
                                            name="total_set"
                                            value={stock.quantity}
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                            placeholder="Total Set"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="text"
                                            name="color"
                                            value={stock.color}
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                            placeholder="Color"
                                            readOnly
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <input
                                            type="number"
                                            name="price"
                                            value={stock.price}
                                            onChange={(event) => handleInputChange(index, event)}
                                            className="border p-2 rounded"
                                            placeholder="Price"
                                            readOnly
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <button
                                            onClick={() => handleRemoveRow(index)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={handleAddRow}
                    className="bg-gray-700 hover:bg-teal-800 text-white py-2 px-4 rounded"
                >
                    Add Row
                </button>   
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Save All
                </button>
            </div>
        </div>
    );
};

export default AddStock;
