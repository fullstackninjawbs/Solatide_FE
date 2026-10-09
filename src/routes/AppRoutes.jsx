import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { trackEvent } from '../utils/analytics'
import Home from '../Redirect/home'
import Shop from '../Redirect/Shop'
import ProductDetail from '../pages/product/ProductDetail'

// Wrapper to handle Vite chunk load errors gracefully with retry before hard reloading
const lazyWithRetry = (componentImport) => {
    const LazyComp = lazy(async () => {
        try {
            const component = await componentImport();
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
            return component;
        } catch (firstError) {
            // Retry once after 300ms to absorb transient network latency
            try {
                await new Promise((res) => setTimeout(res, 300));
                const component = await componentImport();
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
                return component;
            } catch (retryError) {
                const isChunkError =
                    /Failed to fetch dynamically imported module|Loading chunk|error loading dynamically imported module/i.test(
                        retryError?.message || firstError?.message || ''
                    );

                const pageHasAlreadyBeenForceRefreshed = JSON.parse(
                    window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
                );

                // Only perform a hard reload if it's a verified chunk/module error
                // and we haven't already attempted a force refresh in this session
                if (isChunkError && !pageHasAlreadyBeenForceRefreshed) {
                    window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                    window.location.reload();
                    return new Promise(() => { });
                }

                throw retryError || firstError;
            }
        }
    });

    return (props) => (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#102a5c]" /></div>}>
            <LazyComp {...props} />
        </Suspense>
    );
};

const AdminLayout = lazyWithRetry(() => import('../layouts/AdminLayout'))

const AdminLogin = lazyWithRetry(() => import('../pages/admin/AdminLogin'))
const AdminResetPassword = lazyWithRetry(() => import('../pages/admin/AdminResetPassword'))
const Dashboard = lazyWithRetry(() => import('../pages/admin/Dashboard'))
const ProductList = lazyWithRetry(() => import('../pages/admin/ProductList'))
const ProductForm = lazyWithRetry(() => import('../pages/admin/ProductForm'))
const AdminProductsImportPage = lazyWithRetry(() => import('../pages/admin/AdminProductsImportPage'))
const TagadaSync = lazyWithRetry(() => import('../pages/admin/products/TagadaSync'))
const InventoryList = lazyWithRetry(() => import('../pages/admin/products/InventoryList'))
const BatchList = lazyWithRetry(() => import('../pages/admin/products/BatchList'))
const BatchForm = lazyWithRetry(() => import('../pages/admin/products/BatchForm'))
const CoaList = lazyWithRetry(() => import('../pages/admin/products/CoaList'))
const CollectionList = lazyWithRetry(() => import('../pages/admin/products/CollectionList'))
const CollectionForm = lazyWithRetry(() => import('../pages/admin/products/CollectionForm'))
const ReviewList = lazyWithRetry(() => import('../pages/admin/growth/ReviewList'))
const SubscriberList = lazyWithRetry(() => import('../pages/admin/growth/SubscriberList'))
const FaqList = lazyWithRetry(() => import('../pages/admin/content/FaqList'))
const AnalyticsDashboard = lazyWithRetry(() => import('../pages/admin/analytics/AnalyticsDashboard'))
const ReviewVerification = lazyWithRetry(() => import('../pages/product/ReviewVerification'))
const CoaAndTesting = lazyWithRetry(() => import('../Redirect/CoaAndTesting'))
const ConcentrationCalculator = lazyWithRetry(() => import('../Redirect/ConcentrationCalculator'))
const ContactUs = lazyWithRetry(() => import('../Redirect/ContactUs'))
const ResearchResource = lazyWithRetry(() => import('../pages/researchResource/ResearchResource'))
const Faq = lazyWithRetry(() => import('../Redirect/Faq'))
const About = lazyWithRetry(() => import('../Redirect/About'))
const ShippingPolicy = lazyWithRetry(() => import('../pages/Shipping_Policy/ShippingPolicy'))
const PrivacyPolicy = lazyWithRetry(() => import('../pages/SitePolicies/SitePolicy'))
const ViewDocument = lazyWithRetry(() => import('../Redirect/ViewDocument'))
const ResearchInsight = lazyWithRetry(() => import('../Redirect/ResearchInsight'))
const Checkout = lazyWithRetry(() => import('../pages/checkout/Checkout'))
const CheckoutSuccess = lazyWithRetry(() => import('../pages/checkout/CheckoutSuccess'))
const CheckoutFailure = lazyWithRetry(() => import('../pages/checkout/CheckoutFailure'))
const PeptidesGuide = lazyWithRetry(() => import('../pages/peptidesGuide/PeptidesGuide'))
const CompoundDatabase = lazyWithRetry(() => import('../pages/compoundDatabase/CompoundDatabase'))
const CoaReports = lazyWithRetry(() => import('../pages/coaReports/CoaReports'))
const Terms = lazyWithRetry(() => import('../pages/terms/Terms'))
const ResearchUseDisclaimer = lazyWithRetry(() => import('../pages/researchUse/ResearchUseDisclaimer'))
const Returns = lazyWithRetry(() => import('../pages/returns/Returns'))
const OrderList = lazyWithRetry(() => import('../pages/admin/OrderList'))
const CreateOrder = lazyWithRetry(() => import('../pages/admin/CreateOrder'))
const OrderDetail = lazyWithRetry(() => import('../pages/admin/OrderDetail'))
const ShippingLabels = lazyWithRetry(() => import('../pages/admin/ShippingLabels'))
const OrderStatus = lazyWithRetry(() => import('../pages/checkout/OrderStatus'))
const CustomerList = lazyWithRetry(() => import('../pages/admin/CustomerList'))
const CustomerDetail = lazyWithRetry(() => import('../pages/admin/CustomerDetail'))
const StoreSettings = lazyWithRetry(() => import('../pages/admin/settings/StoreSettings'))
const DiscountList = lazyWithRetry(() => import('../pages/admin/DiscountList'))
const DiscountForm = lazyWithRetry(() => import('../pages/admin/DiscountForm'))
const AdminUsers = lazyWithRetry(() => import('../pages/admin/settings/AdminUsers'))
const ResearchPage = lazyWithRetry(() => import('../pages/research/ResearchPage'))
const BPC157VsKPV = lazyWithRetry(() => import('../pages/research/BPC157VsKPV'))
const WhatIsTesamorelin = lazyWithRetry(() => import('../pages/research/WhatIsTesamorelin'))
const WhatIsKPV = lazyWithRetry(() => import('../pages/research/WhatIsKPV'))
const TirzepatideResearchOverview = lazyWithRetry(() => import('../pages/research/TirzepatideResearchOverview'))
const NotFound = lazyWithRetry(() => import('../pages/NotFound'))
// ─── Page View Tracker ─────────────────────────────────────────────────────────
// Fires page_view on every route change. Rendered inside BrowserRouter so
// useLocation works. Admin routes are excluded (no admin tracking).
const PageViewTracker = () => {
    const location = useLocation();
    useEffect(() => {
        // Skip admin panel pages
        if (location.pathname.startsWith('/admin')) return;
        trackEvent('page_view', { page: location.pathname, path: location.pathname });
    }, [location.pathname]);
    return null;
};

const appRole = import.meta.env.VITE_APP_ROLE || 'all';
const isStore = appRole === 'store' || appRole === 'all';
const isAdmin = appRole === 'admin' || appRole === 'all';

const AppRoutes = () => {
    return (
        <>
            <PageViewTracker />
            <Routes>
                {/* Admin Routes */}
                {isAdmin && (
                    <>
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="products/new" element={<ProductForm />} />
                            <Route path="products/edit/:id" element={<ProductForm />} />
                            <Route path="products/import" element={<AdminProductsImportPage />} />
                            <Route path="products/tagada-sync" element={<TagadaSync />} />
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
                            <Route path="orders/new" element={<CreateOrder />} />
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
                            <Route path="growth/subscribers" element={<SubscriberList />} />
                            <Route path="content/pages" element={
                                <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>}>
                                    {React.createElement(lazyWithRetry(() => import('../pages/admin/content/PageList')))}
                                </React.Suspense>
                            } />
                            <Route path="content/pages/new" element={
                                <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>}>
                                    {React.createElement(lazyWithRetry(() => import('../pages/admin/content/PageForm')))}
                                </React.Suspense>
                            } />
                            <Route path="content/pages/edit/:id" element={
                                <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>}>
                                    {React.createElement(lazyWithRetry(() => import('../pages/admin/content/PageForm')))}
                                </React.Suspense>
                            } />
                            <Route path="content/faqs" element={<FaqList />} />
                            <Route path="reviews" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Reviews Moderation (Phase 4)</div>} />
                            <Route path="cms" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Static Pages & CMS Editor (Phase 4)</div>} />
                            <Route path="settings" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">System Configuration (Phase 4)</div>} />
                            <Route path="settings/store" element={<StoreSettings />} />
                            <Route path="settings/admin-users" element={<AdminUsers />} />
                            <Route path="settings/shipping-packages" element={
                                <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>}>
                                    {React.createElement(lazyWithRetry(() => import('../pages/admin/settings/ShippingPackages')))}
                                </React.Suspense>
                            } />
                            <Route path="*" element={<div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">Coming Soon</div>} />
                        </Route>
                    </>
                )}

                {/* Client-Facing Site Routes */}
                {isStore && (
                    <>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/checkout/failure" element={<CheckoutFailure />} />
                        <Route path="/order/:orderId" element={<OrderStatus />} />
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            {/* Legacy URL Client-Side Redirects */}
                            <Route path="collections/metabolic-research" element={<Navigate to="/collections/glp-1-metabolic-peptides" replace />} />
                            <Route path="collections/repair-recovery-research" element={<Navigate to="/collections/tissue-cellular-research-peptides" replace />} />
                            <Route path="products/retatrutide-10mg-lyophilised-peptide" element={<Navigate to="/products/retatrutide-10mg" replace />} />
                            <Route path="products/retatrutide-5mg-lyophilised-peptide" element={<Navigate to="/products/retatrutide-5mg" replace />} />
                            <Route path="products/semaglutide-10mg-lyophilised-peptide" element={<Navigate to="/products/semaglutide-10mg" replace />} />
                            <Route path="products/semaglutide-5mg-lyophilised-peptide" element={<Navigate to="/products/semaglutide-5mg" replace />} />
                            <Route path="products/selank-semax-20mg" element={<Navigate to="/products/selank-10mg" replace />} />
                            <Route path="products/kpv-10mg-lyophilised-peptide" element={<Navigate to="/products/kpv-10mg" replace />} />
                            <Route path="products/mots-c-10mg-lyophilised-peptide" element={<Navigate to="/products/mots-c-10mg" replace />} />
                            <Route path="products/ss-31-elamipretide-10mg-lyophilised-peptide" element={<Navigate to="/products/ss-31-elamipretide-10mg" replace />} />
                            <Route path="privacy-policy" element={<Navigate to="/pages/privacy-policy" replace />} />
                            <Route path="contact" element={<Navigate to="/pages/contact-us" replace />} />
                            <Route path="coa" element={<Navigate to="/pages/coa" replace />} />
                            <Route path="research-insight/nnmt-article" element={<Navigate to="/pages/research-library" replace />} />
                            <Route path="cart" element={<Navigate to="/" replace />} />
                            <Route path="blogs/research-insights" element={<Navigate to="/pages/research-library" replace />} />
                            <Route path="blogs/research-insights/nnmt-inhibition-5-amino-1mq" element={<Navigate to="/pages/nnmt-inhibition-the-role-of-5-amino-1mq-in-cellular-energy-and-nad-related-pathways" replace />} />
                            <Route path="blogs/research-insights/retatrutide-vs-semaglutide-research" element={<Navigate to="/pages/retatrutide-vs-semaglutide-research" replace />} />
                            <Route path="blogs/research-insights/glp1-receptor-pathways" element={<Navigate to="/pages/glp1-receptor-pathways" replace />} />
                            <Route path="blogs/research-insights/triple-agonist-peptide-research" element={<Navigate to="/pages/triple-agonist-peptide-research" replace />} />
                            <Route path="policies/shipping-policy" element={<Navigate to="/pages/shipping-policy" replace />} />
                            <Route path="policies/refund-policy" element={<Navigate to="/pages/refund-policy" replace />} />
                            <Route path="policies/privacy-policy" element={<Navigate to="/pages/privacy-policy" replace />} />
                            <Route path="policies/terms-of-service" element={<Navigate to="/pages/terms-of-services" replace />} />
                            <Route path="collections/all" element={<Shop />} />
                            <Route path="collections/:handle" element={<Shop />} />
                            <Route path="shop" element={<Shop />} />
                            <Route path="pages/about" element={<About />} />
                            <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                            <Route path="review/verify/:token" element={<ReviewVerification />} />
                            <Route path="pages/coa-lab-testing" element={<CoaAndTesting />} />
                            <Route path="pages/concentration-calculator" element={<ConcentrationCalculator />} />
                            <Route path="pages/contact-us" element={<ContactUs />} />
                            <Route path="/ResearchPage" element={<ResearchPage />} />
                            <Route path="pages/research-library" element={<ResearchResource />} />
                            <Route path="pages/faq" element={<Faq />} />
                            <Route path="faq" element={<Faq />} />
                            <Route path="/research-insight" element={<ResearchInsight />} />
                            <Route path="pages/shipping-policy" element={<ShippingPolicy />} />
                            <Route path="/pages/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/pages/coa" element={<ViewDocument />} />

                            {/* Missing Footer Routes */}
                            <Route path="pages/research-peptides-guide" element={<PeptidesGuide />} />
                            <Route path="pages/research-compound-database" element={<CompoundDatabase />} />
                            <Route path="pages/coa" element={<CoaReports />} />
                            <Route path="pages/terms-of-services" element={<Terms />} />
                            <Route path="pages/terms" element={<Navigate to="/pages/terms-of-services" replace />} />
                            <Route path="pages/research-use-disclaimer" element={<ResearchUseDisclaimer />} />
                            <Route path="pages/refund-policy" element={<Returns />} />

                            {/* New Research Pages */}
                            {/* <Route path="pages/what-is-bpc-157" element={<WhatIsBPC157 />} /> */}
                            {/* <Route path="pages/what-is-ghk-cu" element={<WhatIsGHKCu />} /> */}
                            {/* <Route path="pages/what-is-mots-c" element={<WhatIsMOTSc />} /> */}
                            {/* <Route path="pages/what-is-selank" element={<WhatIsSelank />} /> */}
                            {/* <Route path="pages/glp-1-research-overview" element={<GLP1ResearchOverview />} /> */}
                            {/* <Route path="pages/cagrisema-vs-semaglutide" element={<CagrisemaVsSemaglutide />} /> */}
                            {/* <Route path="pages/cagrisema-vs-tirzepatide" element={<CagrisemaVsTirzepatide />} /> */}
                            {/* <Route path="pages/cagrisema-vs-retatrutide" element={<CagrisemaVsRetatrutide />} /> */}
                            {/* <Route path="pages/cjc-1295-vs-ipamorelin" element={<CJC1295VsIpamorelin />} /> */}
                            {/* <Route path="pages/cjc-1295-vs-tesamorelin" element={<CJC1295VsTesamorelin />} /> */}
                            {/* <Route path="pages/selank-vs-semax" element={<SelankVsSemax />} /> */}
                            {/* <Route path="pages/mots-c-vs-ss-31" element={<MOTScVsSS31 />} /> */}
                            <Route path="pages/bpc-157-vs-kpv" element={<BPC157VsKPV />} />
                            {/* <Route path="pages/nad-plus-vs-mots-c" element={<NADPlusVsMOTSc />} /> */}
                            {/* <Route path="pages/tesamorelin-vs-ipamorelin" element={<TesaMorelinVsIpamorelin />} /> */}
                            <Route path="pages/what-is-tesamorelin" element={<WhatIsTesamorelin />} />
                            <Route path="pages/what-is-kpv" element={<WhatIsKPV />} />
                            <Route path="pages/tirzepatide-research-overview" element={<TirzepatideResearchOverview />} />

                            {/* Custom Pages */}
                            <Route path="pages/:slug" element={
                                <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div></div>}>
                                    {React.createElement(lazyWithRetry(() => import('../pages/DynamicPage')))}
                                </React.Suspense>
                            } />

                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </>
                )}
            </Routes>
        </>
    )
}

export default AppRoutes