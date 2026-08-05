import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, RefreshCw, TrendingUp, ShoppingBag, Activity, ShieldAlert, ArrowRight, Eye, ShoppingCart, CreditCard, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

// Helper for country flags
const getCountryFlag = (country) => {
  if (!country) return '🌐';
  const c = country.trim().toUpperCase();
  if (c === 'AU' || c === 'AUSTRALIA') return '🇦🇺';
  if (c === 'US' || c === 'USA' || c === 'UNITED STATES') return '🇺🇸';
  if (c === 'GB' || c === 'UK' || c === 'UNITED KINGDOM') return '🇬🇧';
  if (c === 'CA' || c === 'CANADA') return '🇨🇦';
  if (c === 'IN' || c === 'INDIA') return '🇮🇳';
  if (c === 'DE' || c === 'GERMANY') return '🇩🇪';
  if (c === 'FR' || c === 'FRANCE') return '🇫🇷';
  if (c === 'NZ' || c === 'NEW ZEALAND') return '🇳🇿';
  return '🌐';
};

const getCountryFullName = (country) => {
  if (!country) return 'India';
  const c = country.trim().toUpperCase();
  if (c === 'IN' || c === 'INDIA') return 'India';
  if (c === 'AU' || c === 'AUSTRALIA') return 'Australia';
  if (c === 'US' || c === 'USA' || c === 'UNITED STATES') return 'United States';
  if (c === 'GB' || c === 'UK' || c === 'UNITED KINGDOM') return 'United Kingdom';
  if (c === 'CA' || c === 'CANADA') return 'Canada';
  if (c === 'DE' || c === 'GERMANY') return 'Germany';
  if (c === 'FR' || c === 'FRANCE') return 'France';
  if (c === 'NZ' || c === 'NEW ZEALAND') return 'New Zealand';
  return country;
};

const formatLocation = (evt) => {
  if (!evt) return '';
  const parts = [];
  if (evt.city) parts.push(evt.city);
  if (evt.region) parts.push(evt.region);
  parts.push(getCountryFullName(evt.country));
  return parts.join(', ');
};

// Helper for relative time
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'just now';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Helper component for mini SVG sparklines
const Sparkline = ({ data = [], color = "#0079CD" }) => {
  if (!data || data.length < 2) {
    return (
      <svg className="w-20 h-8 opacity-40" viewBox="0 0 100 30" fill="none">
        <path d="M0 25 Q 25 5, 50 20 T 100 10" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 90 + 5;
    const y = 25 - ((val - min) / range) * 20;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg className="w-20 h-8 overflow-hidden" viewBox="0 0 100 30" fill="none" preserveAspectRatio="none">
      <path d={pathD} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const LiveViewSection = ({ className = "", showViewAdvancedButton = true }) => {
  const { formatAUD } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAnalyticsOverview('from=' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastRefreshed('Just now');
      }
    } catch (err) {
      console.error('Failed to fetch live overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 20000); // 20s auto refresh
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (formatAUD) return formatAUD(amount || 0);
    return `A$${(amount || 0).toLocaleString()}`;
  };

  const sparkSales = data?.sparklines?.map(s => s.sales) || [0, 5, 2, 8, 3, 10, 4, 12, 6, 15];
  const sparkSessions = data?.sparklines?.map(s => s.sessions) || [2, 8, 4, 12, 7, 18, 10, 22, 14, 25];
  const sparkOrders = data?.sparklines?.map(s => s.orders) || [0, 1, 0, 3, 1, 4, 2, 5, 3, 6];

  const totalSessionsCount = data?.sessions || 1;
  const sessionsByCountry = data?.sessionsByCountry || [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#214A9E]/10 text-[#214A9E]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Live Store View</h2>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0"></span>
                <span>{lastRefreshed}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Real-time visitor activity & conversion tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLiveData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0079CD]' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>

          {showViewAdvancedButton && (
            <Link
              to="/admin/analytics"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0f2a5e] to-[#214A9E] text-white hover:from-[#15387a] hover:to-[#1a3f8f] text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>View Advanced Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Visitors right now */}
        <div className="bg-gradient-to-br from-[#0f2a5e] to-[#1e4491] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-[12px] font-semibold text-blue-200 uppercase tracking-wider">
              Visitors right now
            </span>
            <div className="text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              <span>{loading && !data ? '—' : (data?.visitorsRightNow ?? data?.liveVisitors ?? 0)}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
          <div className="text-[11px] text-blue-200/80 font-medium mt-3 relative z-10">
            Active in last 5 mins
          </div>
        </div>

        {/* Card 2: Total sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
          <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
            Total sales
          </span>
          <div className="flex items-end justify-between mt-2 gap-1">
            <div>
              <div className="text-2xl font-bold text-slate-900 whitespace-nowrap">
                {loading && !data ? '—' : formatCurrency(data?.totalSales)}
              </div>
              {data?.totalSalesChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.totalSalesChangePct >= 0 ? '+' : ''}{data.totalSalesChangePct}%
                </span>
              )}
            </div>
            <div className="shrink-0 self-center">
              <Sparkline data={sparkSales} color="#0079CD" />
            </div>
          </div>
        </div>

        {/* Card 3: Sessions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
          <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
            Sessions
          </span>
          <div className="flex items-end justify-between mt-2 gap-1">
            <div>
              <div className="text-2xl font-bold text-slate-900 whitespace-nowrap">
                {loading && !data ? '—' : (data?.sessions ?? 0)}
              </div>
              {data?.sessionsChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.sessionsChangePct >= 0 ? '+' : ''}{data.sessionsChangePct}%
                </span>
              )}
            </div>
            <div className="shrink-0 self-center">
              <Sparkline data={sparkSessions} color="#0079CD" />
            </div>
          </div>
        </div>

        {/* Card 4: Orders */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
          <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
            Orders
          </span>
          <div className="flex items-end justify-between mt-2 gap-1">
            <div>
              <div className="text-2xl font-bold text-slate-900 whitespace-nowrap">
                {loading && !data ? '—' : (data?.orders ?? 0)}
              </div>
              {data?.ordersChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.ordersChangePct >= 0 ? '+' : ''}{data.ordersChangePct}%
                </span>
              )}
            </div>
            <div className="shrink-0 self-center">
              <Sparkline data={sparkOrders} color="#0079CD" />
            </div>
          </div>
        </div>

        {/* Card 5: Abandoned Carts Value */}
        <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Abandoned Value
            </span>
            <div className="text-2xl font-bold text-amber-900 mt-2">
              {loading && !data ? '—' : formatCurrency(data?.abandonedCartValue)}
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 mt-2">
            {data?.abandonedCarts ?? 0} abandoned checkouts
          </span>
        </div>
      </div>

      {/* Middle Grid: Customer Behavior & Live Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Behavior Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#214A9E]" />
                Customer Behavior
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Conversion Rate: <span className="font-bold text-[#0079CD]">{data?.conversionRate ?? 0}%</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Active carts */}
              <div className="pb-4 md:pb-0 md:pr-6 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600">
                  <ShoppingCart className="w-4 h-4 text-amber-500" />
                  <span>Active Carts</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {loading && !data ? '—' : (data?.customerBehavior?.activeCarts ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Last 5 minutes</p>
              </div>

              {/* Checking out */}
              <div className="py-4 md:py-0 md:px-6 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Checking Out</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {loading && !data ? '—' : (data?.customerBehavior?.checkingOut ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Last 5 minutes</p>
              </div>

              {/* Purchased */}
              <div className="pt-4 md:pt-0 md:pl-6 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Purchased</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {loading && !data ? '—' : (data?.customerBehavior?.purchased ?? 0)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Completed order</p>
              </div>
            </div>
          </div>

          {/* Visual Funnel Bar */}
          {data?.funnel && (
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Funnel Drop-off</span>
                <span>Cart drop: {data.funnel.cartDropOffPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${Math.max(5, (data.funnel.purchased / (data.funnel.sessions || 1)) * 100)}%` }} className="bg-emerald-500 h-full" title="Purchased"></div>
                <div style={{ width: `${Math.max(0, ((data.customerBehavior?.checkingOut || 0) / (data.funnel.sessions || 1)) * 100)}%` }} className="bg-blue-500 h-full" title="Checking out"></div>
                <div style={{ width: `${Math.max(0, ((data.customerBehavior?.activeCarts || 0) / (data.funnel.sessions || 1)) * 100)}%` }} className="bg-amber-400 h-full" title="Active Carts"></div>
              </div>
            </div>
          )}
        </div>

        {/* Sessions by Location (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0079CD]" />
                Top Visitor Locations
              </h3>
              <span className="text-xs font-semibold text-slate-400">{sessionsByCountry.length} countries</span>
            </div>

            {sessionsByCountry.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No location data available yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                {sessionsByCountry.slice(0, 5).map((loc, idx) => {
                  const pct = Math.round((loc.sessions / totalSessionsCount) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span>{getCountryFlag(loc.country)}</span>
                          <span>{loc.country}</span>
                        </span>
                        <span className="text-slate-500 font-mono">{loc.sessions} sessions ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.min(100, Math.max(5, pct))}%` }} className="bg-[#214A9E] h-full rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Activity Feed Stream Ticker */}
      {recentEvents.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Live Visitor Stream</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentEvents.slice(0, 6).map((evt, index) => {
              const isCart = evt.eventType === 'add_to_cart';
              const isCheckout = evt.eventType === 'begin_checkout';
              const isPurchase = evt.eventType === 'purchase';
              const isProduct = evt.eventType === 'product_view';

              return (
                <div 
                  key={evt._id || index} 
                  className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-3.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold bg-slate-50 border border-slate-200/80 text-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs max-w-[170px] sm:max-w-[200px] truncate" title={formatLocation(evt)}>
                        <span className="text-base shrink-0">{getCountryFlag(evt.country)}</span>
                        <span className="font-bold text-slate-800 text-[12px] truncate">{formatLocation(evt)}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPurchase ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' :
                        isCheckout ? 'bg-blue-50 text-blue-700 border border-blue-200/80' :
                        isCart ? 'bg-amber-50 text-amber-800 border border-amber-200/80' :
                        isProduct ? 'bg-purple-50 text-purple-700 border border-purple-200/80' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {evt.eventType.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatTimeAgo(evt.timestamp)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-[13.5px] line-clamp-1 group-hover:text-[#214A9E] transition-colors">
                      {evt.eventType === 'page_view' ? 'Visited Page' :
                       evt.eventType === 'product_view' ? (evt.productName || 'Viewed Product') :
                       evt.eventType === 'add_to_cart' ? `Added ${evt.productName || 'Item'} to Cart` :
                       evt.eventType === 'begin_checkout' ? 'Started Checkout' :
                       evt.eventType === 'purchase' ? 'Purchased Order' : evt.eventType}
                    </h4>
                    <div className="mt-2 flex items-center">
                      <span className="text-[11px] font-mono text-[#0079CD] font-semibold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100 truncate max-w-full">
                        {evt.path || evt.page || '/'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveViewSection;
