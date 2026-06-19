import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  AlertTriangle,
  FileText,
  PlusCircle,
  Upload,
  BookOpen
} from 'lucide-react';

const Dashboard = () => {
  // Analytics stats matching Solatide theme
  const stats = [
    { name: 'Revenue (MTD)', value: 'Rs. 245,600.00', change: '+12.4%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Orders Today', value: '18', change: '+8.2%', icon: ShoppingBag, color: 'bg-brand-blue/10 text-brand-blue' },
    { name: 'Average Order Value', value: 'Rs. 13,640.00', change: '-2.1%', icon: TrendingUp, color: 'bg-brand-cyan/10 text-brand-cyan' },
    { name: 'New Customers', value: '44', change: '+24.5%', icon: Users, color: 'bg-indigo-50 text-indigo-650' }
  ];

  const tasksList = [
    { id: 1, type: 'order', message: 'Order #1042 awaiting manual PayID confirmation', time: '10 mins ago', severity: 'warning' },
    { id: 2, type: 'stock', message: 'Retatrutide 10mg is critically low on stock (2 left)', time: '1 hour ago', severity: 'danger' },
    { id: 3, type: 'coa', message: 'Pending COA review for Bacteriostatic Water batch B-26X', time: '3 hours ago', severity: 'info' },
    { id: 4, type: 'review', message: '3 new reviews pending approval for Semaglutide 5mg', time: '5 hours ago', severity: 'info' }
  ];

  const lowStockProducts = [
    { name: 'Retatrutide 10mg', sku: 'SOL-RTA-10M', stock: 2, limit: 5 },
    { name: 'Tirzepatide 10mg', sku: 'SOL-TZP-10M', stock: 4, limit: 5 },
    { name: 'BPC-157 10mg', sku: 'SOL-BPC-10M', stock: 0, limit: 5 }
  ];

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Overview</h2>
          <p className="text-slate-555 text-[14px] mt-1">Here is a summary of your shop activity today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-200 text-slate-650 text-[14px] rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-blue shadow-sm font-semibold cursor-pointer">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Year to Date</option>
          </select>
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
          {/* Action Alerts */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-lg font-bold text-brand-navy mb-6">Action Needed</h3>
            <div className="space-y-4">
              {tasksList.map((task) => (
                <div key={task.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-150 transition-all items-start">
                  <div className="mt-0.5">
                    {task.severity === 'danger' ? (
                      <AlertTriangle className="h-5 w-5 text-rose-500" />
                    ) : task.severity === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-brand-blue" />
                    )}
                  </div>
                  <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="text-[14px] font-semibold text-slate-700">{task.message}</p>
                      <span className="text-[12px] text-slate-400 mt-1 block">{task.time}</span>
                    </div>
                    <button className="text-[12px] font-bold text-brand-blue hover:text-brand-cyan self-start sm:self-auto focus:outline-none cursor-pointer">
                      Manage →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                to="/admin/coas"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-blue/5 border border-slate-100 hover:border-brand-blue/20 text-slate-600 hover:text-brand-blue transition-all text-left"
              >
                <Upload className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="text-[14px] font-bold">Upload COA</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Attach report certificates to batches</p>
                </div>
              </Link>
              <Link
                to="/admin/cms"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-blue/5 border border-slate-100 hover:border-brand-blue/20 text-slate-600 hover:text-brand-blue transition-all text-left"
              >
                <BookOpen className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="text-[14px] font-bold">Manage Pages</p>
                  <p className="text-[11px] text-slate-450 mt-0.5">Edit research articles or FAQ lists</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Performance chart with theme colors */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
            <h3 className="text-lg font-bold text-brand-navy mb-6">Store Performance</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>Metabolic Research Compounds</span>
                  <span className="text-slate-800">62%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-navy rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>Tissue & Recovery Peptides</span>
                  <span className="text-slate-800">28%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-cyan rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>Research Solutions & Bac Water</span>
                  <span className="text-slate-800">10%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
