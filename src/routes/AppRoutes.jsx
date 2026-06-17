import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../Redirect/home'
import Shop from '../Redirect/Shop'
import ProductDetail from '../pages/product/ProductDetail'
import CoaAndTesting from '../Redirect/COAAndTesting'
import ConcentrationCalculator from '../Redirect/ConcentrationCalculator'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="coa" element={<CoaAndTesting />} />
                <Route path="calculator" element={<ConcentrationCalculator />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes