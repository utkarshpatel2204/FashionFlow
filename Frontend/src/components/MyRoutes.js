import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import MainPage from "./MainPage";
import Product from "./AddItems";
import {useState, useEffect, useContext} from "react";
import axios from "axios";

function MyRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/dashboard" element={<MainPage />} />
                <Route path="/product" element={<Product />} />
            </Routes>
        </Router>
    )
}

export default MyRoutes
