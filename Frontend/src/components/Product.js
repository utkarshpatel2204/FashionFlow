import React, { useEffect, useState } from 'react';
import initialImage from './initial.png';
import axios from "axios";
import Product from './Product'; // Ensure this path is correct

const ProductForm = (prop) => {
  const [item_name, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(initialImage);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (imageFile) {
      console.log('Updated imageFile:', imageFile);
    }
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('email', prop.Email);
    formData.append('item_name', item_name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('image', imageFile);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await axios.post('http://localhost:8000/stock/additems/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setSuccessMessage('Item added successfully!');
      // Update to use routing or state management to navigate to Product component
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-full w-full bg-white font-serif'>
      <div className="flex h-full w-full bg-white p-2">
        <div className='w-full h-full flex justify-center items-center bg-white p-30'>
          <form onSubmit={handleSubmit} className="w-11/12 h-4/5 p-10 bg-gray-200 rounded-lg shadow-lg">
            <div className="flex items-center gap-12 mb-5">
              <div className="w-50 h-48 ml-5 border-2 border-white bg-gray-100 shadow-md">
                <img src={imageURL} alt="Selected or Initial" className="h-full w-full object-contain" />
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  const url = window.URL.createObjectURL(file);
                  setImageURL(url);
                }}
                required
                className="flex flex-col w-1/2 mt-20"
              />
            </div>

            <div className="mb-4 w-full">
              <label htmlFor="design_no" className="block text-sm font-semibold text-gray-800 mb-1">Item Name</label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={item_name}
                onChange={(e) => setItemName(e.target.value)}
                required
                placeholder='Item name'
                className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-between gap-5 mb-4">
              <div className="w-1/2">
                <label htmlFor="color" className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder='Enter Category'
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-1">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder='Enter price'
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {successMessage && <div className="text-green-600 font-bold text-center mb-4">{successMessage}</div>}
            {error && <div className="text-red-600 font-bold text-center mb-4">{error}</div>}

            <div className="flex justify-end mt-5">
              <button type="submit" className="py-1 px-11 text-white bg-gray-700 rounded-lg hover:bg-teal-500 transition duration-300">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
