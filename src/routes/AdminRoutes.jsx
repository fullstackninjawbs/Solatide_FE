import { Routes, Route } from 'react-router-dom';
import { lazyWithRetry } from './lazyWithRetry';

// Admin panel routes. Mounted under "/admin/*" by AppRoutes and loaded as a separate chunk
// that is excluded entirely from the storefront build (VITE_APP_ROLE=store).

const AdminLayout = lazyWithRetry(() => import('../layouts/AdminLayout'));
const AdminLogin = lazyWithRetry(() => import('../pages/admin/AdminLogin'));
const AdminResetPassword = lazyWithRetry(() => import('../pages/admin/AdminResetPassword'));
const Dashboard = lazyWithRetry(() => import('../pages/admin/Dashboard'));
const ProductList = lazyWithRetry(() => import('../pages/admin/ProductList'));
const ProductForm = lazyWithRetry(() => import('../pages/admin/ProductForm'));
const AdminProductsImportPage = lazyWithRetry(() => import('../pages/admin/AdminProductsImportPage'));
const TagadaSync = lazyWithRetry(() => import('../pages/admin/products/TagadaSync'));
const InventoryList = lazyWithRetry(() => import('../pages/admin/products/InventoryList'));
const BatchList = lazyWithRetry(() => import('../pages/admin/products/BatchList'));
const BatchForm = lazyWithRetry(() => import('../pages/admin/products/BatchForm'));
const CoaList = lazyWithRetry(() => import('../pages/admin/products/CoaList'));
const CollectionList = lazyWithRetry(() => import('../pages/admin/products/CollectionList'));
const CollectionForm = lazyWithRetry(() => import('../pages/admin/products/CollectionForm'));
const ReviewList = lazyWithRetry(() => import('../pages/admin/growth/ReviewList'));
const SubscriberList = lazyWithRetry(() => import('../pages/admin/growth/SubscriberList'));
const FaqList = lazyWithRetry(() => import('../pages/admin/content/FaqList'));
const PageList = lazyWithRetry(() => import('../pages/admin/content/PageList'));
const PageForm = lazyWithRetry(() => import('../pages/admin/content/PageForm'));
const RedirectList = lazyWithRetry(() => import('../pages/admin/content/RedirectList'));
const AnalyticsDashboard = lazyWithRetry(() => import('../pages/admin/analytics/AnalyticsDashboard'));
const OrderList = lazyWithRetry(() => import('../pages/admin/OrderList'));
const CreateOrder = lazyWithRetry(() => import('../pages/admin/CreateOrder'));
const OrderDetail = lazyWithRetry(() => import('../pages/admin/OrderDetail'));
const ShippingLabels = lazyWithRetry(() => import('../pages/admin/ShippingLabels'));
const CustomerList = lazyWithRetry(() => import('../pages/admin/CustomerList'));
const CustomerDetail = lazyWithRetry(() => import('../pages/admin/CustomerDetail'));
const StoreSettings = lazyWithRetry(() => import('../pages/admin/settings/StoreSettings'));
const DiscountList = lazyWithRetry(() => import('../pages/admin/DiscountList'));
const DiscountForm = lazyWithRetry(() => import('../pages/admin/DiscountForm'));
const AdminUsers = lazyWithRetry(() => import('../pages/admin/settings/AdminUsers'));
const ShippingPackages = lazyWithRetry(() => import('../pages/admin/settings/ShippingPackages'));

const Placeholder = ({ children }) => (
    <div className="text-white text-left text-lg font-semibold bg-[#1e293b] p-8 rounded-[20px] border border-slate-800">{children}</div>
);

const AdminRoutes = () => (
    <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="reset-password/:token" element={<AdminResetPassword />} />
        <Route element={<AdminLayout />}>
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
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/new" element={<CreateOrder />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="orders/drafts" element={<Placeholder>Draft Orders (Phase 4)</Placeholder>} />
            <Route path="orders/shipping-labels" element={<ShippingLabels />} />
            <Route path="orders/abandoned" element={<Placeholder>Abandoned Checkouts (Phase 4)</Placeholder>} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="discounts" element={<DiscountList />} />
            <Route path="discounts/new" element={<DiscountForm />} />
            <Route path="discounts/edit/:id" element={<DiscountForm />} />
            <Route path="growth/reviews" element={<ReviewList />} />
            <Route path="growth/subscribers" element={<SubscriberList />} />
            <Route path="content/pages" element={<PageList />} />
            <Route path="content/pages/new" element={<PageForm />} />
            <Route path="content/pages/edit/:id" element={<PageForm />} />
            <Route path="content/faqs" element={<FaqList />} />
            <Route path="content/redirects" element={<RedirectList />} />
            <Route path="reviews" element={<Placeholder>Reviews Moderation (Phase 4)</Placeholder>} />
            <Route path="cms" element={<Placeholder>Static Pages &amp; CMS Editor (Phase 4)</Placeholder>} />
            <Route path="settings" element={<Placeholder>System Configuration (Phase 4)</Placeholder>} />
            <Route path="settings/store" element={<StoreSettings />} />
            <Route path="settings/admin-users" element={<AdminUsers />} />
            <Route path="settings/shipping-packages" element={<ShippingPackages />} />
            <Route path="*" element={<Placeholder>Coming Soon</Placeholder>} />
        </Route>
    </Routes>
);

export default AdminRoutes;
