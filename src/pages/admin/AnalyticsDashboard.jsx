import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Activity, TrendingUp, Users, DollarSign, BarChart2 } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiService.getAnalyticsAttribution();
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          setError(json.message || 'Failed to load attribution stats');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalOrders = stats.reduce((acc, curr) => acc + curr.ordersCount, 0);
  const totalRevenue = stats.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-brand-blue" />
            Analytics
          </h2>
          <p className="text-slate-500 text-[14px]">Order Attribution & Conversion Summary</p>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[24px] p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
          <p className="text-slate-400 mt-4 text-[14px]">Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[24px] p-6 text-red-600">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <h3 className="text-[13px] font-semibold text-slate-500">Attributed Orders</h3>
              </div>
              <p className="text-2xl font-bold text-brand-navy">{totalOrders}</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
                <h3 className="text-[13px] font-semibold text-slate-500">Attributed Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-brand-navy">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.018)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-[15px] font-bold text-brand-navy">Conversions by Source & Channel</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Source</th>
                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Channel</th>
                    <th className="text-right px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Orders</th>
                    <th className="text-right px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                        No attribution data available.
                      </td>
                    </tr>
                  ) : (
                    stats.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3 font-semibold text-brand-navy">{row.source}</td>
                        <td className="px-6 py-3 text-slate-500 capitalize">{row.channel}</td>
                        <td className="px-6 py-3 text-right font-medium text-slate-700">{row.ordersCount}</td>
                        <td className="px-6 py-3 text-right font-semibold text-emerald-600">${row.revenue.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
