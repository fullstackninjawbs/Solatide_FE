import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../../services/api';
import CustomDropdown from '../../../components/CustomDropdown';

const CoaList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Filter state
  const [filterProductId, setFilterProductId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [filterProductId]);

  const fetchProducts = async () => {
    try {
      const res = await apiService.getProducts('limit=200');
      const data = await res.json();
      if (data.success) setProducts(data.data.products);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterProductId) params.set('productId', filterProductId);
      // We only care about approved or pending COAs that have a file
      
      const res = await apiService.getBatches(params.toString());
      const data = await res.json();
      if (data.success) {
        // Filter to only batches that have a COA document attached
        const coaBatches = data.data.batches.filter(b => b.coaFile?.url || b.coaUrl);
        setBatches(coaBatches);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoa = async (batchId) => {
    if (window.confirm('Are you sure you want to remove the COA document from this batch record?')) {
      try {
        const payload = {
            coaFile: null,
            coaUrl: null,
            coaStatus: 'pending'
        };
        const res = await apiService.updateBatch(batchId, payload);
        if (res.ok) {
          fetchBatches();
        } else {
          alert('Failed to remove COA document');
        }
      } catch (error) {
        alert('Error removing COA document');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading COA documents...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">COA Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage uploaded Certificates of Analysis for all batches</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm items-center">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Batch ID or Product Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <CustomDropdown
            value={filterProductId}
            onChange={(val) => setFilterProductId(val)}
            options={[
              { label: 'All Products', value: '' },
              ...products.map(p => ({ label: p.name, value: p._id }))
            ]}
            placeholder="All Products"
          />
        </div>
        {(filterProductId || searchQuery) && (
          <button
            onClick={() => { setFilterProductId(''); setSearchQuery(''); }}
            className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-500 text-[13px] font-semibold hover:bg-red-100 transition-all cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Document</th>
                <th className="px-5 py-4">Batch ID</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Purity / Content</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.filter(batch => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                const matchBatchId = batch.batchId?.toLowerCase().includes(query);
                const matchProductName = batch.productId?.name?.toLowerCase().includes(query);
                const matchDisplayName = batch.displayName?.toLowerCase().includes(query);
                return matchBatchId || matchProductName || matchDisplayName;
              }).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400 italic">
                    No COA documents found.
                  </td>
                </tr>
              ) : (
                batches.filter(batch => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  const matchBatchId = batch.batchId?.toLowerCase().includes(query);
                  const matchProductName = batch.productId?.name?.toLowerCase().includes(query);
                  const matchDisplayName = batch.displayName?.toLowerCase().includes(query);
                  return matchBatchId || matchProductName || matchDisplayName;
                }).map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <a
                        href={batch.coaFile?.url || batch.coaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 rounded-md text-[12px] font-semibold text-[#214A9E] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View COA
                      </a>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">
                      {batch.batchId}
                    </td>
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <span className="line-clamp-1 text-slate-700 font-medium">
                        {batch.productId?.name || <span className="text-red-400 italic">Unknown</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-700 font-medium">{batch.purity || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCoa(batch._id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-[13px] cursor-pointer inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Document
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoaList;
