import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import Logo from '../../components/Logo';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Try to get orderId from URL params or localStorage
  const orderId = searchParams.get('orderId') || searchParams.get('reference') || localStorage.getItem('solatide_last_order_id');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await apiService.getOrderById(orderId);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data.order);
        } else {
          setError('Could not load order details.');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Could not load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Clear cart after successful checkout
    try {
      localStorage.removeItem('solatie_cart');
      // Dispatch a storage event so CartContext picks up the change
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      // Non-critical
    }
  }, [orderId]);

  const fmt = (amount) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount || 0);

  const paymentStatusBadge = (status) => {
    const map = {
      paid: { bg: '#dcfce7', color: '#166534', label: 'Paid' },
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
      failed: { bg: '#fef2f2', color: '#991b1b', label: 'Failed' },
      refunded: { bg: '#f0f9ff', color: '#075985', label: 'Refunded' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 20px' }}>
            <Loader2 size={36} style={{ color: '#102a5c', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Loading order details...</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            {/* Success Banner */}
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', padding: '40px 40px 32px', textAlign: 'center', borderBottom: '1px solid #d1fae5' }}>
              <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={32} style={{ color: '#16a34a' }} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#14532d', margin: '0 0 8px' }}>Order Confirmed!</h1>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
                Thank you for your order. You will receive a confirmation email shortly.
              </p>
            </div>

            {/* Order Details */}
            <div style={{ padding: '32px 40px' }}>
              {error && (
                <div style={{ background: '#fef9c3', color: '#854d0e', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '24px', border: '1px solid #fde68a' }}>
                  {error} Your payment was still processed successfully.
                </div>
              )}

              {order ? (
                <>
                  {/* Order Reference */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</span>
                      {paymentStatusBadge(order.paymentStatus)}
                    </div>
                    <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {order._id}
                    </p>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</h3>
                    {order.products?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < order.products.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                            {item.product?.name || 'Product'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>
                            × {item.quantity}
                          </span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                          {fmt(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Total</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#0079CE' }}>{fmt(order.totalAmount)}</span>
                  </div>

                  {/* Shipping Note */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0f9ff', padding: '16px 20px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #bae6fd' }}>
                    <Package size={20} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: '600', margin: '0 0 4px' }}>Shipping & Handling</p>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        Your order is being processed. You will receive tracking details via email once your order has shipped.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                !error && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                      Your payment was successful. Order details will be sent to your email.
                    </p>
                  </div>
                )
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  to="/shop"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%', padding: '14px',
                    background: '#102a5c', color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '700', textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(16, 42, 92, 0.2)',
                    transition: 'all 0.2s',
                  }}
                >
                  Continue Shopping <ArrowRight size={16} />
                </Link>
                <Link
                  to="/"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', padding: '14px',
                    background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutSuccess;
