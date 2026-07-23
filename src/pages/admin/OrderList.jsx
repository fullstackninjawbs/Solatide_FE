import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import Pagination from '../../components/Pagination';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Package,
  ExternalLink,
  RefreshCw,
  Download
} from 'lucide-react';

// ─── Helper: format date like Shopify ("Today at 2:31 pm") ────────────────────
function formatOrderDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  return date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
}

function fmtAUD(amount) {
  if (amount == null) return '—';
  return `$${Number(amount).toFixed(2)}`;
}

// ─── Status badge components ──────────────────────────────────────────────────
const PAYMENT_BADGE = {
  paid: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  failed: 'bg-red-100 text-red-700 border border-red-200',
  refunded: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const FULFIL_BADGE = {
  unfulfilled: 'bg-amber-50 text-amber-700 border border-amber-200',
  fulfilled: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  partial: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const DELIVERY_BADGE = {
  pending: 'bg-slate-100 text-slate-500 border border-slate-200',
  tracking_added: 'bg-blue-100 text-blue-700 border border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

function Badge({ text, styleMap, fallback = 'bg-slate-100 text-slate-500 border border-slate-200' }) {
  const cls = styleMap?.[text] ?? fallback;
  const label = text ? text.replace(/_/g, ' ') : '—';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const TABS = [
  { label: 'All', filter: {} },
  { label: 'Unfulfilled', filter: { fulfilmentStatus: 'unfulfilled' } },
  { label: 'Paid', filter: { paymentStatus: 'paid' } },
  // { label: 'Refunded', filter: { paymentStatus: 'refunded' } },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const activeTab = parseInt(searchParams.get('tab') || '0', 10);
  const urlQ = searchParams.get('q') || '';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState(urlQ);
  const debounceRef = useRef(null);

  // Sync search input with browser back/forward URL changes
  useEffect(() => {
    setSearchValue(urlQ);
  }, [urlQ]);

  // Debounce search input and update URL query parameters
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (searchValue === currentQ) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchValue.trim()) {
        nextParams.set('q', searchValue.trim());
      } else {
        nextParams.delete('q');
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchValue, searchParams, setSearchParams]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const tabFilter = TABS[activeTab]?.filter || {};
      Object.entries(tabFilter).forEach(([k, v]) => params.set(k, v));
      
      const q = searchParams.get('q');
      if (q) params.set('q', q);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await apiService.getAdminOrders(params.toString());
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (idx) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', String(idx));
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const customerName = (o) => {
    if (o.customer?.firstName || o.customer?.lastName) {
      return [o.customer.firstName, o.customer.lastName].filter(Boolean).join(' ');
    }
    return o.customerName || o.customerEmail || '—';
  };

  const itemCount = (o) => {
    if (o.lineItems?.length) return `${o.lineItems.length} item${o.lineItems.length !== 1 ? 's' : ''}`;
    if (o.products?.length) return `${o.products.length} item${o.products.length !== 1 ? 's' : ''}`;
    return '—';
  };

  const orderTotal = (o) => fmtAUD(o.grandTotal ?? o.totalAmount);

  return (
    <div className="space-y-5 text-left font-sans">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Orders</h2>
          <p className="text-slate-500 text-[14px] mt-0.5">
            {loading ? 'Loading…' : `${total.toLocaleString()} total order${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            disabled
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-400 cursor-not-allowed opacity-60"
            title="Export (coming soon)"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── Main card ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.018)] overflow-hidden">

        {/* ── Filter Tabs + Search ────────────────────────────────────────── */}
        <div className="border-b border-slate-100">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pt-3">
            {TABS.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(idx)}
                className={`px-4 py-2 text-[13px] font-semibold rounded-t-lg transition-all border-b-2 ${activeTab === idx
                    ? 'border-brand-navy text-brand-navy bg-slate-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search order # or email…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue bg-slate-50 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Order</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Channel</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Total</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Payment</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Fulfilment</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Items</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Delivery</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Shipping Method</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded-md w-full max-w-[80px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Package size={40} strokeWidth={1.2} />
                      <p className="text-[14px] font-medium">No orders found</p>
                      <p className="text-[12px]">Orders will appear here once customers complete checkout via Tagada.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Order # */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="font-semibold text-brand-navy hover:text-brand-blue transition-colors flex items-center gap-1 group-hover:underline"
                      >
                        {order.orderNumber ?? `#${String(order._id).slice(-6).toUpperCase()}`}
                        <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      </Link>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatOrderDate(order.createdAt)}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{customerName(order)}</span>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      Tagadacm
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                      {orderTotal(order)}
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge text={order.paymentStatus} styleMap={PAYMENT_BADGE} />
                    </td>

                    {/* Fulfilment */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge text={order.fulfilmentStatus} styleMap={FULFIL_BADGE} />
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {itemCount(order)}
                    </td>

                    {/* Delivery */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.deliveryStatus ? (
                        <Badge text={order.deliveryStatus} styleMap={DELIVERY_BADGE} />
                      ) : (
                        <span className="text-slate-400 text-[12px]">—</span>
                      )}
                    </td>

                    {/* Shipping Method */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap max-w-[180px] truncate">
                      {order.shippingMethodName ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {!loading && orders.length > 0 && (
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

export default OrderList;
