import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PurchaseHistory(props) {
    const userEmail = props.Email;
    const [orderHistory, setOrderHistory] = useState([]);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getpurchases/?email=${userEmail}`, {
                    withCredentials: true,
                });
                setOrderHistory(response.data);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Error fetching order history.');
            }
        };

        fetchOrderHistory();
    }, [userEmail]);

    const handleCardClick = (Id) => {
        navigate(`/dashboard/purchaseHistory/${Id}`);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 overflow-y-auto bg-[#1B2A41] text-white">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Purchase History</h1>
                <p className="text-gray-400">View all previous purchases below</p>
            </div>

            {/* Purchase History Table */}
            <div className='w-full shadow-md rounded-lg overflow-hidden '>
                <table className="w-full text-left border-collapse">
                    <thead className="text-black bg-[#CCC9DC] ">
                    <tr>
                        <th className="border-b p-3 text-center">Sr No.</th>
                        <th className="border-b p-3 text-center">Purchase Date</th>
                        <th className="border-b p-3 text-center">Shop Name</th>
                        <th className="border-b p-3 text-center">Total Price</th>
                    </tr>
                    </thead>
                    <tbody className=''>
                    {orderHistory.length > 0 ? (
                        orderHistory.map((order, index) => (
                            <tr key={index}
                            onClick={() => handleCardClick(order._id)}
                            className="hover:bg-gray-100 transition-colors bg-[#324A5F] hover:text-black">
                                 <td className="border-b p-3 text-center">{index+1}</td>
                                <td className="border-b p-3 text-center">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="border-b p-3 text-center">{order.shop_name}</td>
                                <td className="border-b p-3 text-center">Rs. {order.total_price}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border-b p-3 text-center text-gray-500">
                                {error ? error : 'No purchases found.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PurchaseHistory;