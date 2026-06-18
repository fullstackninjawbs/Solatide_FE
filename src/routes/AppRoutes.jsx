import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../Redirect/home'
import Shop from '../Redirect/Shop'
import ProductDetail from '../pages/product/ProductDetail'
import CoaAndTesting from '../Redirect/COAAndTesting'
import ConcentrationCalculator from '../Redirect/ConcentrationCalculator'
import ContactUs from '../Redirect/ContactUs'
import ResearchResource from '../pages/researchResource/ResearchResource'
import Faq from '../Redirect/Faq'
import About from '../Redirect/About'
import ResearchInsight from '../Redirect/ResearchInsight'
import ShippingPolicy from '../pages/Shipping_Policy/ShippingPolicy'
import PrivacyPolicy from '../pages/PrivacyPolicy/Privacy_policy'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="about" element={<About />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="coa" element={<CoaAndTesting />} />
                <Route path="calculator" element={<ConcentrationCalculator />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="research-resource" element={<ResearchResource />} />
                <Route path="resource" element={<ResearchResource />} />
                <Route path="Faq" element={<Faq />} />
                <Route path="/ResearchInsight" element={<ResearchInsight />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="privacy" element={<PrivacyPolicy />} />


                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes