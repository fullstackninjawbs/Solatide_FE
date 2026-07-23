import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileSpreadsheet, Play, CheckCircle, AlertTriangle, Eye, RefreshCw, Layers } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';

const AdminProductsImportPage = () => {
  const [file, setFile] = useState(null);
  const [importMode, setImportMode] = useState('upsertByHandle');
  const [publishDefault, setPublishDefault] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { formatAUD } = useCurrency();

  const importOptions = [
    { value: 'createOnly', label: 'Create Only (no updates)' },
    { value: 'upsertByHandle', label: 'Upsert (create or update)' },
    { value: 'skipExisting', label: 'Skip Existing handles' }
  ];
  
  const selectedOption = importOptions.find(opt => opt.value === importMode);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    setPreviewData(null);
    setImportSummary(null);

    if (!file) return;

    // Validate CSV extension
    if (!file.name.endsWith('.csv')) {
      setError('Please select a valid Shopify CSV file (.csv format only).');
      setFile(null);
      return;
    }

    setFile(file);
  };

  // POST to Preview API
  const handlePreview = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setPreviewData(null);
    setImportSummary(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.previewProductsImport(formData);
      const result = await response.json();

      if (result.success && result.data) {
        setPreviewData(result.data);
      } else {
        setError(result.message || 'Error occurred while loading preview.');
      }
    } catch (err) {
      setError('Connection to backend API failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // POST to Commit API
  const handleCommit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setImportSummary(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', importMode);
    formData.append('publishDefault', publishDefault.toString());

    try {
      const response = await apiService.commitProductsImport(formData);
      const result = await response.json();

      if (result.success && result.data) {
        setImportSummary(result.data);
        setFile(null); // Clear file input after import completes
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(result.message || 'Error occurred during commit.');
      }
    } catch (err) {
      setError('Connection to backend API failed during import.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">Catalog</span>
          <h2 className="text-2xl font-bold text-brand-navy">Import Products</h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-650 text-[14px] flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Drag & Drop Zone */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-6">
            <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-brand-blue" />
              <span>Select Shopify CSV File</span>
            </h3>

            {/* Drag & Drop */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-[20px] p-10 flex flex-col items-center justify-center bg-slate-50/55 hover:bg-slate-50 hover:border-brand-blue/50 transition-all cursor-pointer text-center group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv"
                className="hidden"
              />
              <Upload className="h-10 w-10 text-slate-400 group-hover:text-brand-blue mb-4 transition-colors" />
              
              {file ? (
                <div className="space-y-1.5">
                  <p className="text-[15px] font-bold text-brand-navy">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB — Ready to parse</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[14px] font-bold text-slate-700">Drag & drop your products CSV here, or click to browse</p>
                  <p className="text-xs text-slate-400">Supports standard Shopify product catalog exports</p>
                </div>
              )}
            </div>

            {/* Preview Panel: Table of First 5 Items */}
            {previewData && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-[14px] font-bold text-brand-navy flex items-center gap-2">
                    <Eye className="h-4.5 w-4.5 text-brand-cyan" />
                    <span>Mapped Products Preview</span>
                  </h4>
                  <div className="flex gap-4 text-xs font-semibold text-slate-500">
                    <span>Products: <strong className="text-brand-navy">{previewData.productsCount}</strong></span>
                    <span>Variant Rows: <strong className="text-brand-navy">{previewData.variantsCount}</strong></span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-450 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                        <th className="py-3 pl-4">Handle</th>
                        <th className="py-3">Title</th>
                        <th className="py-3 text-center">Variants</th>
                        <th className="py-3 text-center">Images</th>
                        <th className="py-3 text-right pr-4">Base Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {previewData.productsPreview.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="py-3 pl-4 font-mono text-slate-500">{p.slug}</td>
                          <td className="py-3 font-semibold text-slate-700">{p.name}</td>
                          <td className="py-3 text-center text-slate-550">{p.variants.length}</td>
                          <td className="py-3 text-center text-slate-550">{p.images.length}</td>
                          <td className="py-3 text-right pr-4 font-bold text-brand-navy">
                            {formatAUD(p.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Warnings List */}
                {previewData.errors.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-xs space-y-2">
                    <p className="font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wide mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Validation Warnings ({previewData.errors.length})</span>
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-1 divide-y divide-amber-100/50">
                      {previewData.errors.map((err, idx) => (
                        <div key={idx} className="py-1 text-slate-650 flex gap-2">
                          <span className="font-bold text-amber-700 shrink-0">Row {err.row}:</span>
                          <span>{err.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Completed Summary Panel */}
            {importSummary && (
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl space-y-4 animate-in scale-in duration-200">
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="h-6 w-6 shrink-0" />
                  <h4 className="text-[16px] font-bold">Import Completed Successfully</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-2xl font-black text-emerald-600">{importSummary.created}</p>
                    <p className="text-xs text-slate-450 font-bold uppercase mt-1">Created</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-2xl font-black text-brand-blue">{importSummary.updated}</p>
                    <p className="text-xs text-slate-450 font-bold uppercase mt-1">Updated</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-2xl font-black text-slate-400">{importSummary.skipped}</p>
                    <p className="text-xs text-slate-450 font-bold uppercase mt-1">Skipped</p>
                  </div>
                </div>

                {importSummary.errors.length > 0 && (
                  <div className="p-3 bg-white border border-emerald-100 rounded-2xl text-xs space-y-2 mt-4">
                    <p className="font-bold text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Warnings & Skips ({importSummary.errors.length})</span>
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importSummary.errors.slice(0, 10).map((err, idx) => (
                        <p key={idx} className="text-slate-650">
                          {err.row ? <span className="font-bold text-slate-500">Row {err.row}: </span> : null}
                          {err.message}
                        </p>
                      ))}
                      {importSummary.errors.length > 10 && (
                        <p className="text-slate-400 font-semibold mt-1">...and {importSummary.errors.length - 10} more logs</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings and Action Buttons */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Options Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-5">
            <h3 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-brand-cyan" />
              <span>Import Config</span>
            </h3>

            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Import Behavior
              </label>
              <div className="w-full">
                <CustomDropdown
                  value={importMode}
                  options={importOptions}
                  onChange={(val) => setImportMode(val)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="publishDefault"
                checked={publishDefault}
                onChange={(e) => setPublishDefault(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <label htmlFor="publishDefault" className="text-[14px] font-semibold text-slate-700 cursor-pointer select-none">
                Publish new imports
              </label>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-3">
            <AdminSecondaryButton
              onClick={handlePreview}
              disabled={loading || !file}
              className="w-full !py-3.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading && !previewData ? 'animate-spin' : ''}`} />
              <span>Preview CSV Data</span>
            </AdminSecondaryButton>

            <AdminPrimaryButton
              onClick={handleCommit}
              disabled={loading || !file || !previewData}
              className="w-full !py-3.5"
            >
              <Play className="h-4 w-4" />
              <span>{loading && previewData ? 'Running Import...' : 'Run Import Now'}</span>
            </AdminPrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsImportPage;
