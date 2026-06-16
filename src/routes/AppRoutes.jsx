import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import AboutUs from '../pages/AboutUs'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes