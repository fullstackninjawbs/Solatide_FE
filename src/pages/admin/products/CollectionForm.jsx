import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Upload, Search, X, Layers, Settings as SettingsIcon } from 'lucide-react';
import { apiService } from '../../../services/api';
import JoditEditor from 'jodit-react';

const CollectionForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
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
    ruleRelation: 'all',
    rules: [],
    sortOrder: 0,
    displayOptions: {
      showFaqBlock: false
    },
    products: [] // populated list of products (only used or modified in manual mode)
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
    );
  }, [initialDescription, joditConfig]);

  // Fetch collections and product catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiService.getProducts('limit=200');
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
              type: collection.type || 'manual',
              ruleRelation: collection.ruleRelation || 'all',
              rules: collection.rules || [],
              sortOrder: collection.sortOrder || 0,
              displayOptions: collection.displayOptions || { showFaqBlock: false },
              products: products || []
            });
            setInitialDescription(collection.description || '');
          } else {
            setError('Collection not found.');
          }
        } catch (err) {
          setError('Failed to fetch collection details.');
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchCollection();
    }
  }, [id, isEditMode]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDisplayOptionChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      displayOptions: {
        ...prev.displayOptions,
        [name]: checked
      }
    }));
  };

  // Automated Rules Handlers
  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { field: 'title', operator: 'is equal to', value: '' }]
    }));
  };

  const removeRule = (idx) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx)
    }));
  };

  const updateRule = (idx, key, val) => {
    setFormData(prev => {
      const newRules = [...prev.rules];
      newRules[idx] = { ...newRules[idx], [key]: val };
      return { ...prev, rules: newRules };
    });
  };

  // Simulated File Upload (Cloudinary helper)
  const handleFileUploadSim = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const mockCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/v123456/${file.name.replace(/\s+/g, '_')}`;
    setFormData(prev => ({
      ...prev,
      bannerImage: mockCloudinaryUrl
    }));
  };

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
      products: prev.products.filter(p => p._id !== productId)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare payload: extract product IDs for manual mode
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description,
        bannerImage: formData.bannerImage,
        status: formData.status,
        type: formData.type,
        ruleRelation: formData.ruleRelation,
        rules: formData.type === 'automated' ? formData.rules : [],
        sortOrder: Number(formData.sortOrder) || 0,
        displayOptions: formData.displayOptions,
        products: formData.type === 'manual' ? formData.products.map(p => p._id || p) : []
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
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
        <p className="text-[14px] font-medium">Fetching collection details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header and top save buttons */}
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
              {isEditMode ? 'Edit Collection' : 'Create Collection'}
            </h2>
            <p className="text-slate-500 text-[14px]">
              {isEditMode ? `Edit properties for /${formData.slug}` : 'Add a new category of research products'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            to="/admin/products/collections"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-650 hover:bg-slate-50 text-[14px] font-semibold transition-all cursor-pointer text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-cta-gradient hover:bg-cta-gradient-hover text-white px-6 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Collection'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-650 text-[14px] flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column (Main Form Content) */}
        <div className="lg:col-span-8 space-y-6">

          {/* General Properties Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
              General Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Collection Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Research-Grade Peptides"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Slug URL (Optional - auto-generated from title)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-[14px] select-none font-mono">/</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="research-grade-peptides"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
                  {memoizedEditor}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Type Selection & Rules */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-6">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-navy">
                Collection Type
              </h3>
              <span className="text-slate-400 text-[13px]">Choose how products are added</span>
            </div>

            {/* Type Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${formData.type === 'manual'
                    ? 'border-brand-blue bg-blue-50/10 shadow-[0_4px_12px_rgba(0,121,206,0.03)]'
                    : 'border-slate-200 hover:border-slate-350'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    value="manual"
                    checked={formData.type === 'manual'}
                    onChange={handleChange}
                    className="text-brand-blue focus:ring-brand-blue cursor-pointer h-4 w-4"
                  />
                  <span className="font-bold text-[14px] text-slate-850">Manual</span>
                </div>
                <p className="text-[12px] text-slate-500 mt-2">
                  Add products one by one. You retain absolute control over exactly which items are included.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${formData.type === 'automated'
                    ? 'border-brand-blue bg-blue-50/10 shadow-[0_4px_12px_rgba(0,121,206,0.03)]'
                    : 'border-slate-200 hover:border-slate-350'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    value="automated"
                    checked={formData.type === 'automated'}
                    onChange={handleChange}
                    className="text-brand-blue focus:ring-brand-blue cursor-pointer h-4 w-4"
                  />
                  <span className="font-bold text-[14px] text-slate-850">Automated</span>
                </div>
                <p className="text-[12px] text-slate-500 mt-2">
                  Products matching specific rules (price, tags, categories) are automatically included.
                </p>
              </label>
            </div>

            {/* MANUAL PRODUCTS SELECTOR */}
            {formData.type === 'manual' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-[14px] font-bold text-slate-800">Add Products</h4>

                {/* Search Bar for products */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductSearchDropdown(true);
                      }}
                      onFocus={() => setShowProductSearchDropdown(true)}
                      placeholder="Search catalog products by name or SKU..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue transition-all text-[14px]"
                    />
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => setProductSearch('')}
                        className="absolute right-3 p-1 hover:bg-slate-200 rounded-full cursor-pointer text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Suggestions */}
                  {showProductSearchDropdown && productSearch && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-250 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      {filteredSearchProducts.length === 0 ? (
                        <div className="p-4 text-slate-400 text-center text-[13px]">No matching products found</div>
                      ) : (
                        filteredSearchProducts.map(prod => (
                          <button
                            key={prod._id}
                            type="button"
                            onClick={() => handleAddProduct(prod)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50/80 transition-colors flex items-center justify-between border-b border-slate-100 last:border-0 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                                {prod.images?.[0]?.url ? (
                                  <img src={prod.images[0].url} alt={prod.name} className="h-full w-full object-cover" />
                                ) : (
                                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                                )}
                              </div>
                              <span className="text-[14px] font-semibold text-slate-800">{prod.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[12px] font-bold text-slate-600">AUD {prod.price}</span>
                              {prod.sku && <span className="block text-[10px] text-slate-400 font-mono">{prod.sku}</span>}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Products List */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                    Selected Products ({formData.products.length})
                  </h5>

                  {formData.products.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-[13px]">
                      No products added yet. Search and select above to add them to this manual collection.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-slate-50/10">
                      {formData.products.map(prod => (
                        <div key={prod._id || prod} className="px-4 py-3 flex items-center justify-between hover:bg-white transition-colors bg-white/40">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                              {prod.images?.[0]?.url || prod.imageUrl ? (
                                <img src={prod.images?.[0]?.url || prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                              ) : (
                                <Layers className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div className="text-left">
                              <span className="font-semibold text-slate-800 text-[14px]">{prod.name || 'Unnamed Product'}</span>
                              <span className="block text-[11px] text-slate-450">{prod.category || 'No Category'}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(prod._id || prod)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AUTOMATED RULES BUILDER */}
            {formData.type === 'automated' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-[14px] font-bold text-slate-850">Conditions</h4>
                  <div className="flex items-center gap-3 text-[14px]">
                    <span className="text-slate-500">Products must match:</span>
                    <select
                      name="ruleRelation"
                      value={formData.ruleRelation}
                      onChange={handleChange}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-250 text-slate-850 focus:outline-none focus:border-brand-blue text-[13px] font-semibold cursor-pointer"
                    >
                      <option value="all">all conditions</option>
                      <option value="any">any condition</option>
                    </select>
                  </div>
                </div>

                {formData.rules.length === 0 ? (
                  <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-[13px]">
                    No conditions defined. Click "Add condition" to automatically populate this collection.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.rules.map((rule, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">

                        {/* Field Selection */}
                        <div className="flex-1 min-w-[150px]">
                          <select
                            value={rule.field}
                            onChange={(e) => updateRule(idx, 'field', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px] cursor-pointer"
                          >
                            <option value="title">Product title</option>
                            <option value="type">Product category</option>
                            <option value="tag">Product tag</option>
                            <option value="vendor">Product vendor</option>
                            <option value="price">Price</option>
                            <option value="compareAtPrice">Compare at price</option>
                          </select>
                        </div>

                        {/* Operator Selection */}
                        <div className="flex-1 min-w-[150px]">
                          <select
                            value={rule.operator}
                            onChange={(e) => updateRule(idx, 'operator', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px] cursor-pointer"
                          >
                            <option value="is equal to">is equal to</option>
                            <option value="is not equal to">is not equal to</option>
                            <option value="is greater than">is greater than</option>
                            <option value="is less than">is less than</option>
                            <option value="starts with">starts with</option>
                            <option value="ends with">ends with</option>
                            <option value="contains">contains</option>
                            <option value="does not contain">does not contain</option>
                          </select>
                        </div>

                        {/* Rule Value */}
                        <div className="flex-[2] min-w-[200px]">
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => updateRule(idx, 'value', e.target.value)}
                            placeholder="Value"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px]"
                            required
                          />
                        </div>

                        {/* Delete condition */}
                        <button
                          type="button"
                          onClick={() => removeRule(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer self-end sm:self-auto"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addRule}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add condition</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar widgets) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status Widget */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-[14px] font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-100">
              Publishing Status
            </h3>

            <div className="space-y-3">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[14px] cursor-pointer font-semibold"
              >
                <option value="active">Active (Visible in catalogs)</option>
                <option value="draft">Draft (Hidden from store)</option>
              </select>
            </div>
          </div>

          {/* Banner Image Widget */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-[14px] font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-100">
              Collection Banner Image
            </h3>

            <div className="space-y-4">
              {formData.bannerImage ? (
                <div className="relative h-40 w-full rounded-2xl border border-slate-200 overflow-hidden group">
                  <img src={formData.bannerImage} alt="Banner Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}
                      className="p-2 bg-red-650/90 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-40 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50/50">
                  <Layers className="h-8 w-8 text-slate-300" />
                  <span className="text-[12px]">No banner image added</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Direct Image URL
                </label>
                <input
                  type="text"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13px]"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-center border border-slate-200 hover:bg-slate-50 rounded-xl p-2.5 text-[13px] font-semibold text-slate-600 transition-all cursor-pointer">
                  <Upload className="h-4.5 w-4.5 mr-2 text-slate-450" />
                  <span>Simulate Image Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadSim}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collection Metadata & Display Widget */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-[14px] font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <SettingsIcon className="h-4 w-4 text-slate-400" />
              <span>Layout Settings</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Sort Order Priority
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[14px]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Lower numbers have higher priority in store menus</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="showFaqBlock"
                    checked={formData.displayOptions.showFaqBlock}
                    onChange={handleDisplayOptionChange}
                    className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4 cursor-pointer"
                  />
                  <div className="text-left">
                    <span className="font-semibold text-slate-700 text-[13.5px]">Show FAQ Block</span>
                    <span className="block text-[11px] text-slate-400">Display collection-specific FAQs on catalog page</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
};

export default CollectionForm;
