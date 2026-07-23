import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, AlertCircle, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import Pagination from '../../components/Pagination';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const selectedStatus = searchParams.get('status') || 'all';
  const selectedCollection = searchParams.get('collection') || '';
  const urlQ = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState(urlQ);

  const [collectionsList, setCollectionsList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSelectionDropdownOpen, setIsSelectionDropdownOpen] = useState(false);
  const selectionDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { formatAUD } = useCurrency();
  const debounceRef = useRef(null);

  // Sync search input with URL changes (back/forward)
  useEffect(() => {
    setSearchQuery(urlQ);
  }, [urlQ]);

  // Debounce search query and sync with URL
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (searchQuery === currentQ) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        nextParams.set('q', searchQuery.trim());
      } else {
        nextParams.delete('q');
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchParams, setSearchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (urlQ) params.set('search', urlQ);
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedCollection) params.set('collection', selectedCollection);

      const response = await apiService.getProducts(params.toString());
      const result = await response.json();
      if (result.success && result.data && result.data.products) {
        setProducts(result.data.products);
        setTotal(result.total ?? result.data.pagination?.total ?? 0);
      } else {
        setError('Failed to parse catalog products.');
      }
    } catch (err) {
      setError('Could not connect to the API server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await apiService.getCollections();
      const data = await res.json();
      if (data.success && data.data) setCollectionsList(data.data);
    } catch (err) {
      console.error('Failed to load collections', err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectionDropdownRef.current && !selectionDropdownRef.current.contains(event.target)) {
        setIsSelectionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
    setSelectedProducts([]);
  }, [page, limit, selectedStatus, selectedCollection, urlQ]);

  const handleStatusChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('status', val);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleCollectionChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('collection', val);
    } else {
      nextParams.delete('collection');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the product "${name}"?`)) {
      return;
    }

    try {
      const response = await apiService.deleteProduct(id);
      if (response.ok || response.status === 204) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete the product.');
      }
    } catch (err) {
      alert('Network error deleting product.');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(`Are you absolutely sure you want to delete ALL products? This action cannot be undone!`)) {
      return;
    }

    try {
      const response = await apiService.deleteAllProducts();
      if (response.ok || response.status === 200) {
        setProducts([]);
        alert('All products deleted successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete all products.');
      }
    } catch (err) {
      alert('Network error deleting products.');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Products</h2>
          <p className="text-slate-500 text-[14px]">Manage your catalog, stock quantities, and research listings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDeleteAll}
            className="hidden bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </button>
          <AdminSecondaryButton>
            Export
          </AdminSecondaryButton>
          <AdminSecondaryButton to="/admin/products/import">
            Import
          </AdminSecondaryButton>
          <AdminPrimaryButton to="/admin/products/new">
            <Plus className="h-4 w-4" />
            <span>Add product</span>
          </AdminPrimaryButton>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-650 text-[14px] flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Table Container */}
      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">


        {/* Search + Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
            />
          </div>
          {/* Status Filter */}
          <CustomDropdown
            value={selectedStatus}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' }
            ]}
          />
          {/* Collection Filter */}
          <CustomDropdown
            value={selectedCollection}
            onChange={handleCollectionChange}
            placeholder="All Collections"
            align="right"
            options={[
              { value: '', label: 'All Collections' },
              ...collectionsList.map(col => ({ value: col._id, label: col.name }))
            ]}
          />
        </div>

        {/* Table list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
            <p className="text-[14px] font-medium">Loading catalog...</p>
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
                {selectedProducts.length > 0 ? (
                  <tr className="border-b border-slate-200 bg-white shadow-sm text-[14px]">
                    <th className="py-3 pl-6 w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.length === products.length && products.length > 0} 
                        onChange={handleSelectAll} 
                        className="rounded border-slate-700 bg-slate-700 text-white cursor-pointer accent-slate-800 h-4 w-4" 
                      />
                    </th>
                    <th colSpan="9" className="py-3 pl-2 pr-6 font-normal">
                      <div className="flex items-center gap-3">
                        <div className="relative" ref={selectionDropdownRef}>
                          <button 
                            onClick={() => setIsSelectionDropdownOpen(!isSelectionDropdownOpen)}
                            className="font-semibold text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            {selectedProducts.length} selected 
                            <ChevronDown className="h-4 w-4 ml-1 text-slate-500" />
                          </button>
                          {isSelectionDropdownOpen && (
                            <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 w-40 z-20 overflow-hidden">
                              <button 
                                onClick={() => {
                                  setSelectedProducts([]);
                                  setIsSelectionDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                              >
                                Unselect all
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <AdminSecondaryButton className="!py-1.5 !px-3.5 !text-[13px]">Set as active</AdminSecondaryButton>
                          <AdminSecondaryButton className="!py-1.5 !px-3.5 !text-[13px]">Set as draft</AdminSecondaryButton>
                        </div>
                      </div>
                    </th>
                  </tr>
                ) : (
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-4 pl-6 w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-350 cursor-pointer h-4 w-4" 
                      />
                    </th>
                    <th className="py-4 pl-2 pr-8">Product</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Inventory</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">Research Focus</th>
                    <th className="py-4">Channels</th>
                    <th className="py-4">Product type</th>
                    <th className="py-4">Vendor</th>
                    <th className="py-4 pr-6 text-right w-24">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 pl-6">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className={`rounded cursor-pointer h-4 w-4 ${selectedProducts.includes(product._id) ? 'accent-slate-800' : 'border-slate-350'}`} 
                      />
                    </td>
                    <td className="py-3.5 pl-2 pr-8 font-semibold text-slate-700 max-w-[300px]">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-150 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={product.images?.[0]?.url || product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="hover:text-brand-blue transition-colors text-slate-700 whitespace-normal break-words line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${(product.publishStatus || (product.published !== false ? 'active' : 'draft')) === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : (product.publishStatus === 'archived')
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-slate-100 text-slate-650 border border-slate-200'
                        }`}>
                        {product.publishStatus === 'archived' ? 'Archived' : product.publishStatus === 'draft' || product.published === false ? 'Draft' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`font-semibold ${product.stockQuantity <= 0
                        ? 'text-red-500'
                        : product.stockQuantity <= product.lowStockThreshold
                          ? 'text-amber-600'
                          : 'text-slate-650'
                        }`}>
                        {product.stockQuantity !== undefined ? `${product.stockQuantity} in stock` : '0 in stock'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {product.category?.includes(' > ') ? product.category.split(' > ').pop() : (product.category || 'Uncategorized')}
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">
                      {product.researchCategory === 'metabolic-pathway' ? 'Metabolic Pathway' :
                       product.researchCategory === 'tissue-cellular' ? 'Tissue & Cellular' :
                       product.researchCategory === 'dermal-pigmentation' ? 'Dermal & Pigmentation' :
                       product.researchCategory === 'laboratory-support' ? 'Laboratory Support' : 
                       'None'}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-700">2</td>
                    <td className="py-3.5 text-slate-600">{product.productType || 'Research Peptides'}</td>
                    <td className="py-3.5 text-slate-500">{product.vendor || 'Solatide Biosciences'}</td>
                    <td className="py-3.5 pr-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="text-brand-blue hover:text-blue-800 font-semibold text-[13px]"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-red-500 hover:text-red-700 font-semibold text-[13px] cursor-pointer focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
