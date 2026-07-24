import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Tag, Package, Truck, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import Pagination from '../../components/Pagination';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';

const DiscountList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const selectedStatus = searchParams.get('status') || 'all';
  const urlQ = searchParams.get('q') || '';

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Sync search input with browser URL changes
  useEffect(() => {
    setSearchQuery(urlQ);
  }, [urlQ]);

  // Debounce search input and sync with URL query
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

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (urlQ) params.set('search', urlQ);
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);

      const res = await apiService.getAdminDiscounts(params.toString());
      const data = await res.json();
      if (data.success && data.data) {
        setDiscounts(data.data.discounts);
        setTotal(data.total ?? data.data.pagination?.total ?? 0);
      } else {
        setError('Failed to fetch discounts.');
      }
    } catch (err) {
      setError('Error connecting to server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [page, limit, selectedStatus, urlQ]);

  const handleStatusChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('status', val);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;
    try {
      const res = await apiService.deleteAdminDiscount(id);
      if (res.ok || res.status === 204) {
        setDiscounts(discounts.filter(d => d._id !== id));
      } else {
        alert('Failed to delete discount.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting discount.');
    }
  };

  const handleSyncFromTagada = async () => {
    try {
      setLoading(true);
      const res = await apiService.syncAdminDiscountsFromTagada();
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchDiscounts();
      } else {
        alert(data.message || 'Failed to sync from Tagada.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server to sync.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Discounts</h2>
          <p className="text-slate-500 text-[14px]">Manage your discount codes and automatic discounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminSecondaryButton
            onClick={handleSyncFromTagada}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync from Tagada
          </AdminSecondaryButton>
          <div title="Order mgmt will happen in Tagada">
            <AdminPrimaryButton href="https://app.tagadapay.com/dashboard" target="_blank">
              Create discount
            </AdminPrimaryButton>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] min-h-[500px]">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discounts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
            />
          </div>
          <CustomDropdown
            value={selectedStatus}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'expired', label: 'Expired' }
            ]}
          />
        </div>

        {/* Table list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
            <p className="text-[14px] font-medium">Loading discounts...</p>
          </div>
        ) : discounts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Tag className="h-12 w-12 text-slate-300" />
            <p className="text-[15px] font-semibold text-slate-650">No discounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
                  </th>
                  <th className="py-4 pl-2 pr-4 min-w-[200px]">Title</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Method</th>
                  <th className="py-4 px-4">Eligibility</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Combinations</th>
                  <th className="py-4 px-4 text-center">Used</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {discounts.map((discount) => (
                  <tr key={discount._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 pl-6">
                      <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
                    </td>
                    <td className="py-3.5 pl-2 pr-4">
                      <Link to={`/admin/discounts/edit/${discount._id}`} className="font-semibold text-slate-800 hover:text-brand-blue transition-colors">
                        {discount.code}
                      </Link>
                      <div className="text-slate-500 text-[13px] mt-0.5">
                        {discount.type === 'percent' ? `${discount.value}%` : `$${discount.value}`} off {discount.appliesTo === 'all' ? 'entire order' : discount.appliesTo}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold tracking-wide ${discount.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : discount.status === 'expired'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {discount.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Code
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        All customers
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        Amount off order
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Tag className="w-4 h-4" />
                        <Package className="w-4 h-4" />
                        <Truck className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {discount.usesSoFar || 0}
                    </td>
                    <td className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href="https://app.tagadapay.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-blue-800 font-semibold text-[13px]"
                            title="Order mgmt will happen in Tagada"
                          >
                            Manage in Tagada
                          </a>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && discounts.length > 0 && (
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

export default DiscountList;
