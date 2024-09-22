import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Product from "./Product";
import ViewStock from "./ViewStock";
import Content from "./Content";
import AddVendor from './Addvendor';
import VendorsHist from './VendorsHist';
import NewOrder from './NewOrder';
import AddStock from './AddStock';
import Purchase from "./Purchase";


const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [activeDropdowns, setActiveDropdowns] = useState([]); // Track active dropdowns
    const [activeContent, setActiveContent] = useState(<Content />); // Default content
    const navigate = useNavigate();

    useEffect(() => {
        const getName = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/', {
                    withCredentials: true,
                });
                setUsername(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getName();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout/', {}, {
                withCredentials: true,
            });
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleDropdown = (index) => {
        setActiveDropdowns((prev) =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const isDropdownActive = (index) => {
        return activeDropdowns.includes(index);
    };

    return (
        <div className="flex h-screen overflow-hidden font-serif">
            <div className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0 overflow-y-auto pt-5 flex flex-col justify-between">
                <h2 className="mb-5 text-3xl text-center">TeeStockPro</h2>
                <hr className="border-t border-gray-600 mb-5" />
                <ul className="p-0 m-0 flex-grow">
                <li className="relative my-2 p-2 cursor-pointer"    >
                        <a className="text-gray-300 no-underline text-lg block pr-8 font-bold" onClick={() => setActiveContent(<Content Email={email} />)}>Home</a>
                        
                    </li>
                    <li className="relative my-2 p-2 cursor-pointer" onClick={() => toggleDropdown(0)}>
                        <a className="text-gray-300 no-underline text-lg block pr-8 font-bold">Stocks</a>
                        <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm cursor-pointer transition-transform duration-500 ${isDropdownActive(0) ? 'rotate-90' : '-rotate-90'}`}>
                            &#11167;
                        </span>
                        {isDropdownActive(0) && (
                            <ul className="list-none p-2 ml-2 bg-gray-800 mt-2">
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<Product Email={email} />)}>
                                        Add Items
                                    </button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<AddStock Email={email} />)}>
                                    Add Stock
                                    </button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<ViewStock Email={email} />)}>
                                        View Stock
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative my-2 p-2 cursor-pointer" onClick={() => toggleDropdown(2)}>
                        <a className="text-gray-300 no-underline text-lg block pr-8 font-bold">Order List</a>
                        <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm cursor-pointer transition-transform duration-500 ${isDropdownActive(2) ? 'rotate-90' : '-rotate-90'}`}>
                            &#11167;
                        </span>
                        {isDropdownActive(2) && (
                            <ul className="list-none p-2 ml-2 bg-gray-800 mt-2">
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<NewOrder Email={email} />)}>New Order</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none">Order history</button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative my-2 p-2 cursor-pointer" onClick={() => toggleDropdown(3)}>
                        <a className="text-gray-300 no-underline text-lg block pr-8 font-bold">Vendors</a>
                        <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm cursor-pointer transition-transform duration-500 ${isDropdownActive(3) ? 'rotate-90' : '-rotate-90'}`}>
                            &#11167;
                        </span>
                        {isDropdownActive(3) && (
                            <ul className="list-none p-2 ml-2 bg-gray-800 mt-2">
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<AddVendor Email={email} />)}>Add Vendor</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none" onClick={() => setActiveContent(<VendorsHist Email={email} />)}>Vendors History</button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative my-2 p-2 cursor-pointer" onClick={() => toggleDropdown(4)}>
                        <a className="text-gray-300 no-underline text-lg block pr-8 font-bold">Billing</a>
                        <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm cursor-pointer transition-transform duration-500 ${isDropdownActive(4) ? 'rotate-90' : '-rotate-90'}`}>
                            &#11167;
                        </span>
                        {isDropdownActive(4) && (
                            <ul className="list-none p-2 ml-2 bg-gray-800 mt-2">
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none"
                                           onClick={() => setActiveContent(<Purchase Email={email}/>)}
                                    > View Expenses</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-gray-300 bg-transparent border-none">Add Expense</button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
                <div className="p-2 text-center bg-gray-900 my-5">
                    <a href="#" className="text-gray-300  text-lg block p-2 bg-gray-800 rounded-md hover:bg-teal-500 transition-colors duration-300" onClick={handleLogout}>Log Out</a>
                </div>
            </div>

            <div className="ml-64 flex-grow overflow-y-auto p-5 h-screen box-border bg-gray-100">
                <header className="bg-gray-200 p-5 text-center border-b border-gray-400">
                    <h1 className="text-2xl text-gray-800 font-serif">Welcome, {username}</h1>
                </header>
                <div className="mt-5 text-lg text-gray-800 flex justify-center items-center">
                    {activeContent}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
