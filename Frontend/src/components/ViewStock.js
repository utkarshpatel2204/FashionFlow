import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewStock = (props) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const userEmail = props.Email;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/viewstock?email=${userEmail}`, {
                    withCredentials: true,
                });
                setProducts(response.data);
            } catch (error) {
                setError('Error fetching stock data');
                console.error('Error fetching stock data:', error);
            }
        };

        fetchProducts();
    }, [userEmail]);
    const filteredProducts = products.filter((product) =>
        product.design_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto mt-25"> 
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-left text-4xl font-bold">Stock List</h1>
                <div className="flex items-center">
                    <label htmlFor="designNo" className="mr-2">item_name</label>
                    <input 
                        type="text" 
                        id="item_name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input h-10 rounded border border-gray-300 px-4 mr-2" 
                        placeholder="Design No"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            
            <div className="overflow-x-auto">
                <div className="relative max-h-80 overflow-y-scroll"> 
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="py-3 px-4 border-r border-gray-300 text-center">Sr No</th>
                                <th scope="col" className="py-1 px-2 border-r border-gray-300 text-center">Image</th>
                                <th scope="col" className="py-1 px-2 border-r border-gray-300 text-center">Item Name</th>
                                <th scope="col" className="py-1 px-2 border-r border-gray-300 text-center">Cateory</th>
                                <th scope="col" className="py-1 px-2 border-r border-gray-300 text-center">Price</th>
                                <th scope="col" className="py-1 px-2 border-r border-gray-300 text-center">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {filteredProducts.map((product,index) => (
                                <tr key={product.id} className="hover:bg-gray-200 transition duration-300 ease-in-out">
                                     <td className="py-3 px-4 text-center border-r border-gray-300">{index + 1}</td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">
                                        <img 
                                            src={`http://localhost:8000${product.image}`} 
                                            alt="Product" 
                                            className="h-24 w-24 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{product.item_name}</td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{product.category}</td>
                                    <td className="py-3 px-4 text-center border-r border-gray-300">{product.price}</td>
                                    <td className="py-3 px-4 text-center">{product.total_quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No matching products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewStock;
