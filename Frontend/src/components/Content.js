import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// SignUp chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Content = (props) => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/getsells/?email=${props.Email}`, {
                    withCredentials: true,
                });
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
                console.error('Error fetching purchase history:', error);
                setError('Error fetching purchase history.');
            }
        };

        fetchPurchaseHistory();
    }, [props.Email]);

    const uniqueDates = Array.from(new Set(orderHistory.map(order => new Date(order.date).toLocaleDateString()))).sort((a, b) => new Date(a) - new Date(b));

    const chartData = {
        labels: uniqueDates,
        datasets: [
            {
                label: 'Purchases',
                data: uniqueDates.map(date => {
                    const purchase = purchaseHistory.find(p => new Date(p.date).toLocaleDateString() === date);
                    return purchase ? parseFloat(purchase.total_price) : 0;
                }),
                backgroundColor: '#FFFFFF', // Color for Purchases
                borderColor: '#1B2A41',
                borderWidth: 1,
            },
            {
                label: 'Revenue',
                data: uniqueDates.map(date => {
                    const order = orderHistory.find(o => new Date(o.date).toLocaleDateString() === date);
                    return order ? parseFloat(order.total_price) : 0;
                }),
                backgroundColor: '#FF6F61', // Color for Revenue
                borderColor: '#1B2A41',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#FFFFFF', // Adjust legend text color
                },
            },
            title: {
                display: true,
                text: 'Earnings Overview',
                color: '#FFFFFF', // Adjust title color
            },
        },
    };

    const totalRevenue = orderHistory.reduce((sum, order) => {
        const price = parseFloat(order.total_price);
        return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const totalPurchase = purchaseHistory.reduce((total, purchase) => total + (parseFloat(purchase.total_price) || 0), 0);
    const profit = totalRevenue - totalPurchase;

    return (
        <div className="flex gap-[2%] rounded-xl shadow-lg items-center bg-[#1B2A41] w-full" style={{ minHeight: '80vh', padding: '100px' }}>
            {/* Stat Boxes */}
            <div className="flex flex-col justify-around w-full mb-8 gap-6">
                <div className="bg-[#324A5F] rounded-lg p-5 w-48 text-center text-white shadow-lg transform transition-all hover:scale-105">
                    <h3 className="text-lg font-semibold">Revenue</h3>
                    <p className="text-xl">₹ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-[#324A5F] rounded-lg p-5 w-48 text-center text-white shadow-lg transform transition-all hover:scale-105">
                    <h3 className="text-lg font-semibold">Purchases</h3>
                    <p className="text-xl">₹ {totalPurchase.toFixed(2)}</p>
                </div>
                <div className="bg-[#324A5F] rounded-lg p-5 w-48 text-center text-white shadow-lg transform transition-all hover:scale-105">
                    <h3 className="text-lg font-semibold">Profit</h3>
                    <p className="text-xl">₹ {profit.toFixed(2)}</p>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-[#324A5F] rounded-lg p-6 w-full md:w-4/5 shadow-lg">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Content;
