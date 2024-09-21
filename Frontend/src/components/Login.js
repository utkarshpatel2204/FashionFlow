import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    const fetchUser = async (e) => {
        e.preventDefault();
        try {
            axios.post('http://localhost:8000/api/login/', {
                email: username,
                password: password,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    console.log('Login successful:', response.data);
                    setUser(response.data.token);
                    navigate('/dashboard');
                })
                .catch(error => {
                    console.error('Login error:', error);
                    setError('Login failed. Please try again.');
                });

        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-screen w-full bg-cover bg-center bg-fixed font-serif" style={{ backgroundImage: "url('images/img1.jpeg')" }}>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-80"></div>
            <div className="relative bg-gray-300 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <form onSubmit={fetchUser}>
                    <h1 className="text-2xl font-bold mb-6">Login to your account</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <Link to="#" className="text-blue-600 hover:text-blue-800 text-sm float-right mb-4">Forgot password?</Link>
                    <button
                        type="submit"
                        className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                    >
                        Login
                    </button>

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                    {user && <p className="text-green-600 mt-4">{user}</p>}

                    <p className="text-sm text-gray-600 mt-6">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
