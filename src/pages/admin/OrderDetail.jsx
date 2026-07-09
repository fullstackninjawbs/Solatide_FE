import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  ArrowLeft,
  MoreHorizontal,
  ChevronDown,
  MapPin,
  Truck,
  Image as ImageIcon,
  Edit2,
  Mail,
  Check,
  ExternalLink,
  Package,
  Clock,
  User,
  CreditCard,
  Tag,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  const [updating, setUpdating] = useState(false);
  const [creatingLabel, setCreatingLabel] = useState(false);

  // New states for interactive fields
  const [commentText, setCommentText] = useState('');
  const [newTag, setNewTag] = useState('');

  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [addressTypeToEdit, setAddressTypeToEdit] = useState('shipping');
  const [editAddressForm, setEditAddressForm] = useState({ name: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', country: '' });

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

  const updateOrderField = async (payload, successMessage = 'Order updated') => {
    try {
      setUpdating(true);
      const res = await apiService.updateAdminOrder(id, payload);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.data.order);
        toast.success(successMessage);
        return true;
      } else {
        toast.error(data.message || 'Update failed');
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = { text: commentText.trim(), createdAt: new Date() };
    const updatedComments = [...(order.comments || []), newComment];
    const success = await updateOrderField({ comments: updatedComments }, 'Comment added');
    if (success) setCommentText('');
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tagToAdd = newTag.trim();
      if (order.tags?.includes(tagToAdd)) {
        toast.error('Tag already exists');
        return;
      }
      const updatedTags = [...(order.tags || []), tagToAdd];
      const success = await updateOrderField({ tags: updatedTags }, 'Tag added');
      if (success) setNewTag('');
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = (order.tags || []).filter(t => t !== tagToRemove);
    await updateOrderField({ tags: updatedTags }, 'Tag removed');
  };

  const openAddressModal = (type) => {
    setAddressTypeToEdit(type);
    const addr = type === 'shipping' ? order.shippingAddressObj : order.billingAddressObj;
    setEditAddressForm(addr || { name: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', country: '' });
    setIsEditAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    const payload = addressTypeToEdit === 'shipping'
      ? { shippingAddressObj: editAddressForm }
      : { billingAddressObj: editAddressForm };

    const success = await updateOrderField(payload, 'Address updated');
    if (success) setIsEditAddressModalOpen(false);
  };

  const handleCreateLabel = async () => {
    if (creatingLabel) return;
    setCreatingLabel(true);
    try {
      const res = await apiService.createAdminShipment(id);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
        toast.success('Shipping label generated successfully!');
      } else {
        toast.error(data.message || 'Failed to create shipping label');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while creating label');
    } finally {
      setCreatingLabel(false);
    }
  };

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
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-72 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            <div className="h-72 bg-white rounded-[20px] border border-slate-100" />
            <div className="h-48 bg-white rounded-[20px] border border-slate-100" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-white rounded-[20px] border border-slate-100" />
            <div className="h-72 bg-white rounded-[20px] border border-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Package size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
        <p className="text-lg font-semibold text-brand-navy">Order not found</p>
        <Link to="/admin/orders" className="text-brand-blue text-[14px] mt-2 font-medium hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to orders
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
  const shippingAmt = order.shippingAmount ?? 0;
  const discountAmt = order.discountAmount ?? 0;
  const taxAmt = order.taxAmount ?? 0;
  const grandTotal = order.grandTotal ?? order.totalAmount ?? (subtotal + shippingAmt + taxAmt - discountAmt);

  const paymentStatus = (order.paymentStatus || 'pending').toLowerCase();
  const fulfilStatus = (order.fulfilmentStatus || 'unfulfilled').toLowerCase();

  const isPaid = paymentStatus === 'paid';
  const isUnfulfilled = fulfilStatus === 'unfulfilled';

  return (
    <div className="space-y-6 font-sans text-slate-800 pb-24">
      <div className="w-full">

        {/* ─── Header Section ─── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/admin/orders" className="p-2 text-slate-400 hover:text-brand-navy hover:bg-white rounded-xl transition-colors bg-slate-100 border border-slate-200">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-3xl font-bold text-brand-navy tracking-tight flex items-center gap-4">
                {order.orderNumber ?? `#${String(order._id).slice(-8).toUpperCase()}`}

                <div className="flex items-center gap-2 mt-1">
                  {/* Payment Badge */}
                  <span className={`flex items-center gap-1.5 px-3 py-1 text-[13px] font-semibold rounded-full border ${isPaid
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    {isPaid ? <Check size={14} /> : <Clock size={14} />}
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                  </span>

                  {/* Fulfillment Badge */}
                  <span className={`flex items-center gap-1.5 px-3 py-1 text-[13px] font-semibold rounded-full border ${!isUnfulfilled
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    <Package size={14} />
                    {order.fulfilmentStatus ? order.fulfilmentStatus.charAt(0).toUpperCase() + order.fulfilmentStatus.slice(1) : 'Unfulfilled'}
                  </span>
                </div>
              </h1>
            </div>
            <p className="text-[14px] text-slate-500 ml-[52px] font-medium">
              {fmtDate(order.createdAt)} from Tagadacrm
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-slate-50 hover:border-slate-300 transition-all">
              Refund
            </button>
            <button className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-slate-50 hover:border-slate-300 transition-all">
              Edit
            </button>
            <button className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
              Print <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="px-4 py-2.5 text-[13.5px] font-semibold text-white bg-brand-navy border border-brand-navy rounded-xl shadow-[0_4px_14px_rgba(15,23,42,0.2)] hover:bg-brand-navy/90 transition-all flex items-center gap-2">
              More actions <ChevronDown size={14} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* ─── 2-Column Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ════════════════ LEFT COLUMN ════════════════ */}
          <div className="space-y-8">

            {/* Fulfillment Card */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-brand-navy">Fulfillment</h2>
                      <p className="text-[13px] text-slate-500 font-medium">Standard Shipping</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[13px] font-semibold rounded-full border border-slate-200 flex items-center gap-1.5">
                    <MapPin size={14} /> Shop location
                  </span>
                </div>

                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-2 mb-6">
                  {lineItems.length > 0 ? (
                    lineItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-5 p-3 hover:bg-white rounded-xl transition-colors">
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14.5px] font-semibold text-brand-navy truncate hover:text-brand-blue cursor-pointer transition-colors">
                            {item.title}
                          </p>
                          {(item.sku || item.variantTitle) && (
                            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
                              {item.sku || item.variantTitle}
                            </p>
                          )}
                        </div>
                        <div className="text-right whitespace-nowrap px-4 border-r border-slate-200">
                          <p className="text-[14px] font-medium text-slate-700">
                            {fmtAUD(item.unitPrice)} <span className="text-slate-400 mx-1">×</span> {item.quantity}
                          </p>
                        </div>
                        <div className="text-right whitespace-nowrap w-[90px]">
                          <p className="text-[15px] font-bold text-brand-navy">{fmtAUD(item.subtotal)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Package size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="text-[14px] font-medium">No line items recorded for this order.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {order.easyPostShipmentId ? (
                    <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div>
                        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Shipping Label Created</p>
                        <p className="text-[14.5px] font-bold text-brand-navy">
                          {order.trackingCarrier} - <a href={order.labelUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{order.trackingNumber}</a>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a href={order.labelUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-[13.5px] font-semibold text-brand-navy bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Download Label</a>
                        <button onClick={handleFulfill} disabled={fulfilling || !isUnfulfilled} className="px-4 py-2 text-[13.5px] font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50">
                          {fulfilling ? 'Updating...' : 'Mark as fulfilled'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleFulfill}
                        disabled={fulfilling || !isUnfulfilled}
                        className="px-5 py-2.5 text-[14px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {fulfilling ? 'Updating...' : 'Mark as fulfilled'}
                      </button>
                      <button
                        onClick={handleCreateLabel}
                        disabled={creatingLabel || !isPaid}
                        className="px-5 py-2.5 text-[14px] font-semibold text-white bg-brand-blue rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingLabel ? 'Generating...' : 'Create shipping label'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Paid Summary Card */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-navy">Payment</h2>
                    <p className="text-[13px] text-slate-500 font-medium">Completed via TagadaPay</p>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-4">
                  <div className="flex justify-between items-center text-[14.5px]">
                    <span className="text-slate-500 font-medium flex items-center gap-2">Subtotal <span className="text-[12px] px-2 py-0.5 bg-slate-200/50 rounded-md text-slate-600">{totalItems} items</span></span>
                    <span className="text-slate-700 font-semibold">{fmtAUD(subtotal)}</span>
                  </div>
                  {discountAmt > 0 && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-500 font-medium flex items-center gap-2">
                        Discount
                        {order.couponCode && (
                          <span className="text-[12px] px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-md font-bold uppercase tracking-wider">
                            {order.couponCode}
                          </span>
                        )}
                      </span>
                      <span className="text-brand-blue font-semibold">-{fmtAUD(discountAmt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[14.5px]">
                    <span className="text-slate-500 font-medium">Shipping <span className="text-slate-400 text-[13px] ml-1">({order.shippingMethodName || 'Standard'})</span></span>
                    <span className="text-slate-700 font-semibold">{fmtAUD(shippingAmt)}</span>
                  </div>
                  {taxAmt > 0 && (
                    <div className="flex justify-between items-center text-[14.5px]">
                      <span className="text-slate-500 font-medium">Tax</span>
                      <span className="text-slate-700 font-semibold">{fmtAUD(order.taxAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-5 mt-3 border-t border-slate-200">
                    <span className="text-[16px] font-bold text-brand-navy">Total</span>
                    <span className="text-[18px] font-black text-brand-navy">{fmtAUD(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="p-7">
                <h2 className="text-lg font-bold text-brand-navy mb-6">Timeline</h2>

                <div className="flex gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center shadow-md flex-shrink-0">
                    SB
                  </div>
                  <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:border-brand-blue transition-all bg-slate-50/50">
                    <textarea
                      placeholder="Leave a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full text-[14px] px-4 py-3 outline-none text-slate-700 placeholder-slate-400 bg-transparent resize-none min-h-[80px]"
                    />
                    <div className="bg-white px-3 py-2 border-t border-slate-200 flex justify-between items-center">
                      <div className="flex gap-1 text-slate-400">
                        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center">@</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center">#</button>
                      </div>
                      <button onClick={handleAddComment} disabled={updating || !commentText.trim()} className="px-5 py-2 bg-brand-navy text-white font-semibold rounded-lg text-[13px] shadow-sm hover:bg-brand-navy/90 transition-all disabled:opacity-50">
                        {updating ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline events */}
                <div className="ml-5 border-l-2 border-slate-100 pl-8 relative space-y-8 pb-4">
                  {order.comments?.slice().reverse().map((comment, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[37px] top-1 w-[11px] h-[11px] rounded-full bg-brand-blue ring-4 ring-white shadow-sm" />
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block min-w-[200px]">
                        <p className="text-[14.5px] text-slate-700">{comment.text}</p>
                      </div>
                      <p className="text-[13px] font-medium text-slate-400 mt-1">{fmtDate(comment.createdAt)}</p>
                    </div>
                  ))}

                  <div className="relative">
                    <div className="absolute -left-[37px] top-1 w-[11px] h-[11px] rounded-full bg-slate-300 ring-4 ring-white shadow-sm" />
                    <div>
                      <p className="text-[14.5px] text-slate-700">
                        A <span className="font-bold text-brand-navy">{fmtAUD(grandTotal)}</span> payment was processed on Tagada Pay.
                      </p>
                      <p className="text-[13px] font-medium text-slate-400 mt-1">{fmtDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[37px] top-1 w-[11px] h-[11px] rounded-full bg-slate-300 ring-4 ring-white shadow-sm" />
                    <div>
                      <p className="text-[14.5px] text-slate-700">
                        <span className="font-bold text-brand-navy">{customerName}</span> placed this order on Tagadacrm.
                      </p>
                      <p className="text-[13px] font-medium text-slate-400 mt-1">{fmtDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <div className="space-y-6">

            {/* Notes */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 relative group">
              <button className="absolute top-6 right-6 text-slate-300 hover:text-brand-blue transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={16} /></button>
              <h3 className="text-[15px] font-bold text-brand-navy mb-3 flex items-center gap-2">
                Notes
              </h3>
              <p className="text-[14px] text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                {order.adminNotes ? order.adminNotes : (
                  order.tagadaOrderId ? `TagadaPay Order ID: ${order.tagadaOrderId}` : 'No special notes left for this order.'
                )}
              </p>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-brand-navy flex items-center gap-2">
                  Customer
                </h3>
                <button className="text-slate-300 hover:text-brand-blue transition-colors"><MoreHorizontal size={18} /></button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-lg">
                  {customerName !== 'No customer name' ? customerName.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <div>
                  <a href="#" className="block text-[15px] font-bold text-brand-navy hover:text-brand-blue transition-colors">{customerName}</a>
                  <p className="text-[13px] font-medium text-slate-500 mt-0.5">1 order</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold tracking-wider uppercase text-slate-400 mb-2.5">Contact info</h4>
                  {customerEmail ? (
                    <a href={`mailto:${customerEmail}`} className="flex items-center gap-2 text-[14px] font-medium text-brand-blue hover:underline break-all mb-1.5">
                      <Mail size={14} className="text-brand-blue/60" /> {customerEmail}
                    </a>
                  ) : (
                    <p className="text-[14px] text-slate-400 italic">No email provided</p>
                  )}
                  {customerPhone && (
                    <p className="text-[14px] font-medium text-slate-600 mt-1 pl-6">{customerPhone}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[12px] font-bold tracking-wider uppercase text-slate-400">Shipping address</h4>
                    <button onClick={() => openAddressModal('shipping')} className="text-slate-300 hover:text-brand-blue transition-colors"><Edit2 size={14} /></button>
                  </div>
                  {shippingLines?.length > 0 ? (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <address className="not-italic text-[14px] font-medium text-slate-700 leading-relaxed mb-2">
                        {shippingLines.map((line, i) => <div key={i}>{line}</div>)}
                      </address>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(shippingLines.join(', '))}`} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-brand-blue hover:underline flex items-center gap-1">
                        <MapPin size={12} /> View map
                      </a>
                    </div>
                  ) : (
                    <p className="text-[14px] text-slate-400 italic">No shipping address</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[12px] font-bold tracking-wider uppercase text-slate-400">Billing address</h4>
                    <button onClick={() => openAddressModal('billing')} className="text-slate-300 hover:text-brand-blue transition-colors"><Edit2 size={14} /></button>
                  </div>
                  {sameAddress ? (
                    <p className="text-[14px] font-medium text-slate-500 flex items-center gap-2">
                      <Check size={14} className="text-emerald-500" /> Same as shipping
                    </p>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <address className="not-italic text-[14px] font-medium text-slate-700 leading-relaxed">
                        {billingLines.map((line, i) => <div key={i}>{line}</div>)}
                      </address>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 relative group">
              <h3 className="text-[15px] font-bold text-brand-navy mb-4 flex items-center gap-2">
                Tags
              </h3>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full text-[14px] font-medium bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all mb-4"
                />
              </div>
              {order.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-navy/5 text-brand-navy font-semibold text-[13px] rounded-lg border border-brand-navy/10"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="text-brand-navy/40 hover:text-brand-navy transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Order Risk */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex items-center justify-between group cursor-pointer hover:border-brand-blue/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check size={16} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-brand-navy">Order risk</h3>
                  <p className="text-[12px] font-medium text-emerald-600">Low risk</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
            </div>

          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      {isEditAddressModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Edit {addressTypeToEdit} address</h2>
              <button onClick={() => setIsEditAddressModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto px-1">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editAddressForm.name}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={editAddressForm.company}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Address / Street 1</label>
                <input
                  type="text"
                  value={editAddressForm.street1}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, street1: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Apartment, suite, etc. / Street 2</label>
                <input
                  type="text"
                  value={editAddressForm.street2}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, street2: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editAddressForm.city}
                    onChange={(e) => setEditAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={editAddressForm.state}
                    onChange={(e) => setEditAddressForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">ZIP / Postal code</label>
                  <input
                    type="text"
                    value={editAddressForm.zip}
                    onChange={(e) => setEditAddressForm(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editAddressForm.country}
                    onChange={(e) => setEditAddressForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditAddressModalOpen(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                disabled={updating}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
