export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = {
  // Products
  getProducts: async (queryParams = '') => {
    return fetch(`${API_URL}/api/products${queryParams ? `?${queryParams}` : ''}`);
  },
  getProductById: async (id, options = {}) => {
    return fetch(`${API_URL}/api/products/${id}`, options);
  },
  getProductBySlug: async (slug, options = {}) => {
    return fetch(`${API_URL}/api/products/${slug}`, options);
  },
  // Admin-namespaced product endpoints (auth required)
  getAdminProducts: async (queryParams = '') => {
    return fetch(`${API_URL}/api/admin/product${queryParams ? `?${queryParams}` : ''}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  saveAdminProduct: async (id, data) => {
    return fetch(`${API_URL}/api/admin/product${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: data
    });
  },
  deleteAdminProduct: async (id) => {
    return fetch(`${API_URL}/api/admin/product/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  saveProduct: async (id, data) => {
    return fetch(`${API_URL}/api/products${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: data
    });
  },
  deleteProduct: async (id) => {
    return fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  deleteAllProducts: async () => {
    return fetch(`${API_URL}/api/products`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },
  previewProductsImport: async (data) => {
    return fetch(`${API_URL}/api/products/import/preview`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: data
    });
  },
  commitProductsImport: async (data) => {
    return fetch(`${API_URL}/api/products/import/commit`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: data
    });
  },

  // Checkout / Orders
  createOrder: async (data) => {
    return fetch(`${API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  createTagadaPayment: async (data) => {
    return fetch(`${API_URL}/api/payments/tagada/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  getOrderById: async (id) => {
    return fetch(`${API_URL}/api/v1/orders/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },

  // Admin Settings
  getTagadaSettings: async () => {
    return fetch(`${API_URL}/api/admin/settings/tagada`, {
      headers: { ...getAuthHeaders() }
    });
  },
  saveTagadaSettings: async (data) => {
    return fetch(`${API_URL}/api/admin/settings/tagada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  testTagadaConnection: async (data) => {
    return fetch(`${API_URL}/api/admin/settings/tagada/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },

  // Auth
  adminLogin: async (data) => {
    return fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Batches (Admin)
  getBatches: async () => {
    return fetch(`${API_URL}/api/admin/batches`, {
      headers: { ...getAuthHeaders() }
    });
  },
  getBatchById: async (id) => {
    return fetch(`${API_URL}/api/admin/batches/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  createBatch: async (data) => {
    return fetch(`${API_URL}/api/admin/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  updateBatch: async (id, data) => {
    return fetch(`${API_URL}/api/admin/batches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  deleteBatch: async (id) => {
    return fetch(`${API_URL}/api/admin/batches/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // Collections (Admin)
  getCollections: async () => {
    return fetch(`${API_URL}/api/admin/collection`, {
      headers: { ...getAuthHeaders() }
    });
  },
  getCollectionById: async (id) => {
    return fetch(`${API_URL}/api/admin/collection/${id}`, {
      headers: { ...getAuthHeaders() }
    });
  },
  createCollection: async (data) => {
    return fetch(`${API_URL}/api/admin/collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  updateCollection: async (id, data) => {
    return fetch(`${API_URL}/api/admin/collection/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  deleteCollection: async (id) => {
    return fetch(`${API_URL}/api/admin/collection/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // ─── Orders (Admin) ─────────────────────────────────────────────────────────
  getAdminOrders: async (queryString = '') => {
    return fetch(`${API_URL}/api/admin/order${queryString ? \`?${queryString}\` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminOrderById: async (id) => {
    return fetch(`${API_URL}/api/admin/order/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  updateAdminOrderStatus: async (id, payload) => {
    return fetch(`${API_URL}/api/admin/order/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  }
};
