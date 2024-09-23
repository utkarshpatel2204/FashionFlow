import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrderHistory(props) {
    const userEmail = props.Email;
    const [orderHistory, setOrderHistory] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getsells/?email=${userEmail}`, {
                    withCredentials: true,
                });
                console.log(response.data);
                const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrderHistory(sortedData);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Error fetching order history.');
            }
        };

        fetchOrderHistory();
    }, [userEmail]);

    const handleCardClick = (Id) => {
        navigate(`/dashboard/sellsHistory/${Id}`);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gray-100">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order History</h1>
                <p className="text-gray-500">Review all previous orders below</p>
            </div>

            <div className="bg-white w-full shadow-md rounded-lg overflow-x-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border-b p-3 text-center">Sr No.</th>
                        <th className="border-b p-3 text-center">Order Date</th>
                        <th className="border-b p-3 text-center">shop Name</th>
                        <th className="border-b p-3 text-center">Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderHistory.length > 0 ? (
                        orderHistory.map((order, index) => (
                            <tr
                                key={index}
                                onClick={() => handleCardClick(order.id)}
                                className="cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <td className="border-b p-3 text-center">{index+1}</td>
                                <td className="border-b p-3 text-center">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="border-b p-3 text-center">{order.shop_name}</td>
                                <td className="border-b p-3 text-center">{order.total_price}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border-b p-3 text-center text-gray-500 text-center">
                                {error ? error : 'No orders found.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderHistory;