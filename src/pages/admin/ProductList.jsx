import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, AlertCircle, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const { formatAUD } = useCurrency();

  const categories = [
    'All',
    'Metabolic Pathway Research',
    'Tissue & Cellular Research',
    'Dermal & Pigmentation Research',
    'Research Solutions'
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.set('limit', '100');
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedCollection) params.set('collection', selectedCollection);

      const response = await apiService.getProducts(params.toString());
      const result = await response.json();
      if (result.success && result.data && result.data.products) {
        setProducts(result.data.products);
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
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedStatus, selectedCollection]);

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
          <button className="bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer">
            Export
          </button>
          <Link
            to="/admin/products/import"
            className="bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer inline-flex items-center"
          >
            Import
          </Link>
          <Link
            to="/admin/products/new"
            className="bg-cta-gradient hover:bg-cta-gradient-hover text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add product</span>
          </Link>
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
        {/* Category Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-4 border-b-2 font-semibold text-[14px] whitespace-nowrap cursor-pointer transition-all ${selectedCategory === cat
                ? 'border-brand-navy text-brand-navy font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
            >
              {cat === 'All' ? 'All Products' : cat}
            </button>
          ))}
        </div>

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
            onChange={setSelectedStatus}
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
            onChange={setSelectedCollection}
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
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
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
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 pl-6">
                      <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
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
      </div>
    </div>
  );
};

export default ProductList;
