import React, { useState } from 'react';
import axios from 'axios';

const AddItemStock = (prop) => {
    const [item_name, setitem_name] = useState('');
    const [totalquantity, settotalquantity] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        // FormData for the post request
        const formData = {
            email: prop.Email, // Can be passed from props
            item_name: item_name,
            total_quantity: totalquantity,

        };

        try {
            await axios.post(`http://localhost:8000/stock/additemsstock/`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccessMessage('Stock added successfully!');
            setError('');
        } catch (error) {
            console.error('Error adding stock:', error);
            setError('Error adding stock:');
        }
    };


    return (
        <div className="bg-[#1B2A41] p-6 rounded-lg h-full w-full">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white">Add New Stock</h1>
                <p className="text-gray-400">Fill out the details to add new stock.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3 mt-5 flex-col bg-[#1B2A41]">

                <div className="grid grid-cols-2 gap-10 w-full">

                    <div className="space-y-5">
                        <label htmlFor="item_name" className="block text-sm font-semibold text-white mb-1">
                            Item Name
                        </label>
                        <input
                            type="text"
                            id="item_name"
                            name="item_name"
                            value={item_name}
                            onChange={(e) => setitem_name(e.target.value)}
                            className="w-full border border-gray-300 p-2 text-white rounded bg-[#324A5F]"
                            required
                        />
                    </div>


                    <div className="space-y-5">
                        <label htmlFor="total_set" className="block text-sm font-semibold text-white mb-1">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="total_quantity"
                            name="total_quantity"
                            min={0}
                            value={totalquantity}
                            onChange={(e) => settotalquantity(parseInt(e.target.value))}
                            className="w-full border border-gray-300 p-2 text-white rounded bg-[#324A5F]"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Success Message */}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                </div>
                {/* Submit Button */}
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        className="w-[20%] bg-[#CCC9DC] text-black p-2 rounded mt-4 hover:bg-[#E6859E]"
                    >
                        Add Stock
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddItemStock;
