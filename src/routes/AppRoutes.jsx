import { useEffect } from 'react'
import { Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { trackEvent } from '../utils/analytics'
import { lazyWithRetry } from './lazyWithRetry'

// ─── Storefront pages: imported EAGERLY ────────────────────────────────────────
// These routes are prerendered and hydrated with hydrateRoot. They must not sit behind
// React.lazy/Suspense: the chunk would not be loaded at hydration time and the prerendered
// HTML has no Suspense boundary markers, so React would discard the whole DOM.
import Home from '../Redirect/home'
import Shop from '../Redirect/Shop'
import ProductDetail from '../pages/product/ProductDetail'
import ConcentrationCalculator from '../Redirect/ConcentrationCalculator'
import Faq from '../Redirect/Faq'
import About from '../Redirect/About'
import ShippingPolicy from '../pages/Shipping_Policy/ShippingPolicy'
import PrivacyPolicy from '../pages/SitePolicies/SitePolicy'
import ViewDocument from '../Redirect/ViewDocument'
import Terms from '../pages/terms/Terms'
import Returns from '../pages/returns/Returns'
import DynamicPage from '../pages/DynamicPage'
import NotFound from '../pages/NotFound'

// ─── Never-prerendered storefront routes (served as an empty SPA shell → createRoot) ──
const ReviewVerification = lazyWithRetry(() => import('../pages/product/ReviewVerification'))
const Checkout = lazyWithRetry(() => import('../pages/checkout/Checkout'))
const CheckoutSuccess = lazyWithRetry(() => import('../pages/checkout/CheckoutSuccess'))
const CheckoutFailure = lazyWithRetry(() => import('../pages/checkout/CheckoutFailure'))
const BankPayment = lazyWithRetry(() => import('../pages/checkout/BankPayment'))
const OrderStatus = lazyWithRetry(() => import('../pages/checkout/OrderStatus'))

// ─── Admin: build-time switch ──────────────────────────────────────────────────
// Vite inlines import.meta.env.VITE_APP_ROLE, so for the storefront build the condition is a
// constant and Rollup drops the dynamic import: no admin chunk is emitted into dist-store.
const AdminRoutes = import.meta.env.VITE_APP_ROLE === 'store'
    ? null
    : lazyWithRetry(() => import('./AdminRoutes'))

const appRole = import.meta.env.VITE_APP_ROLE || 'all';
const isStore = appRole === 'store' || appRole === 'all';

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

// Legacy /product/:id → canonical /products/:id (nginx also 301s server-side).
const LegacyProductRedirect = () => {
    const { id } = useParams();
    return <Navigate to={`/products/${id}`} replace />;
};

const AppRoutes = () => {
    return (
        <>
            <PageViewTracker />
            <Routes>
                {/* Admin panel — its own lazy chunk and Suspense boundary, never wraps storefront routes */}
                {AdminRoutes && <Route path="/admin/*" element={<AdminRoutes />} />}

                {/* Client-Facing Site Routes */}
                {isStore && (
                    <>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/checkout/failure" element={<CheckoutFailure />} />
                        <Route path="/checkout/payment/:orderId" element={<BankPayment />} />
                        <Route path="/order/:orderId" element={<OrderStatus />} />
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            {/* Legacy URL Client-Side Redirects (nginx 301s these server-side) */}
                            <Route path="collections/research-grade-peptides" element={<Navigate to="/collections/all" replace />} />
                            <Route path="collections/frontpage" element={<Navigate to="/collections/all" replace />} />
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
                            {/* Dead SPA-only routes (M-22) → canonical URLs (nginx 301s these server-side) */}
                            <Route path="shop" element={<Navigate to="/collections/all" replace />} />
                            <Route path="faq" element={<Navigate to="/pages/faq" replace />} />
                            <Route path="ResearchPage" element={<Navigate to="/pages/research-library" replace />} />
                            <Route path="research-insight" element={<Navigate to="/pages/research-library" replace />} />
                            <Route path="product/:id" element={<LegacyProductRedirect />} />
                            <Route path="pages/terms" element={<Navigate to="/pages/terms-of-services" replace />} />
                            <Route path="pages/data-sharing-opt-out-1" element={<Navigate to="/pages/data-sharing-opt-out" replace />} />

                            <Route path="collections/all" element={<Shop />} />
                            <Route path="collections/:handle" element={<Shop />} />
                            <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="review/verify/:token" element={<ReviewVerification />} />
                            <Route path="pages/about" element={<About />} />
                            <Route path="pages/concentration-calculator" element={<ConcentrationCalculator />} />
                            <Route path="pages/faq" element={<Faq />} />
                            <Route path="pages/shipping-policy" element={<ShippingPolicy />} />
                            <Route path="pages/privacy-policy" element={<PrivacyPolicy />} />
                            {/* /pages/coa renders the COA library (CertificatesAnalysis) — the live page */}
                            <Route path="pages/coa" element={<ViewDocument />} />
                            <Route path="pages/terms-of-services" element={<Terms />} />
                            <Route path="pages/refund-policy" element={<Returns />} />

                            {/* CMS pages */}
                            <Route path="pages/:slug" element={<DynamicPage />} />

                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </>
                )}
            </Routes>
        </>
    )
}

export default AppRoutes
