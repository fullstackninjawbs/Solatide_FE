import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Package, Truck, Printer, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';

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

export default function ShippingLabels() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, successes: 0, failures: 0 });

  const [generatedLabels, setGeneratedLabels] = useState({});

  const fetchReadyOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'processing',
        fulfilmentStatus: 'unfulfilled',
        page: String(page),
        limit: String(limit)
      });
      const res = await apiService.getAdminOrders(params.toString());
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data.orders || []);
        setTotal(data.total ?? data.data.pagination?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadyOrders();
  }, [page, limit]);

  const handlePageChange = (newPage, newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    nextParams.set('limit', String(newLimit));
    setSearchParams(nextParams);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(orders.map(o => o._id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const next = new Set(selectedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedOrders(next);
  };

  const handleGenerateLabels = async () => {
    const targetIds = Array.from(selectedOrders);
    if (targetIds.length === 0) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: targetIds.length, successes: 0, failures: 0 });

    let successCount = 0;
    let failCount = 0;
    const newLabels = { ...generatedLabels };

    for (let i = 0; i < targetIds.length; i++) {
      const orderId = targetIds[i];
      setProgress(p => ({ ...p, current: i + 1 }));

      try {
        const res = await apiService.createAdminShipment(orderId);
        if (res.ok) {
          const data = await res.json();
          successCount++;
          if (data.data?.order?.labelUrl) {
            newLabels[orderId] = data.data.order.labelUrl;
          }
        } else {
          failCount++;
        }
      } catch (err) {
        console.error('Error generating label for', orderId, err);
        failCount++;
      }
    }

    setGeneratedLabels(newLabels);
    setProgress(p => ({ ...p, successes: successCount, failures: failCount }));
    setIsGenerating(false);
    setSelectedOrders(new Set());
  };

  return (
    <div className="space-y-5 text-left font-sans">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
            <Printer className="w-6 h-6" />
            Shipping Labels
          </h2>
          <p className="text-slate-500 text-[14px] mt-0.5">
            Bulk generate Starshipit shipping labels for orders ready to be fulfilled.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReadyOrders}
            disabled={loading || isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleGenerateLabels}
            disabled={selectedOrders.size === 0 || isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-brand-cyan/20"
          >
            <Package size={14} />
            Generate {selectedOrders.size > 0 ? `(${selectedOrders.size})` : ''} Labels
          </button>
        </div>
      </div>

      {/* Progress Card (Shown during or just after generation) */}
      {(isGenerating || progress.total > 0) && (
        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.018)]">
          <h3 className="text-brand-navy font-semibold mb-4 flex items-center gap-2">
            {isGenerating ? (
              <><RefreshCw className="w-5 h-5 text-brand-cyan animate-spin" /> Generating Labels...</>
            ) : (
              <><CheckCircle className="w-5 h-5 text-emerald-500" /> Generation Complete</>
            )}
          </h3>

          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden border border-slate-200">
            <div
              className="bg-brand-cyan h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">
              Processed {progress.current} of {progress.total}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-4 h-4" /> {progress.successes} Succeeded
              </span>
              {progress.failures > 0 && (
                <span className="text-red-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-4 h-4" /> {progress.failures} Failed
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.018)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-5 py-4 w-12 text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan w-4 h-4"
                      checked={orders.length > 0 && selectedOrders.size === orders.length}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-5 py-4 text-slate-500 font-semibold text-[13px] uppercase tracking-wider">Order</th>
                <th className="px-5 py-4 text-slate-500 font-semibold text-[13px] uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 text-slate-500 font-semibold text-[13px] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-4 text-slate-500 font-semibold text-[13px] uppercase tracking-wider">Items</th>
                <th className="px-5 py-4 text-slate-500 font-semibold text-[13px] uppercase tracking-wider text-right">Label Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mb-4" />
                      Loading unfulfilled orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                      <Truck className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-navy mb-1">All caught up!</h3>
                    <p className="text-slate-500 text-[14px]">There are no unfulfilled orders ready for shipping.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const labelUrl = generatedLabels[order._id] || order.labelUrl;
                  const isProcessed = !!labelUrl || order.status === 'shipped';

                  return (
                    <tr
                      key={order._id}
                      className={`hover:bg-slate-50/80 transition-colors ${selectedOrders.has(order._id) ? 'bg-slate-50' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            checked={selectedOrders.has(order._id)}
                            onChange={() => handleSelectOne(order._id)}
                            disabled={isProcessed}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/admin/orders/${order._id}`} className="text-brand-navy hover:text-brand-cyan font-bold transition-colors">
                          {order.orderNumber || order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-[14px] whitespace-nowrap font-medium">
                          {formatOrderDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-brand-navy font-semibold text-[14px]">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="text-slate-500 text-[13px] mt-0.5">
                          {order.customer?.email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-600 text-[14px] font-medium">
                          {(order.lineItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0)} items
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {labelUrl ? (
                          <a
                            href={labelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-[13px] font-bold shadow-sm"
                          >
                            <Printer size={14} />
                            Print Label
                          </a>
                        ) : isProcessed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-[13px] font-bold">
                            <CheckCircle size={14} />
                            Shipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[13px] font-bold">
                            <AlertCircle size={14} />
                            Needs Label
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
}
