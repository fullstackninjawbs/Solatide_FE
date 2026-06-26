import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import ProductList from '../pages/admin/ProductList'
import ProductForm from '../pages/admin/ProductForm'
import AdminProductsImportPage from '../pages/admin/AdminProductsImportPage'
import BatchList from '../pages/admin/products/BatchList'
import BatchForm from '../pages/admin/products/BatchForm'
import Home from '../Redirect/home'
import Shop from '../Redirect/Shop'
import ProductDetail from '../pages/product/ProductDetail'
import CoaAndTesting from '../Redirect/COAAndTesting'
import ConcentrationCalculator from '../Redirect/ConcentrationCalculator'
import ContactUs from '../Redirect/ContactUs'
import ResearchResource from '../pages/researchResource/ResearchResource'
import Faq from '../Redirect/Faq'
import About from '../Redirect/About'
import ShippingPolicy from '../pages/Shipping_Policy/ShippingPolicy'
import PrivacyPolicy from '../pages/PrivacyPolicy/Privacy_policy'
import ViewDocument from '../Redirect/ViewDocument'
import AffiliatePro from '../Redirect/AffiliatePro'
import ResearchInsight from '../Redirect/ResearchInsight'
import Checkout from '../pages/checkout/Checkout'
import CheckoutSuccess from '../pages/checkout/CheckoutSuccess'
import CheckoutFailure from '../pages/checkout/CheckoutFailure'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Checkout Routes (standalone — no MainLayout header/footer) */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failure" element={<CheckoutFailure />} />

            {/* Admin Panel Dashboard (Protected Layout) */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="products/import" element={<AdminProductsImportPage />} />
                <Route path="batches" element={<BatchList />} />
                <Route path="batches/new" element={<BatchForm />} />
                <Route path="batches/:id/edit" element={<BatchForm />} />
                <Route path="coas" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">COA Batch Management (Phase 4)</div>} />
                <Route path="orders" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Orders Management (Phase 4)</div>} />
                <Route path="customers" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Customers Account Profiles (Phase 4)</div>} />
                <Route path="reviews" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Reviews Moderation (Phase 4)</div>} />
                <Route path="cms" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Static Pages & CMS Editor (Phase 4)</div>} />
                <Route path="affiliates" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Affiliates Program (Phase 4)</div>} />
                <Route path="settings" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">System Configuration (Phase 4)</div>} />
            </Route>

            {/* Client-Facing Site Routes */}
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
                <Route path="faq" element={<Faq />} />
                <Route path="/research-insight" element={<ResearchInsight />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="/view-document" element={<ViewDocument />} />
                <Route path="/affiliate-pro" element={<AffiliatePro />} />

                {/* Missing Footer Routes */}
                <Route path="peptides-guide" element={<div className="min-h-screen pt-32 pb-16 px-4 bg-[#f8fafc] text-center text-2xl font-bold">Research Peptides Guide (Coming Soon)</div>} />
                <Route path="compound-database" element={<div className="min-h-screen pt-32 pb-16 px-4 bg-[#f8fafc] text-center text-2xl font-bold">Research Compound Database (Coming Soon)</div>} />
                <Route path="coa-reports" element={<div className="min-h-screen pt-32 pb-16 px-4 bg-[#f8fafc] text-center text-2xl font-bold">COA Reports (Coming Soon)</div>} />
                <Route path="terms" element={<div className="min-h-screen pt-32 pb-16 px-4 bg-[#f8fafc] text-center text-2xl font-bold">Terms of Services (Coming Soon)</div>} />
                <Route path="returns" element={<div className="min-h-screen pt-32 pb-16 px-4 bg-[#f8fafc] text-center text-2xl font-bold">Returns & Refunds (Coming Soon)</div>} />

                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes