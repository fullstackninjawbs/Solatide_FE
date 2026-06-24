export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
  }
};
