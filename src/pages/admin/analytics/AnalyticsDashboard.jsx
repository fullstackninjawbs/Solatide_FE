import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart
} from 'recharts';
import { apiService } from '../../../services/api';
import ChartContainer from '../../../components/analytics/ChartContainer';
import CustomDropdown from '../../../components/CustomDropdown';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, month, custom
  const [paymentMethod, setPaymentMethod] = useState('All');

  // Existing data state
  const [summary, setSummary] = useState(null);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  // Live overview state (new)
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (paymentMethod !== 'All') {
        params.set('paymentMethod', paymentMethod);
      }

      // Calculate dates
      const now = new Date();
      let fromDate = new Date();
      if (dateRange === '7days') {
        fromDate.setDate(now.getDate() - 7);
      } else if (dateRange === '30days') {
        fromDate.setDate(now.getDate() - 30);
      } else if (dateRange === 'month') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      // If custom, we would handle explicit start/end dates

      params.set('from', fromDate.toISOString());
      params.set('to', now.toISOString());

      const queryString = params.toString();

      const [summaryRes, dayRes, statusRes, productRes, customersRes] = await Promise.all([
        apiService.getAnalyticsSummary(queryString),
        apiService.getAnalyticsOrdersByDay(queryString),
        apiService.getAnalyticsOrdersByStatus(queryString),
        apiService.getAnalyticsRevenueByProduct(queryString),
        apiService.getAnalyticsTopCustomers(queryString)
      ]);

      const [summaryData, dayData, statusData, productData, customersData] = await Promise.all([
        summaryRes.json(),
        dayRes.json(),
        statusRes.json(),
        productRes.json(),
        customersRes.json()
      ]);

      if (summaryData.success) setSummary(summaryData.data);
      if (dayData.success) setOrdersByDay(dayData.data);
      if (statusData.success) setOrdersByStatus(statusData.data);
      if (productData.success) setRevenueByProduct(productData.data);
      if (customersData.success) setTopCustomers(customersData.data);

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch live overview data (new)
  const fetchOverview = async () => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const now = new Date();
      let fromDate = new Date();
      if (dateRange === '7days') fromDate.setDate(now.getDate() - 7);
      else if (dateRange === '30days') fromDate.setDate(now.getDate() - 30);
      else if (dateRange === 'month') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);

      const params = new URLSearchParams();
      params.set('from', fromDate.toISOString());
      params.set('to', now.toISOString());

      const res = await apiService.getAnalyticsOverview(params.toString());
      const data = await res.json();
      if (data.success) setOverview(data.data);
    } catch (err) {
      console.error('Failed to fetch overview:', err);
      setOverviewError('Failed to load live overview.');
    } finally {
      setOverviewLoading(false);
    }
  };

  // Fetch data
  useEffect(() => {
    fetchAnalytics();
    fetchOverview();
  }, [dateRange, paymentMethod]);

  // Auto-refresh live visitors every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchOverview, 60000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };
  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-US').format(val || 0);
  };

  const COLORS = ['#214A9E', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of orders, revenue, and product performance</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Date Range:</label>
          <CustomDropdown
            value={dateRange}
            onChange={setDateRange}
            options={[
              { label: 'Last 7 days', value: '7days' },
              { label: 'Last 30 days', value: '30days' },
              { label: 'This month', value: 'month' }
            ]}
          />
        </div>


      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* ─── Live Overview Section ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Live Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Auto-refreshes every 60 seconds · Live visitors = last 5 min</p>
          </div>
          <button
            onClick={fetchOverview}
            disabled={overviewLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-navy border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={overviewLoading ? 'animate-spin' : ''}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Refresh
          </button>
        </div>

        {overviewError && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            {overviewError}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Live Visitors */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Visitors</span>
            </div>
            <p className="text-4xl font-bold text-slate-800">
              {overviewLoading ? <span className="text-2xl text-slate-300">—</span> : (overview?.liveVisitors ?? 0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Last 5 minutes</p>
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</span>
            </div>
            <p className="text-4xl font-bold text-slate-800">
              {overviewLoading ? <span className="text-2xl text-slate-300">—</span> : formatNumber(overview?.sessions)}
            </p>
            <p className="text-xs text-slate-400 mt-1">In selected period</p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</span>
            </div>
            <p className="text-4xl font-bold text-slate-800">
              {overviewLoading ? <span className="text-2xl text-slate-300">—</span> : formatNumber(overview?.orders)}
            </p>
            <p className="text-xs text-slate-400 mt-1">In selected period</p>
          </div>

          {/* Abandoned Carts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Abandoned Carts</span>
            </div>
            <p className="text-4xl font-bold text-slate-800">
              {overviewLoading ? <span className="text-2xl text-slate-300">—</span> : formatNumber(overview?.abandonedCarts)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Checkout started, no purchase</p>
          </div>
        </div>

        {/* Sessions by Country */}
        {!overviewLoading && overview?.sessionsByCountry && overview.sessionsByCountry.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Sessions by Country</h3>
            <div className="space-y-3">
              {overview.sessionsByCountry.map((row, i) => {
                const max = overview.sessionsByCountry[0]?.sessions || 1;
                const pct = Math.round((row.sessions / max) * 100);
                return (
                  <div key={row.country || i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-28 shrink-0">{row.country || 'Unknown'}</span>
                    <div className="flex-grow bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-brand-navy" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 w-10 text-right shrink-0">{row.sessions}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* ─── End Live Overview ──────────────────────────────────────────────── */}

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-navy"></div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Total Revenue</h4>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(summary?.totalRevenue)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Total Orders</h4>
              <p className="text-3xl font-bold text-slate-800">{formatNumber(summary?.totalOrders)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Avg. Order Value</h4>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(summary?.averageOrderValue)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Paid vs Refunded</h4>
              <p className="text-xl font-bold text-slate-800 mt-3">
                <span className="text-emerald-500">Paid: {formatNumber(summary?.paidOrders)}</span>
                <span className="text-slate-300 mx-2">|</span>
                <span className="text-red-500">Refunded: {formatNumber(summary?.refundedOrders)}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart 1: Orders & Revenue over time */}
            <ChartContainer title="Orders & Revenue Over Time" className="lg:col-span-2">
              {ordersByDay.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={ordersByDay} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value, name) => {
                        if (name === 'Revenue') return [formatCurrency(value), name];
                        return [formatNumber(value), name];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="right" dataKey="ordersCount" name="Orders" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={30} />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#214A9E" strokeWidth={3} dot={{ r: 4, fill: '#214A9E', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* Chart 2: Orders by Status */}
            <ChartContainer title="Orders by Status">
              {ordersByStatus.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="status"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value) => [formatNumber(value), 'Orders']}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="capitalize ml-1 text-slate-600 font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Top Products */}
            <ChartContainer title="Top Products by Revenue">
              {revenueByProduct.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height={300 + revenueByProduct.length * 20}>
                  <BarChart
                    layout="vertical"
                    data={revenueByProduct}
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    barSize={24}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                    <YAxis type="category" dataKey="productTitle" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={150} />
                    <Tooltip
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value, name) => {
                        if (name === 'totalRevenue') return [formatCurrency(value), 'Revenue'];
                        if (name === 'totalQuantity') return [formatNumber(value), 'Quantity'];
                        return [value, name];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value) => value === 'totalRevenue' ? 'Revenue' : 'Quantity'} />
                    <Bar dataKey="totalRevenue" fill="#214A9E" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="totalQuantity" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* Chart 4: Top Customers */}
            <ChartContainer title="Top Customers by Revenue">
              {topCustomers.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height={300 + topCustomers.length * 20}>
                  <BarChart
                    layout="vertical"
                    data={topCustomers}
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    barSize={24}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={120} />
                    <Tooltip
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value, name) => {
                        if (name === 'totalRevenue') return [formatCurrency(value), 'Revenue'];
                        if (name === 'ordersCount') return [formatNumber(value), 'Orders'];
                        return [value, name];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value) => value === 'totalRevenue' ? 'Revenue' : 'Orders'} />
                    <Bar dataKey="totalRevenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="ordersCount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
