import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../../services/api';
import CustomDropdown from '../../../components/CustomDropdown';
import Pagination from '../../../components/Pagination';

const BatchList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const filterStatus = searchParams.get('status') || '';
  const filterCoaStatus = searchParams.get('coaStatus') || '';
  const filterProductId = searchParams.get('productId') || '';
  const urlQ = searchParams.get('q') || '';

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState(urlQ);

  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Sync search input with browser URL changes
  useEffect(() => {
    setSearchQuery(urlQ);
  }, [urlQ]);

  // Debounce search input and update URL query parameters
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (searchQuery === currentQ) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        nextParams.set('q', searchQuery.trim());
      } else {
        nextParams.delete('q');
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchParams, setSearchParams]);

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
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (filterStatus) params.set('status', filterStatus);
      if (filterCoaStatus) params.set('coaStatus', filterCoaStatus);
      if (filterProductId) params.set('productId', filterProductId);
      if (urlQ) params.set('search', urlQ);

      const res = await apiService.getBatches(params.toString());
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.batches);
        setTotal(data.total ?? data.data.pagination?.total ?? 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [page, limit, filterStatus, filterCoaStatus, filterProductId, urlQ]);

  const handleStatusChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('status', val);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleCoaStatusChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('coaStatus', val);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleProductChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('productId', val);
    } else {
      nextParams.delete('productId');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
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
    <div className="w-full">
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
        <CustomDropdown
          value={filterStatus}
          onChange={handleStatusChange}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]}
          placeholder="All Statuses"
        />
        <CustomDropdown
          value={filterCoaStatus}
          onChange={handleCoaStatusChange}
          options={[
            { label: 'All COA Statuses', value: '' },
            { label: 'COA Pending', value: 'pending' },
            { label: 'COA Approved', value: 'approved' }
          ]}
          placeholder="All COA Statuses"
        />
        <div className="flex-1 min-w-[200px]">
          <CustomDropdown
            value={filterProductId}
            onChange={handleProductChange}
            options={[
              { label: 'All Products', value: '' },
              ...products.map(p => ({ label: p.name, value: p._id }))
            ]}
            placeholder="All Products"
          />
        </div>
        {(filterStatus || filterCoaStatus || filterProductId || searchQuery) && (
          <button
            onClick={handleClearFilters}
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
                      <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap ${batch.coaStatus === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}>
                        {batch.coaStatus === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                      {(batch.coaFile?.url || batch.coaUrl) && (
                        <a
                          href={batch.coaFile?.url || batch.coaUrl}
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
                      <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${batch.status === 'active'
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

        {/* Pagination */}
        {!loading && batches.length > 0 && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default BatchList;
