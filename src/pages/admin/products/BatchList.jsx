import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCoaStatus, setFilterCoaStatus] = useState('');
  const [filterProductId, setFilterProductId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [filterStatus, filterCoaStatus, filterProductId]);

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
      if (filterStatus) params.set('status', filterStatus);
      if (filterCoaStatus) params.set('coaStatus', filterCoaStatus);
      if (filterProductId) params.set('productId', filterProductId);

      const res = await apiService.getBatches(params.toString());
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.batches);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch record?')) {
      try {
        const res = await apiService.deleteBatch(id);
        if (res.ok || res.status === 204) {
          fetchBatches();
        } else {
          alert('Failed to delete batch');
        }
      } catch (error) {
        alert('Error deleting batch');
        console.error(error);
      }
    }
  };

  const flagSummary = (batch) => {
    const flags = [];
    if (batch.includesPurity) flags.push('Purity');
    if (batch.includesMeasuredContent) flags.push('Content');
    if (batch.includesEndotoxin || batch.endotoxinIncludedInCoa) flags.push('Endotoxin');
    if (batch.includesSterility || batch.sterilityIncludedInCoa) flags.push('Sterility');
    return flags.length ? flags.join(' · ') : '—';
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading batch records...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Batch Records</h1>
          <p className="text-sm text-slate-500 mt-1">Manage COA batches and product/variant assignments</p>
        </div>
        <Link
          to="/admin/batches/new"
          className="bg-[#214A9E] hover:bg-[#1a3a7d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Batch Record
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterCoaStatus}
          onChange={(e) => setFilterCoaStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
        >
          <option value="">All COA Statuses</option>
          <option value="pending">COA Pending</option>
          <option value="approved">COA Approved</option>
        </select>
        <select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-blue-400 transition-all cursor-pointer flex-1 min-w-[180px]"
        >
          <option value="">All Products</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        {(filterStatus || filterCoaStatus || filterProductId) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterCoaStatus(''); setFilterProductId(''); }}
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
                <th className="px-5 py-4">Batch ID</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Purity / Content</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">COA Status</th>
                <th className="px-5 py-4">Flags</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-slate-400 italic">
                    No batch records found.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">
                      {batch.batchId}
                      {batch.displayName && (
                        <span className="block text-[11px] text-slate-400 font-normal">{batch.displayName}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 max-w-[160px]">
                      <span className="line-clamp-1 text-slate-700 font-medium">
                        {batch.productId?.name || <span className="text-red-400 italic">Unknown</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-700 font-medium">{batch.purity || '—'}</span>
                      {(batch.measuredContent || batch.content) && (
                        <span className="block text-[11px] text-slate-400 max-w-[160px] truncate">
                          {batch.measuredContent || batch.content}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[140px]">
                      <span className="line-clamp-1">{batch.method || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap ${
                        batch.coaStatus === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {batch.coaStatus === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                      {batch.coaUrl && (
                        <a
                          href={batch.coaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[11px] text-blue-500 hover:underline mt-0.5"
                        >
                          View COA →
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-500">
                      {flagSummary(batch)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${
                        batch.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {batch.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/batches/${batch._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-[13px]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(batch._id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-[13px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
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

export default BatchList;
