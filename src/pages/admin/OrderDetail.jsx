/* eslint-disable no-unsafe-optional-chaining */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { State } from 'country-state-city';
import CustomAddressAutocomplete from '../../components/admin/CustomAddressAutocomplete';
import {
  ArrowLeft,
  MoreHorizontal,
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
  Printer,
  X,
  Activity,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';
import { toast } from 'react-hot-toast';
import { getUserFriendlyErrorMessage } from '../../utils/getUserFriendlyErrorMessage';

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

  const [order, setOrder] = useState(null);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fulfilling, setFulfilling] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  // New states for interactive fields
  const [commentText, setCommentText] = useState('');
  const [newTag, setNewTag] = useState('');

  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [addressTypeToEdit, setAddressTypeToEdit] = useState('shipping');
  const [addressModalMode, setAddressModalMode] = useState('edit'); // 'edit' | 'suggested'
  const [editAddressForm, setEditAddressForm] = useState({ name: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', country: '' });

  // Refund modal states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundType, setRefundType] = useState('full'); // 'full' | 'partial'
  const [refundReason, setRefundReason] = useState('');

  // Load Order

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiService.getAdminOrderById(id);
        const refundsRes = await apiService.getAdminOrderRefunds(id);
        const data = await res.json();
        const refundsData = await refundsRes.json();
        if (data.success) {
          setOrder(data.data.order);
        }
        if (refundsData.success) {
          setRefunds(refundsData.data.refunds);
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
    setAddressModalMode('edit');
    const addr = type === 'shipping' ? order.shippingAddressObj : order.billingAddressObj;
    setEditAddressForm({
      name: addr?.name || '',
      company: addr?.company || '',
      street1: addr?.street1 || '',
      street2: addr?.street2 || '',
      city: addr?.city || '',
      state: addr?.state || '',
      zip: addr?.zip || '',
      country: addr?.country || ''
    });
    setIsEditAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    const payload = addressTypeToEdit === 'shipping'
      ? { shippingAddressObj: editAddressForm }
      : { billingAddressObj: editAddressForm };

    const success = await updateOrderField(payload, 'Address updated');
    if (success) setIsEditAddressModalOpen(false);
  };

  const handleUseSuggestedAddress = () => {
    setAddressTypeToEdit('shipping');
    setAddressModalMode('suggested');
    const addr = order.addressValidation.suggestedAddress;
    setEditAddressForm({
      name: order.shippingAddressObj?.name || '',
      company: order.shippingAddressObj?.company || '',
      street1: addr?.street1 || '',
      street2: addr?.street2 || '',
      city: addr?.city || '',
      state: addr?.state || '',
      zip: addr?.zip || '',
      country: addr?.country || ''
    });
    setIsEditAddressModalOpen(true);
  };

  const handleCreateLabel = async () => {
    if (creatingLabel) return;
    setCreatingLabel(true);
    try {
      const res = await apiService.createAdminShipment(id);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
        // If there was a warning (e.g. Starshipit address validation failed but order was created)
        if (data.warning) {
          toast.error(`Warning: ${data.warning}`, { duration: 8000 });
        } else {
          toast.success(data.message || 'Shipping label generated successfully!');
        }
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

  const handleRevalidateAddress = async () => {
    if (revalidating) return;
    setRevalidating(true);
    try {
      toast.loading('Re-running address validation...', { id: 'revalidate' });
      const res = await apiService.revalidateAdminOrderAddress(id);
      const data = await res.json();
      if (data.success) {
        toast.success('Re-validation triggered! Refreshing...', { id: 'revalidate' });
        // Wait 3 seconds then reload order to show new result
        setTimeout(async () => {
          const orderRes = await apiService.getAdminOrderById(id);
          const orderData = await orderRes.json();
          if (orderData.success) setOrder(orderData.data.order);
          setRevalidating(false);
        }, 3000);
      } else {
        toast.error(data.message || 'Re-validation failed', { id: 'revalidate' });
        setRevalidating(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error', { id: 'revalidate' });
      setRevalidating(false);
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
        toast.success('Order fulfilled successfully');
      } else {
        toast.error(getUserFriendlyErrorMessage(data.message, 'orderFulfill'));
      }
    } catch (err) {
      console.error(err);
      toast.error(getUserFriendlyErrorMessage(err, 'orderFulfill'));
    } finally {
      setFulfilling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefund = async () => {
    if (refunding) return;
    setRefunding(true);
    try {
      const payload = {
        type: 'full',
        reason: refundReason || 'Admin initiated refund'
      };

      const res = await apiService.refundAdminOrder(id, payload);
      const data = await res.json();

      if (data.success) {
        setOrder(data.data.order);
        if (data.data.refund) {
          setRefunds([data.data.refund, ...refunds]);
        }
        setIsRefundModalOpen(false);
        setRefundReason('');
        toast.success(data.message || 'Refund initiated successfully');
      } else {
        toast.error(data.message || 'Failed to process refund');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server for refund');
    } finally {
      setRefunding(false);
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

  // ─── Timeline Events Logic ───────────────────────────────────────────────────

  const getGroupKey = (dateStr) => {
    if (!dateStr) return 'Past';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getTimeString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins || 1} minutes ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const timelineEvents = [];
  const addEvent = (text, date, hasEmailButton = false) => {
    timelineEvents.push({ text, date, hasEmailButton });
  };

  // Base created event
  addEvent(
    <span><span className="font-bold text-brand-navy">{customerName}</span> placed this order on Tagadacrm.</span>,
    order.createdAt
  );

  // Tagada ID
  if (order.tagadaOrderId) {
    addEvent(
      <span>Confirmation <span className="font-bold text-brand-navy">#{order.tagadaOrderId}</span> was generated for this order.</span>,
      order.createdAt
    );
  }

  // Admin note
  if (order.adminNotes) {
    addEvent(
      <span>Tagadacrm added a note to this order.</span>,
      order.updatedAt || order.createdAt
    );
  }

  // Payment
  if (isPaid || grandTotal > 0) {
    addEvent(
      <span>A <span className="font-bold text-brand-navy">{fmtAUD(grandTotal)}</span> payment was processed on Tagada Pay.</span>,
      order.createdAt
    );
    addEvent(
      <span>Tagadacrm sent an order confirmation email to {customerName} ({customerEmail}).</span>,
      order.createdAt,
      true
    );
  }

  // Refunds
  if (refunds && refunds.length > 0) {
    const uniqueRefunds = [];
    const seenRefundKeys = new Set();

    refunds.forEach(refund => {
      if (Number(refund.amount) <= 0) return;

      const key = `${refund.amount}-${new Date(refund.createdAt).toDateString()}-${new Date(refund.createdAt).getHours()}-${new Date(refund.createdAt).getMinutes()}`;
      if (seenRefundKeys.has(key)) return;
      seenRefundKeys.add(key);
      uniqueRefunds.push(refund);
    });

    uniqueRefunds.forEach(refund => {
      addEvent(
        <span>Tagadacrm refunded <span className="font-bold text-brand-navy">{fmtAUD(refund.amount)}</span> to Tagada Pay.</span>,
        refund.createdAt
      );
      if (refund.type === 'full') {
        addEvent(
          <span>Tagadacrm refunded shipping.</span>,
          refund.createdAt
        );
      }
      addEvent(
        <span>Tagadacrm sent a refund notification email to {customerName} ({customerEmail}).</span>,
        refund.createdAt,
        true
      );
    });
  }

  // Comments
  if (order.comments && order.comments.length > 0) {
    order.comments.forEach(comment => {
      addEvent(
        <span className="text-slate-700">{comment.text}</span>,
        comment.createdAt
      );
    });
  }

  timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  const groupedEvents = {};
  timelineEvents.forEach(ev => {
    const key = getGroupKey(ev.date);
    if (!groupedEvents[key]) groupedEvents[key] = [];
    groupedEvents[key].push(ev);
  });

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
                #{order.orderNumber ?? String(order._id).slice(-8).toUpperCase()}

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

          <div className=" items-center gap-3 print:hidden flex">
            {isPaid && (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="hidden px-4 py-2.5 text-[13.5px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-red-100 transition-all disabled:opacity-50"
              >
                {refunding ? 'Processing...' : 'Refund'}
              </button>
            )}
            <AdminSecondaryButton onClick={handlePrint} className="!text-[13.5px] px-4 !py-2.5 shadow-sm">
              Print <Printer size={14} className="text-slate-400" />
            </AdminSecondaryButton>
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
                      <p className="text-[13px] text-slate-500 font-medium">{order.shippingMethodName || 'Standard Shipping'}</p>
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
                  {order.starshipitOrderId ? (
                    <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div>
                        <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Check size={14} /> Shipment Created {order.shipmentStatus ? `(${order.shipmentStatus})` : ''}
                        </p>
                        <p className="text-[14.5px] font-bold text-brand-navy">
                          {order.trackingCarrier} - {order.trackingNumber ? (
                            <a href={order.trackingUrl || `https://www.google.com/search?q=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{order.trackingNumber}</a>
                          ) : (
                            <span className="text-slate-400 italic font-medium">Label Pending (Check Starshipit)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.labelUrl && (
                          <AdminSecondaryButton href={order.labelUrl} className="!text-[13.5px] px-4 !py-2">
                            Download Label
                          </AdminSecondaryButton>
                        )}
                        <button onClick={handleFulfill} disabled={fulfilling || !isUnfulfilled} className="px-4 py-2 text-[13.5px] font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50">
                          {fulfilling ? 'Updating...' : 'Mark as fulfilled'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {order.addressValidation?.needsReview && (
                        <p className="text-[12px] font-medium text-red-500 mr-auto flex items-center gap-1">
                          ⚠️ Verify address before creating label
                        </p>
                      )}
                      <AdminSecondaryButton
                        onClick={handleFulfill}
                        disabled={fulfilling || !isUnfulfilled}
                        className="shadow-sm"
                      >
                        {fulfilling ? 'Updating...' : 'Mark as fulfilled'}
                      </AdminSecondaryButton>
                      <AdminPrimaryButton
                        onClick={handleCreateLabel}
                        disabled={creatingLabel || order.refundStatus === 'refunded'}
                      >
                        {creatingLabel ? 'Generating...' : 'Create shipping label'}
                      </AdminPrimaryButton>
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

            {/* Refunds Card */}
            {order.paymentStatus !== 'pending' && (
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mt-8">
                <div className="p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-brand-navy">Refunds</h2>
                        <p className="text-[13px] text-slate-500 font-medium">Manage order refunds</p>
                      </div>
                    </div>
                    {order.refundStatus === 'refunded' ? (
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[13px] font-semibold rounded-full border border-green-200">
                        Fully Refunded
                      </span>
                    ) : order.refundStatus === 'partially_refunded' ? (
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[13px] font-semibold rounded-full border border-yellow-200">
                        Partially Refunded
                      </span>
                    ) : null}
                  </div>

                  {refunds.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {refunds.map((refund, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <div>
                            <p className="text-[14px] font-bold text-brand-navy">
                              {refund.type === 'full' ? 'Full Refund' : 'Partial Refund'}
                              <span className="ml-2 text-[12px] font-medium text-slate-400 capitalize">({refund.status})</span>
                            </p>
                            <p className="text-[13px] text-slate-500 mt-0.5">{refund.reason}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[15px] font-black text-brand-navy">{fmtAUD(refund.amount)}</p>
                            <p className="text-[12px] text-slate-400 mt-0.5">{new Date(refund.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.refundStatus !== 'refunded' && (
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                      <AdminPrimaryButton
                        onClick={() => {
                          setRefundType('full');
                          setIsRefundModalOpen(true);
                        }}
                        disabled={order.tagadaEnv && order.tagadaEnv !== 'sandbox'}
                        className="!bg-orange-600 hover:!bg-orange-700 !shadow-none"
                      >
                        Refund Full Amount
                      </AdminPrimaryButton>
                    </div>
                  )}

                  {order.tagadaEnv && order.tagadaEnv !== 'sandbox' && order.refundStatus !== 'refunded' && (
                    <p className="text-xs text-red-500 font-medium text-right mt-3">
                      Refunds can only be initiated for sandbox/test orders.
                    </p>
                  )}
                </div>
              </div>
            )}

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
                    <div className="bg-white px-3 py-2 border-t border-slate-200 flex justify-end items-center">
                      <AdminPrimaryButton onClick={handleAddComment} disabled={updating || !commentText.trim()} className="!py-1.5 !px-4 !text-[13px]">
                        {updating ? 'Posting...' : 'Post'}
                      </AdminPrimaryButton>
                    </div>
                  </div>
                </div>

                {/* Timeline events */}
                <div className="ml-5 border-l-2 border-slate-100 pl-8 relative pb-4 mt-8">
                  {Object.entries(groupedEvents).map(([groupName, events], gIdx) => (
                    <div key={gIdx} className="mb-8 last:mb-0">
                      <h4 className="text-[13px] font-bold text-slate-500 mb-6 relative">
                        <span className="bg-white pr-4 relative z-10">{groupName}</span>
                      </h4>
                      <div className="space-y-6">
                        {events.map((event, i) => (
                          <div key={i} className="relative flex items-start justify-between gap-4 group">
                            {/* The line dot */}
                            <div className="absolute -left-[40px] top-1.5 w-[11px] h-[11px] rounded-full bg-slate-500 ring-4 ring-white shadow-sm" />

                            <div className="flex items-start gap-3">
                              {/* The light grey square icon */}
                              <div className="w-6 h-6 bg-slate-100/80 rounded flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5 border border-slate-200/50">
                                <Activity size={12} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[14px] text-slate-600">{event.text}</p>

                              </div>
                            </div>
                            <div className="text-[13px] text-slate-400 whitespace-nowrap font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                              {getTimeString(event.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <div className="space-y-6">

            {/* Address Validation Warning */}
            {order.addressValidation?.needsReview && (
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-200 p-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <h3 className="text-[15px] font-bold text-red-700 mb-3 flex items-center gap-2">
                  ⚠️ Address Needs Review
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                  {order.addressValidation.validationMessage || 'Address has unconfirmed or replaced/inferred components. Please review.'}
                </p>
                <div className={`grid gap-4 mb-4 ${order.addressValidation.suggestedAddress ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-hidden">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Original Address</span>
                    <address className="not-italic text-[13px] font-medium text-slate-700">
                      {order.shippingAddressObj?.street1}<br />
                      {order.shippingAddressObj?.street2 && <>{order.shippingAddressObj.street2}<br /></>}
                      {order.shippingAddressObj?.city} {order.shippingAddressObj?.state} {order.shippingAddressObj?.zip}
                    </address>
                  </div>
                  {order.addressValidation.suggestedAddress && (
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Suggested Correction</span>
                      <address className="not-italic text-[13px] font-medium text-emerald-800">
                        {order.addressValidation.suggestedAddress.street1}<br />
                        {order.addressValidation.suggestedAddress.street2 && <>{order.addressValidation.suggestedAddress.street2}<br /></>}
                        {order.addressValidation.suggestedAddress.city} {order.addressValidation.suggestedAddress.state} {order.addressValidation.suggestedAddress.zip}
                      </address>
                    </div>
                  )}
                </div>
                {order.addressValidation.suggestedAddress ? (
                  <>
                    <button onClick={handleUseSuggestedAddress} className="w-full bg-[#0275d8] hover:bg-[#025aa5] text-white font-bold transition-colors shadow-sm rounded-xl text-[13px] py-2.5 flex justify-center items-center mb-2">
                      Use Suggested Address
                    </button>
                    <button onClick={handleRevalidateAddress} disabled={revalidating} className="w-full bg-white hover:bg-slate-50 text-slate-600 font-semibold border border-slate-200 transition-colors shadow-sm rounded-xl text-[13px] py-2 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {revalidating ? <><span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent"></span> Validating...</> : 'Re-validate Address'}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => openAddressModal('shipping')} className="flex-1 bg-brand-navy hover:bg-brand-blue text-white font-bold transition-colors shadow-sm rounded-xl text-[13px] py-2.5 flex justify-center items-center">
                      Edit Address
                    </button>
                    <button onClick={handleRevalidateAddress} disabled={revalidating} className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-semibold border border-slate-200 transition-colors shadow-sm rounded-xl text-[13px] py-2.5 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {revalidating ? <><span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent"></span> Validating...</> : 'Re-validate'}
                    </button>
                  </div>
                )}
              </div>
            )}

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

            {/* Conversion Summary */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
              <h3 className="text-[15px] font-bold text-brand-navy mb-5 flex items-center gap-2">
                Conversion Summary
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="block text-slate-400 font-medium mb-1">Source</span>
                    <span className="font-semibold text-brand-navy">{(order.attribution?.lastTouch?.source || order.attribution?.firstTouch?.source) || 'Direct / Unknown'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium mb-1">Channel</span>
                    <span className="font-semibold text-brand-navy">{(order.attribution?.lastTouch?.channel || order.attribution?.firstTouch?.channel) || 'direct'}</span>
                  </div>
                  {(order.attribution?.lastTouch?.utmCampaign || order.attribution?.firstTouch?.utmCampaign) && (
                    <div className="col-span-2">
                      <span className="block text-slate-400 font-medium mb-1">Campaign</span>
                      <span className="font-semibold text-brand-navy">{order.attribution?.lastTouch?.utmCampaign || order.attribution?.firstTouch?.utmCampaign}</span>
                    </div>
                  )}
                  {(order.attribution?.lastTouch?.sourceDomain || order.attribution?.firstTouch?.sourceDomain) && (
                    <div className="col-span-2">
                      <span className="block text-slate-400 font-medium mb-1">Domain</span>
                      <span className="font-semibold text-brand-blue truncate block">
                        {order.attribution?.lastTouch?.sourceDomain || order.attribution?.firstTouch?.sourceDomain}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="flex items-center justify-between w-full text-[13px] font-semibold text-slate-500 hover:text-brand-blue transition-colors"
                  >
                    Technical Details
                    {showTechDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showTechDetails && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 text-[12px] font-mono break-all text-slate-600">
                      {(order.attribution?.lastTouch?.utmSource || order.attribution?.firstTouch?.utmSource) && (
                        <div><span className="font-semibold text-slate-400">utm_source:</span> {order.attribution?.lastTouch?.utmSource || order.attribution?.firstTouch?.utmSource}</div>
                      )}
                      {(order.attribution?.lastTouch?.utmMedium || order.attribution?.firstTouch?.utmMedium) && (
                        <div><span className="font-semibold text-slate-400">utm_medium:</span> {order.attribution?.lastTouch?.utmMedium || order.attribution?.firstTouch?.utmMedium}</div>
                      )}
                      {(order.attribution?.lastTouch?.utmContent || order.attribution?.firstTouch?.utmContent) && (
                        <div><span className="font-semibold text-slate-400">utm_content:</span> {order.attribution?.lastTouch?.utmContent || order.attribution?.firstTouch?.utmContent}</div>
                      )}
                      {(order.attribution?.lastTouch?.utmTerm || order.attribution?.firstTouch?.utmTerm) && (
                        <div><span className="font-semibold text-slate-400">utm_term:</span> {order.attribution?.lastTouch?.utmTerm || order.attribution?.firstTouch?.utmTerm}</div>
                      )}
                      {(order.attribution?.lastTouch?.gclid || order.attribution?.firstTouch?.gclid) && (
                        <div><span className="font-semibold text-slate-400">gclid:</span> {order.attribution?.lastTouch?.gclid || order.attribution?.firstTouch?.gclid}</div>
                      )}
                      {(order.attribution?.lastTouch?.fbclid || order.attribution?.firstTouch?.fbclid) && (
                        <div><span className="font-semibold text-slate-400">fbclid:</span> {order.attribution?.lastTouch?.fbclid || order.attribution?.firstTouch?.fbclid}</div>
                      )}
                      {(order.attribution?.lastTouch?.ttclid || order.attribution?.firstTouch?.ttclid) && (
                        <div><span className="font-semibold text-slate-400">ttclid:</span> {order.attribution?.lastTouch?.ttclid || order.attribution?.firstTouch?.ttclid}</div>
                      )}
                      {(order.attribution?.lastTouch?.msclkid || order.attribution?.firstTouch?.msclkid) && (
                        <div><span className="font-semibold text-slate-400">msclkid:</span> {order.attribution?.lastTouch?.msclkid || order.attribution?.firstTouch?.msclkid}</div>
                      )}
                      {(order.attribution?.lastTouch?.sessionId || order.attribution?.firstTouch?.sessionId) && (
                        <div><span className="font-semibold text-slate-400">session_id:</span> {order.attribution?.lastTouch?.sessionId || order.attribution?.firstTouch?.sessionId}</div>
                      )}
                      {(order.attribution?.lastTouch?.referrerUrl || order.attribution?.firstTouch?.referrerUrl) && (
                        <div>
                          <span className="font-semibold text-slate-400">referrer:</span>
                          <a href={order.attribution?.lastTouch?.referrerUrl || order.attribution?.firstTouch?.referrerUrl} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline ml-1">
                            {(order.attribution?.lastTouch?.referrerUrl || order.attribution?.firstTouch?.referrerUrl).substring(0, 50)}...
                          </a>
                        </div>
                      )}
                      {(order.attribution?.lastTouch?.landingPage || order.attribution?.firstTouch?.landingPage) && (
                        <div>
                          <span className="font-semibold text-slate-400">landing_page:</span>
                          <span className="ml-1">{(order.attribution?.lastTouch?.landingPage || order.attribution?.firstTouch?.landingPage).substring(0, 50)}...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Risk */}
            <div className="hidden bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex items-center justify-between group cursor-pointer hover:border-brand-blue/30 transition-colors">
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
      {isEditAddressModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Edit {addressTypeToEdit} address</h2>
              <button onClick={() => setIsEditAddressModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto px-1">
              {/* Address fields only - Name and Company managed separately */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Address / Street 1</label>
                <CustomAddressAutocomplete
                  value={editAddressForm.street1}
                  onChange={(val) => setEditAddressForm(prev => ({ ...prev, street1: val }))}
                  onSelect={(place) => {
                    const addr = place.address || {};
                    let streetNumber = addr.house_number || '';
                    let route = addr.road || '';
                    let city = addr.suburb || addr.city || addr.town || addr.village || addr.municipality || addr.state_district || '';
                    let stateName = addr.state || addr.province || addr.region || '';
                    let zip = addr.postcode || addr.postal || '';
                    let countryCode = addr.country_code ? addr.country_code.toUpperCase() : editAddressForm.country;

                    let streetStr = `${streetNumber} ${route}`.trim();
                    if (!streetStr) {
                      streetStr = place.name || (place.display_name ? place.display_name.split(',')[0] : '');
                    }

                    const countryStates = State.getStatesOfCountry(countryCode);
                    const matchedState = countryStates.find(s =>
                      s.name.toLowerCase() === stateName.toLowerCase() ||
                      s.isoCode.toLowerCase() === stateName.toLowerCase()
                    );
                    const finalStateCode = matchedState ? matchedState.isoCode : stateName;

                    setEditAddressForm(prev => ({
                      ...prev,
                      street1: streetStr,
                      city: city || prev.city,
                      state: finalStateCode || prev.state,
                      zip: zip || prev.zip,
                      country: countryCode || prev.country
                    }));
                  }}
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
        </div>,
        document.body
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden p-7 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              Refund Full Amount
            </h3>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-orange-800 mb-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                TEST MODE WARNING
              </p>
              <p className="text-xs text-orange-700">
                You are about to process a refund in the TEST Tagada funnel. No real money will be affected. Do you want to continue?
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Reason (optional)</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full text-[14px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  placeholder="e.g., Customer request, out of stock"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <AdminSecondaryButton onClick={() => setIsRefundModalOpen(false)}>
                Cancel
              </AdminSecondaryButton>
              <AdminPrimaryButton
                onClick={handleRefund}
                disabled={refunding}
                className="!bg-orange-600 hover:!bg-orange-700 !shadow-none"
              >
                {refunding ? 'Processing...' : 'Confirm Refund'}
              </AdminPrimaryButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default OrderDetail;
