import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const Dashboard = () => {
  const { formatAUD } = useCurrency();
  const [timeFilter, setTimeFilter] = useState('Today');
  
  const [stats, setStats] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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
