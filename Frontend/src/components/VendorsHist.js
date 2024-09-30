import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VendorsHistory = (props) => {
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false); // To toggle dropdown visibility

    const userEmail = props.Email;
    const dropdownRef = useRef(null); // Ref for dropdown
    const inputRef = useRef(null); // Ref for input field

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/viewvendors?email=${userEmail}`, {
                    withCredentials: true,
                });
                setVendors(response.data);
                setFilteredVendors(response.data); // Initialize filtered vendors
            } catch (error) {
                setError('Error fetching vendor data');
                console.error('Error fetching vendors:', error);
            }
        };
        fetchVendors();
    }, [userEmail]);

    useEffect(() => {
        // Filter vendors based on searchTerm
        const filtered = vendors.filter((vendor) =>
            vendor.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVendors(filtered);
    }, [searchTerm, vendors]);

    // Handle input change and filter the dropdown list
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(true); // Show dropdown when typing
    };

    // Handle selecting a shop from the dropdown
    const handleSelectShop = (shop_name) => {
        setSearchTerm(shop_name); // Set the selected shop name
        setShowDropdown(false); // Hide dropdown after selection
    };

    // Close dropdown when clicking outside of the input and dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                inputRef.current && !inputRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="container mx-auto mt-8 bg-[#1B2A41] p-10 rounded-xl">
            <h1 className="text-4xl font-bold mb-6 text-white">Vendor History</h1>

            {/* Search Field */}
            <div className="relative w-full mb-4">
                <label htmlFor="shop_name" className="mr-2 text-lg font-semibold ">Shop Name:</label>
                <input
                    type="text"
                    id="shop_name"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
                    ref={inputRef} // Set ref for input field
                    className="form-input h-10 rounded border border-gray-300 text-white px-4 w-full bg-[#324A5F]"
                    placeholder="enter shop name"
                />
                
                {/* Dropdown for shop name suggestions */}
                {showDropdown && filteredVendors.length > 0 && (
                    <ul ref={dropdownRef} className="absolute z-20 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto rounded-lg shadow-md mt-1">
                        {filteredVendors.map((vendor) => (
                            <li
                                key={vendor.id}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleSelectShop(vendor.shop_name)}
                            >
                                {vendor.shop_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Vendor Table */}
            <div className="overflow-x-auto">
                <div className="relative max-h-80 overflow-y-scroll">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="text-black sticky top-0 z-10 bg-[#CCC9DC]">
                        <tr>
                            <th scope="col" className="py-3 px-4 border-r border-gray-300 text-center">Shop Name</th>
                            <th scope="col" className="py-3 px-4 border-r border-gray-300 text-center">Owner Name</th>
                            <th scope="col" className="py-3 px-4 border-r border-gray-300 text-center">Contact Number
                            </th>
                            <th scope="col" className="py-3 px-4 border-r border-gray-300 text-center">GST Number</th>
                            <th scope="col" className="py-3 px-4 text-center">Address</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y bg-[#324A5F] text-white">
                            {filteredVendors.length > 0 ? (
                                filteredVendors.map((vendor) => (
                                    <tr key={vendor.id}
                                        className="hover:bg-gray-200 transition duration-300 ease-in-out hover:text-black">
                                        <td className="py-3 px-4 text-center border-r border-gray-300">{vendor.shop_name}</td>
                                        <td className="py-3 px-4 text-center border-r border-gray-300">{vendor.owner_name}</td>
                                        <td className="py-3 px-4 text-center border-r border-gray-300">{vendor.contact}</td>
                                        <td className="py-3 px-4 text-center border-r border-gray-300">{vendor.GST}</td>
                                        <td className="py-3 px-4 text-center">{vendor.address}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">
                                        No matching vendors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorsHistory;
