import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Product from "./AddItems";
import ViewItemStock from "./ViewItemStock";
import Content from "./Content";
import AddVendor from './Addvendor';
import VendorsHist from './VendorsHist';
import NewSells from './NewSells';
import AddItemStock from './AddItemStock';
import Purchase from "./Purchase";
import SellsHistory from "./SellsHistory";
import PurchaseHistory from "./PurchaseHistory";
import img from './Screenshot 2024-09-24 120634.png'
import img1 from './PPM-JanFeb23-Supply-chain_empty-shelves.jpg'
const MainPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown
    const [activeContent, setActiveContent] = useState(); // Default content
    const navigate = useNavigate();

    useEffect(() => {
        const getName = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/', {
                    withCredentials: true,
                });
                setUsername(response.data.name);
                setEmail(response.data.email);
                console.log(email)

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getName();
    }, []);
    useEffect(() => {
        setActiveContent(<Content Email={email}/>)
    }, [email]);
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

    // Toggle the dropdowns and ensure only one is active
    const toggleDropdown = (index) => {
        setActiveDropdown((prevIndex) => (prevIndex === index ? null : index));
    };

    const isDropdownActive = (index) => {
        return activeDropdown === index;
    };

    // Close dropdown after a content selection
    const handleContentSelection = (contentComponent, dropdownIndex) => {
        setActiveContent(contentComponent);
        setActiveDropdown(null); // Close the dropdown
    };

    return (
        <div className="flex h-screen font-serif overflow-y-hidden">
            {/* Navbar - full width (100vw) */}
            <nav className="bg-[#0C1821] text-white h-16 w-full flex items-center justify-between px-10 fixed top-0 left-0 z-10">
                {/* Profile section inside navbar */}
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#324A5F] rounded-full mr-4"></div> {/* Profile photo */}
                    <h3 className="text-[#CCC9DC]">Fashion Flow</h3>
                </div>
                <ul className="flex space-x-6">
                    <li className="relative">
                        <a className="text-[#CCC9DC] no-underline text-lg font-bold cursor-pointer" onClick={() => handleContentSelection(<Content Email={email} />, null)}>Home</a>
                    </li>
                    <li className="relative">
                        <a className="text-[#CCC9DC] no-underline text-lg font-bold cursor-pointer" onClick={() => toggleDropdown(0)}>Stocks</a>
                        {isDropdownActive(0) && (
                            <ul className="absolute left-0 mt-2 bg-[#0C1821] text-sm p-2 shadow-lg border rounded-lg w-48">
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<Product Email={email} />, 0)}>Add Items</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<AddItemStock Email={email} />, 0)}>Add Stock</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<ViewItemStock Email={email} />, 0)}>View Stock</button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative">
                        <a className="text-[#CCC9DC] no-underline text-lg font-bold cursor-pointer" onClick={() => toggleDropdown(1)}>Order List</a>
                        {isDropdownActive(1) && (
                            <ul className="absolute left-0 mt-2 bg-[#0C1821] text-sm p-2 shadow-lg border rounded-lg w-48">
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<NewSells Email={email} />, 1)}>New Order</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<SellsHistory Email={email} />, 1)}>Order History</button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative">
                        <a className="text-[#CCC9DC] no-underline text-lg font-bold cursor-pointer" onClick={() => toggleDropdown(2)}>Vendors</a>
                        {isDropdownActive(2) && (
                            <ul className="absolute left-0 mt-2 bg-[#0C1821] text-sm p-2 shadow-lg border rounded-lg w-48">
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<AddVendor Email={email} />, 2)}>Add Vendor</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<VendorsHist Email={email} />, 2)}>Vendor History</button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="relative">
                        <a className="text-[#CCC9DC] no-underline text-lg font-bold cursor-pointer" onClick={() => toggleDropdown(3)}>Purchase</a>
                        {isDropdownActive(3) && (
                            <ul className="absolute left-0 mt-2 bg-[#0C1821] text-sm p-2 shadow-lg border rounded-lg w-48">
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<Purchase Email={email} />, 3)}>New Purchase</button>
                                </li>
                                <li className="my-2">
                                    <button className="text-sm text-[#CCC9DC] bg-transparent border-none w-full text-left hover:bg-[#324A5F] p-2 rounded-md"
                                            onClick={() => handleContentSelection(<PurchaseHistory Email={email} />, 3)}>Purchase History</button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
                <div>
                    <button className="bg-[#324A5F] text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-colors duration-300" onClick={handleLogout}>Log Out</button>
                </div>
            </nav>

            {/* MyRoutes content area with space on the left for photos */}
            <div className="flex mt-16 h-[92%] bg-[#CCC9DC] w-full overflow-y-hidden">
                <div className="w-[25%] bg-[#F4A261] h-full flex items-center justify-center">
                    {/*<div className="w-28 h-28 bg-white rounded-lg shadow-lg">*/}
                    {/*    /!* Placeholder for random photo *!/*/}
                    {/*</div>*/}
                    <img src={img1} alt="as"className='h-full' />
                </div>

                <div className="flex-grow p-5 overflow-y-auto">
                    <div className="mt-5 text-lg text-[#1B2A41] flex justify-center items-center">
                        {activeContent}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
