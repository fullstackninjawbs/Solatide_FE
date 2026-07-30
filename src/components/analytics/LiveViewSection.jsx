import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

// Helper component for mini SVG sparklines
const Sparkline = ({ data = [], color = "#3b82f6" }) => {
  if (!data || data.length < 2) {
    // Default smooth curve placeholder if empty data
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
    <svg className="w-24 h-9 overflow-visible" viewBox="0 0 100 30" fill="none">
      <path d={pathD} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const LiveViewSection = ({ className = "" }) => {
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
    const interval = setInterval(fetchLiveData, 30000); // 30s auto refresh
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (formatAUD) return formatAUD(amount || 0);
    return `A$${(amount || 0).toLocaleString()}`;
  };

  const sparkSales = data?.sparklines?.map(s => s.sales) || [0, 5, 2, 8, 3, 10, 4, 12, 6, 15];
  const sparkSessions = data?.sparklines?.map(s => s.sessions) || [2, 8, 4, 12, 7, 18, 10, 22, 14, 25];
  const sparkOrders = data?.sparklines?.map(s => s.orders) || [0, 1, 0, 3, 1, 4, 2, 5, 3, 6];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-slate-700" />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Live View</h2>
          <div className="flex items-center gap-1.5 ml-2 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>{lastRefreshed}</span>
          </div>
        </div>
        <button
          onClick={fetchLiveData}
          disabled={loading}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Refresh Live Data"
        >
          <RefreshCw />
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Visitors right now */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[13px] font-medium text-slate-500 border-b border-dotted border-slate-300 pb-0.5">
              Visitors right now
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {loading && !data ? '—' : (data?.visitorsRightNow ?? data?.liveVisitors ?? 0)}
            </div>
          </div>
        </div>

        {/* Card 2: Total sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[110px]">
          <div>
            <span className="text-[13px] font-medium text-slate-500 border-b border-dotted border-slate-300 pb-0.5">
              Total sales
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900">
                {loading && !data ? '—' : formatCurrency(data?.totalSales)}
              </span>
              {data?.totalSalesChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.totalSalesChangePct >= 0 ? '+' : ''}{data.totalSalesChangePct}%
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 pl-2">
            <Sparkline data={sparkSales} color="#3b82f6" />
          </div>
        </div>

        {/* Card 3: Sessions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[110px]">
          <div>
            <span className="text-[13px] font-medium text-slate-500 border-b border-dotted border-slate-300 pb-0.5">
              Sessions
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900">
                {loading && !data ? '—' : (data?.sessions ?? 0)}
              </span>
              {data?.sessionsChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.sessionsChangePct >= 0 ? '+' : ''}{data.sessionsChangePct}%
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 pl-2">
            <Sparkline data={sparkSessions} color="#3b82f6" />
          </div>
        </div>

        {/* Card 4: Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between min-h-[110px]">
          <div>
            <span className="text-[13px] font-medium text-slate-500 border-b border-dotted border-slate-300 pb-0.5">
              Orders
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900">
                {loading && !data ? '—' : (data?.orders ?? 0)}
              </span>
              {data?.ordersChangePct != null && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5 inline" />
                  {data.ordersChangePct >= 0 ? '+' : ''}{data.ordersChangePct}%
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 pl-2">
            <Sparkline data={sparkOrders} color="#3b82f6" />
          </div>
        </div>
      </div>

      {/* Customer behavior Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="mb-6">
          <span className="text-base font-bold text-slate-800 border-b border-dotted border-slate-300 pb-0.5">
            Customer behavior
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Active carts */}
          <div className="pb-4 md:pb-0 md:pr-6 space-y-1">
            <span className="text-[13px] font-medium text-slate-600">Active carts</span>
            <div className="text-2xl font-bold text-slate-900">
              {loading && !data ? '—' : (data?.customerBehavior?.activeCarts ?? 0)}
            </div>
          </div>

          {/* Checking out */}
          <div className="py-4 md:py-0 md:px-6 space-y-1">
            <span className="text-[13px] font-medium text-slate-600">Checking out</span>
            <div className="text-2xl font-bold text-slate-900">
              {loading && !data ? '—' : (data?.customerBehavior?.checkingOut ?? 0)}
            </div>
          </div>

          {/* Purchased */}
          <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
            <span className="text-[13px] font-medium text-slate-600">Purchased</span>
            <div className="text-2xl font-bold text-slate-900">
              {loading && !data ? '—' : (data?.customerBehavior?.purchased ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveViewSection;
