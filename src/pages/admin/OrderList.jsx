import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import Pagination from '../../components/Pagination';
import CustomDropdown from '../../components/CustomDropdown';
import CountryFlag from '../../components/CountryFlag';
import {
  Search,
  Package,
  ExternalLink,
  RefreshCw,
  Download,
  Trash2,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Clock,
  Printer,
  MinusCircle,
  X
} from 'lucide-react';
import { useToast } from '../../components/admin/feedback/ToastProvider';
import { getUserFriendlyErrorMessage } from '../../utils/getUserFriendlyErrorMessage';

function formatOrderDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  
  // Format for Australia/Sydney e.g. "Tue, 10 Nov at 4:30 pm"
  const timeStr = date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' }).toLowerCase();
  const datePart = date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' });
  
  return `${datePart} at ${timeStr}`;
}

const SYD = { timeZone: 'Australia/Sydney' };
const formatOrderDay = (d) => (d ? new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', ...SYD }) : '—');
const formatOrderTime = (d) => (d ? new Date(d).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, ...SYD }).toLowerCase() : '');

function fmtAUD(amount) {
  if (amount == null) return '—';
  return `$${Number(amount).toFixed(2)}`;
}

// ─── Status badges (same pill style as the rest of the admin) ─────────────────
const PAYMENT_BADGE = {
  paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  awaiting_payment: 'bg-amber-50 text-amber-700 border border-amber-200',
  failed: 'bg-red-50 text-red-700 border border-red-200',
  partially_refunded: 'bg-slate-100 text-slate-600 border border-slate-200',
  refunded: 'bg-slate-100 text-slate-600 border border-slate-200',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const PAYMENT_LABEL = {
  paid: 'Paid',
  pending: 'Pending',
  awaiting_payment: 'Awaiting Payment',
  failed: 'Failed',
  partially_refunded: 'Partially Refunded',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

// Bank transfer / PayID orders (our own checkout) — payment confirmed manually by the admin
const BANK_METHODS = ['payid', 'bank_transfer', 'international_bank_transfer'];
const paymentBadgeText = (o) => (o.paymentStatus === 'pending' && BANK_METHODS.includes(o.paymentMethod) ? 'awaiting_payment' : o.paymentStatus);

const FULFIL_BADGE = {
  unfulfilled: 'bg-amber-50 text-amber-700 border border-amber-200',
  fulfilled: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  partial: 'bg-blue-50 text-blue-700 border border-blue-200',
};

const FULFIL_LABEL = {
  unfulfilled: 'Unfulfilled',
  fulfilled: 'Fulfilled',
  partial: 'Partial',
};

function Pill({ value, styles, labels }) {
  const cls = styles[value] || 'bg-slate-100 text-slate-500 border border-slate-200';
  const label = labels[value] || (value ? value.replace(/_/g, ' ') : '—');
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

// ─── Traffic source ───────────────────────────────────────────────────────────
// As recorded at checkout (utils/attribution.ts already gives a clean label such as
// "Google Organic", "Google Ads", "Instagram Ads", "ChatGPT" or a referring site)
function trafficSource(o) {
  const touch = o.attribution?.lastTouch || o.attribution?.firstTouch;
  const source = String(touch?.source || '').trim();
  if (!source || /^(\(?direct\)?|none)$/i.test(source) || /^direct\b/i.test(source)) return 'Direct';
  return source;
}

// ─── Delivery status ──────────────────────────────────────────────────────────
// `order.delivery` comes from the server (services/shipping/deliveryStatus.ts), the same
// logic as the tracking timeline on the order page, so both always agree.
const DELIVERY_STYLE = {
  not_shipped: { label: 'Not Shipped', Icon: MinusCircle, pill: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-100 text-slate-400' },
  label_pending: { label: 'Label Pending', Icon: Clock, pill: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-50 text-amber-600' },
  label_created: { label: 'Label Created', Icon: Printer, pill: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-50 text-violet-600' },
  in_transit: { label: 'In Transit', Icon: Truck, pill: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-50 text-blue-600' },
  out_for_delivery: { label: 'Out for Delivery', Icon: Truck, pill: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-50 text-indigo-600' },
  delayed: { label: 'Delayed', Icon: Clock, pill: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-50 text-amber-600' },
  exception: { label: 'Delivery Issue', Icon: AlertTriangle, pill: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-50 text-red-600' },
  returned: { label: 'Returned to Sender', Icon: AlertTriangle, pill: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-50 text-red-600' },
  delivered: { label: 'Delivered', Icon: CheckCircle2, pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-50 text-emerald-600' },
};

const shortDate = (d) => (d
  ? new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' })
  : '');

function deliveryNote(d) {
  switch (d.stage) {
    case 'delivered': return shortDate(d.at);
    case 'in_transit': return d.at ? `Dispatched ${shortDate(d.at)}` : '';
    case 'out_for_delivery': return d.at ? shortDate(d.at) : '';
    case 'delayed': return `No update for ${d.days} days`;
    case 'exception': return 'Check with the carrier';
    case 'returned': return d.at ? shortDate(d.at) : '';
    case 'label_created': return 'Awaiting carrier scan';
    case 'label_pending': return 'Print it in Starshipit';
    default: return '';
  }
}

function DeliveryStatus({ order }) {
  const d = order.delivery || { stage: 'not_shipped' };
  const style = DELIVERY_STYLE[d.stage] || DELIVERY_STYLE.not_shipped;
  const { Icon } = style;
  const note = deliveryNote(d);
  return (
    <div className="flex items-center gap-2" title={d.source === 'manual' ? 'Tracking entered manually' : undefined}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${style.dot}`}>
        <Icon size={13} strokeWidth={2.5} />
      </span>
      <div className="leading-tight">
        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${style.pill}`}>
          {style.label}
        </span>
        {note && <div className="text-[11px] text-slate-400 font-medium mt-0.5">{note}</div>}
      </div>
    </div>
  );
}

// ─── Country ──────────────────────────────────────────────────────────────────
// Shipping country as a 2-letter code. Website orders store the code already ("AU");
// older / imported orders may store the name. Unknown → "—" (never guessed).
const COUNTRY_NAME_TO_ISO = {
  AUSTRALIA: 'AU', 'NEW ZEALAND': 'NZ', 'UNITED STATES': 'US', 'UNITED STATES OF AMERICA': 'US', USA: 'US',
  'UNITED KINGDOM': 'GB', UK: 'GB', 'GREAT BRITAIN': 'GB', CANADA: 'CA', INDIA: 'IN', GERMANY: 'DE',
  FRANCE: 'FR', SINGAPORE: 'SG', MALAYSIA: 'MY', INDONESIA: 'ID', PHILIPPINES: 'PH', JAPAN: 'JP',
  CHINA: 'CN', IRELAND: 'IE', NETHERLANDS: 'NL', SWITZERLAND: 'CH', SWEDEN: 'SE', NORWAY: 'NO',
  DENMARK: 'DK', FINLAND: 'FI', BELGIUM: 'BE', AUSTRIA: 'AT', ITALY: 'IT', SPAIN: 'ES', PORTUGAL: 'PT',
  GREECE: 'GR', POLAND: 'PL', 'SOUTH AFRICA': 'ZA', BRAZIL: 'BR', MEXICO: 'MX', 'UNITED ARAB EMIRATES': 'AE',
  UAE: 'AE', 'SAUDI ARABIA': 'SA', ISRAEL: 'IL', TURKEY: 'TR', THAILAND: 'TH', VIETNAM: 'VN',
  'HONG KONG': 'HK', TAIWAN: 'TW', 'SOUTH KOREA': 'KR', FIJI: 'FJ', 'PAPUA NEW GUINEA': 'PG',
};
const ISO3_TO_ISO2 = { AUS: 'AU', NZL: 'NZ', USA: 'US', GBR: 'GB', CAN: 'CA', IND: 'IN' };

function orderCountryCode(o) {
  const raw = o.shippingAddressObj?.country
    || o.billingAddressObj?.country
    || (typeof o.shippingAddress === 'object' && o.shippingAddress?.country)
    || o.customer?.defaultAddress?.country
    || '';
  const v = String(raw).trim().toUpperCase();
  if (!v) return '';
  if (/^[A-Z]{2}$/.test(v)) return v;
  return ISO3_TO_ISO2[v] || COUNTRY_NAME_TO_ISO[v] || '';
}

function CountryCell({ order }) {
  const code = orderCountryCode(order);
  if (!code) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap" title={code}>
      <CountryFlag countryCode={code} alt="" className="rounded-sm ring-1 ring-slate-200 shrink-0" style={{ width: 18, height: 13, objectFit: 'cover' }} />
      <span className="text-[13px] font-semibold text-slate-700">{code}</span>
    </div>
  );
}

// ─── Items: total quantity ────────────────────────────────────────────────────
function itemQuantity(o) {
  const lines = o.lineItems?.length ? o.lineItems : (o.products || []);
  if (!lines.length) return '—';
  const qty = lines.reduce((sum, l) => sum + (Number(l?.quantity) || 0), 0);
  return qty || lines.length;
}

function SortIcon({ active, order }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />;
  return order === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 text-brand-blue" />
    : <ArrowDown className="h-3.5 w-3.5 text-brand-blue" />;
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const TABS = [
  { label: 'All', filter: { hasCustomer: true } },
  { label: 'Awaiting Payment', filter: { awaitingPayment: 'true' } },
  { label: 'Unfulfilled', filter: { fulfilmentStatus: 'unfulfilled', hasCustomer: true } },
  { label: 'Paid', filter: { paymentStatus: 'paid', hasCustomer: true } },
  { label: 'Abandoned Checkouts', filter: { hasCustomer: false } },
  { label: 'Deleted Orders', filter: { isDeleted: 'true' } },
];

// ─── Filters (dropdowns next to the search) ───────────────────────────────────
// Each is kept in the URL and sent to GET /api/admin/order (validated on the server).
const FILTERS = [
  { key: 'payment', param: 'paymentStatus', placeholder: 'Payment', allLabel: 'All payments', options: [
    { value: 'paid', label: 'Paid' },
    { value: 'awaiting_payment', label: 'Awaiting payment' },
    { value: 'partially_refunded', label: 'Partially refunded' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'failed', label: 'Failed' },
  ] },
  { key: 'fulfilment', param: 'fulfilmentStatus', placeholder: 'Fulfilment', allLabel: 'All fulfilment', options: [
    { value: 'unfulfilled', label: 'Unfulfilled' },
    { value: 'fulfilled', label: 'Fulfilled' },
  ] },
  { key: 'delivery', param: 'delivery', placeholder: 'Delivery', allLabel: 'All deliveries', options: [
    { value: 'not_shipped', label: 'Not shipped' },
    { value: 'label_pending', label: 'Label pending' },
    { value: 'label_created', label: 'Label created' },
    { value: 'in_transit', label: 'In transit' },
    { value: 'out_for_delivery', label: 'Out for delivery' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'issue', label: 'Delivery issue' },
    { value: 'delivered', label: 'Delivered' },
  ] },
  { key: 'destination', param: 'destination', placeholder: 'Destination', allLabel: 'All destinations', options: [
    { value: 'au', label: 'Australia' },
    { value: 'international', label: 'International' },
  ] },
  { key: 'method', param: 'paymentMethod', placeholder: 'Payment method', allLabel: 'All methods', options: [
    { value: 'payid', label: 'PayID' },
    { value: 'bank_transfer', label: 'Bank transfer' },
    { value: 'international_bank_transfer', label: 'International transfer' },
    { value: 'tagada', label: 'Card (Tagada)' },
    { value: 'manual_offline', label: 'Manual (admin)' },
  ] },
  { key: 'date', param: null, placeholder: 'Date', allLabel: 'All dates', options: [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
  ] },
];
const FILTER_KEYS = FILTERS.map((x) => x.key);

// Start of a calendar day in Sydney time, as an exact instant (handles daylight saving)
function sydneyDayStart(y, m, d) {
  const wall = Date.UTC(y, m, d);
  const offsetAt = (utc) => {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Australia/Sydney', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date(utc));
    const g = (t) => Number(p.find((x) => x.type === t)?.value);
    return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute')) - utc;
  };
  let utc = wall - offsetAt(wall);
  utc = wall - offsetAt(utc);
  return new Date(utc);
}

/** Date preset → { from, to } (to exclusive), using Sydney calendar days. */
function dateRange(preset) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const g = (t) => Number(p.find((x) => x.type === t)?.value);
  const y = g('year'); const m = g('month') - 1; const d = g('day');
  const day = (offset) => sydneyDayStart(y, m, d + offset);
  switch (preset) {
    case 'today': return { from: day(0), to: day(1) };
    case 'yesterday': return { from: day(-1), to: day(0) };
    case '7d': return { from: day(-6), to: day(1) };
    case '30d': return { from: day(-29), to: day(1) };
    case 'this_month': return { from: sydneyDayStart(y, m, 1), to: day(1) };
    case 'last_month': return { from: sydneyDayStart(y, m - 1, 1), to: sydneyDayStart(y, m, 1) };
    default: return null;
  }
}

const TH = 'text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap';

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const activeTab = parseInt(searchParams.get('tab') || '0', 10);
  const urlQ = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const filterValues = Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || '']));
  const activeFilterCount = FILTER_KEYS.filter((k) => filterValues[k]).length;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState(urlQ);
  const debounceRef = useRef(null);
  const toast = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalMode, setDeleteModalMode] = useState('single');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

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

      for (const flt of FILTERS) {
        const v = searchParams.get(flt.key);
        if (!v || !flt.param) continue;
        if (flt.key === 'payment') params.delete('awaitingPayment');
        params.set(flt.param, v);
      }
      const range = dateRange(searchParams.get('date'));
      if (range) {
        params.set('from', range.from.toISOString());
        params.set('to', range.to.toISOString());
      }

      const q = searchParams.get('q');
      if (q) params.set('q', q);
      if (sortBy) {
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
      }
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
  }, [activeTab, page, limit, searchParams, sortBy, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (idx) => {
    setSelectedOrders([]);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', String(idx));
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleFilterChange = (key, value) => {
    setSelectedOrders([]);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSelectedOrders([]);
    const nextParams = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((k) => nextParams.delete(k));
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const handleSoftDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiService.softDeleteAdminOrder(orderToDelete._id);
      const data = await res.json();
      if (data.success) {
        toast.success('Order moved to deleted orders list');
        setDeleteModalOpen(false);
        setOrderToDelete(null);
        fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to delete order');
      }
    } catch (err) {
      toast.error(getUserFriendlyErrorMessage(err, 'deleteOrder'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (orderId) => {
    try {
      const res = await apiService.restoreAdminOrder(orderId);
      const data = await res.json();
      if (data.success) {
        toast.success('Order restored successfully');
        fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to restore order');
      }
    } catch (err) {
      toast.error(getUserFriendlyErrorMessage(err, 'restoreOrder'));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map((o) => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
    );
  };

  const handleBulkSoftDelete = async () => {
    if (selectedOrders.length === 0) return;
    
    setIsDeleting(true);
    try {
      const res = await apiService.bulkSoftDeleteAdminOrders(selectedOrders);
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedOrders.length} orders moved to deleted list`);
        setDeleteModalOpen(false);
        setSelectedOrders([]);
        fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to bulk delete orders');
      }
    } catch (err) {
      toast.error(getUserFriendlyErrorMessage(err, 'deleteOrder'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedOrders.length === 0) return;
    setIsBulkProcessing(true);
    try {
      const res = await apiService.bulkRestoreAdminOrders(selectedOrders);
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedOrders.length} orders restored successfully`);
        setSelectedOrders([]);
        fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to bulk restore orders');
      }
    } catch (err) {
      toast.error(getUserFriendlyErrorMessage(err, 'restoreOrder'));
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleSort = (field) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sortBy === field) {
      if (sortOrder === 'asc') {
        nextParams.set('sortOrder', 'desc');
      } else {
        nextParams.delete('sortBy');
        nextParams.delete('sortOrder');
      }
    } else {
      nextParams.set('sortBy', field);
      nextParams.set('sortOrder', 'asc');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const customerName = (o) => {
    if (o.customer?.firstName || o.customer?.lastName) {
      return [o.customer.firstName, o.customer.lastName].filter(Boolean).join(' ');
    }
    return o.customerName || o.customerEmail || '—';
  };

  const orderTotal = (o) => fmtAUD(o.grandTotal ?? o.totalAmount);

  const handleExport = async () => {
    try {
      const response = await apiService.exportAdminOrdersCsv();
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      toast.error(getUserFriendlyErrorMessage(err, 'exportOrders'));
    }
  };

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
          <Link
            to="/admin/orders/new"
            className="bg-cta-gradient hover:bg-cta-gradient-hover text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Order
          </Link>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Export orders as CSV"
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
          <div className="flex items-center gap-1 px-4 pt-3 overflow-x-auto">
            {TABS.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(idx)}
                className={`px-4 py-2 text-[13px] font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${activeTab === idx
                  ? 'border-brand-navy text-brand-navy bg-slate-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Bulk Actions */}
          <div className="px-4 py-3 flex items-center justify-between min-h-[56px]">
            {selectedOrders.length > 0 ? (
              <div className="flex items-center gap-3 w-full bg-brand-navy text-white px-4 py-2 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <span className="text-[13px] font-semibold">{selectedOrders.length} selected</span>
                <div className="flex-1" />
                {TABS[activeTab]?.filter?.isDeleted ? (
                  <button
                    onClick={handleBulkRestore}
                    disabled={isBulkProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Restore Selected
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDeleteModalMode('bulk');
                      setDeleteModalOpen(true);
                    }}
                    disabled={isBulkProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete Selected
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrders([])}
                  className="px-2 py-1.5 hover:bg-white/10 rounded-lg text-[13px] font-medium transition-colors ml-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-60 shrink-0">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search order # or email…"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue bg-slate-50 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <>
                  {FILTERS.map((flt, i) => (
                    <CustomDropdown
                      key={flt.key}
                      value={filterValues[flt.key]}
                      onChange={(v) => handleFilterChange(flt.key, v)}
                      placeholder={flt.placeholder}
                      align={i >= FILTERS.length - 2 ? 'right' : 'left'}
                      options={[{ value: '', label: flt.allLabel }, ...flt.options]}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-colors cursor-pointer ${filterValues[flt.key]
                        ? 'bg-blue-50 border-blue-200 text-brand-navy'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    />
                  ))}
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 px-2.5 py-2 text-[12.5px] font-semibold text-slate-500 hover:text-red-600 transition-colors"
                    >
                      <X size={14} /> Clear filters ({activeFilterCount})
                    </button>
                  )}
                </>
              </div>
            )}
          </div>
        </div>

        {/* ── Table: columns in the order of the client's mock-up ────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                  />
                </th>
                <th className={TH}>
                  <button type="button" onClick={() => handleSort('orderNumber')} className="group inline-flex items-center gap-1.5 uppercase hover:text-slate-700 transition-colors">
                    Order # <SortIcon active={sortBy === 'orderNumber'} order={sortOrder} />
                  </button>
                </th>
                <th className={TH}>
                  <button type="button" onClick={() => handleSort('createdAt')} className="group inline-flex items-center gap-1.5 uppercase hover:text-slate-700 transition-colors">
                    Date <SortIcon active={sortBy === 'createdAt' || sortBy === 'date'} order={sortOrder} />
                  </button>
                </th>
                <th className={TH}>Customer</th>
                <th className={`${TH} text-center`}>Items</th>
                <th className={`${TH} text-right`}>Total</th>
                <th className={TH}>Payment</th>
                <th className={TH}>Fulfilment</th>
                <th className={TH}>Delivery Status</th>
                <th className={TH}>Traffic Source</th>
                <th className={TH}>Country</th>
                <th className={TH}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    {Array.from({ length: 12 }).map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-4 bg-slate-100 rounded-md w-full max-w-[80px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Package size={40} strokeWidth={1.2} />
                      <p className="text-[14px] font-medium">No orders found</p>
                      {activeFilterCount > 0 || urlQ ? (
                        <button type="button" onClick={clearFilters} className="text-[12.5px] font-semibold text-brand-blue hover:underline">
                          Clear the filters to see all orders
                        </button>
                      ) : (
                        <p className="text-[12px]">Orders will appear here once customers complete checkout.</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const email = order.customer?.email || order.customerEmail || '';
                  const name = customerName(order);
                  return (
                    <tr
                      key={order._id}
                      className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors group ${selectedOrders.includes(order._id) ? 'bg-slate-50' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOne(order._id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                        />
                      </td>

                      {/* Order # */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-semibold text-brand-navy hover:text-brand-blue transition-colors flex items-center gap-1 group-hover:underline"
                        >
                          #{order.orderNumber ?? String(order._id).slice(-6).toUpperCase()}
                          <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3 whitespace-nowrap leading-snug" title={formatOrderDate(order.createdAt)}>
                        <p className="text-slate-600">{formatOrderDay(order.createdAt)}</p>
                        <p className="text-[12px] text-slate-400">{formatOrderTime(order.createdAt)}</p>
                      </td>

                      {/* Customer: name + email */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="leading-snug max-w-[190px]">
                          <p className="text-slate-700 font-semibold truncate">{name}</p>
                          {email && email !== name && <p className="text-[12px] text-slate-400 truncate">{email}</p>}
                        </div>
                      </td>

                      {/* Items: total quantity */}
                      <td className="px-3 py-3 text-center text-slate-700 font-medium whitespace-nowrap">
                        {itemQuantity(order)}
                      </td>

                      {/* Total */}
                      <td className="px-3 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                        {orderTotal(order)}
                      </td>

                      {/* Payment */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Pill value={paymentBadgeText(order)} styles={PAYMENT_BADGE} labels={PAYMENT_LABEL} />
                      </td>

                      {/* Fulfilment */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          <Pill value={order.fulfilmentStatus || 'unfulfilled'} styles={FULFIL_BADGE} labels={FULFIL_LABEL} />
                          {order.addressValidation?.needsReview && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200" title="Address needs review">
                              ⚠️ Address Review
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Delivery Status */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <DeliveryStatus order={order} />
                      </td>

                      {/* Traffic Source */}
                      <td className="px-3 py-3 text-slate-700 whitespace-nowrap">
                        {trafficSource(order)}
                      </td>

                      {/* Country */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <CountryCell order={order} />
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3 whitespace-nowrap text-right">
                        {TABS[activeTab]?.filter?.isDeleted ? (
                          <button
                            onClick={() => handleRestore(order._id)}
                            className="text-slate-400 hover:text-emerald-500 transition-colors p-1 rounded hover:bg-emerald-50"
                            title="Restore Order"
                          >
                            <RotateCcw size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setOrderToDelete(order);
                              setDeleteModalMode('single');
                              setDeleteModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
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

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 !m-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {deleteModalMode === 'bulk' ? 'Delete Orders' : 'Delete Order'}
            </h3>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              {deleteModalMode === 'bulk'
                ? `Are you sure you want to delete ${selectedOrders.length} orders? They will be moved to the `
                : 'Are you sure you want to delete this order? It will be moved to the '}
              <strong>Deleted Orders</strong> tab and can be viewed there later.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteModalMode === 'bulk' ? handleBulkSoftDelete : handleSoftDelete}
                className="px-4 py-2 rounded-xl text-[14px] font-semibold bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
