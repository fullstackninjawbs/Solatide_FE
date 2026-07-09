import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Tag, Package, Truck, Edit2, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (searchQuery) params.set('search', searchQuery);
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);

      const res = await apiService.getAdminDiscounts(params.toString());
      const data = await res.json();
      if (data.success && data.data) {
        setDiscounts(data.data.discounts);
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
    const delayDebounceFn = setTimeout(() => {
      fetchDiscounts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedStatus]);

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

  return (
    <div className="space-y-6 text-left font-sans pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Discounts</h2>
          <p className="text-slate-500 text-[14px]">Manage your discount codes and automatic discounts.</p>
        </div>
        <Link
          to="/admin/discounts/new"
          className="bg-brand-navy hover:bg-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          Create discount
        </Link>
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
            onChange={setSelectedStatus}
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/discounts/edit/${discount._id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit discount"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete discount"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountList;
