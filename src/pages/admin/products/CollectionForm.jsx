import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Upload, Layers } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { apiService } from '../../../services/api';
import JoditEditor from 'jodit-react';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../../components/admin/AdminSecondaryButton';

const CollectionForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductSearchDropdown, setShowProductSearchDropdown] = useState(false);

  // Collection State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bannerImage: '',
    status: 'active',
    type: 'manual',
    sortOrder: 0,
    displayOptions: {
      showFaqBlock: false
    },
    products: [],
    publishing: ['online_store'],
    themeTemplate: 'default'
  });

  const [initialDescription, setInitialDescription] = useState('');

  // Jodit Editor Config
  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Describe the collection products and general info...',
    height: 300,
    hidePoweredByJodit: true,
    buttons: [
      'paragraph', '|',
      'bold', 'italic', 'underline', 'brush', '|',
      'align', '|',
      'link', 'image', 'table', '|',
      'dots', '|',
      'source'
    ],
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html'
  }), []);

  const memoizedEditor = useMemo(() => {
    return (
      <div className="border border-slate-200 rounded-b-xl overflow-hidden">
        <JoditEditor
          value={initialDescription}
          config={joditConfig}
          tabIndex={1}
          onBlur={newContent => setFormData(prev => ({ ...prev, description: newContent }))}
          onChange={newContent => {
            setFormData(prev => {
              if (prev.description === newContent) return prev;
              return { ...prev, description: newContent };
            });
          }}
        />
      </div>
    );
  }, [initialDescription, joditConfig]);

  // Fetch collections and product catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiService.getProducts('limit=1000');
        const result = await res.json();
        if (result.success && result.data && result.data.products) {
          setProductsCatalog(result.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products catalog', err);
      }
    };
    fetchCatalog();

    if (isEditMode) {
      const fetchCollection = async () => {
        try {
          setFetching(true);
          const res = await apiService.getCollectionById(id);
          const result = await res.json();
          if (result.success && result.data) {
            const { collection, products } = result.data;
            setFormData({
              name: collection.name || '',
              slug: collection.slug || '',
              description: collection.description || '',
              bannerImage: collection.bannerImage || '',
              status: collection.status || 'active',
              type: 'manual',
              sortOrder: collection.sortOrder || 0,
              displayOptions: collection.displayOptions || { showFaqBlock: false },
              products: products || [],
              publishing: collection.publishing || ['online_store'],
              themeTemplate: collection.themeTemplate || 'default'
            });
            setInitialDescription(collection.description || '');
          } else {
            setError('Failed to fetch collection details.');
          }
        } catch (err) {
          setError('Error connecting to server.');
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchCollection();
    }
  }, [id, isEditMode]);

  // Manual Mode: Products selection helpers
  const handleAddProduct = (product) => {
    if (formData.products.some(p => p._id === product._id)) {
      alert('Product is already in this collection.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, product]
    }));
    setProductSearch('');
    setShowProductSearchDropdown(false);
  };

  const handleRemoveProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => (p._id || p) !== productId)
    }));
  };

  // Filter product catalog by search input
  const filteredSearchProducts = useMemo(() => {
    if (!productSearch) return [];
    return productsCatalog.filter(p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
    );
  }, [productSearch, productsCatalog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'solatide_preset');

      const response = await fetch('https://api.cloudinary.com/v1_1/dqwpt5h6a/image/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (response.ok && data.secure_url) {
        setFormData(prev => ({ ...prev, bannerImage: data.secure_url }));
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const updateRule = (index, key, value) => {
    const newRules = [...formData.rules];
    const updatedRule = { ...newRules[index], [key]: value };
    
    // Automatically reset operator to a sensible default when switching between string/number fields
    if (key === 'field' && newRules[index].field !== value) {
      if (['Price', 'Compare at price', 'Weight', 'Inventory stock'].includes(value)) {
        updatedRule.operator = 'Is greater than';
      } else {
        updatedRule.operator = 'Contains';
      }
    }
    
    newRules[index] = updatedRule;
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description,
        bannerImage: formData.bannerImage,
        status: formData.status,
        type: 'manual',
        sortOrder: Number(formData.sortOrder) || 0,
        displayOptions: formData.displayOptions,
        products: formData.products.map(p => p._id || p),
        publishing: formData.publishing,
        themeTemplate: formData.themeTemplate
      };

      let response;
      if (isEditMode) {
        response = await apiService.updateCollection(id, payload);
      } else {
        response = await apiService.createCollection(payload);
      }

      const result = await response.json();
      if (response.ok || result.success) {
        navigate('/admin/products/collections');
      } else {
        setError(result.message || 'Failed to save collection.');
      }
    } catch (err) {
      setError('A network error occurred while saving the collection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
        <p className="text-[14px] font-medium">Fetching collection details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/collections"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              {isEditMode ? formData.name : 'Create Collection'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <AdminSecondaryButton to="/admin/products/collections">
            Cancel
          </AdminSecondaryButton>
          <AdminPrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </AdminPrimaryButton>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[14px] flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Main Form Content) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title and Description Card */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-[13.5px] font-medium text-slate-700 mb-1.5">
                Title
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Research-Grade Peptides"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue transition-colors text-[14px]"
                required
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <div className="focus-within:ring-1 focus-within:ring-brand-blue rounded-xl transition-all">
                {memoizedEditor}
              </div>
            </div>
          </div>

          {/* Products List Card */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-850">Products</h3>
              <CustomDropdown
                value="best_selling"
                onChange={() => { }}
                className="w-48 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] cursor-pointer"
                options={[
                  { value: 'best_selling', label: 'Sort: Best selling' },
                  { value: 'title_asc', label: 'Sort: Title A-Z' },
                  { value: 'title_desc', label: 'Sort: Title Z-A' },
                  { value: 'price_asc', label: 'Sort: Price low to high' },
                  { value: 'price_desc', label: 'Sort: Price high to low' }
                ]}
              />
            </div>

            <div className="relative z-20">
              <input
                type="text"
                placeholder="Search products to add..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductSearchDropdown(true);
                }}
                onFocus={() => setShowProductSearchDropdown(true)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue transition-colors text-[14px]"
              />
              
              {/* Search Results Dropdown */}
              {showProductSearchDropdown && productSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                  {filteredSearchProducts.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-[13px]">
                      No products found matching "{productSearch}"
                    </div>
                  ) : (
                    filteredSearchProducts.map(prod => (
                      <button
                        key={prod._id}
                        type="button"
                        onClick={() => handleAddProduct(prod)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-3 cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {prod.images?.[0]?.url ? (
                            <img src={prod.images[0].url} alt={prod.name} className="h-full w-full object-cover" />
                          ) : (
                            <Layers className="h-4 w-4 m-auto mt-2 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="block text-[13.5px] font-medium text-slate-800">{prod.name}</span>
                          <span className="block text-[11px] text-slate-500">${prod.price}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Products List */}
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white max-h-[500px] overflow-auto">
              {formData.products.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-[13px]">
                  No products added yet. Search and select above to add them.
                </div>
              ) : (
                formData.products.map((prod, idx) => (
                  <div key={prod._id || prod} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-slate-400 font-medium w-4">{idx + 1}.</span>
                      <div className="h-10 w-10 rounded border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 bg-slate-50">
                        {prod.images?.[0]?.url || prod.imageUrl ? (
                          <img src={prod.images?.[0]?.url || prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                        ) : (
                          <Layers className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 text-[13.5px]">{prod.name || 'Unnamed Product'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[12px] font-semibold rounded-md">
                        Active
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod._id || prod)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar widgets) */}
        <div className="space-y-6">

          {/* Publishing Widget */}
          <div className="hidden bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[14px] font-bold text-slate-850">Publishing</h3>
              <button type="button" className="text-brand-blue text-[13px] font-medium hover:underline">Manage</button>
            </div>

            <div className="hidden space-y-3">
              <h4 className="text-[13px] font-medium text-slate-700">Sales channels</h4>
              <ul className="space-y-2 text-[13.5px] text-slate-600">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formData.publishing.includes('online_store') ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span>Online Store</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formData.publishing.includes('pos') ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span>Point of Sale</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Banner Image Widget */}
          <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="text-[14px] font-bold text-slate-850">Image</h3>

            <div className="space-y-4">
              {formData.bannerImage ? (
                <div className="relative h-40 w-full rounded-xl border border-slate-200 overflow-hidden group">
                  <img src={formData.bannerImage} alt="Banner Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:bg-slate-50 transition-colors">
                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-medium text-slate-700 shadow-sm">
                      {isUploading ? 'Uploading...' : 'Add image'}
                    </div>
                    <span className="text-[12.5px] text-slate-400">or drop an image to upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </form>
  );
};

export default CollectionForm;
