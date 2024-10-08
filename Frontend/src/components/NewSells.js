import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';


function NewSells(props) {
    const userEmail = props.Email;

    const [vendorsDetails, setvendorsDetails] = useState([]);
    const [vendorName, setvendorName] = useState('');
    const [vendorDetails, setvendorDetails] = useState(null);
    const [orderItems, setOrderItems] = useState([
        { srNo: 1, item_name: '', quantity: 0, category: '', total_price: 0, status: '' },
    ]);
    const [totalPrice, setTotalPrice] = useState(0)

    const [vendorNameList, setvendorNameList] = useState([]);
    const [itemDetails, setitemDetails] = useState([]);
    const [itemNameList, setitemNameList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [date, setDate] = useState(new Date().toLocaleString())

    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/viewvendors?email=${userEmail}`, {
                    withCredentials: true,
                });
                setvendorsDetails(response.data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };
        const fetchitem_name = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/stock/viewstock?email=${userEmail}`, {
                    withCredentials: true,
                });
                setitemDetails(response.data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };
        fetchitem_name();
        fetchParties();
    }, [userEmail]);

    useEffect(() => {
        if (vendorsDetails && vendorsDetails.length > 0) {
            const updatedPartyList = vendorsDetails.map(party => ({
                label: party.shop_name,
                value: party.shop_name
            }));
            setvendorNameList(updatedPartyList);
        }
    }, [vendorsDetails]);

    useEffect(() => {
        if (itemDetails && itemDetails.length > 0) {
            const updatedDesignList = itemDetails.map(product => ({
                label: product.item_name,
                value: product.item_name
            }));
            setitemNameList(updatedDesignList);

        const updatedCategoryList = [...new Set(itemDetails.map(item => item.category))].map(category => ({
                label: category,
                value: category,
            }));
            setCategoryList(updatedCategoryList); // Update category list with unique categories
        }
    }, [itemDetails]);

    const handlevendorNameChange = (e) => {
        const selectedvendorName = e.value;
        setvendorName(selectedvendorName);

        const selectedvendorDetails = vendorsDetails.find(party => party.shop_name === selectedvendorName);
        if (selectedvendorDetails) {
            setvendorDetails({
                address: selectedvendorDetails.address,
                owner_name: selectedvendorDetails.owner_name,
                GST: selectedvendorDetails.GST,
                contact: selectedvendorDetails.contact,
            });
        } else {
            setvendorDetails(null);
        }
    };

    useEffect(() => {
        return () => {
            setTotalPrice(orderItems.reduce((acc, item) => acc + item.total_price, 0))
        };
    }, [orderItems]);

    const handleRowChange = (index, field, value) => {
        const updatedOrderItems = [...orderItems];
        updatedOrderItems[index][field] = value;

        if (field === 'item_name') {
            const selectedProduct = itemDetails.find(product => product.item_name === value);
            updatedOrderItems[index].price = selectedProduct ? selectedProduct.price : 0;
            updatedOrderItems[index].category = selectedProduct ? selectedProduct.category : '';
            updatedOrderItems[index].status = updatedOrderItems[index].quantity > selectedProduct?.total_quantity ? 'Not in Stock' : 'In Stock';
        }
        if (field === 'category') {
            updatedOrderItems[index].category = value;
        }

        if (field === 'quantity') {
            const selectedProduct = itemDetails.find(product => product.item_name === updatedOrderItems[index].item_name);
            updatedOrderItems[index].total_price = updatedOrderItems[index].quantity * updatedOrderItems[index].price;
            updatedOrderItems[index].status = updatedOrderItems[index].quantity > selectedProduct?.total_quantity ? 'Not in Stock' : 'In Stock';
        }

        setOrderItems(updatedOrderItems);
        setTotalPrice(orderItems.reduce((acc, item) => acc + item.total_price, 0))
    };

    const addNewRow = () => {
        setOrderItems([...orderItems, { srNo: orderItems.length + 1, item_name: '', quantity: 0, category: '', price: 0, total_price: 0, status: '' }]);
    };

    const deleteRow = (index) => {
        const updatedOrderItems = orderItems.filter((item, i) => i !== index);
        setOrderItems(updatedOrderItems.map((item, i) => ({ ...item, srNo: i + 1 })));
    };
    const validateOrderItems = () => {
        const party = !(vendorName === '')
        const itemName = orderItems.map(item => item.item_name);
        const hasUniqueitem_name = new Set(itemName).size === itemName.length;
        const allitem_namesFilled = orderItems.every(item => item.item_name !== '');
        const allQuantitiesValid = orderItems.every(item => item.quantity > 0);
        const allInStock = orderItems.every(item => item.status === 'In Stock');
        return hasUniqueitem_name && allitem_namesFilled && allQuantitiesValid && allInStock && party;
    };

    const generateInvoiceNumber = () => {
        return `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    };

    const generatePDF = () => {
    const doc = new jsPDF();

    // Set the font size for the title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);  // Title text at (14, 20)

    // Set font size for normal text
    doc.setFontSize(12);

    const invoiceNumber = generateInvoiceNumber();
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 38);
    doc.text(`Vendor: ${vendorName}`, 14, 46);

    if (vendorDetails) {
        doc.text(`Owner: ${vendorDetails.owner_name}`, 14, 54);
        doc.text(`Address: ${vendorDetails.address}`, 14, 62);
        doc.text(`GST: ${vendorDetails.GST}`, 14, 70);
        doc.text(`Mobile: ${vendorDetails.contact}`, 14, 78);
    }

    // Adding space between vendor details and table
    doc.setFontSize(14);
    doc.text("Order Details", 14, 90); // Add a heading for the order details section

    // Reset font size for table content
    doc.setFontSize(12);

    // AutoTable for order items
    doc.autoTable({
        head: [['Sr No', 'Item Name', 'Quantity', 'Category', 'Price', 'Total', 'Status']],
        body: orderItems.map(item => [
            item.srNo,
            item.item_name,
            item.quantity,
            item.category,
            `₹${parseFloat(item.price).toFixed(2)}`,  // Ensure 2 decimal places
            `₹${parseFloat(item.total_price).toFixed(2)}`, // Ensure 2 decimal places
            item.status
        ]),
        startY: 100, // Starting position for the table
        margin: { left: 14, right: 14 }, // Add some margin to the sides
        theme: 'grid',  // Optional theme for better styling (other options are 'striped', 'plain')
    });

    // Add total price at the bottom of the table
    doc.text(`Total Price: ₹${parseFloat(totalPrice).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    // Save the PDF with the generated invoice number
    doc.save(`${invoiceNumber}.pdf`);
};


    const handleSave = async () => {
        if (validateOrderItems()) {
            try {
                await axios.post(`http://localhost:8000/stock/addsells/`, {
                    email: props.Email,
                    shop_name: vendorName,
                    vendor_details: vendorDetails,
                    date: date,
                    sellsList: orderItems,
                    total_price: totalPrice
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setSuccessMessage('Order is saved');
                setError('');
                 generatePDF(); // Generate PDF after successful save
            } catch (error) {
                console.error('Error adding stock:', error);
                setError('Error adding stock:');
            }
        } else {
            setError('Validation failed! Ensure unique item , valid quantities, and all items in stock.');
            setSuccessMessage('');
        }
    };

    return (
        <div className='w-full flex flex-col items-center justify-center p-3 bg-[#1B2A41] overflow-y-scroll'>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Add New Sells</h1>
                <p className="text-gray-400 text-lg">Fill out the details to add a new Sells.</p>


            </div>

            {/* Party Information Section */}
            <div className='w-full p-6 rounded-md shadow-md mb-4 '>
                <div className="mb-4 ">
                    <label htmlFor="shop_name" className="block text-lg font-semibold mb-2">Shop Name</label>
                    <Select options={vendorNameList} onChange={handlevendorNameChange} className="w-full bg-[#324A5F]" />
                </div>

                {vendorDetails && (
                    <div className="border-t border-gray-200 pt-4 mt-4 text-white">
                        <p className=""><strong>Owner Name:</strong> {vendorDetails.owner_name}</p>
                        <p className=""><strong>Address:</strong> {vendorDetails.address}</p>
                        <p className=""><strong>GST Number:</strong> {vendorDetails.GST}</p>
                        <p className=""><strong>Mobile:</strong> {vendorDetails.contact}</p>
                    </div>
                )}
                <p className="mt-4 text-white"><strong>Date:</strong> {date}</p>
            </div>

            {/* Order Items Section */}
            <div className='w-full p-6 rounded-md shadow-md bg-[#324A5F]'>
                <table className="w-full table-auto border-collapse bg-[#324A5F]">
                    <thead className="bg-[#CCC9DC] text-black">
                    <tr className="bg-[#CCC9DC]">
                        <th className="border p-3">Sr No</th>
                        <th className="border p-3">Item Name</th>
                        <th className="border p-3">Quantity</th>
                        <th className="border p-3">Category</th>

                        <th className="border p-3">Price</th>
                        <th className="border p-3">Total</th>
                        <th className="border p-3">Status</th>
                        <th className="border p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderItems.map((row, index) => (
                        <tr key={index} className="text-white">
                            <td className="border p-3">{row.srNo}</td>
                            <td className="border p-3 text-black">
                                <Select options={itemNameList} onChange={e => handleRowChange(index, 'item_name', e.value)} />
                            </td>
                            <td className="border p-3">
                                <input
                                    type="number"
                                    value={row.quantity}
                                    min={0}
                                    className="w-full border rounded px-3 py-1 bg-[#324A5F]"
                                    onChange={e => handleRowChange(index, 'quantity', e.target.value)}
                                />
                            </td>
                            <td className="border p-3 text-black">
                               <Select  className="bg-[#324A5F]" options={categoryList} onChange={e => handleRowChange(index, 'category', e.value)} />
                            </td>
                            <td className="border p-3">{row.price}</td>
                            <td className="border p-3">{row.total_price}</td>
                            <td className="border p-3">
                                    <span className={row.status === 'In Stock' ? 'text-green-600' : 'text-red-600'}>
                                        {row.status}
                                    </span>
                            </td>
                            <td className="border p-3">
                                <button onClick={() => deleteRow(index)} className="text-red-500 hover:text-red-700">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button onClick={addNewRow} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Row
                </button>

                <div className="mt-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Total Price: ₹{totalPrice}</h2>
                    <button
                        onClick={handleSave}
                        className="py-2 px-6 bg-[#CCC9DC] text-black rounded-lg hover:bg-green-800 transition duration-300"
                    >
                        Save Sells List
                    </button>
                </div>
            </div>

            {/* Messages Section */}
            {error && <div className="mt-4 bg-red-100 text-red-600 p-3 rounded">{error}</div>}
            {successMessage && <div className="mt-4 bg-green-100 text-green-600 p-3 rounded">{successMessage}</div>}
        </div>
    );
}

export default  NewSells;