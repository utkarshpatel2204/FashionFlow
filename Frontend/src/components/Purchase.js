import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

function AddPurchase(props) {
    const userEmail = props.Email;

    const [vendorDetails, setVendorsDetails] = useState([]);
    const [shopName, setShopName] = useState('');
    const [partyDetails, setPartyDetails] = useState(null); // To hold fetched party details
    const [purchaseItems, setPurchaseItems] = useState([
        { srNo: 1, purchaseItem: '', quantity: 0, pieces: 0 ,total_price:0},
        { srNo: 2, purchaseItem: '', quantity: 0, pieces: 0 ,total_price:0},
    ]); // Initial order item row
    const [totalPrice,setTotalPrice]=useState(0)

    const [partiesNameList, setPartiesNameList] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [date,setDate]=useState(new Date().toLocaleString())
    // Fetch the party details when the component mounts
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}stock/viewParties/?email=${userEmail}`, {
                    withCredentials: true,
                });
                setPartiesDetails(response.data);  // Set the fetched party details
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchParties();
    }, [userEmail]);

    // Update partiesNameList when partiesDetails is updated
    useEffect(() => {
        if (vendorDetails && vendorDetails.length > 0) {
            const updatedPartyList = partiesDetails.map(party => ({
                label: party.shop_name,
                value: party.shop_name
            }));
            setPartiesNameList(updatedPartyList);
        }
    }, [vendorsDetails]);


    // Function to handle party name selection and fetch details
    const handlePartyNameChange = (e) => {
        const selectedPartyName = e.value;
        setPartyName(selectedPartyName);

        const selectedPartyDetails = vendorDetails.find(party => party.shop_name === selectedPartyName);
        if (selectedPartyDetails) {
            setPartyDetails({
                address: selectedPartyDetails.address,
                gst: selectedPartyDetails.gst_number,
                mobile: selectedPartyDetails.mobile,
            });
        } else {
            setPartyDetails(null);
        }
    }
    useEffect(() => {
        return () => {
            setTotalPrice(purchaseItems.reduce((acc, item) => acc + item.total_price, 0))
        };
    }, [purchaseItems]);

    // Function to handle row changes
    const handleRowChange = (index, field, value) => {
        const updatedPurchaseItems = [...purchaseItems];
        updatedPurchaseItems[index][field] = value;


        if (field === 'quantity' | field === 'price' ) {

            updatedPurchaseItems[index].total_price = updatedPurchaseItems[index].price * updatedPurchaseItems[index].quantity;

        }

        setPurchaseItems(updatedPurchaseItems);
        setTotalPrice(purchaseItems.reduce((acc, item) => acc + item.total_price, 0))
        console.log(purchaseItems)
    };

    // Function to add new row
    const addNewRow = () => {
        setPurchaseItems([...purchaseItems, { srNo: purchaseItems.length + 1, purchaseItem: '', quantity: 0, pieces: 0 ,total_price:0}]);
    };

    // Function to delete a row
    const deleteRow = (index) => {
        const updatedPurchaseItems = purchaseItems.filter((item, i) => i !== index);
        setPurchaseItems(updatedPurchaseItems.map((item, i) => ({ ...item, srNo: i + 1 })));
        console.log(purchaseItems)

    };

    // Validation before saving
    const validateOrderItems = () => {
        const party = !(partyName === '')
        const purchaseNumbers = purchaseItems.map(item => item.purchaseItem);
        const hasUniqueDesignNo = new Set(purchaseNumbers).size === purchaseNumbers.length;
        const allDesignNosFilled = purchaseItems.every(item => item.purchaseItem !== '');
        const allQuantitiesValid = purchaseItems.every(item => item.quantity > 0);

        return hasUniqueDesignNo && allDesignNosFilled && allQuantitiesValid &&  party;
    };

    // Handle Save
    const handleSave =async () => {
        if (validateOrderItems()) {

            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}stock/addPurchareItems/`, {
                    email:props.Email,
                    shopName:shopName,
                    partyDetails:partyDetails,
                    date:date,
                    purchaseList:purchaseItems,
                    total_price:totalPrice
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setSuccessMessage('purchase is saved')
                setError('');
            } catch (error) {
                console.error('Error adding purchaseList:', error);
                setError('Error adding purchaseList:' + error);
            }
            console.log('Order items are valid, proceed with saving:', purchaseItems);
        } else {
            setError('Validation failed! Ensure unique Design Nos, valid quantities, and all items in stock.');
            setSuccessMessage('')
        }
    };

    return (
        <div className='h-full w-full flex flex-col items-center justify-center p-3 overflow-y-scroll'>
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Add New Purchase</h1>
                <p className="text-gray-600">Fill out the details to add a new Purchase.</p>
            </div>

            {/* Party Information Section */}
            <div className='h-[40%] bg-gray-400 w-full p-6 '>
                <label htmlFor="party_name" className="block text-sm font-semibold  mb-1">Party Name</label>
                <Select options={partiesNameList} onChange={handlePartyNameChange} />
                {partyDetails && (
                    <div className="mt-4">
                        <p><strong>Address:</strong> {partyDetails.address}</p>
                        <p><strong>GST Number:</strong> {partyDetails.gst}</p>
                        <p><strong>Mobile:</strong> {partyDetails.mobile}</p>
                    </div>
                )}
                <strong>Date:</strong>{date}
            </div>

            {/* Order Items Section */}
            <div className=' bg-white w-full p-6'>
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr>
                        <th className="border bg-sec text-pri p-2">Sr No</th>
                        <th className="border bg-sec text-pri p-2">Purchare Items</th>
                        <th className="border bg-sec text-pri p-2">Quantity</th>
                        <th className="border bg-sec text-pri p-2">Price</th>
                        <th className="border bg-sec text-pri p-2">Total</th>
                     {/* New Status Column */}
                        <th className="border bg-sec text-pri p-2">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchaseItems.map((item, index) => (
                        <tr key={index}>
                            <td className="border p-2">{item.srNo}</td>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    value={item.purchaseItem}
                                    onChange={(e) => handleRowChange(index, 'purchaseItem', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </td>
                            <td className="border p-2">{item.total_price}</td>

                            <td className="border p-2">
                                <button
                                    type="button"
                                    onClick={() => deleteRow(index)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Add Row Button */}
                <div className="border p-2 mt-2">
                    <button
                        type="button"
                        onClick={addNewRow}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                        Add Row
                    </button>
                </div>
                <strong>Total Amount:</strong>{totalPrice}
                {/* Save Button */}
                <div className="border p-2 mt-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                        Save
                    </button>
                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Success Message */}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default AddPurchase;