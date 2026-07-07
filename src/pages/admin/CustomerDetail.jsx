import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ArrowLeft, CheckCircle, Ban, Loader2, Edit2, Copy, ShoppingBag, ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // New State for Interactions
    const [newTag, setNewTag] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
    const [editContactForm, setEditContactForm] = useState({ email: '', phone: '' });
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [editAddressForm, setEditAddressForm] = useState({ name: '', street1: '', street2: '', city: '', state: '', zip: '', country: '' });

    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const res = await apiService.getAdminCustomerById(id);
            const data = await res.json();
            if (res.ok && data.success) {
                setCustomer(data.data.customer);
                setOrders(data.data.orders);
                setEditContactForm({
                    email: data.data.customer.email || '',
                    phone: data.data.customer.phone || ''
                });
                setEditAddressForm(data.data.customer.defaultAddress || {
                    name: '', street1: '', street2: '', city: '', state: '', zip: '', country: ''
                });
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

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleTagChange = (e) => {
        setNewTag(e.target.value);
    };

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
        if (!window.confirm(`Are you sure you want to ${customer.banned ? 'unban' : 'ban'} this customer?`)) return;
        await updateCustomerField({ banned: !customer.banned }, `Customer ${customer.banned ? 'unbanned' : 'banned'} successfully`);
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
        const updatedTags = (customer.tags || []).filter(t => t !== tagToRemove);
        await updateCustomerField({ tags: updatedTags }, 'Tag removed');
    };

    const handleAddComment = async (e) => {
        if (e.key === 'Enter' && commentText.trim()) {
            e.preventDefault();
            // Don't send Date object directly to avoid timezone shift mismatches if possible, backend will append Date.now
            const newComment = { text: commentText.trim() };
            const updatedComments = [...(customer.comments || []), newComment];
            const success = await updateCustomerField({ comments: updatedComments }, 'Comment added');
            if (success) setCommentText('');
        }
    };

    const handleSaveContact = async () => {
        if (!editContactForm.email) {
            toast.error("Email is required");
            return;
        }
        const success = await updateCustomerField({
            email: editContactForm.email,
            phone: editContactForm.phone
        }, 'Contact info updated');

        if (success) {
            setIsEditContactModalOpen(false);
        }
    };

    const handleSaveAddress = async () => {
        const success = await updateCustomerField({ defaultAddress: editAddressForm }, 'Address updated');
        if (success) {
            setIsEditAddressModalOpen(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString, includeTime = false) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...(includeTime && { hour: 'numeric', minute: '2-digit' })
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getTimeSince = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 30) return `${days} days ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500">Loading customer profile...</p>
            </div>
        );
    }

    if (!customer) return null;

    const lastOrder = orders.length > 0 ? orders[0] : null;
    const address = customer.defaultAddress || lastOrder?.shippingAddressObj || lastOrder?.billingAddressObj;
    // Prefer the explicitly saved phone on customer, fallback to order phone
    const phoneToDisplay = customer.phone || lastOrder?.customer?.phone;

    const cardClass = "bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]";

    // Combine timeline items: orders and comments and account creation
    const timelineItems = [
        ...orders.map(order => ({
            type: 'order',
            date: new Date(order.createdAt),
            order
        })),
        ...(customer.comments || []).map(comment => ({
            type: 'comment',
            date: new Date(comment.createdAt),
            comment
        })),
        {
            type: 'creation',
            date: new Date(customer.createdAt)
        }
    ].sort((a, b) => b.date - a.date);

    return (
        <div className="font-sans w-full min-h-screen text-[#1a1a1a]">
            {/* Header Section */}
            <div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/customers" className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-[#111827]">{customer.name}</h1>

                        <div className="flex items-center gap-2">
                            {customer.banned ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-red-100 text-red-800">
                                    <Ban className="w-3.5 h-3.5" /> Banned
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#e4f5e9] text-[#116530]">
                                    <CheckCircle className="w-3.5 h-3.5" /> Active
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm">
                            Edit
                        </button>
                        <button className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                            Contact <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                            onClick={toggleBanStatus}
                            disabled={updating}
                            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold shadow-sm transition-colors ${customer.banned
                                ? 'bg-[#1a1a1a] text-white hover:bg-black'
                                : 'bg-[#1a1a1a] text-white hover:bg-black'
                                }`}
                        >
                            {updating ? 'Updating...' : (customer.banned ? 'Unban customer' : 'Ban customer')}
                        </button>
                    </div>
                </div>
                <div className="mt-2 ml-12">
                    <p className="text-[13px] text-gray-500">
                        Customer since {formatDate(customer.createdAt)}
                    </p>
                </div>
            </div>

            <div>
                {/* Top Metrics Bar */}
                <div className={`${cardClass} mb-6 flex overflow-hidden border border-gray-100`}>
                    <div className="p-4 flex-1 border-r border-gray-100">
                        <p className="text-[13px] text-gray-600 font-semibold mb-1">Amount spent</p>
                        <p className="text-[16px] font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                    <div className="p-4 flex-1 border-r border-gray-100">
                        <p className="text-[13px] text-gray-600 font-semibold mb-1">Orders</p>
                        <p className="text-[16px] font-bold text-gray-900">{customer.orderCount}</p>
                    </div>
                    <div className="p-4 flex-1 border-r border-gray-100">
                        <p className="text-[13px] text-gray-600 font-semibold mb-1">Customer since</p>
                        <p className="text-[14px] text-gray-900 mt-1">{getTimeSince(customer.createdAt)}</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Last Order Placed */}
                        <div className={cardClass}>
                            <div className="p-5">
                                <h2 className="text-[15px] font-bold text-gray-900 mb-4">Last order placed</h2>

                                {lastOrder ? (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Link to={`/admin/orders/${lastOrder._id}`} className="font-bold text-[16px] text-gray-900 hover:underline">
                                                        {lastOrder.orderNumber}
                                                    </Link>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium flex items-center gap-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${lastOrder.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                        {lastOrder.paymentStatus}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium flex items-center gap-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${lastOrder.fulfilmentStatus === 'fulfilled' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                        {lastOrder.fulfilmentStatus || 'Unfulfilled'}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-gray-500">
                                                    {formatDate(lastOrder.createdAt, true)} from Web
                                                </p>
                                            </div>
                                            <p className="text-[15px] font-bold text-gray-900">{formatCurrency(lastOrder.grandTotal)}</p>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            {lastOrder.lineItems?.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                                                            {item.productImageUrl ? (
                                                                <img src={item.productImageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ShoppingBag className="w-5 h-5 text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-medium text-blue-700 hover:underline cursor-pointer">{item.title}</p>
                                                            {item.variantTitle && <p className="text-[13px] text-gray-500">{item.variantTitle}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex items-center gap-4">
                                                        <p className="text-[13px] text-gray-500 font-medium">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                                                        <p className="text-[14px] font-medium text-gray-900 w-20">{formatCurrency(item.unitPrice * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end gap-3">
                                            <Link to="/admin/orders" className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm">
                                                View all orders
                                            </Link>
                                            <button className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-black shadow-sm">
                                                Create order
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-[14px] font-medium text-gray-700 mb-1">No orders yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="pt-4">
                            <h2 className="text-[15px] font-bold text-gray-900 mb-4 px-1">Timeline</h2>
                            <div className={cardClass}>
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={handleCommentChange}
                                            onKeyDown={handleAddComment}
                                            placeholder="Leave a comment... (Press Enter to post)"
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 mt-8">
                                        {timelineItems.map((item, idx) => {
                                            if (item.type === 'order') {
                                                return (
                                                    <div key={`order-${item.order._id}`} className="relative pl-6">
                                                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-[3px] border-white"></span>
                                                        <div className="flex justify-between items-start group">
                                                            <div>
                                                                <p className="text-[13px] text-gray-900">
                                                                    This customer placed order <Link to={`/admin/orders/${item.order._id}`} className="font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 hover:bg-gray-200">{item.order.orderNumber}</Link> on Web.
                                                                </p>
                                                            </div>
                                                            <span className="text-[12px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{formatDate(item.date, true)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (item.type === 'comment') {
                                                return (
                                                    <div key={`comment-${idx}`} className="relative pl-6">
                                                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-[3px] border-white"></span>
                                                        <div className="flex justify-between items-start group">
                                                            <div>
                                                                <p className="text-[13px] text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                    {item.comment.text}
                                                                </p>
                                                            </div>
                                                            <span className="text-[12px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4">{formatDate(item.date, true)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (item.type === 'creation') {
                                                return (
                                                    <div key="creation" className="relative pl-6">
                                                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-[3px] border-white"></span>
                                                        <div className="flex justify-between items-start group">
                                                            <p className="text-[13px] text-gray-900">Web created this customer.</p>
                                                            <span className="text-[12px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{formatDate(item.date, true)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Customer Details */}
                    <div className="space-y-6">

                        {/* Customer Overview */}
                        <div className={cardClass}>
                            <div className="p-4 flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-gray-900">Customer</h2>
                            </div>

                            <div className="px-4 pb-4 space-y-5">
                                <p className="text-[13px] text-gray-600">Has an active account</p>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-[13px] font-bold text-gray-900">Contact information</h3>
                                        <button onClick={() => setIsEditContactModalOpen(true)} className="text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                    <a href={`mailto:${customer.email}`} className="text-[13px] text-blue-600 hover:underline">{customer.email}</a>
                                    {phoneToDisplay && <p className="text-[13px] text-gray-900 mt-1">{phoneToDisplay}</p>}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-[13px] font-bold text-gray-900">Default address</h3>
                                        <button onClick={() => setIsEditAddressModalOpen(true)} className="text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                    {address ? (
                                        <div className="text-[13px] text-gray-600 leading-relaxed mt-1">
                                            <p className="text-gray-900">{address.name || customer.name}</p>
                                            <p>{address.street1}</p>
                                            {address.street2 && <p>{address.street2}</p>}
                                            <p>{address.city} {address.state} {address.zip}</p>
                                            <p>{address.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-[13px] text-gray-500 italic">No address provided</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-2">Marketing</h3>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[12px] font-medium border border-gray-200">Email</span>
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[12px] font-medium border border-gray-200">SMS</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Store Credit */}
                        <div className={cardClass}>
                            <div className="p-4 flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-gray-900">Store credit</h2>
                                <button className="text-gray-400 hover:text-gray-700"><Edit2 className="w-4 h-4" /></button>
                            </div>
                            <div className="px-4 pb-4">
                                <p className="text-[13px] text-gray-500">None</p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className={cardClass}>
                            <div className="p-4 flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-gray-900">Tags</h2>
                                <button className="text-gray-400 hover:text-gray-700"><Edit2 className="w-4 h-4" /></button>
                            </div>
                            <div className="px-4 pb-4">
                                {customer.tags && customer.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {customer.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[13px] border border-gray-200 flex items-center gap-1.5">
                                                {tag}
                                                <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-600">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={handleTagChange}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add a tag and press Enter"
                                    className="w-full h-9 border border-gray-300 rounded-lg px-3 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit Contact Modal */}
            {isEditContactModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Edit contact information</h2>
                            <button onClick={() => setIsEditContactModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    value={editContactForm.email}
                                    onChange={(e) => setEditContactForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Phone number</label>
                                <input
                                    type="text"
                                    value={editContactForm.phone}
                                    onChange={(e) => setEditContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditContactModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveContact}
                                disabled={updating}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {updating ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Address Modal */}
            {isEditAddressModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Edit address</h2>
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

export default CustomerDetail;
