import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Info, HelpCircle, ExternalLink, Check, Trash2, ArrowLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { apiService } from '../../../services/api';

const BatchForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const [formData, setFormData] = useState({
    batchId: '',
    productId: '',
    variantId: '',
    variantSku: '',
    purity: '',
    measuredContent: '',
    content: '',
    method: 'HPLC / LC-MS Tested',
    coaUrl: '',
    coaStatus: 'pending',
    includesPurity: true,
    includesMeasuredContent: true,
    includesEndotoxin: false,
    includesSterility: false,
    hasEndotoxinTest: false,
    hasSterilityTest: false,
    endotoxinIncludedInCoa: false,
    sterilityIncludedInCoa: false,
    endotoxinReportUrl: '',
    sterilityReportUrl: '',
    appearance: 'Lyophilised solid white powder',
    notes: '',
    status: 'active',
    setAsCurrent: true,
    tests: {
      purityHplc: { performed: false, result: '' },
      netPeptideContent: { performed: false, result: '' },
      identityHplc: { performed: false, result: '' },
      fentanylScreen: { performed: false, result: '' },
      hplcConformity: { performed: false, result: '' },
      heavyMetalsIcpMs: { performed: false, result: '' },
      sterilityPcr: { performed: false, result: '' },
      endotoxinUsp85: { performed: false, result: '' }
    },
    customTests: []
  });

  useEffect(() => {
    fetchProducts();
    if (isEditMode) {
      fetchBatch();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await apiService.getProducts();
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    }
  };

  const fetchVariantsForProduct = async (productId) => {
    if (!productId) { setProductVariants([]); return; }
    try {
      const res = await apiService.getProductById(productId);
      const data = await res.json();
      if (data.success && data.data.product) {
        setProductVariants(data.data.product.variants || []);
      }
    } catch (err) {
      console.error('Failed to load product variants', err);
    }
  };

  const fetchBatch = async () => {
    try {
      setInitialLoading(true);
      const res = await apiService.getBatchById(id);
      const data = await res.json();
      if (data.success && data.data.batch) {
        const batchData = data.data.batch;
        const mappedProductId = batchData.productId?._id || batchData.productId;

        // Determine if this batch is currently the active/current batch on the product
        let isCurrent = false;
        if (mappedProductId) {
          try {
            const prodRes = await apiService.getProductById(mappedProductId);
            const prodData = await prodRes.json();
            if (prodData.success && prodData.data.product) {
              const prod = prodData.data.product;
              // Check root-level currentBatch
              const rootBatchId = prod.currentBatch?._id || prod.currentBatchId;
              if (rootBatchId && rootBatchId.toString() === (batchData._id || id).toString()) {
                isCurrent = true;
              }
              // Check variant-level currentBatch
              if (!isCurrent && prod.variants) {
                isCurrent = prod.variants.some(v => {
                  const vBatchId = v.currentBatch?._id || v.currentBatchId;
                  return vBatchId && vBatchId.toString() === (batchData._id || id).toString();
                });
              }
            }
          } catch (e) {
            console.error('Failed to check current batch status:', e);
          }
        }

        setFormData({
          ...batchData,
          productId: mappedProductId,
          setAsCurrent: isCurrent,
          tests: {
            purityHplc: { performed: false, result: '', ...(batchData.tests?.purityHplc || {}) },
            netPeptideContent: { performed: false, result: '', ...(batchData.tests?.netPeptideContent || {}) },
            identityHplc: { performed: false, result: '', ...(batchData.tests?.identityHplc || {}) },
            fentanylScreen: { performed: false, result: '', ...(batchData.tests?.fentanylScreen || {}) },
            hplcConformity: { performed: false, result: '', ...(batchData.tests?.hplcConformity || {}) },
            heavyMetalsIcpMs: { performed: false, result: '', ...(batchData.tests?.heavyMetalsIcpMs || {}) },
            sterilityPcr: { performed: false, result: '', ...(batchData.tests?.sterilityPcr || {}) },
            endotoxinUsp85: { performed: false, result: '', ...(batchData.tests?.endotoxinUsp85 || {}) }
          },
          customTests: batchData.customTests || []
        });

        if (mappedProductId) {
          fetchVariantsForProduct(mappedProductId);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load batch data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleTestToggle = (key) => {
    setFormData(prev => {
      const currentTests = prev.tests || {};
      const currentTest = currentTests[key] || { performed: false, result: '' };
      return {
        ...prev,
        tests: {
          ...currentTests,
          [key]: {
            ...currentTest,
            performed: !currentTest.performed
          }
        }
      };
    });
  };

  const handleTestResultChange = (key, value) => {
    setFormData(prev => {
      const currentTests = prev.tests || {};
      const currentTest = currentTests[key] || { performed: false, result: '' };
      return {
        ...prev,
        tests: {
          ...currentTests,
          [key]: {
            ...currentTest,
            result: value
          }
        }
      };
    });
  };

  const handleAddCustomTest = () => {
    setFormData(prev => ({
      ...prev,
      customTests: [...(prev.customTests || []), { name: '', result: '' }]
    }));
  };

  const handleCustomTestChange = (index, field, value) => {
    setFormData(prev => {
      const nextCustom = [...(prev.customTests || [])];
      nextCustom[index] = { ...nextCustom[index], [field]: value };
      return {
        ...prev,
        customTests: nextCustom
      };
    });
  };

  const handleRemoveCustomTest = (index) => {
    setFormData(prev => ({
      ...prev,
      customTests: (prev.customTests || []).filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: nextVal }));

    if (name === 'productId') {
      fetchVariantsForProduct(value);
      setFormData(prev => ({ ...prev, productId: value, variantId: '', variantSku: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.batchId || !formData.productId) {
      alert('Batch ID and Product are required');
      return;
    }

    const payload = {
      ...formData,
      variantId: formData.variantId === '' ? null : formData.variantId
    };

    try {
      setLoading(true);

      let res;
      if (isEditMode) {
        res = await apiService.updateBatch(id, payload);
      } else {
        res = await apiService.createBatch(payload);
      }

      const data = await res.json();
      if (data.success) {
        alert(`Batch ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/admin/batches');
      } else {
        alert(data.message || 'Error saving batch');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the batch');
    } finally {
      setLoading(false);
    }
  };

  const renderBooleanSelector = (label, name, value) => {
    return (
      <div className="border-b border-slate-100 py-4 last:border-b-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13.5px] font-semibold text-slate-700">{label}</span>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, [name]: false }))}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-slate-600 select-none">
            <input
              type="radio"
              name={name}
              checked={value === true}
              onChange={() => setFormData(prev => ({ ...prev, [name]: true }))}
              className="w-4 h-4 text-blue-600 border-slate-350 focus:ring-blue-500 cursor-pointer"
            />
            True
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-slate-600 select-none">
            <input
              type="radio"
              name={name}
              checked={value === false}
              onChange={() => setFormData(prev => ({ ...prev, [name]: false }))}
              className="w-4 h-4 text-blue-600 border-slate-350 focus:ring-blue-500 cursor-pointer"
            />
            False
          </label>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
        <p className="text-[14px] font-medium">Loading batch details...</p>
      </div>
    );
  }

  // Find references info
  const selectedProduct = products.find(p => p._id === formData.productId);
  const selectedVariant = productVariants.find(v => v._id === formData.variantId);

  return (
    <div className="w-full pb-24 font-sans text-left" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <Link to="/admin/batches" className="hover:text-blue-600 transition-colors">Batches</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{isEditMode ? formData.batchId : 'New Batch'}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <span>{isEditMode ? `Edit Batch: ${formData.batchId}` : 'Create Batch Record'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure COA parameters, analytical reports, and associated product references</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Main Column (Left, 8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Basic Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-850 pb-3 border-b border-slate-100">Basic Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Batch ID *</label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  placeholder="e.g. SOL-RTA-26B"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">DisplayName / Alias</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="e.g. Batch RTA-26B"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product *</label>
                <CustomDropdown
                  value={formData.productId}
                  onChange={(val) => handleChange({ target: { name: 'productId', value: val } })}
                  placeholder="Select a product..."
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  options={[
                    { value: '', label: 'Select a product...' },
                    ...products.map(p => ({ value: p._id, label: p.name }))
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Variant Selector (optional)</label>
                <CustomDropdown
                  value={formData.variantId}
                  onChange={(val) => handleChange({ target: { name: 'variantId', value: val } })}
                  placeholder="All variants (product-level)"
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  options={[
                    { value: '', label: 'All variants (product-level)' },
                    ...productVariants.map(v => ({ value: v._id, label: `${v.title} — ${v.sku}` }))
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Purity</label>
                <input
                  type="text"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  placeholder="e.g. 99.91%"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Measured Content</label>
                <input
                  type="text"
                  name="measuredContent"
                  value={formData.measuredContent}
                  onChange={handleChange}
                  placeholder="e.g. 10.2mg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Testing Method</label>
                <input
                  type="text"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  placeholder="HPLC, UV + LC-MS Tested"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Appearance</label>
                <input
                  type="text"
                  name="appearance"
                  value={formData.appearance}
                  onChange={handleChange}
                  placeholder="e.g. White Lyophilised Powder"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* COA Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-850 pb-3 border-b border-slate-100">COA & Testing Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">COA Link</label>
                <input
                  type="url"
                  name="coaUrl"
                  value={formData.coaUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">COA Status</label>
                <CustomDropdown
                  value={formData.coaStatus}
                  onChange={(val) => handleChange({ target: { name: 'coaStatus', value: val } })}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved / Available' }
                  ]}
                />
              </div>
            </div>

            {/* Boolean selectors */}
            <div className="pt-4 border-t border-slate-100 space-y-1">
              {renderBooleanSelector('Coa Includes Purity', 'includesPurity', formData.includesPurity)}
              {renderBooleanSelector('Coa Includes Measured Content', 'includesMeasuredContent', formData.includesMeasuredContent)}
              {renderBooleanSelector('Coa Includes Endotoxin', 'includesEndotoxin', formData.includesEndotoxin)}
              {renderBooleanSelector('Coa Includes Sterility', 'includesSterility', formData.includesSterility)}

              {renderBooleanSelector('Has Endotoxin Test', 'hasEndotoxinTest', formData.hasEndotoxinTest)}
              {renderBooleanSelector('Endotoxin Included in COA', 'endotoxinIncludedInCoa', formData.endotoxinIncludedInCoa)}

              {formData.hasEndotoxinTest && (
                <div className="py-2.5 pl-6 border-l-2 border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Endotoxin Report URL</label>
                  <input
                    type="url"
                    name="endotoxinReportUrl"
                    value={formData.endotoxinReportUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              )}

              {renderBooleanSelector('Has Sterility Test', 'hasSterilityTest', formData.hasSterilityTest)}
              {renderBooleanSelector('Sterility Included in COA', 'sterilityIncludedInCoa', formData.sterilityIncludedInCoa)}

              {formData.hasSterilityTest && (
                <div className="py-2.5 pl-6 border-l-2 border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sterility Report Link</label>
                  <input
                    type="url"
                    name="sterilityReportUrl"
                    value={formData.sterilityReportUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* COA Analytical Test Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-850">COA Analytical Test Panel</h2>
              <p className="text-xs text-slate-500 mt-1">Specify which tests are included in this batch's COA panel and enter their results.</p>
            </div>

            <div className="divide-y divide-slate-100 text-left">
              {[
                { key: 'purityHplc', label: 'Purity (HPLC)', placeholder: 'e.g. 99.94%' },
                { key: 'netPeptideContent', label: 'Net Peptide Content', placeholder: 'e.g. 10.2mg or 98.4%' },
                { key: 'identityHplc', label: 'Identity (HPLC)', placeholder: 'e.g. Conform or PASS' },
                { key: 'fentanylScreen', label: 'Fentanyl Screen', placeholder: 'e.g. Not Detected or PASS', highlight: true },
                { key: 'hplcConformity', label: 'HPLC Conformity', placeholder: 'e.g. Conform' },
                { key: 'heavyMetalsIcpMs', label: 'Heavy Metals (ICP-MS)', placeholder: 'e.g. PASS or < LOD' },
                { key: 'sterilityPcr', label: 'Sterility (PCR)', placeholder: 'e.g. Negative' },
                { key: 'endotoxinUsp85', label: 'Endotoxin (USP <85>)', placeholder: 'e.g. < 0.05 EU/mg' }
              ].map(({ key, label, placeholder, highlight }) => {
                const testData = formData.tests?.[key] || { performed: false, result: '' };
                return (
                  <div
                    key={key}
                    className={`py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${highlight ? 'bg-emerald-50/40 -mx-6 px-6 border-y border-emerald-100 my-1 first:mt-0 last:mb-0' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`test-${key}`}
                        checked={testData.performed}
                        onChange={() => handleTestToggle(key)}
                        className="w-4.5 h-4.5 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`test-${key}`}
                        className={`text-sm font-semibold cursor-pointer select-none flex items-center gap-2 ${highlight ? 'text-emerald-900 font-bold' : 'text-slate-700'
                          }`}
                      >
                        {label}
                        {highlight && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Safety Priority
                          </span>
                        )}
                      </label>
                    </div>

                    {testData.performed && (
                      <div className="flex-1 max-w-md md:pl-4">
                        <input
                          type="text"
                          value={testData.result}
                          onChange={(e) => handleTestResultChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Tests Section */}
            {(formData.customTests && formData.customTests.length > 0) && (
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3.5 text-left">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Tests</h3>
                {(formData.customTests || []).map((test, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2 border-b border-dashed border-slate-100 last:border-b-0">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Test Name *</label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => handleCustomTestChange(index, 'name', e.target.value)}
                          placeholder="e.g. pH Level, Purity (NMR)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Result</label>
                        <input
                          type="text"
                          value={test.result}
                          onChange={(e) => handleCustomTestChange(index, 'result', e.target.value)}
                          placeholder="e.g. 7.4, Conform, 99.8%"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex items-end justify-end md:self-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomTest(index)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Custom Test"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-start select-none">
              <button
                type="button"
                onClick={handleAddCustomTest}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#214A9E] bg-blue-50 hover:bg-blue-100 border border-blue-200/50 rounded-xl transition-all hover:shadow-sm cursor-pointer"
              >
                + Add Custom Test
              </button>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-850 pb-3 border-b border-slate-100">Notes</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Internal Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Write private notes about this batch..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right, 4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status & Save Actions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-850 pb-3 border-b border-slate-100">Publish Details</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Batch Status</label>
              <CustomDropdown
                value={formData.status}
                onChange={(val) => handleChange({ target: { name: 'status', value: val } })}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer font-medium"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive / Archived' }
                ]}
              />
            </div>

            <div className="bg-[#f0f7ff]/70 border border-[#214A9E]/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1a4494] text-[13.5px]">Set as Current Batch</h4>
                  <p className="text-[11.5px] text-[#214A9E]/70 mt-0.5 leading-relaxed">
                    Automatically link this batch to the selected product page.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    name="setAsCurrent"
                    checked={formData.setAsCurrent}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#214A9E] hover:bg-[#1a3a7d] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  isEditMode ? 'Save Changes' : 'Create Batch'
                )}
              </button>
              <Link
                to="/admin/batches"
                className="w-full text-center px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm font-semibold"
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* References Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-850">References</h3>
                <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" title="Associated product variants using this batch record" />
              </div>
            </div>

            {selectedProduct ? (
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm shrink-0 select-none">
                    🧪
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[13px] font-bold text-slate-800 break-words leading-tight">
                      {selectedProduct.name}
                    </p>
                    <p className="text-[11.5px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
                      <span>{selectedVariant ? selectedVariant.title : 'Default Title'}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">
                      Product variant
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[12.5px] text-slate-400 italic text-left select-none">No associated product variant references.</p>
            )}
          </div>

        </div>

      </form>
    </div>
  );
};

export default BatchForm;
