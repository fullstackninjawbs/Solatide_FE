import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Sparkles, Upload } from 'lucide-react';
import productVialImage from '../../assets/images/homePageFirstSection.png';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Product state attributes matching Expanded Product Model
  const [formData, setFormData] = useState({
    id: '', // Custom Numeric ID
    name: '',
    description: '',
    price: '',
    category: 'Metabolic Pathway Research',
    tag: '',
    inStock: true,
    sku: '',
    compareAtPrice: '',
    stockQuantity: 10,
    lowStockThreshold: 5,
    molecularFormula: '',
    molecularWeight: '',
    casNumber: '',
    appearance: 'Lyophilised white powder',
    purity: '≥99%',
    researchApplications: '', // Will convert to array on submit
    imageUrl: '', // For backward compatibility / direct URL
    images: [], // List of { url, alt }
    seo: {
      title: '',
      description: '',
      canonicalUrl: ''
    }
  });

  const categories = [
    'Metabolic Pathway Research',
    'Tissue & Cellular Research',
    'Dermal & Pigmentation Research',
    'Research Solutions'
  ];

  // Fetch product details if in edit mode
  useEffect(() => {
    if (!isEditMode) {
      // Auto-generate numeric ID based on timestamp or random number
      setFormData(prev => ({
        ...prev,
        id: Math.floor(100 + Math.random() * 900)
      }));
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const result = await response.json();
        if (result.success && result.data && result.data.product) {
          const product = result.data.product;
          
          setFormData({
            id: product.id || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            category: product.category || 'Metabolic Pathway Research',
            tag: product.tag || '',
            inStock: product.inStock !== undefined ? product.inStock : true,
            sku: product.sku || '',
            compareAtPrice: product.compareAtPrice || '',
            stockQuantity: product.stockQuantity || 0,
            lowStockThreshold: product.lowStockThreshold || 5,
            molecularFormula: product.molecularFormula || '',
            molecularWeight: product.molecularWeight || '',
            casNumber: product.casNumber || '',
            appearance: product.appearance || 'Lyophilised white powder',
            purity: product.purity || '≥99%',
            researchApplications: Array.isArray(product.researchApplications) 
              ? product.researchApplications.join('\n') 
              : '',
            imageUrl: product.imageUrl || '',
            images: product.images || [],
            seo: {
              title: product.seo?.title || '',
              description: product.seo?.description || '',
              canonicalUrl: product.seo?.canonicalUrl || ''
            }
          });
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Error fetching product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value
      }
    }));
  };

  // Add Cloudinary image URL simulated helper
  const addImage = () => {
    if (!formData.imageUrl) {
      alert('Please fill the URL field first.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: prev.imageUrl, alt: prev.name + ' image' }],
      imageUrl: '' // Clear URL input
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  // Simulate file upload to Cloudinary (will hook to signatures in Phase 4)
  const handleFileUploadSim = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate Cloudinary URL generation
    const mockCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/v123456/${file.name.replace(/\s+/g, '_')}`;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: mockCloudinaryUrl, alt: file.name }],
      imageUrl: mockCloudinaryUrl // Set main image fallback as well
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Format research applications as array of strings
    const formattedApps = formData.researchApplications
      ? formData.researchApplications.split('\n').map(line => line.trim()).filter(Boolean)
      : [];

    // Ensure at least one image exists (use fallback if empty)
    const finalImages = formData.images.length > 0 
      ? formData.images 
      : (formData.imageUrl ? [{ url: formData.imageUrl }] : []);

    const finalPayload = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
      researchApplications: formattedApps,
      images: finalImages,
      // If we don't have images list, save main imageUrl
      imageUrl: finalImages[0]?.url || ''
    };

    try {
      const token = localStorage.getItem('adminToken');
      const method = isEditMode ? 'PATCH' : 'POST';
      const endpoint = isEditMode 
        ? `http://localhost:5000/api/products/${id}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalPayload)
      });

      const result = await response.json();
      if (result.success) {
        navigate('/admin/products');
      } else {
        setError(result.message || 'An error occurred while saving.');
      }
    } catch (err) {
      setError('Connection to server failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Top breadcrumbs / back actions */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">Catalog</span>
          <h2 className="text-2xl font-bold text-brand-navy">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-650 text-[14px] flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !formData.name && isEditMode ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
          <p className="text-[14px]">Loading product data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Core Product Info (ColSpan 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Description Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-brand-cyan" />
                <span>General Information</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-8">
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. CagriSema 10mg"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                    required
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Short Numeric ID *
                  </label>
                  <input
                    type="number"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g. 7"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the research compound uses, criteria, storage specifications..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  required
                />
              </div>
            </div>

            {/* Technical Specifications Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Technical Specifications
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Purity Standard
                  </label>
                  <input
                    type="text"
                    name="purity"
                    value={formData.purity}
                    onChange={handleChange}
                    placeholder="e.g. ≥99% based on third-party documentation"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    CAS Number
                  </label>
                  <input
                    type="text"
                    name="casNumber"
                    value={formData.casNumber}
                    onChange={handleChange}
                    placeholder="e.g. 204868-23-4"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Molecular Formula
                  </label>
                  <input
                    type="text"
                    name="molecularFormula"
                    value={formData.molecularFormula}
                    onChange={handleChange}
                    placeholder="e.g. C187H291N45O59S"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Molecular Weight
                  </label>
                  <input
                    type="text"
                    name="molecularWeight"
                    value={formData.molecularWeight}
                    onChange={handleChange}
                    placeholder="e.g. 4110.15 g/mol"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Appearance
                </label>
                <input
                  type="text"
                  name="appearance"
                  value={formData.appearance}
                  onChange={handleChange}
                  placeholder="e.g. Lyophilised powder"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>

            {/* Research Applications (Multi-line) */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Research Applications (One per line)
                </label>
                <textarea
                  name="researchApplications"
                  value={formData.researchApplications}
                  onChange={handleChange}
                  placeholder="In-vitro receptor binding affinity essays&#10;Metabolic activation pathways evaluations"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>

            {/* SEO Override Settings */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                SEO & Search Engine Listing
              </h3>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Meta Title Override
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.seo.title}
                  onChange={handleSeoChange}
                  placeholder={formData.name || 'Buy CagriSema 10mg Australia | Solatide'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Meta Description
                </label>
                <textarea
                  name="description"
                  value={formData.seo.description}
                  onChange={handleSeoChange}
                  placeholder="Describe this product for search engines..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Stock, Media, Visibility (ColSpan 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status & Category Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Visibility & Category
              </h3>
              
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Subtitle Badge (e.g. Dual GIP Agonist)
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g. Dual GLP-1/GIP Receptor Agonist"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                />
                <label htmlFor="inStock" className="text-[14px] font-semibold text-slate-700 cursor-pointer select-none">
                  Published (Live in catalog)
                </label>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Pricing
              </h3>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Price (AUD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="149.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Compare-at Price
                </label>
                <input
                  type="number"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  placeholder="199.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>

            {/* Inventory Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Inventory & SKU
              </h3>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. SOL-CAD-24B"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Low Stock Threshold Warning
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>

            {/* Media Uploads Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Media & Cloudinary Images
              </h3>
              
              {/* Image previews list */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative h-20 bg-slate-50 border border-slate-150 rounded-xl overflow-hidden p-1 flex items-center justify-center group/img">
                      <img src={img.url} alt="product preview" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Add Image by URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://cloudinary.com/..."
                    className="flex-grow px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-navy transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Upload simulated preset */}
              <div className="border-2 border-dashed border-slate-250 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadSim}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-6 w-6 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-650">Upload to Cloudinary</span>
                <span className="text-[10px] text-slate-400 mt-1">Select an image file</span>
              </div>
            </div>

            {/* Save Action Card */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow bg-cta-gradient hover:bg-cta-gradient-hover text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-cta hover:shadow-cta-hover cursor-pointer focus:outline-none transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <Link
                to="/admin/products"
                className="px-5 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-xl text-[14px] font-semibold flex items-center justify-center transition-all cursor-pointer"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
