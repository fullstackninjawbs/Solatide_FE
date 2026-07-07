import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ArrowLeft, CheckCircle, Ban, Loader2, Mail, MapPin, Tag, Edit2, Copy, AlertCircle, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

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

    const toggleBanStatus = async () => {
        if (!window.confirm(`Are you sure you want to ${customer.banned ? 'unban' : 'ban'} this customer?`)) return;
        try {
            setUpdating(true);
            const res = await apiService.updateAdminCustomer(id, { banned: !customer.banned });
            const data = await res.json();
            if (res.ok && data.success) {
                setCustomer(data.data.customer);
                toast.success(`Customer ${customer.banned ? 'unbanned' : 'banned'} successfully`);
            }
        } catch (error) {
            console.error('Failed to update customer:', error);
            toast.error('Error updating customer');
        } finally {
            setUpdating(false);
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
    const address = lastOrder?.shippingAddressObj || lastOrder?.billingAddressObj;
    const phone = lastOrder?.customer?.phone;

    return (
        <div className="p-8 font-sans max-w-7xl mx-auto bg-[#f6f6f7] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/customers" className="p-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors">
                        <ArrowLeft className="w-4 h-4 text-gray-700" />
                    </Link>
                    <h1 className="text-[20px] font-bold text-gray-900">{customer.name}</h1>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={toggleBanStatus}
                        disabled={updating}
                        className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors border shadow-sm ${
                            customer.banned 
                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                    >
                        {updating ? 'Updating...' : (customer.banned ? 'Unban Customer' : 'Ban Customer')}
                    </button>
                </div>
            </div>

            {/* Top Metrics Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex divide-x divide-gray-200">
                <div className="p-4 flex-1">
                    <p className="text-[13px] text-gray-600 font-medium mb-1">Amount spent</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                </div>
                <div className="p-4 flex-1">
                    <p className="text-[13px] text-gray-600 font-medium mb-1">Orders</p>
                    <p className="text-lg font-bold text-gray-900">{customer.orderCount}</p>
                </div>
                <div className="p-4 flex-1">
                    <p className="text-[13px] text-gray-600 font-medium mb-1">Customer since</p>
                    <p className="text-[14px] text-gray-900 mt-1">{getTimeSince(customer.createdAt)}</p>
                </div>
                <div className="p-4 flex-1">
                    <p className="text-[13px] text-gray-600 font-medium mb-1">Status</p>
                    {customer.banned ? (
                        <p className="text-[14px] text-red-600 font-medium mt-1 flex items-center gap-1"><Ban className="w-4 h-4"/> Banned</p>
                    ) : (
                        <p className="text-[14px] text-green-600 font-medium mt-1 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Active</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Orders & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Last Order Placed */}
                    {lastOrder ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f9fafb]">
                                <h2 className="text-[15px] font-semibold text-gray-900">Last order placed</h2>
                                <Link to={`/admin/orders/${lastOrder._id}`} className="text-blue-600 text-[13px] font-medium hover:underline">
                                    View order
                                </Link>
                            </div>
                            
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-[16px] text-gray-900">{lastOrder.orderNumber}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium uppercase tracking-wider">
                                                {lastOrder.paymentStatus}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium uppercase tracking-wider">
                                                {lastOrder.fulfilmentStatus || 'Unfulfilled'}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-gray-500">{formatDate(lastOrder.createdAt, true)}</p>
                                    </div>
                                    <p className="text-[16px] font-bold text-gray-900">{formatCurrency(lastOrder.grandTotal)}</p>
                                </div>

                                <div className="space-y-4">
                                    {lastOrder.lineItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded border border-gray-200 bg-white flex items-center justify-center p-1">
                                                    {item.productImageUrl ? (
                                                        <img src={item.productImageUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <ShoppingBag className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-gray-900">{item.title}</p>
                                                    {item.variantTitle && <p className="text-[13px] text-gray-500">{item.variantTitle}</p>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[13px] text-gray-900">x {item.quantity}</p>
                                                <p className="text-[14px] font-medium text-gray-900">{formatCurrency(item.unitPrice)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-[14px] font-medium text-gray-700 mb-1">No orders yet</p>
                            <p className="text-[13px] text-gray-500">This customer hasn't placed any orders.</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 bg-[#f9fafb]">
                            <h2 className="text-[15px] font-semibold text-gray-900">Timeline</h2>
                        </div>
                        <div className="p-5">
                            <div className="relative border-l border-gray-200 ml-3 space-y-6">
                                {orders.map(order => (
                                    <div key={order._id} className="relative pl-6">
                                        <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[13px] text-gray-900">
                                                    Placed order <Link to={`/admin/orders/${order._id}`} className="font-semibold hover:underline">{order.orderNumber}</Link>
                                                </p>
                                                <p className="text-[13px] text-gray-500 mt-1">Total: {formatCurrency(order.grandTotal)}</p>
                                            </div>
                                            <span className="text-[12px] text-gray-500">{formatDate(order.createdAt, true)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="relative pl-6">
                                    <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                                    <div className="flex justify-between items-start">
                                        <p className="text-[13px] text-gray-900">Customer account created.</p>
                                        <span className="text-[12px] text-gray-500">{formatDate(customer.createdAt, true)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Details */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-[15px] font-semibold text-gray-900">Customer</h2>
                            <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Contact information</h3>
                                <div className="flex justify-between items-center">
                                    <a href={`mailto:${customer.email}`} className="text-[13px] text-blue-600 hover:underline">{customer.email}</a>
                                    <button className="text-gray-400 hover:text-gray-600" title="Copy email">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {phone && <p className="text-[13px] text-gray-600 mt-1">{phone}</p>}
                            </div>
                            
                            <hr className="border-gray-100" />
                            
                            <div>
                                <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Default address</h3>
                                {address ? (
                                    <div className="text-[13px] text-gray-600 leading-relaxed">
                                        <p className="font-medium text-gray-900 mb-1">{address.name || customer.name}</p>
                                        <p>{address.street1}</p>
                                        {address.street2 && <p>{address.street2}</p>}
                                        <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.zip}</p>
                                        <p>{address.country}</p>
                                        {phone && <p className="mt-1">{phone}</p>}
                                    </div>
                                ) : (
                                    <p className="text-[13px] text-gray-500 italic">No address provided</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Marketing & Tax */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Marketing</h3>
                                <div className="flex gap-2">
                                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[12px] font-medium">Email</span>
                                </div>
                            </div>
                            <hr className="border-gray-100" />
                            <div>
                                <h3 className="text-[13px] font-semibold text-gray-900 mb-1">Tax details</h3>
                                <p className="text-[13px] text-gray-600">Collect tax</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-[15px] font-semibold text-gray-900">Tags</h2>
                            <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4">
                            {customer.tags && customer.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {customer.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[12px] font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[13px] text-gray-500">None</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-[15px] font-semibold text-gray-900">Notes</h2>
                            <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4">
                            <p className="text-[13px] text-gray-500">None</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
