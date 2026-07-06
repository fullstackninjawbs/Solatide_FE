import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import Logo from '../../components/Logo';

const OrderStatus = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await apiService.getOrderById(orderId);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.data.order);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4 text-lg">{error || 'Order not found'}</div>
                <Link to="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
    });

    const displayCurrency = order.currency || 'USD';
    const formatOrderPrice = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: displayCurrency }).format(amount);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 flex justify-center sticky top-0 z-10 shadow-sm">
                <Logo />
            </header>

            <main className="max-w-3xl mx-auto mt-10 px-4">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-[22px] text-gray-900 font-normal">
                            Order <span className="font-medium">{order.orderNumber}</span>
                        </h1>
                        <p className="text-[13px] text-gray-500 mt-1">Confirmed {orderDate}</p>
                    </div>
                    <Link to="/shop" className="bg-[#102a5c] text-white rounded-lg shadow-md px-6 py-2.5 text-[14px] font-semibold hover:bg-[#0c2048] transition-all duration-200">
                        Buy again
                    </Link>
                </div>

                {/* Status Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm flex items-start gap-5">
                    <div className="mt-0.5 bg-[#f0f9ff] p-2.5 rounded-full">
                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#0ea5e9] fill-current">
                            <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 0 1-1.43.188L5.764 13.77a1 1 0 1 1 1.286-1.54l3.935 3.284 5.36-7.27a1 1 0 0 1 1.582 1.156z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-[18px] font-bold text-[#102a5c]">Confirmed</h2>
                        <p className="text-[14px] text-gray-600 mt-1">We're preparing these items for shipping.</p>
                        <p className="text-[13px] text-gray-400 mt-1">{orderDate}</p>
                    </div>
                </div>

                {/* Items and Totals Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                        {(order.lineItems || []).map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                            {item.productImageUrl ? (
                                                <img src={item.productImageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-gray-300">No Img</span>
                                            )}
                                        </div>
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-[14px] text-gray-900 font-medium">{item.title}</div>
                                        {item.variantTitle && (
                                            <div className="text-[12px] text-gray-500 mt-0.5">{item.variantTitle}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[14px] text-gray-900">
                                    {formatOrderPrice(item.subtotal || (item.unitPrice * item.quantity))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[14px] text-gray-600">Subtotal</span>
                            <span className="text-[14px] text-gray-900">{formatOrderPrice(order.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[14px] text-gray-600">Shipping</span>
                            <span className="text-[14px] text-gray-900">{formatOrderPrice(order.shippingAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                            <span className="text-[16px] font-semibold text-gray-900">Total</span>
                            <span className="text-[18px] font-semibold text-gray-900">
                                <span className="text-[13px] text-gray-500 font-normal mr-1">{displayCurrency}</span>
                                {formatOrderPrice(order.grandTotal || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Information Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                    <div className="flex px-5 py-4 border-b border-gray-100">
                        <div className="w-[120px] shrink-0 text-[13px] text-gray-500 font-medium">Contact</div>
                        <div className="text-[14px] text-gray-900">{order.customerEmail || order.customer?.email}</div>
                    </div>
                    <div className="flex px-5 py-4 border-b border-gray-100">
                        <div className="w-[120px] shrink-0 text-[13px] text-gray-500 font-medium pt-1">Ship to</div>
                        <div className="text-[14px] text-gray-900 leading-relaxed">
                            {order.shippingAddressObj?.name || order.customer?.firstName + ' ' + order.customer?.lastName}<br />
                            {order.shippingAddressObj?.street1 || ''}<br />
                            {order.shippingAddressObj?.street2 ? <>{order.shippingAddressObj.street2}<br /></> : null}
                            {order.shippingAddressObj?.city || ''}, {order.shippingAddressObj?.state || ''} {order.shippingAddressObj?.zip || ''}<br />
                            {order.shippingAddressObj?.country || ''}
                        </div>
                    </div>
                    <div className="flex px-5 py-4">
                        <div className="w-[120px] shrink-0 text-[13px] text-gray-500 font-medium">Method</div>
                        <div className="text-[14px] text-gray-900">{order.shippingMethodName || 'Standard Shipping'}</div>
                    </div>
                </div>
            </main>

            {/* Footer Links */}
            <footer className="mt-16 border-t border-gray-200 py-6 text-center">
                <div className="flex flex-wrap justify-center gap-4 px-4 text-[13px] text-blue-600">
                    <Link to="/returns" className="hover:underline">Refund policy</Link>
                    <Link to="/shipping-policy" className="hover:underline">Shipping</Link>
                    <Link to="/privacy" className="hover:underline">Privacy policy</Link>
                    <Link to="/terms" className="hover:underline">Terms of service</Link>
                    <Link to="/contact" className="hover:underline">Contact information</Link>
                </div>
            </footer>
        </div>
    );
};

export default OrderStatus;
