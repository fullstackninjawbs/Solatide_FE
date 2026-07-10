import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Check, Save } from 'lucide-react';
import { apiService } from '../../../services/api';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline editing state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editAction, setEditAction] = useState('Set to');

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (searchQuery) params.set('search', searchQuery);

      const response = await apiService.getProducts(params.toString());
      const result = await response.json();
      if (result.success && result.data && result.data.products) {
        setProducts(result.data.products);
      } else {
        setError('Failed to fetch inventory.');
      }
    } catch (err) {
      setError('Could not connect to the API server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditQuantity(product.stockQuantity || 0);
    setEditAction('Set to');
  };

  const handleSaveInventory = async (product) => {
    try {
      const currentQty = product.stockQuantity || 0;
      let newQty = parseInt(editQuantity, 10);
      if (isNaN(newQty)) return;

      if (editAction === 'Add') {
        newQty = currentQty + newQty;
      }

      const payload = {
        stockQuantity: newQty,
        inStock: newQty > 0
      };

      const response = await apiService.saveProduct(product._id, JSON.stringify(payload));
      const result = await response.json();

      if (result.success) {
        setProducts(products.map(p => p._id === product._id ? { ...p, stockQuantity: newQty, inStock: newQty > 0 } : p));
        setEditingProductId(null);
      } else {
        alert('Failed to update inventory');
      }
    } catch (err) {
      console.error('Error saving inventory:', err);
      alert('An error occurred while saving.');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Inventory</h2>
          <p className="text-slate-500 text-[14px]">Manage your product stock levels and allocations.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
          {error}
        </div>
      )}

      {/* Filter and Table Container */}
      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] min-h-[500px]">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
            />
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
            <p className="text-[14px] font-medium">Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
            <p className="text-[15px] font-semibold text-slate-650">No products found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">

                  <th className="py-4 pl-2 pr-8 min-w-[240px]">Product</th>
                  <th className="py-4 px-4 whitespace-nowrap">SKU</th>
                  <th className="py-4 px-4 text-center">Unavailable</th>
                  <th className="py-4 px-4 text-center">Committed</th>
                  <th className="py-4 px-4 text-center">Available</th>
                  <th className="py-4 px-4 text-center">On hand</th>
                  <th className="py-4 pr-6 text-center">Incoming</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/60 transition-colors group relative">

                    <td className="py-3.5 pl-2 pr-8 font-semibold text-slate-700 max-w-[300px]">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-150 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={product.images?.[0]?.url || product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <Link to={`/admin/products/edit/${product._id}`} className="truncate hover:text-brand-blue hover:underline transition-colors block leading-tight">
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {product.sku || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-center font-medium">0</td>
                    <td className="py-3.5 px-4 text-slate-500 text-center font-medium">0</td>

                    {/* Available Column - Interactive */}
                    <td className="py-3.5 px-4 text-center relative">
                      {editingProductId === product._id ? (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20 flex items-center gap-2 bg-white shadow-[0_5px_25px_-5px_rgba(0,0,0,0.15)] border border-slate-200 rounded-xl px-3 py-2 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-9 shadow-sm hover:border-slate-400 transition-colors">
                            <select
                              value={editAction}
                              onChange={(e) => setEditAction(e.target.value)}
                              className="bg-slate-50 pl-2 pr-1 py-1 h-full text-[13px] font-medium border-r border-slate-300 outline-none text-slate-700 cursor-pointer hover:bg-slate-100"
                            >
                              <option value="Set to">Set to</option>
                              <option value="Add">Add</option>
                            </select>
                            <input
                              type="number"
                              className="w-16 px-2 py-1 h-full outline-none text-[13px] text-center font-semibold text-slate-800"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              autoFocus
                            />
                          </div>

                          <select className="bg-white border border-slate-300 shadow-sm rounded-lg px-2 h-9 text-[13px] font-medium outline-none text-slate-700 w-36 hover:border-slate-400 transition-colors cursor-pointer">
                            <option>Shop location</option>
                            <option disabled>Damaged (Unavailable)</option>
                            <option disabled>Quality control (Unavailable)</option>
                            <option disabled>Safety stock (Unavailable)</option>
                            <option disabled>Other (Unavailable)</option>
                          </select>

                          <div className="flex items-center gap-1.5 ml-1">
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="h-9 w-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                              title="Cancel"
                            >
                              <span className="text-[16px] leading-none mb-0.5">&times;</span>
                            </button>
                            <button
                              onClick={() => handleSaveInventory(product)}
                              className="h-9 w-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#102a5c] hover:border-[#102a5c] hover:bg-blue-50/30 transition-all shadow-sm"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/80 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all inline-block min-w-[3rem]"
                          onClick={() => handleEditClick(product)}
                          title="Click to edit inventory"
                        >
                          {product.stockQuantity || 0}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-center font-semibold">
                      {product.stockQuantity || 0}
                    </td>
                    <td className="py-3.5 pr-6 text-slate-500 text-center font-medium">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
