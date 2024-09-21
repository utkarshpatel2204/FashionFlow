import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                name: name,
                email: email,
                password: password,
            });
            setSuccess('Registration successful! Please log in.');
            setName('');
            setEmail('');
            setPassword('');
            setPassword2('');
            setError('');
            navigate('/');
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="relative flex items-center justify-center h-screen w-full bg-cover bg-center bg-fixed font-serif" style={{ backgroundImage: "url('images/img1.jpeg')" }}>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-80"></div>
            <div className="relative bg-gray-300 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <form onSubmit={handleRegister}>
                    <h1 className="text-2xl font-bold mb-6">Create an account</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                    >
                        Register
                    </button>

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                    {success && <p className="text-green-600 mt-4">{success}</p>}

                    <p className="text-sm text-gray-600 mt-6">
                        Already have an account? <Link to="/" className="text-blue-600 hover:text-blue-800">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
