import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Product from "./Product";
import {useState, useEffect, useContext} from "react";
import axios from "axios";

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/product" element={<Product />} />
            </Routes>
        </Router>
    )
}

export default Main
