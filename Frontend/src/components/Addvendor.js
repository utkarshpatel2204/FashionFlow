import React, { useState } from 'react';
import axios from 'axios';

const AddVendor = (props) => {
    const [shopName, setShopName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [GSTNumber, setGSTNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const   [email, setEmail]=useState('')

    const handleAddVendor = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('shop_name', shopName);
        formData.append('owner_name', ownerName);
        formData.append('contact', contactNumber);
        formData.append('GST', GSTNumber);
        formData.append('address', address);
        // formData.append('email',email)
        console.log(formData)

        try {
            // Replace with your backend endpoint URL
            await axios.post('http://localhost:8000/stock/addvendors',{
                email:props.Email,
                shop_name:shopName,
                owner_name:ownerName,
                contact:contactNumber,
                GST :GSTNumber,
                address:address,
                }, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                }
              });
            setSuccess('Vendor added successfully!');
            setShopName('');
            setOwnerName('');
            setContactNumber('');
            setAddress('');
            setGSTNumber('');
            setError('');
        } catch (error) {
           
            setError('Error adding vendor. Please try again.');
        }
    };

    return (
        <div className="container mx-auto mt-8 bg-[#1B2A41]">
            <div className=" p-8 rounded-lg shadow-lg text-white">
                <h1 className="text-3xl font-bold mb-6">Add Vendor</h1>
                <form onSubmit={handleAddVendor} className="space-y-4">
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name='email'*/}
                    {/*        value={email}*/}
                    {/*        onChange={(e) => setEmail(e.target.value)}*/}
                    {/*        required*/}
                    {/*        className="w-full p-2 text-sm border border-gray-300 rounded-lg"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">Shop Name:</label>
                        <input
                            type="text"
                            name='shop_name'
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-[#324A5F]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">Owner Name:</label>
                        <input
                            type="text"
                            name='owner_name'
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            required
                            className="w-full p-2 text-sm border rounded-lg bg-[#324A5F]"
                        />
                    </div>

                    <div className="flex justify-between gap-5 mb-4">
                        <div className='w-1/2'>
                            <label className="block text-sm font-semibold text-white mb-1">Contact Number:</label>
                            <input
                                type="text"
                                name='contact'
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-[#324A5F]"
                            />
                        </div>

                        <div className='w-1/2'>
                            <label className="block text-sm font-semibold text-white mb-1">GST Number:</label>
                            <input
                                type="text"
                                name='GST'
                                value={GSTNumber}
                                onChange={(e) => setGSTNumber(e.target.value)}
                                required
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-[#324A5F]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-1 ">Address:</label>
                        <input
                            type="text"
                            name='address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-[#324A5F]"
                        />
                    </div>

                    <div className="flex justify-end mt-5">
                        <button type="submit"
                                className="py-1 px-11 text-white bg-[#CCC9DC] rounded-lg hover:bg-green-400 transition duration-300">
                            Save
                        </button>
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default AddVendor;
