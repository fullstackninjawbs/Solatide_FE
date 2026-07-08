import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Sparkles, Upload, X, Layers, Globe, Eye, HelpCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import JoditEditor from 'jodit-react';
import CustomDropdown from '../../components/CustomDropdown';
const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Lists fetched from APIs
  const [collectionsList, setCollectionsList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);

  // Interactive tags list state
  const [tagInput, setTagInput] = useState('');
  const [tagsList, setTagsList] = useState([]);

  // Category metafields suggestions state
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Search Engine Listing preview editing toggle
  const [editSeo, setEditSeo] = useState(false);

  // Product Form Attributes
  const [formData, setFormData] = useState({
    id: '', // Numeric ID
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'Metabolic Pathway Research',
    researchCategory: 'laboratory-support',
    tag: '', // Badge text
    inStock: true,
    sku: '',
    tagadaVariantId: '',
    stockQuantity: 10,
    lowStockThreshold: 5,
    imageUrl: '',
    images: [],
    seo: {
      title: '',
      description: '',
      canonicalUrl: ''
    },

    // Shopify Refinements
    published: true,
    vendor: 'Solatide Biosciences',
    productType: 'Research Peptides',
    barcode: '',
    costPerItem: '',
    requiresShipping: true,
    weightGrams: 10,
    weightUnit: 'kg', // UI helper ('kg' or 'g')
    countryOfOrigin: 'Australia',
    hsCode: '',
    chemicalGrade: 'Laboratory',
    chemicalPurity: '≥99%',
    chemicalColor: 'Clear',
    overviewHtml: '',
    summaryHtml: '',
    researchApplicationsHtml: '',
    technicalSpecsRawHtml: '',
    inventoryPolicy: 'deny', // 'continue' or 'deny'
    taxable: true,

    // Selected manual collection IDs
    collections: [],

    _originalVariants: [],
    currentBatch: null,
    technicalSpecsTable: []
  });

  const categories = [
    'Metabolic Pathway Research',
    'Tissue & Cellular Research',
    'Dermal & Pigmentation Research',
    'Research Solutions'
  ];

  const editorRef = useRef(null);
  const [initialDescription, setInitialDescription] = useState('');
  const [initialOverview, setInitialOverview] = useState('');
  const [initialSummary, setInitialSummary] = useState('');
  const [initialApplications, setInitialApplications] = useState('');

  // Jodit editor config
  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Describe the research compound uses, criteria, storage specifications...',
    height: 300,
    hidePoweredByJodit: true,
    buttons: [
      'paragraph', '|',
      'bold', 'italic', 'underline', 'brush', '|',
      'align', '|',
      'link', 'image', 'video', 'table', '|',
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

  const joditOverviewConfig = useMemo(() => ({ ...joditConfig, placeholder: 'Detailed compound overview...', height: 220 }), [joditConfig]);
  const joditSummaryConfig = useMemo(() => ({ ...joditConfig, placeholder: 'Brief summary snippet...', height: 180 }), [joditConfig]);
  const joditApplicationsConfig = useMemo(() => ({ ...joditConfig, placeholder: 'List research applications (HTML format)...', height: 200 }), [joditConfig]);

  const memoizedOverviewEditor = useMemo(() => {
    return (
      <JoditEditor
        value={initialOverview}
        config={joditOverviewConfig}
        onBlur={newContent => setFormData(prev => ({ ...prev, overviewHtml: newContent }))}
        onChange={newContent => {
          setFormData(prev => {
            if (prev.overviewHtml === newContent) return prev;
            return { ...prev, overviewHtml: newContent };
          });
        }}
      />
    );
  }, [initialOverview, joditOverviewConfig]);

  const memoizedSummaryEditor = useMemo(() => {
    return (
      <JoditEditor
        value={initialSummary}
        config={joditSummaryConfig}
        onBlur={newContent => setFormData(prev => ({ ...prev, summaryHtml: newContent }))}
        onChange={newContent => {
          setFormData(prev => {
            if (prev.summaryHtml === newContent) return prev;
            return { ...prev, summaryHtml: newContent };
          });
        }}
      />
    );
  }, [initialSummary, joditSummaryConfig]);

  const memoizedApplicationsEditor = useMemo(() => {
    return (
      <JoditEditor
        value={initialApplications}
        config={joditApplicationsConfig}
        onBlur={newContent => setFormData(prev => ({ ...prev, researchApplicationsHtml: newContent }))}
        onChange={newContent => {
          setFormData(prev => {
            if (prev.researchApplicationsHtml === newContent) return prev;
            return { ...prev, researchApplicationsHtml: newContent };
          });
        }}
      />
    );
  }, [initialApplications, joditApplicationsConfig]);

  // Load product & collections
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        // Fetch manual collections to choose from
        const colRes = await apiService.getCollections();
        const colResult = await colRes.json();
        if (colResult.success && colResult.data) {
          // Show all collections from the admin collections API
          setCollectionsList(colResult.data);
        }
      } catch (err) {
        console.error('Failed to load collections', err);
      }

      try {
        // Fetch batches to assign to variants
        const batchRes = await apiService.getBatches();
        const batchResult = await batchRes.json();
        if (batchResult.success && batchResult.data && batchResult.data.batches) {
          setBatchesList(batchResult.data.batches);
        }
      } catch (err) {
        console.error('Failed to load batches', err);
      }
    };

    fetchInitData();

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
        setFetching(true);
        const response = await apiService.getProductById(id);
        const result = await response.json();
        if (result.success && result.data && result.data.product) {
          const product = result.data.product;

          // Parse tags list — prefer tags[] array, fall back to tag string
          if (product.tags && product.tags.length > 0) {
            setTagsList(product.tags);
          } else if (product.tag) {
            setTagsList(product.tag.split(',').map(t => t.trim()).filter(Boolean));
          }

          setFormData({
            id: product.id || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            compareAtPrice: product.compareAtPrice || '',
            category: product.category || 'Metabolic Pathway Research',
            researchCategory: product.researchCategory || 'laboratory-support',
            tag: product.tag || '',
            inStock: product.inStock !== undefined ? product.inStock : true,
            sku: product.sku || '',
            stockQuantity: product.stockQuantity || 0,
            lowStockThreshold: product.lowStockThreshold || 5,
            imageUrl: product.imageUrl || '',
            images: (product.images && product.images.length > 0)
              ? product.images
              : (product.imageUrl ? [{ url: product.imageUrl }] : []),
            seo: {
              title: product.seo?.title || '',
              description: product.seo?.description || '',
              canonicalUrl: product.seo?.canonicalUrl || ''
            },
            tagadaVariantId: product.variants?.[0]?.tagadaVariantId || '',
            _originalVariants: product.variants || [],
            currentBatch: product.currentBatch || null,

            // Shopify Refinements
            published: product.published !== false,
            vendor: product.vendor || 'Solatide Biosciences',
            productType: product.productType || 'Research Peptides',
            barcode: product.barcode || '',
            costPerItem: product.costPerItem || '',
            requiresShipping: product.variants?.[0]?.requiresShipping !== false,
            weightGrams: product.variants?.[0]?.weightGrams || 10,
            weightUnit: product.variants?.[0]?.weightGrams >= 1000 ? 'kg' : 'g',
            countryOfOrigin: product.countryOfOrigin || 'Australia',
            hsCode: product.hsCode || '',
            chemicalGrade: product.chemicalGrade || 'Laboratory',
            chemicalPurity: product.chemicalPurity || '≥99%',
            chemicalColor: product.chemicalColor || 'Clear',
            overviewHtml: product.overviewHtml || '',
            summaryHtml: product.summaryHtml || '',
            researchApplicationsHtml: product.researchApplicationsHtml || '',
            technicalSpecsRawHtml: product.technicalSpecs?.rawHtml || '',
            technicalSpecsTable: product.technicalSpecsTable || [],
            inventoryPolicy: product.variants?.[0]?.inventoryPolicy || 'deny',
            taxable: product.variants?.[0]?.taxable !== false,
            collections: product.collections || []
          });
          setInitialDescription(product.description || '');
          setInitialOverview(product.overviewHtml || '');
          setInitialSummary(product.summaryHtml || '');
          setInitialApplications(product.researchApplicationsHtml || '');
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Error fetching product details.');
        console.error(err);
      } finally {
        setFetching(false);
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

  // Image helpers
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
    setFormData(prev => {
      const newImages = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: newImages,
        imageUrl: newImages.length > 0 ? newImages[0].url : ''
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // Use our authenticated backend endpoint which handles the Cloudinary upload
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await apiService.uploadImage(uploadData);
      const result = await response.json();

      if (result.success && result.data?.secure_url) {
        const newImage = { url: result.data.secure_url, alt: file.name };

        setFormData(prev => {
          const newImages = [...prev.images, newImage];
          // Keep the very first image as the primary imageUrl for shop listings
          const primaryImageUrl = newImages[0]?.url || result.data.secure_url;

          return {
            ...prev,
            images: newImages,
            imageUrl: primaryImageUrl
          };
        });
      } else {
        alert('Upload Failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to connect to the server for upload.');
    } finally {
      setIsUploading(false);
    }
  };

  // Category Metafields suggestions helper
  const acceptSuggestions = () => {
    setFormData(prev => ({
      ...prev,
      chemicalGrade: 'Laboratory',
      chemicalPurity: '≥99%',
      chemicalColor: 'Clear'
    }));
    setShowSuggestions(false);
  };

  // Tag manager helpers
  const addTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tagsList.includes(val)) {
        const nextTags = [...tagsList, val];
        setTagsList(nextTags);
        setFormData(prev => ({ ...prev, tags: nextTags, tag: nextTags.join(', ') }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tag) => {
    const nextTags = tagsList.filter(t => t !== tag);
    setTagsList(nextTags);
    setFormData(prev => ({ ...prev, tags: nextTags, tag: nextTags.join(', ') }));
  };

  // Collections selection toggle
  const toggleCollection = (colId) => {
    setFormData(prev => {
      const isSelected = prev.collections.includes(colId);
      const nextCols = isSelected
        ? prev.collections.filter(id => id !== colId)
        : [...prev.collections, colId];
      return { ...prev, collections: nextCols };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Format weight to grams for database storage
    const weightGrams = formData.weightUnit === 'kg'
      ? parseFloat(formData.weightGrams) * 1000
      : parseFloat(formData.weightGrams);

    const finalImages = [...formData.images];

    // Ensure imageUrl is set to the first image if it exists
    const finalImageUrl = finalImages.length > 0 ? finalImages[0].url : formData.imageUrl;

    // Construct variants array matching structure
    let updatedVariants = [...formData._originalVariants];
    if (updatedVariants.length === 0) {
      updatedVariants.push({
        title: 'Default Title',
        sku: formData.sku || `${formData.id || 'new'}-default`,
        price: parseFloat(formData.price) || 0,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        stockQty: parseInt(formData.stockQuantity, 10) || 0,
        inventoryPolicy: formData.inventoryPolicy,
        requiresShipping: formData.requiresShipping,
        taxable: formData.taxable,
        weightGrams: weightGrams,
        tagadaVariantId: formData.tagadaVariantId
      });
    } else {
      updatedVariants[0] = {
        ...updatedVariants[0],
        tagadaVariantId: formData.tagadaVariantId,
        sku: formData.sku || updatedVariants[0].sku,
        price: parseFloat(formData.price) || updatedVariants[0].price,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        stockQty: parseInt(formData.stockQuantity, 10) || 0,
        inventoryPolicy: formData.inventoryPolicy,
        requiresShipping: formData.requiresShipping,
        taxable: formData.taxable,
        weightGrams: weightGrams
      };
    }

    // Map variants list payload to ensure clean currentBatchId reference values are sent
    const mappedVariants = updatedVariants.map(v => {
      const bId = v.currentBatchId?._id || v.currentBatchId || v.currentBatch?._id || null;
      return {
        ...v,
        currentBatchId: bId === '' ? null : bId
      };
    });

    const finalPayload = {
      id: parseInt(formData.id, 10),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
      category: formData.category,
      researchCategory: formData.researchCategory,
      imageUrl: finalImageUrl,
      images: finalImages,
      sku: formData.sku,
      tagadaVariantId: formData.tagadaVariantId,
      variants: mappedVariants,
      seo: formData.seo,
      inStock: parseInt(formData.stockQuantity, 10) > 0,

      // Shopify Refinements
      published: formData.published,
      vendor: formData.vendor,
      productType: formData.productType,
      barcode: formData.barcode,
      costPerItem: formData.costPerItem ? parseFloat(formData.costPerItem) : undefined,
      countryOfOrigin: formData.countryOfOrigin,
      hsCode: formData.hsCode,
      chemicalGrade: formData.chemicalGrade,
      chemicalPurity: formData.chemicalPurity,
      chemicalColor: formData.chemicalColor,
      overviewHtml: formData.overviewHtml,
      summaryHtml: formData.summaryHtml,
      researchApplicationsHtml: formData.researchApplicationsHtml,
      technicalSpecs: {
        rawHtml: formData.technicalSpecsRawHtml
      },
      technicalSpecsTable: formData.technicalSpecsTable,
      // Tags: send both arrays and comma-string for full compatibility
      tags: tagsList,
      tag: tagsList.join(', '),
      collections: formData.collections
    };

    try {
      const response = await apiService.saveProduct(isEditMode ? id : null, JSON.stringify(finalPayload));
      const result = await response.json();
      if (result.success || response.ok) {
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

  if (fetching) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
        <p className="text-[14px] font-medium">Fetching product data...</p>
      </div>
    );
  }

  // Interactive URL slug helper
  const slugifiedName = formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'product-slug';

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-brand-navy">{formData.name || 'Unnamed Product'}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase ${formData.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                {formData.published ? 'Active' : 'Draft'}
              </span>
            </div>
            <p className="text-slate-500 text-[13.5px]">Refined Shopify-style product catalog detail manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-650 hover:bg-slate-50 text-[14px] font-semibold transition-all cursor-pointer text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-cta-gradient hover:bg-cta-gradient-hover text-white px-6 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save'}</span>
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left main form section (ColSpan 8) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Title & Description Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="sm:col-span-9">
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Title
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
              <div className="sm:col-span-3">
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Product ID *
                </label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:border-brand-blue transition-all">
                {memoizedEditor}
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
              Media
            </h3>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative h-24 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center p-1.5 group/img">
                    <img src={img.url} alt="preview" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-red-650/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-grow px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13px] placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 bg-gradient-to-r from-[#00ACEE] to-[#0079CD] text-white rounded-xl text-xs font-bold hover:bg-brand-navy cursor-pointer transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="relative border-2 border-dashed border-slate-250 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                />
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-blue mb-1"></div>
                ) : (
                  <Upload className="h-5 w-5 text-slate-400 mb-1" />
                )}
                <span className="text-[12px] font-semibold text-slate-650">
                  {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-base font-bold text-brand-navy pb-2 border-b border-slate-100">
              Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Price (AUD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 text-slate-400 font-semibold text-[14px] top-2.5">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="149.95"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue transition-all text-[14px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Compare-at Price (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 text-slate-400 font-semibold text-[14px] top-2.5">$</span>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    placeholder="199.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue transition-all text-[14px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Cost Per Item (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 text-slate-400 font-semibold text-[14px] top-2.5">$</span>
                  <input
                    type="number"
                    name="costPerItem"
                    value={formData.costPerItem}
                    onChange={handleChange}
                    placeholder="25.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue transition-all text-[14px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 self-center mt-6">
                <input
                  type="checkbox"
                  id="taxable"
                  name="taxable"
                  checked={formData.taxable}
                  onChange={handleChange}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                />
                <label htmlFor="taxable" className="text-[13.5px] font-semibold text-slate-700 cursor-pointer select-none">
                  Charge tax on this product
                </label>
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">
                Inventory
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold text-slate-500">Track Quantity</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-55/10 text-emerald-700 text-[10px] font-bold border border-emerald-200/50 uppercase">Tracked</span>
              </div>
            </div>

            {/* Inventory table mockup for location */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-[13px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-55/20 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4 text-center">Unavailable</th>
                    <th className="py-2.5 px-4 text-center">Committed</th>
                    <th className="py-2.5 px-4 text-center">Available</th>
                    <th className="py-2.5 px-4 text-center">On Hand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-slate-50/10">
                  <tr>
                    <td className="py-3 px-4 text-slate-900 font-bold">Shop location</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                    <td className="py-3 px-4 text-center text-brand-blue">
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border border-slate-200 text-center rounded bg-white text-[13.5px] font-bold"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-slate-800">{formData.stockQuantity}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. SOL-CAG-24B"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px] font-mono"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Barcode (ISBN, UPC, GTIN)
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="e.g. 9312345678901"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px] font-mono"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Low Stock Warning Limit
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue text-[13.5px]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <input
                type="checkbox"
                id="inventoryPolicy"
                checked={formData.inventoryPolicy === 'continue'}
                onChange={(e) => setFormData(prev => ({ ...prev, inventoryPolicy: e.target.checked ? 'continue' : 'deny' }))}
                className="h-4.5 w-4.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <label htmlFor="inventoryPolicy" className="text-[13.5px] font-semibold text-slate-700 cursor-pointer select-none">
                Continue selling when out of stock
              </label>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">
                Shipping
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-slate-550">Physical product</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="requiresShipping"
                    checked={formData.requiresShipping}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue" />
                </label>
              </div>
            </div>

            {formData.requiresShipping && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                  <div className="sm:col-span-8">
                    <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Package Template
                    </label>
                    <CustomDropdown
                      options={[
                        { value: 'default', label: 'Store default • Padded Mailer - 12 × 18 × 2 cm, 10 g' },
                        { value: 'box', label: 'Cardboard Box - 15 × 15 × 10 cm, 30 g' }
                      ]}
                      value={formData.packageTemplate || 'default'}
                      onChange={(val) => setFormData(prev => ({ ...prev, packageTemplate: val }))}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px] cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Product weight
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="weightGrams"
                        value={formData.weightGrams}
                        onChange={handleChange}
                        step="0.001"
                        className="w-full px-3 py-2.5 rounded-l-xl bg-slate-50 border border-slate-200 border-r-0 text-slate-850 text-[13.5px]"
                      />
                      <CustomDropdown
                        options={[
                          { value: 'kg', label: 'kg' },
                          { value: 'g', label: 'g' }
                        ]}
                        value={formData.weightUnit || 'kg'}
                        onChange={(val) => setFormData(prev => ({ ...prev, weightUnit: val }))}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 min-w-[70px] bg-slate-100 border border-slate-200 rounded-r-xl text-[13.5px] cursor-pointer"
                        align="right"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Country/Region of origin
                    </label>
                    <input
                      type="text"
                      name="countryOfOrigin"
                      value={formData.countryOfOrigin}
                      onChange={handleChange}
                      placeholder="Australia"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      HS (Harmonized System) Code
                    </label>
                    <input
                      type="text"
                      name="hsCode"
                      value={formData.hsCode}
                      onChange={handleChange}
                      placeholder="e.g. 2933.99"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px] font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Metafields / Specifications Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">

            {showSuggestions && (
              <div className="bg-blue-50/20 border border-brand-blue/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-brand-cyan shrink-0" />
                    <span className="font-bold text-[13.5px] text-slate-850">3 suggestions available</span>
                  </div>
                  <p className="text-[12px] text-slate-500">Auto-fill category specifications based on typical biochemical standards.</p>
                </div>
                <button
                  type="button"
                  onClick={acceptSuggestions}
                  className="px-4 py-2 bg-gradient-to-r from-[#00ACEE] to-[#0079CD] hover:bg-brand-navy text-white text-[12px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Accept all
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">
                Category Metafields
              </h3>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Biochemicals Taxonomy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Chemical Color
                </label>
                <input
                  type="text"
                  name="chemicalColor"
                  value={formData.chemicalColor}
                  onChange={handleChange}
                  placeholder="e.g. Clear"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Chemical Grade
                </label>
                <input
                  type="text"
                  name="chemicalGrade"
                  value={formData.chemicalGrade}
                  onChange={handleChange}
                  placeholder="e.g. Laboratory"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Chemical Purity
                </label>
                <input
                  type="text"
                  name="chemicalPurity"
                  value={formData.chemicalPurity}
                  onChange={handleChange}
                  placeholder="e.g. ≥99%"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
                />
              </div>
            </div>

            {/* Existing Molecular attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Purity Standard
                </label>
                <input
                  type="text"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  CAS Number
                </label>
                <input
                  type="text"
                  name="casNumber"
                  value={formData.casNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Mol. Formula
                </label>
                <input
                  type="text"
                  name="molecularFormula"
                  value={formData.molecularFormula}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Mol. Weight
                </label>
                <input
                  type="text"
                  name="molecularWeight"
                  value={formData.molecularWeight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Product Storefront Metafields Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">
                Product Metafields
              </h3>
              <span className="text-[12px] font-bold text-slate-400">Custom UI Fields</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Product Summary
                </label>
                <span className="text-[11px] text-slate-400 block mb-2">Short summary snippet displayed in grid cards</span>
                {memoizedSummaryEditor}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Research Applications
                </label>
                <span className="text-[11px] text-slate-400 block mb-2">Detailed list of scientific evaluations</span>
                {memoizedApplicationsEditor}
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Technical Specifications Table
                </label>
                <span className="text-[11px] text-slate-400 block mb-3">Structured parameter specification table</span>

                <div className="space-y-2.5 mb-3">
                  {(formData.technicalSpecsTable || []).map((row, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={row.parameter || ''}
                        onChange={(e) => {
                          const updated = [...formData.technicalSpecsTable];
                          updated[idx] = { ...updated[idx], parameter: e.target.value };
                          setFormData(prev => ({ ...prev, technicalSpecsTable: updated }));
                        }}
                        placeholder="Parameter (e.g. Purity)"
                        className="w-1/3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13px] focus:outline-none focus:border-brand-blue"
                      />
                      <input
                        type="text"
                        value={row.specification || ''}
                        onChange={(e) => {
                          const updated = [...formData.technicalSpecsTable];
                          updated[idx] = { ...updated[idx], specification: e.target.value };
                          setFormData(prev => ({ ...prev, technicalSpecsTable: updated }));
                        }}
                        placeholder="Specification (e.g. ≥99% standard)"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13px] focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.technicalSpecsTable.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, technicalSpecsTable: updated }));
                        }}
                        className="text-red-400 hover:text-red-650 p-2 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newRow = { parameter: '', specification: '' };
                    setFormData(prev => ({
                      ...prev,
                      technicalSpecsTable: [...(prev.technicalSpecsTable || []), newRow]
                    }));
                  }}
                  className="px-4 py-2 bg-slate-55 hover:bg-slate-100 text-slate-700 text-[12.5px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 w-fit"
                >
                  <Plus className="h-3.5 w-3.5" /> Add parameter row
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Product Overview
                </label>
                <span className="text-[11px] text-slate-400 block mb-2">Complete descriptive writeup</span>
                {memoizedOverviewEditor}
              </div>
            </div>
          </div>

          {/* Variants Table Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">Variants</h3>
              <button
                type="button"
                onClick={() => {
                  const newVariant = {
                    title: 'New Variant',
                    sku: `${formData.sku || 'sku'}-v${Date.now()}`,
                    price: parseFloat(formData.price) || 0,
                    compareAtPrice: null,
                    stockQty: 0,
                    inventoryPolicy: 'deny',
                    requiresShipping: true,
                    taxable: true,
                    weightGrams: 10,
                    tagadaVariantId: ''
                  };
                  setFormData(prev => ({ ...prev, _originalVariants: [...prev._originalVariants, newVariant] }));
                }}
                className="text-[13px] font-semibold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add variant
              </button>
            </div>

            {formData._originalVariants.length === 0 ? (
              <p className="text-[13px] text-slate-400 italic">No variants. A default variant will be created on save.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="pb-2">Title</th>
                      <th className="pb-2">SKU</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Stock</th>
                      <th className="pb-2">Tagada ID</th>
                      <th className="pb-2">Current Batch</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {formData._originalVariants.map((variant, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={variant.title || ''}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px] min-w-[90px]"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={variant.sku || ''}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = { ...updated[idx], sku: e.target.value };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px] font-mono min-w-[90px]"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            value={variant.price || ''}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = { ...updated[idx], price: parseFloat(e.target.value) || 0 };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="w-24 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px]"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            value={variant.stockQty || 0}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = { ...updated[idx], stockQty: parseInt(e.target.value) || 0 };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="w-20 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px]"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={variant.tagadaVariantId || ''}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = { ...updated[idx], tagadaVariantId: e.target.value };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            placeholder="var_..."
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px] font-mono min-w-[100px]"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <select
                            value={variant.currentBatchId?._id || variant.currentBatchId || variant.currentBatch?._id || ''}
                            onChange={e => {
                              const updated = [...formData._originalVariants];
                              updated[idx] = {
                                ...updated[idx],
                                currentBatchId: e.target.value || null,
                                currentBatch: e.target.value ? { _id: e.target.value } : null
                              };
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12.5px] cursor-pointer"
                          >
                            <option value="">No Batch</option>
                            {batchesList
                              .filter(b => {
                                const bProductId = b.productId?._id || b.productId;
                                return bProductId === id;
                              })
                              .map(b => (
                                <option key={b._id} value={b._id}>
                                  {b.batchId} ({b.purity || 'No purity'})
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData._originalVariants.filter((_, i) => i !== idx);
                              setFormData(prev => ({ ...prev, _originalVariants: updated }));
                            }}
                            className="text-red-400 hover:text-red-600 p-1 rounded-lg cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Search Engine Listing Preview */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-brand-navy">
                Search engine listing
              </h3>
              <button
                type="button"
                onClick={() => setEditSeo(!editSeo)}
                className="text-[13px] font-semibold text-brand-blue hover:underline cursor-pointer"
              >
                {editSeo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Google Search Result Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1 max-w-full overflow-hidden">
              <span className="text-[11.5px] text-[#202124] block leading-none font-sans font-normal">
                https://solatidebiosciences.com.au › products › <span className="font-bold">{slugifiedName}</span>
              </span>
              <span className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight font-sans block">
                {formData.seo.title || `Buy ${formData.name || 'CagriSema 10mg'} Australia | Solatide Biosciences`}
              </span>
              <span className="text-[13.5px] text-[#4d5156] leading-normal font-sans block max-w-2xl">
                {formData.seo.description || `${formData.name || 'CagriSema 10mg'}: pre-blended Cagrilintide + Semaglutide lyophilised research peptide in Australia. ≥99% purity, batch COA. For laboratory research use only.`}
              </span>
              <span className="text-[12px] text-slate-500 font-bold block mt-1">AUD {formData.price || '149.95'} AUD</span>
            </div>

            {editSeo && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Page Title Override
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.seo.title}
                    onChange={handleSeoChange}
                    placeholder={`Buy ${formData.name} Australia | Solatide`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
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
                    placeholder="Describe this product for search engine result snippets..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[13.5px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar section (ColSpan 4) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status Widget */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Product Status
            </h3>

            <CustomDropdown
              options={[
                { value: 'true', label: 'Active (Visible in Store)' },
                { value: 'false', label: 'Draft (Hidden in Store)' }
              ]}
              value={formData.published ? 'true' : 'false'}
              onChange={(val) => setFormData(prev => ({ ...prev, published: val === 'true' }))}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-850 text-[13.5px] font-bold cursor-pointer focus:outline-none focus:border-brand-blue"
            />
          </div>



          {/* Product Organization Widget */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Product Organization
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Product Type
                </label>
                <CustomDropdown
                  options={[
                    { value: 'Research Peptides', label: 'Research Peptides' },
                    { value: 'Laboratory Supplies', label: 'Laboratory Supplies' },
                    { value: 'Biochemicals', label: 'Biochemicals' },
                    { value: 'Reagents & Solvents', label: 'Reagents & Solvents' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.productType}
                  onChange={(val) => setFormData(prev => ({ ...prev, productType: val }))}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue transition-all text-[13.5px] cursor-pointer"
                />
              </div>

              {/* Research Category */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Research Category
                </label>
                <CustomDropdown
                  options={[
                    { value: 'metabolic-pathway', label: 'Metabolic Pathway Research' },
                    { value: 'tissue-cellular', label: 'Tissue & Cellular Research' },
                    { value: 'dermal-pigmentation', label: 'Dermal & Pigmentation Research' },
                    { value: 'laboratory-support', label: 'Laboratory Support' }
                  ]}
                  value={formData.researchCategory || 'laboratory-support'}
                  onChange={(val) => setFormData(prev => ({ ...prev, researchCategory: val }))}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue transition-all text-[13.5px] cursor-pointer"
                />
              </div>

              {/* Collections Dropdown */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Collections
                </label>
                <CustomDropdown
                  options={[
                    { value: '', label: 'Add to collection...' },
                    ...collectionsList
                      .filter(col => !formData.collections.includes(col._id))
                      .map(col => ({
                        value: col._id,
                        label: `${col.name}${col.type === 'automated' ? ' (Automated)' : ' (Manual)'}`
                      }))
                  ]}
                  value=""
                  onChange={(val) => {
                    const colId = val;
                    if (colId && !formData.collections.includes(colId)) {
                      toggleCollection(colId);
                    }
                  }}
                  placeholder="Add to collection..."
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-blue transition-all text-[13.5px] cursor-pointer"
                />

                {/* Selected Collections Display */}
                {formData.collections.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 p-2 border border-slate-150 rounded-xl bg-slate-50/45">
                    {formData.collections.map(colId => {
                      const col = collectionsList.find(c => c._id === colId);
                      return (
                        <span key={colId} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-100">
                          {col ? col.name : 'Unknown Collection'}
                          <button
                            type="button"
                            onClick={() => toggleCollection(colId)}
                            className="text-brand-blue/60 hover:text-red-500 focus:outline-none cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tag Manager */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Tags
                </label>

                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tags..."
                    className="flex-grow px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-850 text-xs placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {tagsList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 p-2 border border-slate-150 rounded-xl bg-slate-50/40">
                    {tagsList.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-slate-400 hover:text-red-500 focus:outline-none cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No tags defined</span>
                )}
              </div>
            </div>
          </div>

          {/* Save Action Block */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-grow bg-cta-gradient hover:bg-cta-gradient-hover text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-cta hover:shadow-cta-hover cursor-pointer"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
            <Link
              to="/admin/products"
              className="px-5 border border-slate-250 hover:bg-slate-50 text-slate-650 rounded-xl text-[14px] font-semibold flex items-center justify-center cursor-pointer text-center"
            >
              Cancel
            </Link>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;
