import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../Redirect/home'
import AboutUs from '../pages/AboutUs'
import Shop from '../Redirect/Shop'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes