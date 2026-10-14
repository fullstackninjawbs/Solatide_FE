import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../../services/api';
import CustomDropdown from '../../../components/CustomDropdown';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';
import { getUserFriendlyErrorMessage } from '../../../utils/getUserFriendlyErrorMessage';
import Pagination from '../../../components/Pagination';

const CoaList = () => {
  // Page, page size, search and product filter live in the URL (same pattern as admin Orders)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const urlQ = searchParams.get('q') || '';
  const filterProductId = searchParams.get('product') || '';

  const [batches, setBatches] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const debounceRef = useRef(null);
  const toast = useToast();
  const confirm = useConfirm();

  // Sync search input with browser back/forward URL changes
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setSearchQuery(urlQ);
  }

  // Debounce search input into the URL (server-side search)
  useEffect(() => {
    if (searchQuery === urlQ) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchQuery.trim()) nextParams.set('q', searchQuery.trim());
      else nextParams.delete('q');
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, urlQ, searchParams, setSearchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const setFilterProductId = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set('product', val);
    else nextParams.delete('product');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.delete('product');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const fetchProducts = async () => {
    try {
      const res = await apiService.getProducts('limit=200');
      const data = await res.json();
      if (data.success) setProducts(data.data.products);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      // Server-side: only batches with a COA document, paged (previously only the first 50
      // batches were fetched and then filtered here, so older COAs could go missing)
      const params = new URLSearchParams();
      params.set('hasCoa', 'true');
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (filterProductId) params.set('productId', filterProductId);
      if (urlQ) params.set('search', urlQ);

      const res = await apiService.getBatches(params.toString());
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.batches);
        setTotal(data.total ?? 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterProductId, urlQ]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);
  const handleDeleteCoa = async (batchId) => {
    const isConfirmed = await confirm({
      title: 'Remove COA Document?',
      description: 'Are you sure you want to remove the COA document from this batch record?',
      confirmLabel: 'Remove Document',
      variant: 'danger'
    });

    if (isConfirmed) {
      try {
        const payload = {
            coaFile: null,
            coaUrl: null,
            coaStatus: 'pending'
        };
        const res = await apiService.updateBatch(batchId, payload);
        if (res.ok) {
          fetchBatches();
          toast.success('COA document removed successfully');
        } else {
          toast.error('Failed to remove COA document');
        }
      } catch (error) {
        toast.error(getUserFriendlyErrorMessage(error, 'coaRemove'));
        console.error(error);
      }
    }
  };

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
            onClick={clearFilters}
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-500">
                    Loading COA documents...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400 italic">
                    No COA documents found.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
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
                      <Link
                        to={`/admin/batches/${batch._id}/edit`}
                        className="line-clamp-1 text-slate-700 font-medium hover:text-brand-blue hover:underline"
                      >
                        {batch.products?.length > 0 ? (
                          batch.products.map(p => p.name).join(', ')
                        ) : batch.productId?.name ? (
                          batch.productId.name
                        ) : (
                          <span className="text-red-400 italic">Unknown</span>
                        )}
                      </Link>
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

export default CoaList;
