import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'

const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const ProductList = lazy(() => import('../pages/admin/ProductList'))
const ProductForm = lazy(() => import('../pages/admin/ProductForm'))
const AdminProductsImportPage = lazy(() => import('../pages/admin/AdminProductsImportPage'))
const InventoryList = lazy(() => import('../pages/admin/products/InventoryList'))
const BatchList = lazy(() => import('../pages/admin/products/BatchList'))
const BatchForm = lazy(() => import('../pages/admin/products/BatchForm'))
const CoaList = lazy(() => import('../pages/admin/products/CoaList'))
const CollectionList = lazy(() => import('../pages/admin/products/CollectionList'))
const CollectionForm = lazy(() => import('../pages/admin/products/CollectionForm'))
const ReviewList = lazy(() => import('../pages/admin/growth/ReviewList'))
const FaqList = lazy(() => import('../pages/admin/content/FaqList'))
const AnalyticsDashboard = lazy(() => import('../pages/admin/analytics/AnalyticsDashboard'))
const Home = lazy(() => import('../Redirect/home'))
const Shop = lazy(() => import('../Redirect/Shop'))
const ProductDetail = lazy(() => import('../pages/product/ProductDetail'))
const ReviewVerification = lazy(() => import('../pages/product/ReviewVerification'))
const CoaAndTesting = lazy(() => import('../Redirect/CoaAndTesting'))
const ConcentrationCalculator = lazy(() => import('../Redirect/ConcentrationCalculator'))
const ContactUs = lazy(() => import('../Redirect/ContactUs'))
const ResearchResource = lazy(() => import('../pages/researchResource/ResearchResource'))
const Faq = lazy(() => import('../Redirect/Faq'))
const About = lazy(() => import('../Redirect/About'))
const ShippingPolicy = lazy(() => import('../pages/Shipping_Policy/ShippingPolicy'))
const PrivacyPolicy = lazy(() => import('../pages/SitePolicies/SitePolicy'))
const ViewDocument = lazy(() => import('../Redirect/ViewDocument'))
const AffiliatePro = lazy(() => import('../Redirect/AffiliatePro'))
const ResearchInsight = lazy(() => import('../Redirect/ResearchInsight'))
const Checkout = lazy(() => import('../pages/checkout/Checkout'))
const PeptidesGuide = lazy(() => import('../pages/peptidesGuide/PeptidesGuide'))
const CompoundDatabase = lazy(() => import('../pages/compoundDatabase/CompoundDatabase'))
const CoaReports = lazy(() => import('../pages/coaReports/CoaReports'))
const Terms = lazy(() => import('../pages/terms/Terms'))
const ResearchUseDisclaimer = lazy(() => import('../pages/researchUse/ResearchUseDisclaimer'))
const Returns = lazy(() => import('../pages/returns/Returns'))
const CheckoutSuccess = lazy(() => import('../pages/checkout/CheckoutSuccess'))
const CheckoutFailure = lazy(() => import('../pages/checkout/CheckoutFailure'))
const OrderList = lazy(() => import('../pages/admin/OrderList'))
const OrderDetail = lazy(() => import('../pages/admin/OrderDetail'))
const ShippingLabels = lazy(() => import('../pages/admin/ShippingLabels'))
const OrderStatus = lazy(() => import('../pages/checkout/OrderStatus'))
const CustomerList = lazy(() => import('../pages/admin/CustomerList'))
const CustomerDetail = lazy(() => import('../pages/admin/CustomerDetail'))
const StoreSettings = lazy(() => import('../pages/admin/settings/StoreSettings'))
const DiscountList = lazy(() => import('../pages/admin/DiscountList'))
const DiscountForm = lazy(() => import('../pages/admin/DiscountForm'))
const AdminUsers = lazy(() => import('../pages/admin/settings/AdminUsers'))

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#102a5c]" /></div>}>
            <Routes>
                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/failure" element={<CheckoutFailure />} />
                <Route path="/order/:orderId" element={<OrderStatus />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="products/import" element={<AdminProductsImportPage />} />
                    <Route path="products/inventory" element={<InventoryList />} />
                    <Route path="products/collections" element={<CollectionList />} />
                    <Route path="products/collections/new" element={<CollectionForm />} />
                    <Route path="products/collections/edit/:id" element={<CollectionForm />} />
                    <Route path="batches" element={<BatchList />} />
                    <Route path="batches/new" element={<BatchForm />} />
                    <Route path="batches/:id/edit" element={<BatchForm />} />
                    <Route path="coas" element={<CoaList />} />

                    <Route path="analytics" element={
                        <React.Suspense fallback={
                            <div className="flex h-screen items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
                            </div>
                        }>
                            <AnalyticsDashboard />
                        </React.Suspense>
                    } />

                    <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="orders/drafts" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Draft Orders (Phase 4)</div>} />
                    <Route path="orders/shipping-labels" element={<ShippingLabels />} />
                    <Route path="orders/abandoned" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Abandoned Checkouts (Phase 4)</div>} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="customers/:id" element={<CustomerDetail />} />
                    <Route path="discounts" element={<DiscountList />} />
                    <Route path="discounts/new" element={<DiscountForm />} />
                    <Route path="discounts/edit/:id" element={<DiscountForm />} />
                    <Route path="growth/reviews" element={<ReviewList />} />
                    <Route path="content/faqs" element={<FaqList />} />
                    <Route path="reviews" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Reviews Moderation (Phase 4)</div>} />
                    <Route path="cms" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Static Pages & CMS Editor (Phase 4)</div>} />
                    <Route path="affiliates" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Affiliates Program (Phase 4)</div>} />
                    <Route path="settings" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">System Configuration (Phase 4)</div>} />
                    <Route path="settings/store" element={<StoreSettings />} />
                    <Route path="settings/admin-users" element={<AdminUsers />} />
                    <Route path="*" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Coming Soon</div>} />
                </Route>

                {/* Client-Facing Site Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="about" element={<About />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="review/verify/:token" element={<ReviewVerification />} />
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
                    <Route path="peptides-guide" element={<PeptidesGuide />} />
                    <Route path="compound-database" element={<CompoundDatabase />} />
                    <Route path="coa-reports" element={<CoaReports />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="research-use" element={<ResearchUseDisclaimer />} />
                    <Route path="returns" element={<Returns />} />
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes