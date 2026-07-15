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

  // Data state
  const [summary, setSummary] = useState(null);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

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

  // Fetch data
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, paymentMethod]);

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
