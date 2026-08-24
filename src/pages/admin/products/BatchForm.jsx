import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Info, HelpCircle, ExternalLink, Check, Trash2, ArrowLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import MultiSelectDropdown from '../../../components/MultiSelectDropdown';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { getUserFriendlyErrorMessage } from '../../../utils/getUserFriendlyErrorMessage';

const BatchForm = () => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const [formData, setFormData] = useState({
    batchId: '',
    vendorLotNumber: '',
    products: [],
    variantId: '',
    variantSku: '',
    purity: '',
    measuredContent: '',
    content: '',
    method: 'HPLC / LC-MS Tested',
    coaUrl: '',
    coaFile: null,
    coaStatus: 'pending',
    verificationDetails: {
      labName: '',
      coaReportId: '',
      testDate: '',
      verificationUrl: ''
    },
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
      toast.error('Failed to load products');
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
        const mappedProducts = batchData.products?.map(p => p._id || p) || (batchData.productId ? [batchData.productId._id || batchData.productId] : []);

        // Determine if this batch is currently the active/current batch on any of the products
        let isCurrent = false;
        if (mappedProducts.length > 0) {
          for (const pId of mappedProducts) {
            if (isCurrent) break;
            try {
              const prodRes = await apiService.getProductById(pId);
              const prodData = await prodRes.json();
              if (prodData.success && prodData.data.product) {
                const prod = prodData.data.product;
                const rootBatchId = prod.currentBatch?._id || prod.currentBatchId;
                if (rootBatchId && rootBatchId.toString() === (batchData._id || id).toString()) {
                  isCurrent = true;
                }
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
        }

        setFormData({
          ...batchData,
          products: mappedProducts,
          setAsCurrent: isCurrent,
          qcLevel: batchData.qcLevel,
          verificationDetails: {
            labName: '', coaReportId: '', testDate: '', verificationUrl: '',
            ...(batchData.verificationDetails || {})
          },
          tests: {
            purityHplc: { 
              performed: batchData.tests?.purityHplc?.performed ?? !!batchData.purity, 
              result: batchData.tests?.purityHplc?.result ?? (batchData.purity || ''), 
              ...(batchData.tests?.purityHplc || {}) 
            },
            netPeptideContent: { 
              performed: batchData.tests?.netPeptideContent?.performed ?? !!batchData.measuredContent, 
              result: batchData.tests?.netPeptideContent?.result ?? (batchData.measuredContent || ''), 
              ...(batchData.tests?.netPeptideContent || {}) 
            },
            identityHplc: { performed: false, result: '', ...(batchData.tests?.identityHplc || {}) },
            fentanylScreen: { performed: false, result: '', ...(batchData.tests?.fentanylScreen || {}) },
            hplcConformity: { performed: false, result: '', ...(batchData.tests?.hplcConformity || {}) },
            heavyMetalsIcpMs: { performed: false, result: '', ...(batchData.tests?.heavyMetalsIcpMs || {}) },
            sterilityPcr: { performed: false, result: '', ...(batchData.tests?.sterilityPcr || {}) },
            endotoxinUsp85: { performed: false, result: '', ...(batchData.tests?.endotoxinUsp85 || {}) }
          },
          customTests: batchData.customTests || []
        });

        if (mappedProducts.length > 0) {
          fetchVariantsForProduct(mappedProducts[0]); // Just fetch variants for the first product for now, or you could aggregate them
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load batch data');
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

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      verificationDetails: {
        ...(prev.verificationDetails || {}),
        [name]: value
      }
    }));
  };

  const [uploadingCoa, setUploadingCoa] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingCoa(true);
      const fileData = new FormData();
      fileData.append('coaFile', file);

      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiUrl}/api/admin/batches/upload-coa`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fileData
      });

      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          coaFile: data.data
        }));
      } else {
        toast.error(getUserFriendlyErrorMessage(data.message, 'fileUpload'));
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error(getUserFriendlyErrorMessage(err, 'fileUpload'));
    } finally {
      setUploadingCoa(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: nextVal }));

    if (name === 'products') {
      if (value.length > 0) {
        fetchVariantsForProduct(value[0]);
      } else {
        setProductVariants([]);
      }
      setFormData(prev => ({ ...prev, variantId: '', variantSku: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.batchId || !formData.products || formData.products.length === 0) {
      toast.warning('Batch ID and at least one Product are required');
      return;
    }

    const payload = {
      ...formData,
      purity: formData.tests?.purityHplc?.performed ? formData.tests.purityHplc.result : '',
      measuredContent: formData.tests?.netPeptideContent?.performed ? formData.tests.netPeptideContent.result : '',
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
        toast.success(`Batch ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/admin/batches');
      } else {
        toast.error(getUserFriendlyErrorMessage(data.message, 'batchSave'));
      }
    } catch (err) {
      console.error(err);
      toast.error(getUserFriendlyErrorMessage(err, 'batchSave'));
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
  const selectedProducts = products.filter(p => formData.products.includes(p._id));
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
            {isEditMode && formData.qcLevel && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${formData.qcLevel === 'full' ? 'bg-emerald-100 text-emerald-800' :
                formData.qcLevel === 'partial' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                {formData.qcLevel} QC
              </span>
            )}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vendor Lot Number</label>
                <input
                  type="text"
                  name="vendorLotNumber"
                  value={formData.vendorLotNumber}
                  onChange={handleChange}
                  placeholder="e.g. V-LOT-123"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>



              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Products *</label>
                <MultiSelectDropdown
                  value={formData.products}
                  onChange={(val) => handleChange({ target: { name: 'products', value: val } })}
                  placeholder="Select products..."
                  options={products.map(p => ({ value: p._id, label: p.name }))}
                />
              </div>




            </div>
          </div>

          {/* COA Analytical Test Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-850">COA Analytical Test Panel</h2>
              <p className="text-xs text-slate-500 mt-1">Upload the COA image, verification details, and specify test results.</p>
            </div>

            {/* COA Upload & Verification Details Moved Here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">COA Upload</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden group hover:border-blue-300 transition-colors">
                  {formData.coaFile?.url || formData.coaUrl ? (
                    <div className="flex items-center gap-3 w-full justify-between relative z-10 pointer-events-none">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center font-bold text-[10px]">IMG</div>
                        <div className="text-sm font-medium text-slate-700 truncate max-w-xs">
                          {formData.coaFile?.filename || 'Existing COA'}
                        </div>
                      </div>
                      <div className="w-10"></div>
                    </div>
                  ) : (
                    <div className="text-center relative z-10 pointer-events-none">
                      <p className="text-sm text-slate-500 mb-1">Click to upload the image report from the lab</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingCoa}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                  {(formData.coaFile?.url || formData.coaUrl) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2">
                      <a href={formData.coaFile?.url || formData.coaUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs font-semibold cursor-pointer bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">View File</a>
                      <button type="button" disabled={adminUser?.role !== 'super_admin'} title={adminUser?.role !== 'super_admin' ? "Only Super Admins can remove COAs" : "Remove COA"} onClick={() => setFormData(prev => ({ ...prev, coaFile: null, coaUrl: '' }))} className="text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Remove</button>
                    </div>
                  )}
                  {uploadingCoa && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-40"><div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" /></div>}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
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

              <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Verification Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lab Name</label>
                    <input
                      type="text"
                      name="labName"
                      value={formData.verificationDetails?.labName || ''}
                      onChange={handleVerificationChange}
                      placeholder="e.g. ILS Laboratories"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">COA Report ID</label>
                    <input
                      type="text"
                      name="coaReportId"
                      value={formData.verificationDetails?.coaReportId || ''}
                      onChange={handleVerificationChange}
                      placeholder="e.g. R-23456"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Test Date</label>
                    <input
                      type="date"
                      name="testDate"
                      value={formData.verificationDetails?.testDate ? new Date(formData.verificationDetails.testDate).toISOString().split('T')[0] : ''}
                      onChange={handleVerificationChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Verification URL</label>
                    <input
                      type="url"
                      name="verificationUrl"
                      value={formData.verificationDetails?.verificationUrl || ''}
                      onChange={handleVerificationChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>


            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Analytical Tests</h3>
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
                      <div className="flex-1 max-w-md md:pl-4 flex flex-col gap-2">
                        <input
                          type="text"
                          value={testData.result}
                          onChange={(e) => handleTestResultChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                        {key === 'endotoxinUsp85' && (
                          <input
                            type="url"
                            value={formData.endotoxinReportUrl || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, endotoxinReportUrl: e.target.value }))}
                            placeholder="Link to Endotoxin Report (e.g. https://...)"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-blue-500 transition-all font-medium"
                          />
                        )}
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
                        disabled={adminUser?.role !== 'super_admin'}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title={adminUser?.role !== 'super_admin' ? "Only Super Admins can delete custom tests" : "Delete Custom Test"}
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



        </div>

      </form>
    </div>
  );
};

export default BatchForm;
