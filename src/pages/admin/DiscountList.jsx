import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Tag, Edit2, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import Pagination from '../../components/Pagination';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { useConfirm } from '../../components/admin/feedback/ConfirmProvider';
import { useToast } from '../../components/admin/feedback/ToastProvider';
import { getUserFriendlyErrorMessage } from '../../utils/getUserFriendlyErrorMessage';

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
  const confirm = useConfirm();
  const toast = useToast();

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
    const isConfirmed = await confirm({
      title: 'Delete Discount',
      message: 'Are you sure you want to delete this discount?',
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!isConfirmed) return;
    try {
      const res = await apiService.deleteAdminDiscount(id);
      if (res.ok || res.status === 204) {
        setDiscounts(discounts.filter(d => d._id !== id));
        toast.success('Discount deleted successfully');
      } else {
        toast.error('Failed to delete discount.');
      }
    } catch (err) {
      console.error(err);
      toast.error(getUserFriendlyErrorMessage(err, 'deleteDiscount'));
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Discounts</h2>
          <p className="text-slate-500 text-[14px]">Discount codes customers can use at checkout.</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminPrimaryButton to="/admin/discounts/new">
            Create discount
          </AdminPrimaryButton>
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
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'expired', label: 'Expired' },
              { value: 'disabled', label: 'Disabled' }
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
                  <th className="py-4 pl-6 pr-4 min-w-[200px]">Code</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Rules</th>
                  <th className="py-4 px-4">Schedule</th>
                  <th className="py-4 px-4 text-center">Used</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {discounts.map((discount) => {
                  const st = discount.displayStatus || discount.status;
                  const rules = discount.rules || [];
                  const fmt = (d) => new Date(d).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
                  return (
                    <tr key={discount._id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/discounts/edit/${discount._id}`)}>
                      <td className="py-3.5 pl-6 pr-4">
                        <span className="font-semibold text-slate-800">{discount.code}</span>
                        <div className="text-slate-500 text-[13px] mt-0.5">
                          {discount.type === 'percent' ? `${discount.value}%` : `A$${Number(discount.value || 0).toFixed(2)}`} off order
                          {Number(discount.perCustomerLimit) > 0 ? ' · one per customer' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold tracking-wide capitalize ${st === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st === 'scheduled'
                            ? 'bg-sky-100 text-sky-800'
                            : st === 'expired'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-red-100 text-red-700'
                          }`}>
                          {st}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[13px]">
                        {rules.length === 0 && !(discount.minPurchase > 0) && !(discount.minQuantity > 0) ? 'No conditions' : (
                          <span>
                            {rules.map((r) => ({
                              cart_min_quantity: `Min ${r.quantity} items`,
                              cart_total_min: `Min A$${r.amount}`,
                              cart_total_max: `Max A$${r.amount}`,
                              cart_contains_product: `Contains ${r.products?.length || 0} product(s)`,
                              excluded_products: `Excludes ${r.products?.length || 0} product(s)`,
                              max_product_quantity: `Max ${r.quantity} per product`,
                            }[r.type] || r.type)).concat(discount.minPurchase > 0 ? [`Min A$${discount.minPurchase}`] : [], discount.minQuantity > 0 ? [`Min ${discount.minQuantity} items`] : []).join(discount.ruleMatch === 'any' ? ' or ' : ' · ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[13px] whitespace-nowrap">
                        {discount.activeFrom || discount.activeTo
                          ? `${discount.activeFrom ? fmt(discount.activeFrom) : 'Now'} → ${discount.activeTo ? fmt(discount.activeTo) : 'No end'}`
                          : 'No date limit'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-slate-700 whitespace-nowrap">
                        {discount.usesSoFar || 0}{Number(discount.maxUses) > 0 ? ` / ${discount.maxUses}` : ''}
                      </td>
                      <td className="py-3.5 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/discounts/edit/${discount._id}`} className="p-2 text-slate-400 hover:text-brand-blue" aria-label={`Edit ${discount.code}`}><Edit2 className="w-4 h-4" /></Link>
                          <button type="button" onClick={() => handleDelete(discount._id)} className="p-2 text-slate-400 hover:text-red-600" aria-label={`Delete ${discount.code}`}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
