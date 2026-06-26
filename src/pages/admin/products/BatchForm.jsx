import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiService } from '../../../services/api';

const BatchForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    batchId: '',
    productId: '',
    purity: '',
    measuredContent: '',
    method: 'HPLC / LC-MS Tested',
    coaUrl: '',
    coaStatus: 'pending',
    includesPurity: true,
    includesMeasuredContent: true,
    includesEndotoxin: false,
    includesSterility: false,
    hasEndotoxinTest: false,
    hasSterilityTest: false,
    endotoxinReportUrl: '',
    sterilityReportUrl: '',
    appearance: 'Lyophilised solid white powder',
    notes: '',
    status: 'active',
    setAsCurrent: true
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

  const fetchBatch = async () => {
    try {
      setInitialLoading(true);
      const res = await apiService.getBatchById(id);
      const data = await res.json();
      if (data.success && data.data.batch) {
        setFormData({
          ...data.data.batch,
          productId: data.data.batch.productId._id || data.data.batch.productId,
          setAsCurrent: false // Default false on edit unless user checks it
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load batch data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.productId) {
      alert('Batch ID and Product are required');
      return;
    }

    try {
      setLoading(true);
      
      let res;
      if (isEditMode) {
        res = await apiService.updateBatch(id, formData);
      } else {
        res = await apiService.createBatch(formData);
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

  if (initialLoading) {
    return <div className="p-8 text-center text-slate-500">Loading batch details...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[900px] mx-auto w-full pb-24">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <Link to="/admin/batches" className="hover:text-blue-600 transition-colors">Batches</Link>
        <span>/</span>
        <span className="text-slate-800">{isEditMode ? 'Edit Batch' : 'New Batch'}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Batch Record' : 'Create Batch Record'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure batch details and COA documentation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch ID *</label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                placeholder="e.g. SOL-WLV-010"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product *</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
                required
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Purity</label>
              <input
                type="text"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                placeholder="e.g. 99.20%"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Measured Content</label>
              <input
                type="text"
                name="measuredContent"
                value={formData.measuredContent}
                onChange={handleChange}
                placeholder="e.g. 10.3mg"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Testing Method</label>
              <input
                type="text"
                name="method"
                value={formData.method}
                onChange={handleChange}
                placeholder="e.g. HPLC / LC-MS Tested"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Appearance</label>
              <input
                type="text"
                name="appearance"
                value={formData.appearance}
                onChange={handleChange}
                placeholder="e.g. Lyophilised solid white powder"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              />
            </div>
          </div>
        </div>

        {/* COA Documentation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">COA & Documentation</h2>
          <div className="grid grid-cols-1 gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">COA PDF Link</label>
                <input
                  type="url"
                  name="coaUrl"
                  value={formData.coaUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">COA Status</label>
                <select
                  name="coaStatus"
                  value={formData.coaStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved / Available</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="includesPurity"
                  checked={formData.includesPurity}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900">Includes Purity Test</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="includesMeasuredContent"
                  checked={formData.includesMeasuredContent}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900">Includes Measured Content</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="includesEndotoxin"
                  checked={formData.includesEndotoxin}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900">Includes Endotoxin Test in COA</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="includesSterility"
                  checked={formData.includesSterility}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900">Includes Sterility Test in COA</span>
              </label>
            </div>

          </div>
        </div>

        {/* Additional Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">Additional Reports</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer group mb-3">
                <input
                  type="checkbox"
                  name="hasEndotoxinTest"
                  checked={formData.hasEndotoxinTest}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-bold text-slate-700">Has Separate Endotoxin Report</span>
              </label>
              {formData.hasEndotoxinTest && (
                <div className="pl-7">
                  <input
                    type="url"
                    name="endotoxinReportUrl"
                    value={formData.endotoxinReportUrl}
                    onChange={handleChange}
                    placeholder="Endotoxin PDF Link..."
                    className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[14px]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group mb-3">
                <input
                  type="checkbox"
                  name="hasSterilityTest"
                  checked={formData.hasSterilityTest}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[14px] font-bold text-slate-700">Has Separate Sterility Report</span>
              </label>
              {formData.hasSterilityTest && (
                <div className="pl-7">
                  <input
                    type="url"
                    name="sterilityReportUrl"
                    value={formData.sterilityReportUrl}
                    onChange={handleChange}
                    placeholder="Sterility PDF Link..."
                    className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[14px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes & Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Private notes about this batch..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive / Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Set as current toggle */}
        <div className="bg-[#f0f7ff] rounded-xl border border-[#cce3fe] p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#1a4494] text-[15px]">Set as Current Batch</h3>
            <p className="text-[13px] text-blue-700/80 mt-1">
              Check this to automatically assign this batch to the product page upon saving.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="setAsCurrent"
              checked={formData.setAsCurrent} 
              onChange={handleChange}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 mt-6">
          <Link
            to="/admin/batches"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#214A9E] hover:bg-[#1a3a7d] text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              isEditMode ? 'Save Changes' : 'Create Batch'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default BatchForm;
