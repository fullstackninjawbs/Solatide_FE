import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  ArrowLeft,
  CheckCircle,
  Ban,
  Loader2,
  Edit2,
  ShoppingBag,
  X,
  Trash2,
  Send,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  Truck,
  Package,
  RotateCcw,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Tag,
  ExternalLink,
  User,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';
import { useConfirm } from '../../components/admin/feedback/ConfirmProvider';

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtAUD(v) {
  if (v == null) return '$0.00';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(v));
}

function formatDate(dateString, includeTime = false) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  const dateOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Australia/Sydney' };
  const datePart = d.toLocaleDateString('en-US', dateOptions);
  if (!includeTime) return datePart;
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' };
  const timePart = d.toLocaleTimeString('en-US', timeOptions);
  return `${datePart} at ${timePart.toLowerCase()} AEST`;
}

function getTimeSince(dateString) {
  if (!dateString) return '—';
  const diff = new Date() - new Date(dateString);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CustomerDetail = () => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const confirm = useConfirm();

  // Interactive Form States
  const [newTag, setNewTag] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [editContactForm, setEditContactForm] = useState({ email: '', phone: '' });
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState({
    name: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminCustomerById(id);
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomer(data.data.customer);
        setOrders(data.data.orders || []);
        setEditContactForm({
          email: data.data.customer.email || '',
          phone: data.data.customer.phone || ''
        });
        setEditAddressForm(
          data.data.customer.defaultAddress || {
            name: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        );
      } else {
        toast.error('Customer not found');
        navigate('/admin/customers');
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      toast.error('Error loading customer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const updateCustomerField = async (payload, successMessage = 'Customer updated') => {
    try {
      setUpdating(true);
      const res = await apiService.updateAdminCustomer(id, payload);
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomer(data.data.customer);
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

  const toggleBanStatus = async () => {
    const isConfirmed = await confirm({
      title: customer.banned ? 'Unban Customer' : 'Ban Customer',
      message: `Are you sure you want to ${customer.banned ? 'unban' : 'ban'} this customer?`,
      confirmText: customer.banned ? 'Unban' : 'Ban',
      type: customer.banned ? 'info' : 'danger'
    });
    if (!isConfirmed) return;
    await updateCustomerField(
      { banned: !customer.banned },
      `Customer ${customer.banned ? 'unbanned' : 'banned'} successfully`
    );
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tagToAdd = newTag.trim();
      if (customer.tags?.includes(tagToAdd)) {
        toast.error('Tag already exists');
        return;
      }
      const updatedTags = [...(customer.tags || []), tagToAdd];
      const success = await updateCustomerField({ tags: updatedTags }, 'Tag added');
      if (success) setNewTag('');
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = (customer.tags || []).filter((t) => t !== tagToRemove);
    await updateCustomerField({ tags: updatedTags }, 'Tag removed');
  };

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = { text: commentText.trim() };
    const updatedComments = [...(customer.comments || []), newComment];
    const success = await updateCustomerField({ comments: updatedComments }, 'Comment added');
    if (success) setCommentText('');
  };

  const handleDeleteComment = async (indexToDelete) => {
    const isConfirmed = await confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment?',
      confirmText: 'Delete',
      type: 'danger'
    });
    if (isConfirmed) {
      const updatedComments = (customer.comments || []).filter((_, idx) => idx !== indexToDelete);
      await updateCustomerField({ comments: updatedComments }, 'Comment deleted');
    }
  };

  const handleSaveContact = async () => {
    if (!editContactForm.email) {
      toast.error('Email is required');
      return;
    }
    const success = await updateCustomerField(
      {
        email: editContactForm.email,
        phone: editContactForm.phone
      },
      'Contact information updated ✓'
    );
    if (success) setIsEditContactModalOpen(false);
  };

  const handleSaveAddress = async () => {
    const success = await updateCustomerField(
      { defaultAddress: editAddressForm },
      'Default address updated ✓'
    );
    if (success) setIsEditAddressModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-9 h-9 text-brand-blue animate-spin" />
        <p className="text-slate-500 font-medium text-[14px]">Loading customer profile...</p>
      </div>
    );
  }

  if (!customer) return null;

  const lastOrder = orders.length > 0 ? orders[0] : null;
  const hasAddressData = (addr) => addr && (addr.street1 || addr.city || addr.country);
  const address = hasAddressData(customer.defaultAddress)
    ? customer.defaultAddress
    : hasAddressData(lastOrder?.shippingAddressObj)
    ? lastOrder?.shippingAddressObj
    : lastOrder?.billingAddressObj;

  const phoneToDisplay = customer.phone || lastOrder?.customer?.phone;

  // Combine timeline items: orders (placed, paid, fulfilled, refunded), comments, and account creation
  const timelineItems = (() => {
    const items = [];

    // Account Creation
    items.push({
      type: 'creation',
      date: new Date(customer.createdAt),
      title: 'Customer account was created.'
    });

    // Admin Comments
    if (customer.comments && Array.isArray(customer.comments)) {
      customer.comments.forEach((comment, idx) => {
        items.push({
          type: 'comment',
          date: new Date(comment.createdAt),
          comment,
          originalIndex: idx
        });
      });
    }

    // Order-related lifecycle events
    orders.forEach((order) => {
      const orderId = order._id;
      const orderNo = order.orderNumber;
      const orderLink = (
        <Link
          to={`/admin/orders/${orderId}`}
          className="font-bold text-brand-navy hover:text-brand-blue bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-md transition-colors"
        >
          #{orderNo}
        </Link>
      );

      // 1. Placed
      items.push({
        type: 'order_placed',
        date: new Date(order.createdAt),
        content: <span>Placed order {orderLink} on Web.</span>
      });

      // 2. Paid
      if (order.paymentStatus === 'paid') {
        items.push({
          type: 'order_paid',
          date: new Date(order.paidAt || order.updatedAt || order.createdAt),
          content: <span>Payment of {fmtAUD(order.grandTotal)} for order {orderLink} was processed.</span>
        });
      }

      // 3. Fulfilled
      if (order.fulfilmentStatus === 'fulfilled') {
        items.push({
          type: 'order_fulfilled',
          date: new Date(order.fulfilledAt || order.updatedAt || order.createdAt),
          content: <span>Order {orderLink} was fulfilled.</span>
        });
      }

      // 4. Refunded
      if (order.refundStatus === 'refunded' || order.refundStatus === 'partially_refunded') {
        const isFull = order.refundStatus === 'refunded';
        items.push({
          type: 'order_refunded',
          date: new Date(order.updatedAt || order.createdAt),
          content: <span>Order {orderLink} was {isFull ? 'fully refunded' : 'partially refunded'}.</span>
        });
      }
    });

    return items.sort((a, b) => b.date - a.date);
  })();

  return (
    <div className="font-sans w-full min-h-screen text-slate-850 pb-16">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3.5 mb-1.5 flex-wrap">
            <Link
              to="/admin/customers"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
              title="Back to Customers"
            >
              <ArrowLeft size={18} />
            </Link>

            <h1 className="text-2xl font-black text-brand-navy tracking-tight">{customer.name}</h1>

            <div className="flex items-center gap-2">
              {customer.banned ? (
                <span className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-semibold rounded-full border bg-red-50 text-red-700 border-red-200 shadow-sm">
                  <Ban size={14} className="text-red-500" /> Banned
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-semibold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
                  <CheckCircle size={14} className="text-emerald-500" /> Active Customer
                </span>
              )}
            </div>
          </div>

          <p className="text-[14px] text-slate-500 ml-[52px] font-medium">
            Customer since {formatDate(customer.createdAt)} · {orders.length} order{orders.length === 1 ? '' : 's'} placed
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto ml-[52px] md:ml-0">
          <button
            onClick={toggleBanStatus}
            disabled={updating}
            className={`px-4 py-2.5 rounded-xl text-[13.5px] font-semibold border transition-all cursor-pointer ${
              customer.banned
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {customer.banned ? 'Unban customer' : 'Ban customer'}
          </button>

          <AdminPrimaryButton
            to={`/admin/orders/create?email=${encodeURIComponent(customer.email)}`}
            className="!py-2.5 !px-5 !text-[13.5px] shadow-sm"
          >
            <Package size={15} /> Create order
          </AdminPrimaryButton>
        </div>
      </div>

      {/* ─── Top Metrics Bar (3 Modern Cards) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Spent */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between hover:border-slate-200 transition-all">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-2xl font-black text-brand-navy">{fmtAUD(customer.totalSpent)}</p>
            <p className="text-[12px] text-slate-400 mt-1 font-medium">Lifetime net revenue</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Orders Placed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between hover:border-slate-200 transition-all">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Orders</p>
            <p className="text-2xl font-black text-brand-navy">{customer.orderCount || orders.length || 0}</p>
            <p className="text-[12px] text-slate-400 mt-1 font-medium">Completed purchases</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Customer Since */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between hover:border-slate-200 transition-all">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Since</p>
            <p className="text-xl font-black text-brand-navy mt-1">{getTimeSince(customer.createdAt)}</p>
            <p className="text-[12px] text-slate-400 mt-1 font-medium">{formatDate(customer.createdAt)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* ─── 2-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="space-y-8">
          {/* Order History Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-navy">Order History</h2>
                  <p className="text-[13px] text-slate-500 font-medium">
                    {orders.length} total order{orders.length === 1 ? '' : 's'} recorded
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[13px] font-semibold rounded-full border border-slate-200 flex items-center gap-1.5">
                <Package size={14} /> {orders.length} order{orders.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-0">
              {orders && orders.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const isPaid = order.paymentStatus === 'paid';
                    const isFulfilled = order.fulfilmentStatus === 'fulfilled';
                    return (
                      <div
                        key={order._id}
                        className="p-6 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        <div className="flex justify-between items-start mb-3.5">
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                              <span className="font-bold text-[16px] text-brand-navy group-hover:text-brand-blue transition-colors">
                                #{order.orderNumber}
                              </span>

                              {/* Payment Status Pill */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1.5 border ${
                                  isPaid
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                              </span>

                              {/* Fulfilment Status Pill */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1.5 border ${
                                  isFulfilled
                                    ? 'bg-blue-50 text-brand-blue border-blue-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isFulfilled ? 'bg-brand-blue' : 'bg-slate-400'}`}></span>
                                {order.fulfilmentStatus ? order.fulfilmentStatus.charAt(0).toUpperCase() + order.fulfilmentStatus.slice(1) : 'Unfulfilled'}
                              </span>
                            </div>

                            <p className="text-[13px] text-slate-500 font-medium">
                              {formatDate(order.createdAt, true)} from {order.source === 'shopify_import' ? 'Shopify Import' : order.source === 'admin_manual' ? 'Admin' : 'Web Storefront'}
                            </p>
                          </div>

                          <div className="text-right flex flex-col items-end gap-0.5">
                            <p className="text-[17px] font-black text-brand-navy">{fmtAUD(order.grandTotal)}</p>
                            <p className="text-[12.5px] text-slate-500 font-medium">{order.lineItems?.length || 0} item(s)</p>
                          </div>
                        </div>

                        {/* Product Thumbnails */}
                        <div className="flex items-center gap-2.5 overflow-hidden pt-1">
                          {order.lineItems?.slice(0, 6).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
                              title={item.title}
                            >
                              {item.productImageUrl ? (
                                <img src={item.productImageUrl} alt={item.title || ''} className="w-full h-full object-cover" />
                              ) : (
                                <ShoppingBag className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          ))}
                          {(order.lineItems?.length || 0) > 6 && (
                            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-[12px] font-bold text-slate-500 shrink-0">
                              +{(order.lineItems?.length || 0) - 6}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <ShoppingBag size={22} />
                  </div>
                  <p className="text-[15px] font-bold text-brand-navy mb-1">No orders yet</p>
                  <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                    This customer hasn't completed any purchases on the storefront yet.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-[13px] text-slate-500 font-medium">
                Showing {orders.length} order{orders.length === 1 ? '' : 's'}
              </span>
              <AdminSecondaryButton
                to={`/admin/orders?q=${encodeURIComponent(customer.email)}`}
                className="!py-2 !px-4 !text-[13px]"
              >
                View in Orders page <ExternalLink size={13} className="text-slate-400" />
              </AdminSecondaryButton>
            </div>
          </div>

          {/* Timeline & Notes Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Clock size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-navy">Timeline & Notes</h2>
                <p className="text-[13px] text-slate-500 font-medium">Audit trail of customer lifecycle events and staff comments</p>
              </div>
            </div>

            {/* Leave a Comment Bar */}
            <form onSubmit={handleAddComment} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                {customer.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a staff note or comment... (Press Enter to post)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all pr-24"
                />
                {commentText.trim() && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-blue hover:bg-brand-navy text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Post <Send size={12} />
                  </button>
                )}
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="relative border-l-2 border-slate-100 ml-5 pl-8 space-y-6">
              {timelineItems.map((item, idx) => {
                if (item.type === 'creation') {
                  return (
                    <div key="creation" className="relative">
                      <span className="absolute -left-[50px] top-0.5 w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-4 border-white shadow-sm">
                        <UserPlus size={14} />
                      </span>
                      <div className="flex justify-between items-center group min-h-[36px]">
                        <p className="text-[13.5px] font-medium text-slate-700">{item.title}</p>
                        <span className="text-[12px] text-slate-400 font-medium">{formatDate(item.date, true)}</span>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'comment') {
                  return (
                    <div key={`comment-${idx}`} className="relative">
                      <span className="absolute -left-[50px] top-1 w-9 h-9 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center border-4 border-white shadow-sm">
                        <MessageSquare size={14} />
                      </span>
                      <div className="flex-1 bg-slate-50/90 rounded-2xl p-4 border border-slate-100 relative group">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-[12px] font-bold text-brand-navy uppercase tracking-wider">Staff Note</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">{formatDate(item.date, true)}</span>
                            {adminUser?.role === 'super_admin' && (
                              <button
                                onClick={() => handleDeleteComment(item.originalIndex)}
                                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                                title="Delete note"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[13.5px] text-slate-700 whitespace-pre-wrap leading-relaxed">{item.comment.text}</p>
                      </div>
                    </div>
                  );
                }

                // Order lifecycle actions (placed, paid, fulfilled, refunded)
                let icon = <Package size={14} />;
                let badgeBg = 'bg-slate-100 text-slate-500';

                if (item.type === 'order_placed') {
                  icon = <ShoppingBag size={14} />;
                  badgeBg = 'bg-blue-50 text-brand-blue';
                } else if (item.type === 'order_paid') {
                  icon = <DollarSign size={14} />;
                  badgeBg = 'bg-emerald-50 text-emerald-600';
                } else if (item.type === 'order_fulfilled') {
                  icon = <Truck size={14} />;
                  badgeBg = 'bg-indigo-50 text-indigo-600';
                } else if (item.type === 'order_refunded') {
                  icon = <RotateCcw size={14} />;
                  badgeBg = 'bg-rose-50 text-rose-600';
                }

                return (
                  <div key={`${item.type}-${idx}`} className="relative">
                    <span
                      className={`absolute -left-[50px] top-0.5 w-9 h-9 rounded-full ${badgeBg} flex items-center justify-center border-4 border-white shadow-sm`}
                    >
                      {icon}
                    </span>
                    <div className="flex justify-between items-center group min-h-[36px]">
                      <div className="text-[13.5px] font-medium text-slate-700">{item.content}</div>
                      <span className="text-[12px] text-slate-400 font-medium">{formatDate(item.date, true)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <div className="space-y-8">
          {/* Customer Overview Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-[16px] font-bold text-brand-navy">Customer</h2>
            </div>

            <p className="text-[13px] text-slate-500 font-medium">
              {customer.banned ? 'Account is currently banned' : 'Has an active account'}
            </p>

            {/* Contact Information */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</h3>
                <button
                  onClick={() => {
                    setEditContactForm({
                      email: customer?.email || '',
                      phone: phoneToDisplay || ''
                    });
                    setIsEditContactModalOpen(true);
                  }}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-blue flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Contact Info"
                >
                  <Edit2 size={13} />
                </button>
              </div>

              <div className="space-y-2 mt-1">
                <a
                  href={`mailto:${customer.email}`}
                  className="text-[14px] font-semibold text-brand-blue hover:underline flex items-center gap-2 break-all"
                >
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  {customer.email}
                </a>

                {phoneToDisplay ? (
                  <a
                    href={`tel:${phoneToDisplay}`}
                    className="text-[13.5px] font-medium text-slate-700 hover:text-brand-blue flex items-center gap-2 transition-colors"
                  >
                    <Phone size={14} className="shrink-0 text-slate-400" />
                    {phoneToDisplay}
                  </a>
                ) : (
                  <p className="text-[13px] text-slate-400 italic flex items-center gap-2">
                    <Phone size={14} className="shrink-0 text-slate-300" />
                    No phone recorded
                  </p>
                )}
              </div>
            </div>

            {/* Default Address */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Default Address</h3>
                <button
                  onClick={() => {
                    setEditAddressForm({
                      name: address?.name || '',
                      street1: address?.street1 || '',
                      street2: address?.street2 || '',
                      city: address?.city || '',
                      state: address?.state || '',
                      zip: address?.zip || '',
                      country: address?.country || ''
                    });
                    setIsEditAddressModalOpen(true);
                  }}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-blue flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Address"
                >
                  <Edit2 size={13} />
                </button>
              </div>

              {address ? (
                <div className="text-[13.5px] text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 flex items-start gap-3 mt-1">
                  <MapPin size={16} className="text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-brand-navy text-[14px]">{address.name || customer.name}</p>
                    <p>{address.street1}</p>
                    {address.street2 && <p>{address.street2}</p>}
                    <p>
                      {[address.city, address.state, address.zip].filter(Boolean).join(' ')}
                    </p>
                    <p className="font-semibold text-slate-700 mt-0.5">{address.country || 'Australia'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-slate-400 italic">No address on file</p>
              )}
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-[16px] font-bold text-brand-navy">Tags</h2>
            </div>

            <div>
              {customer.tags && customer.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {customer.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[12.5px] font-semibold border border-slate-200 flex items-center gap-2 group hover:bg-slate-200/80 transition-colors"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        title="Remove tag"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400 italic mb-4">No tags added yet</p>
              )}

              <div className="relative">
                <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag and press Enter..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Contact Modal ─── */}
      {isEditContactModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-brand-navy">Edit Contact Information</h2>
                <button
                  onClick={() => setIsEditContactModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={editContactForm.email}
                    disabled
                    readOnly
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none font-medium"
                  />
                  <p className="text-[11.5px] text-slate-400 mt-1">Customer email is tied to order records and cannot be changed here.</p>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Phone number</label>
                  <input
                    type="text"
                    value={editContactForm.phone}
                    onChange={(e) => setEditContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+61 400 000 000"
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <AdminSecondaryButton onClick={() => setIsEditContactModalOpen(false)} className="!py-2 !px-4">
                  Cancel
                </AdminSecondaryButton>
                <AdminPrimaryButton onClick={handleSaveContact} disabled={updating} className="!py-2 !px-5">
                  {updating ? 'Saving...' : 'Save Changes'}
                </AdminPrimaryButton>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ─── Edit Address Modal ─── */}
      {isEditAddressModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 border border-slate-100">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-brand-navy">Edit Default Address</h2>
                <button
                  onClick={() => setIsEditAddressModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto px-1 pr-2">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Recipient Name</label>
                  <input
                    type="text"
                    value={editAddressForm.name}
                    onChange={(e) => setEditAddressForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={editAddressForm.street1}
                    onChange={(e) => setEditAddressForm((prev) => ({ ...prev, street1: e.target.value }))}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Apartment, suite, unit (optional)
                  </label>
                  <input
                    type="text"
                    value={editAddressForm.street2}
                    onChange={(e) => setEditAddressForm((prev) => ({ ...prev, street2: e.target.value }))}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">City / Suburb</label>
                    <input
                      type="text"
                      value={editAddressForm.city}
                      onChange={(e) => setEditAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      value={editAddressForm.state}
                      onChange={(e) => setEditAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g. QLD, NSW, VIC"
                      className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={editAddressForm.zip}
                      onChange={(e) => setEditAddressForm((prev) => ({ ...prev, zip: e.target.value }))}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      value={editAddressForm.country}
                      onChange={(e) => setEditAddressForm((prev) => ({ ...prev, country: e.target.value }))}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <AdminSecondaryButton onClick={() => setIsEditAddressModalOpen(false)} className="!py-2 !px-4">
                  Cancel
                </AdminSecondaryButton>
                <AdminPrimaryButton onClick={handleSaveAddress} disabled={updating} className="!py-2 !px-5">
                  {updating ? 'Saving...' : 'Save Address'}
                </AdminPrimaryButton>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CustomerDetail;
