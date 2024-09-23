import React from 'react';
import axios from "axios";
import {useState} from "react";
import {useEffect} from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const Home = (props) => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [error, setError] = useState('');



    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getsells/?email=${props.Email}`, {
                    withCredentials: true,
                });
                console.log(response.data);
                const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setOrderHistory(sortedData);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Error fetching order history.');
            }
        };

        fetchOrderHistory();
    }, [props.Email]);


    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getpurchases/?email=${props.Email}`, {
                    withCredentials: true,
                });
                setPurchaseHistory(response.data);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Error fetching order history.');
            }
        };

        fetchPurchaseHistory();
    }, [props.Email]);

    const uniqueDates = Array.from(new Set(orderHistory.map(order => new Date(order.date).toLocaleDateString()))).sort((a, b ) => new Date(a) - new Date(b));

    const chartData = {
        labels:uniqueDates,
        datasets: [
            {
                label: 'Purchase',
                data: uniqueDates.map(date => {
                    const purchase = purchaseHistory.find(p => new Date(p.date).toLocaleDateString() === date);
                    return purchase ? parseFloat(purchase.total_price) : 0;
                }),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Revenue',
                data: uniqueDates.map(date => {
                    const order = orderHistory.find(o => new Date(o.date).toLocaleDateString() === date);
                    return order ? parseFloat(order.total_price) : 0;
                }),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Earnings Overview',
            },
        },
    };

    const totalRevenue = orderHistory.reduce((sum, order) => {
        const price = parseFloat(order.total_price); // Convert total_price string to number
        return sum + (isNaN(price) ? 0 : price); // Ensure valid number
    }, 0);
    const totalPurchase = purchaseHistory.reduce((total, purchase) => total + (parseFloat(purchase.total_price) || 0), 0);
    const profit = totalRevenue - totalPurchase;



    return (
        <div className="flex flex-col    items-center text-gray-800  ml-[15%]">
            {/* Stat Boxes */}
            <div className="flex justify-around w-full mb-8">
                <div className="bg-gray-800 rounded-lg p-5 w-48 text-center text-white m-8 shadow-lg">
                    <h3 className="text-lg font-semibold">Revenue</h3>
                    <p className="text-xl">₹ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-5 w-48 text-center text-white m-8 shadow-lg">
                    <h3 className="text-lg font-semibold">Purchase</h3>
                    <p className="text-xl">₹ {totalPurchase.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-5 w-48 text-center text-white m-8 shadow-lg">
                    <h3 className="text-lg font-semibold">Profit</h3>
                    <p className="text-xl">₹ {profit.toFixed(2)}</p>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white rounded-lg p-6 w-full md:w-4/5 shadow-lg">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Home;
