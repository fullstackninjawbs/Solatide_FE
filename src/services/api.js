const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'hub.solatidebiosciences.com.au') {
      // Replace this with your actual production API URL for the hub
      return 'https://hub.solatidebiosciences.com.au';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5001';
};

export const API_URL = getApiUrl();
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const customFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login?expired=true';
    }
  }
  return response;
};

export const apiService = {
  // Products
  getProducts: async (queryParams = '') => {
    return customFetch(`${API_URL}/api/products${queryParams ? `?${queryParams}` : ''}`);
  },
  getPublicCollections: async () => {
    return customFetch(`${API_URL}/api/products/collections`);
  },
  getProductById: async (id, options = {}) => {
    return customFetch(`${API_URL}/api/products/${id}`, options);
  },
  getProductBySlug: async (slug, options = {}) => {
    return customFetch(`${API_URL}/api/products/${slug}`, options);
  },
  // Admin-namespaced product endpoints (auth required)
  getAdminProducts: async (queryParams = '') => {
    return customFetch(`${API_URL}/api/admin/product${queryParams ? `?${queryParams}` : ''}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  uploadImage: async (formData) => {
    // Note: Do not set Content-Type header when sending FormData; the browser will set it with the boundary.
    return customFetch(`${API_URL}/api/products/upload-image`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData
    });
  },
  updateMediaAltText: async (productId, mediaId, altText) => {
    return customFetch(`${API_URL}/api/admin/product/${productId}/media/${mediaId}/alt-text`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ altText })
    });
  },
  saveAdminProduct: async (id, data) => {
    return customFetch(`${API_URL}/api/admin/product${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: data
    });
  },
  deleteAdminProduct: async (id) => {
    return customFetch(`${API_URL}/api/admin/product/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  // Tagada Sync
  getTagadaSyncHistory: async () => {
    return customFetch(`${API_URL}/api/admin/tagada/products/sync-history`, {
      method: 'GET',
      headers: { ...getAuthHeaders() }
    });
  },
  getTagadaSyncPreview: async () => {
    return customFetch(`${API_URL}/api/admin/tagada/products/sync-preview`, {
      method: 'GET',
      headers: { ...getAuthHeaders() }
    });
  },
  runTagadaSync: async () => {
    return customFetch(`${API_URL}/api/admin/tagada/products/sync`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
  },
  saveProduct: async (id, data) => {
    return customFetch(`${API_URL}/api/products${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: data
    });
  },
  deleteProduct: async (id) => {
    return customFetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  deleteAllProducts: async () => {
    return customFetch(`${API_URL}/api/products`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  previewProductsImport: async (data) => {
    return customFetch(`${API_URL}/api/products/import/preview`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: data
    });
  },
  commitProductsImport: async (data) => {
    return customFetch(`${API_URL}/api/products/import/commit`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: data
    });
  },

  // Reviews
  getProductReviews: async (productId, queryParams = '') => {
    return customFetch(`${API_URL}/api/v1/reviews/product/${productId}${queryParams ? `?${queryParams}` : ''}`);
  },
  verifyReviewEmail: async (token) => {
    return customFetch(`${API_URL}/api/v1/reviews/verify/${token}`);
  },
  submitReview: async (formData) => {
    // Note: formData should be FormData object for multipart/form-data
    return customFetch(`${API_URL}/api/v1/reviews`, {
      method: 'POST',
      body: formData
    });
  },
  getAdminReviews: async (queryParams = '') => {
    return customFetch(`${API_URL}/api/v1/reviews${queryParams ? `?${queryParams}` : ''}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  updateAdminReviewStatus: async (id, status) => {
    return customFetch(`${API_URL}/api/v1/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
  },
  deleteAdminReview: async (id) => {
    return customFetch(`${API_URL}/api/v1/reviews/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  resendVerificationEmail: async (id) => {
    return customFetch(`${API_URL}/api/v1/reviews/${id}/resend-verification`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
  },
  importAdminReviews: async (formData) => {
    return customFetch(`${API_URL}/api/v1/reviews/import`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }, // Content-Type omitted for formData
      body: formData
    });
  },

  // Checkout / Orders
  createOrder: async (data) => {
    return customFetch(`${API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  createTagadaPayment: async (data) => {
    return customFetch(`${API_URL}/api/payments/tagada/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  getOrderById: async (id) => {
    return customFetch(`${API_URL}/api/v1/orders/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  syncOrderWithTagada: async (id) => {
    return customFetch(`${API_URL}/api/payments/tagada/sync/${id}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
  },

  // Admin Settings
  getTagadaSettings: async () => {
    return customFetch(`${API_URL}/api/admin/settings/tagada`, {
      headers: { ...getAuthHeaders() }
    });
  },
  saveTagadaSettings: async (data) => {
    return customFetch(`${API_URL}/api/admin/settings/tagada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  testTagadaConnection: async (data) => {
    return customFetch(`${API_URL}/api/admin/settings/tagada/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },

  // ─── Analytics (Admin) ────────────────────────────────────────────────────────
  getAnalyticsSummary: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/orders/summary${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsOrdersByDay: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/orders/by-day${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsOrdersByStatus: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/orders/by-status${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsRevenueByProduct: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/revenue/by-product${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsTopCustomers: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/customers/top${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsOverview: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/overview${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAnalyticsAttribution: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/analytics/attribution${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Dashboard Analytics (Legacy)
  getDashboardAnalytics: async (timeFilter = 'Today') => {
    return customFetch(`${API_URL}/api/admin/dashboard?timeFilter=${encodeURIComponent(timeFilter)}`, {
      headers: { ...getAuthHeaders() }
    });
  },

  // Settings
  getStoreSettings: async () => {
    return customFetch(`${API_URL}/api/admin/settings/store`, {
      headers: { ...getAuthHeaders() }
    });
  },
  updateStoreSettings: async (data) => {
    return customFetch(`${API_URL}/api/admin/settings/store`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  // Admin Users
  getAdminUsers: async () => {
    return customFetch(`${API_URL}/api/admin/users`, {
      headers: { ...getAuthHeaders() }
    });
  },
  createAdminUser: async (data) => {
    return customFetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  updateAdminUser: async (id, data) => {
    return customFetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  deleteAdminUser: async (id) => {
    return customFetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // Auth
  adminLogin: async (data) => {
    return customFetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  adminForgotPassword: async (email) => {
    return customFetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },
  adminResetPassword: async (token, password) => {
    return customFetch(`${API_URL}/api/v1/auth/reset-password/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  },

  // Batches (Admin)
  uploadBatchCOA: async (formData) => {
    console.log("Uploading COA...");
    return customFetch(`${API_URL}/api/admin/batches/upload-coa`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }, // Content-Type omitted for formData
      body: formData
    });
  },
  getBatches: async (params) => {
    const query = params ? `?${params}` : '';
    return customFetch(`${API_URL}/api/admin/batches${query}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  getBatchById: async (id) => {
    return customFetch(`${API_URL}/api/admin/batches/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  createBatch: async (data) => {
    return customFetch(`${API_URL}/api/admin/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  updateBatch: async (id, data) => {
    return customFetch(`${API_URL}/api/admin/batches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  deleteBatch: async (id) => {
    return customFetch(`${API_URL}/api/admin/batches/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // Collections (Admin)
  getCollections: async () => {
    return customFetch(`${API_URL}/api/admin/collection`, {
      headers: { ...getAuthHeaders() }
    });
  },
  getCollectionById: async (id) => {
    return customFetch(`${API_URL}/api/admin/collection/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  createCollection: async (data) => {
    return customFetch(`${API_URL}/api/admin/collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  updateCollection: async (id, data) => {
    return customFetch(`${API_URL}/api/admin/collection/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  deleteCollection: async (id) => {
    return customFetch(`${API_URL}/api/admin/collection/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // ─── Orders (Admin) ─────────────────────────────────────────────────────────
  getAdminOrders: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/order${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  createAdminOrder: async (payload) => {
    return customFetch(`${API_URL}/api/admin/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
  },
  getAdminOrderConfig: async () => {
    return customFetch(`${API_URL}/api/admin/order/new-config`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminOrderById: async (id) => {
    return customFetch(`${API_URL}/api/admin/order/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  updateAdminOrderStatus: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/order/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  updateAdminOrder: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/order/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  refundAdminOrder: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/order/${id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  getAdminOrderRefunds: async (id) => {
    return customFetch(`${API_URL}/api/admin/order/${id}/refunds`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createAdminShipment: async (id) => {
    return customFetch(`${API_URL}/api/admin/order/${id}/shipment`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
  },

  revalidateAdminOrderAddress: async (id) => {
    return customFetch(`${API_URL}/api/admin/order/${id}/revalidate-address`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
  },

  // ─── Customers (Admin) ─────────────────────────────────────────────────────────
  getAdminCustomers: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/customer${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminCustomerById: async (id) => {
    return customFetch(`${API_URL}/api/admin/customer/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  updateAdminCustomer: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/customer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },

  // ─── Discounts (Admin) ─────────────────────────────────────────────────────────
  syncAdminDiscountsFromTagada: async () => {
    return customFetch(`${API_URL}/api/admin/discount/sync-from-tagada`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },
  getAdminDiscounts: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/discount${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminDiscountById: async (id) => {
    return customFetch(`${API_URL}/api/admin/discount/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  saveAdminDiscount: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/discount${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  deleteAdminDiscount: async (id) => {
    return customFetch(`${API_URL}/api/admin/discount/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // ─── Content / FAQs ─────────────────────────────────────────────────────────
  getPublicFaqs: async () => {
    return customFetch(`${API_URL}/api/v1/content/faqs`, {
      method: 'GET'
    });
  },
  getAdminFaqs: async () => {
    return customFetch(`${API_URL}/api/admin/content/faqs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  createAdminFaqSection: async (payload) => {
    return customFetch(`${API_URL}/api/admin/content/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  updateAdminFaqSection: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/content/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  deleteAdminFaqSection: async (id) => {
    return customFetch(`${API_URL}/api/admin/content/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // ─── Export ─────────────────────────────────────────────────────────────────
  exportAdminOrdersCsv: async () => {
    return customFetch(`${API_URL}/api/admin/order/export/csv`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // ─── Shipping Packages ──────────────────────────────────────────────────────
  getShippingPackages: async () => {
    return customFetch(`${API_URL}/api/admin/shipping/packages`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  createShippingPackage: async (payload) => {
    return customFetch(`${API_URL}/api/admin/shipping/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  updateShippingPackage: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/shipping/packages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  deleteShippingPackage: async (id) => {
    return customFetch(`${API_URL}/api/admin/shipping/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
  setDefaultShippingPackage: async (id) => {
    return customFetch(`${API_URL}/api/admin/shipping/packages/${id}/default`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  },

  // ─── Pages (Admin & Public) ────────────────────────────────────────────────
  getAdminPages: async (queryString = '') => {
    return customFetch(`${API_URL}/api/admin/content/pages${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminPageById: async (id) => {
    return customFetch(`${API_URL}/api/admin/content/pages/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  createAdminPage: async (payload) => {
    return customFetch(`${API_URL}/api/admin/content/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  updateAdminPage: async (id, payload) => {
    return customFetch(`${API_URL}/api/admin/content/pages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  },
  deleteAdminPage: async (id) => {
    return customFetch(`${API_URL}/api/admin/content/pages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
  getPublicPage: async (slug) => {
    return customFetch(`${API_URL}/api/v1/pages/${slug}`, {
      method: 'GET',
    });
  }
};
