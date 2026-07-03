import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  ArrowLeft,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  Truck,
  Image as ImageIcon,
  Edit2,
  Mail,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtAUD(v) {
  if (v == null) return '—';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(v));
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const datePart = d.toLocaleDateString('en-US', options);
  const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${datePart} at ${timePart.toLowerCase()}`;
}

function formatAddress(addr) {
  if (!addr) return null;
  const lines = [
    addr.name,
    addr.company,
    addr.street1,
    addr.street2,
    [addr.city, addr.state, addr.zip].filter(Boolean).join(' '),
    addr.country,
  ].filter(Boolean);
  return lines;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fulfilling, setFulfilling] = useState(false);

  // Load Order
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiService.getAdminOrderById(id);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data.order);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFulfill = async () => {
    if (fulfilling) return;
    setFulfilling(true);
    try {
      const res = await apiService.updateAdminOrderStatus(id, { fulfilmentStatus: 'fulfilled' });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setFulfilling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse p-6 max-w-[1200px] mx-auto">
        <div className="h-8 bg-slate-200 rounded-lg w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-4">
            <div className="h-64 bg-white border border-slate-200 rounded-xl" />
            <div className="h-40 bg-white border border-slate-200 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-white border border-slate-200 rounded-xl" />
            <div className="h-64 bg-white border border-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p className="text-[15px] font-medium">Order not found</p>
        <Link to="/admin/orders" className="text-blue-600 text-[13px] mt-2 inline-block hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  // Derived values
  const customerName = (() => {
    if (order.customer?.firstName || order.customer?.lastName) {
      return [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ');
    }
    return order.customerName || 'No customer name';
  })();

  const customerEmail = order.customer?.email || order.customerEmail;
  const customerPhone = order.customer?.phone;

  const shippingLines = formatAddress(order.shippingAddressObj);
  const billingLines = formatAddress(order.billingAddressObj);
  const sameAddress = !billingLines || JSON.stringify(order.shippingAddressObj) === JSON.stringify(order.billingAddressObj);

  const lineItems = order.lineItems?.length ? order.lineItems : [];
  const totalItems = lineItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const subtotal = order.subtotal ?? order.totalAmount ?? 0;
  const grandTotal = order.grandTotal ?? order.totalAmount ?? 0;
  const shippingAmt = order.shippingAmount ?? 0;
  
  const paymentStatus = (order.paymentStatus || 'pending').toLowerCase();
  const fulfilStatus = (order.fulfilmentStatus || 'unfulfilled').toLowerCase();

  // Badge configs
  const isPaid = paymentStatus === 'paid';
  const isUnfulfilled = fulfilStatus === 'unfulfilled';

  return (
    <div className="min-h-screen bg-[#f1f2f4] pb-20 font-sans text-slate-800">
      <div className="max-w-[1040px] mx-auto px-6 pt-6">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/admin/orders" className="p-1 -ml-1 text-slate-500 hover:bg-slate-200 rounded">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-[22px] font-bold text-slate-900 leading-none flex items-center gap-3">
                {order.orderNumber ?? `#${String(order._id).slice(-8).toUpperCase()}`}
                
                {/* Badges next to title */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-200 text-slate-700 text-[13px] font-medium rounded-md">
                    {isPaid && <div className="w-2 h-2 rounded-full bg-slate-500" />}
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ffea8a] text-[#8a6116] text-[13px] font-medium rounded-md border border-[#ffea8a]">
                    {isUnfulfilled && <div className="w-2 h-2 rounded-full border-2 border-[#8a6116]" />}
                    {order.fulfilmentStatus ? order.fulfilmentStatus.charAt(0).toUpperCase() + order.fulfilmentStatus.slice(1) : 'Unfulfilled'}
                  </span>
                </div>
              </h1>
            </div>
            <p className="text-[13px] text-slate-500 ml-9 mt-1">
              {fmtDate(order.createdAt)} from Tagadacrm (via import)
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50">
              Refund
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50">
              Edit
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1">
              Print <ChevronDown size={14} className="text-slate-500 ml-1" />
            </button>
            <button className="px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1">
              More actions <ChevronDown size={14} className="text-slate-500 ml-1" />
            </button>
            <div className="flex items-center gap-1 ml-1">
              <button className="p-1.5 text-slate-400 bg-slate-200/60 rounded border border-transparent hover:bg-slate-300/50">
                <ChevronUp size={16} />
              </button>
              <button className="p-1.5 text-slate-400 bg-slate-200/60 rounded border border-transparent hover:bg-slate-300/50">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          
          {/* ════════════════ LEFT COLUMN ════════════════ */}
          <div className="space-y-5">
            
            {/* Fulfillment Card */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ffea8a] text-[#8a6116] text-[13px] font-medium rounded-md border border-[#e8d578]">
                    <Package size={14} /> Unfulfilled
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-md">
                    <MapPin size={14} /> Shop location
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg mb-4 text-[13px] text-slate-700">
                  <Truck size={16} className="text-slate-400" />
                  {order.shippingMethodName || 'Standard Shipping'} - Standard Shipping
                </div>

                <div className="space-y-4">
                  {lineItems.length > 0 ? (
                    lineItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-[14px] font-medium text-[#202223] text-blue-600 hover:underline cursor-pointer truncate">
                            {item.title}
                          </p>
                          {(item.sku || item.variantTitle) && (
                            <p className="text-[13px] text-slate-500 mt-0.5">
                              {item.sku || item.variantTitle}
                            </p>
                          )}
                        </div>
                        <div className="text-right pt-0.5 whitespace-nowrap">
                          <p className="text-[13px] text-slate-700">
                            {fmtAUD(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right pt-0.5 w-[80px] whitespace-nowrap">
                          <p className="text-[13px] text-slate-700">{fmtAUD(item.subtotal)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-slate-500 italic py-2">No line items recorded for this order.</p>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button 
                  onClick={handleFulfill}
                  disabled={fulfilling}
                  className="px-4 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {fulfilling ? 'Updating...' : 'Mark as fulfilled'} <ChevronDown size={14} className="text-slate-500" />
                </button>
                <button className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#202223] rounded-lg shadow-sm hover:bg-[#111213]">
                  Create shipping label
                </button>
              </div>
            </div>

            {/* Paid Summary Card */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-200 text-slate-700 text-[13px] font-medium rounded-md">
                    <Check size={14} /> Paid
                  </span>
                </div>
                
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-500 mr-[90px]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                    <span className="text-slate-700 w-[80px] text-right">{fmtAUD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-slate-500 mr-[90px] text-right">{order.shippingMethodName || 'Standard Shipping'}</span>
                    <span className="text-slate-700 w-[80px] text-right">{fmtAUD(shippingAmt)}</span>
                  </div>
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax</span>
                      <span className="text-slate-500 mr-[90px]"></span>
                      <span className="text-slate-700 w-[80px] text-right">{fmtAUD(order.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[#202223] pt-4 mt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="w-[80px] text-right">{fmtAUD(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-4 mt-2 border-t border-slate-200">
                    <span>Paid</span>
                    <span className="w-[80px] text-right">{fmtAUD(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Stub */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden mb-8">
              <div className="p-5 pb-4">
                <h3 className="text-[14px] font-semibold text-[#202223] mb-4">Timeline</h3>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-400 text-white font-bold flex items-center justify-center absolute left-0 top-0">
                    SB
                  </div>
                  <div className="ml-14 border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <input 
                      type="text" 
                      placeholder="Leave a comment..."
                      className="w-full text-[14px] px-3 py-2.5 outline-none text-slate-700 placeholder-slate-500"
                    />
                    <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex justify-between items-center">
                      <div className="flex gap-2 text-slate-400">
                        {/* Fake formatting buttons */}
                        <div className="w-5 h-5 rounded hover:bg-slate-200 cursor-pointer flex items-center justify-center font-serif">☺</div>
                        <div className="w-5 h-5 rounded hover:bg-slate-200 cursor-pointer flex items-center justify-center font-serif">@</div>
                        <div className="w-5 h-5 rounded hover:bg-slate-200 cursor-pointer flex items-center justify-center font-serif">#</div>
                      </div>
                      <button className="px-3 py-1 bg-slate-200 text-slate-400 font-medium rounded text-[13px]">
                        Post
                      </button>
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-500 text-right mt-2 mr-1">Only you and other staff can see comments</p>
                </div>
                
                {/* Timeline events */}
                <div className="mt-8 ml-5 border-l-2 border-slate-200 pl-8 relative space-y-6">
                  
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                  <div>
                    <p className="text-[13px] text-slate-700">
                      A <span className="font-medium">{fmtAUD(grandTotal)}</span> payment was processed on Tagada Pay.
                    </p>
                    <p className="text-[12px] text-slate-500 mt-1">{fmtDate(order.createdAt)}</p>
                  </div>

                  <div className="absolute left-[-5px] top-[75px] w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                  <div>
                    <p className="text-[13px] text-slate-700">
                      {customerName} placed this order on Tagadacrm.
                    </p>
                    <p className="text-[12px] text-slate-500 mt-1">{fmtDate(order.createdAt)}</p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <div className="space-y-5">
            
            {/* Notes */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-[#202223]">Notes</h3>
                <button className="text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
              </div>
              <p className="text-[13px] text-slate-600 break-all">
                {order.adminNotes ? order.adminNotes : (
                  order.tagadaOrderId ? `TagadaPay Order ID: ${order.tagadaOrderId}` : 'No notes.'
                )}
              </p>
            </div>

            {/* Channel Info */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
              <h3 className="text-[13px] font-semibold text-[#202223] mb-3">Channel Information</h3>
              <p className="text-[13px] text-slate-500 mb-1">Channel</p>
              <p className="text-[13px] text-slate-700">Tagadacrm</p>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#202223]">Customer</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
              </div>
              
              <div>
                <a href="#" className="block text-[13px] text-blue-600 hover:underline">{customerName}</a>
                <a href="#" className="block text-[13px] text-blue-600 hover:underline mt-0.5">1 order</a>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold text-[#202223] mb-1.5">Contact information</h3>
                {customerEmail ? (
                  <a href={`mailto:${customerEmail}`} className="block text-[13px] text-blue-600 hover:underline break-all">
                    {customerEmail}
                  </a>
                ) : (
                  <p className="text-[13px] text-slate-500 italic">No email provided</p>
                )}
                {customerPhone && (
                  <p className="text-[13px] text-slate-600 mt-0.5">{customerPhone}</p>
                )}
              </div>

              <div>
                <h3 className="text-[13px] font-semibold text-[#202223] mb-1.5 flex justify-between">
                  Shipping address
                  <button className="text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
                </h3>
                {shippingLines?.length > 0 ? (
                  <>
                    <address className="not-italic text-[13px] text-slate-600 leading-[1.4] mb-1">
                      {shippingLines.map((line, i) => <div key={i}>{line}</div>)}
                    </address>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(shippingLines.join(', '))}`} target="_blank" rel="noreferrer" className="text-[13px] text-blue-600 hover:underline">
                      View map
                    </a>
                  </>
                ) : (
                  <p className="text-[13px] text-slate-500 italic">No shipping address</p>
                )}
              </div>

              <div>
                <h3 className="text-[13px] font-semibold text-[#202223] mb-1.5 flex justify-between">
                  Billing address
                  <button className="text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
                </h3>
                {sameAddress ? (
                  <p className="text-[13px] text-slate-600">Same as shipping address</p>
                ) : (
                  <address className="not-italic text-[13px] text-slate-600 leading-[1.4]">
                    {billingLines.map((line, i) => <div key={i}>{line}</div>)}
                  </address>
                )}
              </div>
            </div>

            {/* Conversion */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
              <h3 className="text-[13px] font-semibold text-[#202223] mb-2">Conversion summary</h3>
              <p className="text-[13px] text-slate-600 mb-2">
                There aren't any conversion details available for this order
              </p>
              <a href="#" className="text-[13px] text-blue-600 hover:underline">Learn more</a>
            </div>

            {/* Order Risk */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#202223]">Order risk</h3>
              <a href="#" className="text-slate-400 hover:text-slate-600"><ExternalLink size={14} /></a>
              {/* Note: I don't have an ExternalLink icon imported above, let's just leave it out or import it */}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-[#202223]">Tags</h3>
                <button className="text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
              </div>
              <input 
                type="text" 
                className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
              />
              {order.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {order.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-[12px] rounded-full border border-slate-200"
                    >
                      {tag}
                      <button className="text-slate-400 hover:text-slate-600">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
