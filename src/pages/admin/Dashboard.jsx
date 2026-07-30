import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  PlusCircle,
  Truck,
  Package,
  Loader2
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CustomDropdown from '../../components/CustomDropdown';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import LiveViewSection from '../../components/analytics/LiveViewSection';

const Dashboard = () => {
  const { formatAUD } = useCurrency();
  const [timeFilter, setTimeFilter] = useState('Today');
  
  const [stats, setStats] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live visitors
  const [liveData, setLiveData] = useState(null);
  const [liveOpen, setLiveOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await apiService.getDashboardAnalytics(timeFilter);
        const result = await response.json();
        if (result.success) {
          // Map icons and colors to stats
          const iconMap = {
            'revenue': { icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', isCurrency: true },
            'orders': { icon: ShoppingBag, color: 'bg-brand-blue/10 text-brand-blue', isCurrency: false },
            'aov': { icon: TrendingUp, color: 'bg-brand-cyan/10 text-brand-cyan', isCurrency: true },
            'customers': { icon: Users, color: 'bg-indigo-50 text-indigo-650', isCurrency: false }
          };

          const formattedStats = result.data.stats.map(s => {
            const mapData = iconMap[s.id] || iconMap['orders'];
            return {
              ...s,
              value: mapData.isCurrency ? formatAUD(Number(s.value)) : s.value,
              icon: mapData.icon,
              color: mapData.color
            };
          });

          setStats(formattedStats);
          setLowStockProducts(result.data.lowStockProducts || []);
          setRecentOrders(result.data.recentOrders || []);
          setRecentCustomers(result.data.recentCustomers || []);
        } else {
          toast.error(result.message || 'Failed to fetch dashboard');
        }
      } catch (error) {
        console.error('Dashboard Error:', error);
        toast.error('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [timeFilter, formatAUD]);

  // Fetch live overview and auto-refresh every 30s
  const fetchLive = async () => {
    try {
      const now = new Date();
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24h for context
      const params = new URLSearchParams({ from: from.toISOString(), to: now.toISOString() });
      const res = await apiService.getAnalyticsOverview(params.toString());
      const data = await res.json();
      if (data.success) setLiveData(data.data);
    } catch { /* silently ignore — never break dashboard */ }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Overview</h2>
          <p className="text-slate-555 text-[14px] mt-1">Here is a summary of your shop activity for {timeFilter.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomDropdown
            value={timeFilter}
            onChange={setTimeFilter}
            align="right"
            options={[
              { value: 'Today', label: 'Today' },
              { value: 'This Week', label: 'This Week' },
              { value: 'This Month', label: 'This Month' },
              { value: 'Year to Date', label: 'Year to Date' }
            ]}
          />
        </div>
      </div>

      {/* ─── Shopify Style Live View Section ─── */}
      <LiveViewSection />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <h3 className="text-2xl font-bold text-brand-navy">{stat.value}</h3>
                <span className={`text-[12px] font-semibold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change} <span className="text-slate-400 font-normal">vs last period</span>
                </span>
              </div>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Live Visitors Card ─────────────────────────────────────── */}
      <button
        onClick={() => setLiveOpen(true)}
        className="w-full text-left bg-gradient-to-r from-[#0f2a5e] to-[#1a3f8f] border border-[#1e4ea0] rounded-[20px] p-5 shadow-lg flex items-center justify-between gap-4 hover:from-[#0d2454] hover:to-[#163680] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">Live Right Now</p>
            <p className="text-3xl font-bold text-white leading-none mt-0.5">
              {liveData ? liveData.liveVisitors : <span className="text-white/30 text-xl">—</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          {liveData?.sessionsByCountry?.slice(0, 3).map((c) => (
            <div key={c.country} className="hidden sm:flex flex-col items-center">
              <span className="text-white font-bold text-lg">{c.sessions}</span>
              <span className="text-white/50 text-[11px] font-medium">{c.country || '—'}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-white/70 text-[13px] font-semibold">
            <span>View details</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </button>

      {/* ─── Live Details Slide-Over (Portaled to body with framer-motion) ─── */}
      {createPortal(
        <AnimatePresence>
          {liveOpen && (
            <div className="fixed inset-0 z-[9999] flex justify-end !mt-0 m-0 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9999]"
                onClick={() => setLiveOpen(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-y-auto z-[10000] !mt-0"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0f2a5e] to-[#1a3f8f] p-6 flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Live Visitors</p>
                    <p className="text-4xl font-bold text-white mt-1">{liveData?.liveVisitors ?? '—'}</p>
                    <p className="text-white/50 text-xs mt-1">Active in the last 5 minutes</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => setLiveOpen(false)} className="text-white/60 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <button onClick={fetchLive} className="text-white/50 hover:text-white flex items-center gap-1 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-grow">
                  {/* Period stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-slate-800">{liveData?.sessions ?? '—'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Sessions (24h)</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-slate-800">{liveData?.orders ?? '—'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Orders (24h)</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-slate-800">{liveData?.abandonedCarts ?? '—'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Abandoned</p>
                    </div>
                  </div>

                  {/* Sessions by Country */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      Sessions by Country (24h)
                    </h4>
                    {liveData?.sessionsByCountry?.length > 0 ? (
                      <div className="space-y-2.5">
                        {liveData.sessionsByCountry.map((row, i) => {
                          const max = liveData.sessionsByCountry[0]?.sessions || 1;
                          const pct = Math.round((row.sessions / max) * 100);
                          return (
                            <div key={row.country || i} className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-600 w-24 shrink-0 truncate">{row.country || 'Unknown'}</span>
                              <div className="flex-grow bg-slate-100 rounded-full h-2">
                                <div className="h-2 rounded-full bg-[#1a3f8f]" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 w-8 text-right shrink-0">{row.sessions}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No location data yet — country is tracked on completed orders.</p>
                    )}
                  </div>

                  {/* Funnel */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                      Conversion Funnel (24h)
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Sessions', value: liveData?.sessions, color: 'bg-[#1a3f8f]' },
                        { label: 'Checkout Started', value: (liveData?.orders ?? 0) + (liveData?.abandonedCarts ?? 0), color: 'bg-amber-400' },
                        { label: 'Orders Completed', value: liveData?.orders, color: 'bg-emerald-500' },
                      ].map(({ label, value, color }) => {
                        const max = liveData?.sessions || 1;
                        const pct = Math.min(100, Math.round(((value || 0) / max) * 100));
                        return (
                          <div key={label}>
                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                              <span>{label}</span>
                              <span className="font-bold text-slate-700">{value ?? '—'}</span>
                            </div>
                            <div className="bg-slate-100 rounded-full h-2.5">
                              <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/admin/analytics"
                      onClick={() => setLiveOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-[#0f2a5e] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#0d2454] transition-colors"
                    >
                      View Full Analytics
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Alerts Feed & Stocks */}
        <div className="lg:col-span-8 space-y-8">
          {/* Low Stock Alerts */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-brand-navy">Stock Warnings</h3>
              <Link to="/admin/products" className="text-xs font-bold text-brand-blue hover:underline">
                View Catalog
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                    <th className="pb-3 pl-4">Product</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3 text-center">Qty Left</th>
                    <th className="pb-3 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {lowStockProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-4 font-semibold text-slate-700">{p.name}</td>
                      <td className="py-3.5 text-slate-400">{p.sku}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold ${p.stock === 0 ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-650'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4">
                        <span className={`inline-flex items-center text-[11px] font-bold uppercase rounded-full px-2.5 py-0.5 ${p.stock === 0 ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-650'}`}>
                          {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-500">All products are well stocked!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-brand-navy">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-bold text-brand-blue hover:underline">
                View All Orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                    <th className="pb-3 pl-4">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-4 font-semibold text-brand-blue hover:text-brand-cyan">
                        <Link to={`/admin/orders/${order._id}`}>
                          {order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-3.5 text-slate-700">
                        {order.customerName || (order.customer?.name) || order.customerEmail || 'Unknown'}
                      </td>
                      <td className="py-3.5 text-right text-slate-700 font-semibold">
                        {order.currency || 'AUD'} {order.totalAmount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3.5 text-right pr-4">
                        <span className={`inline-flex items-center text-[11px] font-bold uppercase rounded-full px-2.5 py-0.5 ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                          order.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {order.paymentStatus || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-500">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Program overview */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-lg font-bold text-brand-navy mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/admin/products"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-blue/5 border border-slate-100 hover:border-brand-blue/20 text-slate-600 hover:text-brand-blue transition-all text-left"
              >
                <PlusCircle className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="text-[14px] font-bold">Add Product</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Create catalog entries & variants</p>
                </div>
              </Link>
              <Link
                to="/admin/orders/shipping-labels"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-blue/5 border border-slate-100 hover:border-brand-blue/20 text-slate-600 hover:text-brand-blue transition-all text-left"
              >
                <Truck className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="text-[14px] font-bold">Shipping Labels</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Bulk generate labels for orders</p>
                </div>
              </Link>
              <Link
                to="/admin/products/inventory"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-blue/5 border border-slate-100 hover:border-brand-blue/20 text-slate-600 hover:text-brand-blue transition-all text-left"
              >
                <Package className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="text-[14px] font-bold">Manage Inventory</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Update product stock quantities</p>
                </div>
              </Link>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
            <h3 className="text-lg font-bold text-brand-navy mb-6">New Customers</h3>
            <div className="space-y-4">
              {recentCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm shrink-0">
                    {customer.name ? customer.name[0].toUpperCase() : customer.email[0].toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[14px] font-bold text-slate-700 truncate">
                      {customer.name || 'No Name'}
                    </p>
                    <p className="text-[12px] text-slate-400 truncate">{customer.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
              {recentCustomers.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-4">No recent customers found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
