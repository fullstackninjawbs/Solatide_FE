const fs = require('fs');
let txt = fs.readFileSync('src/services/api.js', 'utf8');

// Find the position of 'deleteCollection: async'
const splitAt = txt.indexOf('deleteCollection: async');
let clean = txt.substring(0, splitAt);

clean += `deleteCollection: async (id) => {
    return fetch(\`\${API_URL}/api/admin/collection/\${id}\`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // ─── Orders (Admin) ─────────────────────────────────────────────────────────
  getAdminOrders: async (queryString = '') => {
    return fetch(\`\${API_URL}/api/admin/order\${queryString ? \\\`?\${queryString}\\\` : ''}\`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  getAdminOrderById: async (id) => {
    return fetch(\`\${API_URL}/api/admin/order/\${id}\`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
  updateAdminOrderStatus: async (id, payload) => {
    return fetch(\`\${API_URL}/api/admin/order/\${id}/status\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
  }
};
`;

fs.writeFileSync('src/services/api.js', clean);
console.log('Fixed api.js');
