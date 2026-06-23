import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import ProductList from '../pages/admin/ProductList'
import ProductForm from '../pages/admin/ProductForm'
import AdminProductsImportPage from '../pages/admin/AdminProductsImportPage'
import OrderList from '../pages/admin/OrderList'
import CustomerList from '../pages/admin/CustomerList'
import DiscountList from '../pages/admin/DiscountList'
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard'
import CollectionList from '../pages/admin/products/CollectionList'
import InventoryList from '../pages/admin/products/InventoryList'
import CoaList from '../pages/admin/products/CoaList'
import PageList from '../pages/admin/content/PageList'
import ArticleList from '../pages/admin/content/ArticleList'
import CompoundList from '../pages/admin/content/CompoundList'
import FaqList from '../pages/admin/content/FaqList'
import ReviewList from '../pages/admin/growth/ReviewList'
import SubscriberList from '../pages/admin/growth/SubscriberList'
import AffiliateList from '../pages/admin/growth/AffiliateList'
import StoreSettings from '../pages/admin/settings/StoreSettings'
import PaymentSettings from '../pages/admin/settings/PaymentSettings'
import LegalSettings from '../pages/admin/settings/LegalSettings'
import CurrencySettings from '../pages/admin/settings/CurrencySettings'
import AdminUserList from '../pages/admin/settings/AdminUserList'
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

const AppRoutes = () => {
    return (
        <Routes>
            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Panel Dashboard (Protected Layout) */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="products/collections" element={<CollectionList />} />
                <Route path="products/inventory" element={<InventoryList />} />
                <Route path="products/import" element={<AdminProductsImportPage />} />
                <Route path="coas" element={<CoaList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="discounts" element={<DiscountList />} />
                <Route path="content/pages" element={<PageList />} />
                <Route path="content/research-library" element={<ArticleList />} />
                <Route path="content/compound-database" element={<CompoundList />} />
                <Route path="content/faq" element={<FaqList />} />
                <Route path="growth/reviews" element={<ReviewList />} />
                <Route path="growth/newsletter-restock" element={<SubscriberList />} />
                <Route path="growth/affiliates" element={<AffiliateList />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="settings/store" element={<StoreSettings />} />
                <Route path="settings/payments" element={<PaymentSettings />} />
                <Route path="settings/legal" element={<LegalSettings />} />
                <Route path="settings/currencies" element={<CurrencySettings />} />
                <Route path="settings/admin-users" element={<AdminUserList />} />
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
                <Route path="*" element={<Home />} />
            </Route>

            {/* Standalone Checkout Route (No Navbar/Footer) */}
            <Route path="/checkout" element={<Checkout />} />
        </Routes>
    )
}

export default AppRoutes