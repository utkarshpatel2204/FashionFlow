import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PurchaseDetails(props) {
    const { id } = useParams(); // Get the order ID from the URL
    const [purchaseDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPurchaseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getPurchaseDetail/${id}?email=${props.
                Email}`, {
                    withCredentials: true,
                });
                setOrderDetails(response.data[0]);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Error fetching order details.');
            }
        };

        fetchPurchaseDetails();
    }, [id]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!purchaseDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-3 overflow-y-scroll">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <p className="text-gray-600">Details of the order placed on {new Date(purchaseDetails.date).toLocaleDateString()}</p>
            </div>

            {/* Party Information */}
            <div className='bg-white w-full p-6'>
                <h2 className="text-lg font-semibold mb-2">Vendor Information</h2>
                <p><strong>Shop Name:</strong> {purchaseDetails.shop_name}</p>
                <p><strong>Owner Name:</strong> {purchaseDetails.owner_name}</p>
                <p><strong>Address:</strong> {purchaseDetails.party_details?.address}</p>
                <p><strong>GST Number:</strong> {purchaseDetails.party_details?.GST}</p>
                <p><strong>Contact:</strong> {purchaseDetails.party_details?.contact}</p>
            </div>

            {/* Order Items Section */}
            <div className='bg-white w-full p-6 mt-4'>
                <h2 className="text-lg font-semibold mb-2">Order Items</h2>
                <table className="w-full table-auto">
                    <thead className="text-white">
                    <tr>
                        <th className="border bg-sec  p-2">Sr No</th>
                        <th className="border bg-sec  p-2">Item name</th>
                        <th className="border bg-sec  p-2">Quantity</th>
                        <th className="border bg-sec  p-2">Price</th>
                        <th className="border bg-sec  p-2">Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchaseDetails.purchaseList.map((item, index) => (
                        <tr key={index} className="text-center hover:bg-gray-100">
                            <td className="border-t-2 border-b-2 p-2 text-[#3A0A3E]">{item.srNo}</td>
                            <td className="border-t-2 border-b-2 p-2 text-[#3A0A3E] ">{item.item_name}</td>
                            <td className="border-t-2 border-b-2 p-2 text-[#3A0A3E]">{item.quantity}</td>
                            <td className="border-t-2 border-b-2 p-2 text-[#3A0A3E]">{item.price}</td>
                            <td className="border-t-2 border-b-2 p-2 text-[#3A0A3E]">₹ {item.total_price}</td>

                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <strong>Total Amount:</strong> ₹{purchaseDetails.total_price}
                </div>
            </div>
        </div>
    );
}

export default PurchaseDetails;
