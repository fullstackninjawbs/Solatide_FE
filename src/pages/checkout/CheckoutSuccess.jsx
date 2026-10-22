import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2, Clock, XCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import Logo from '../../components/Logo';
import { useCart } from '../../context/CartContext';
import { trackEvent } from '../../utils/analytics';
import { metaPurchase } from '../../utils/metaPixel';
import { LAST_ORDER_ID_KEY, LAST_ORDER_TOKEN_KEY } from '../../hooks/useTagadaCheckout';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 10; // ~30 s

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

// The public endpoints require the order's access token (?accessToken=).
const withToken = (orderId, token) => `${encodeURIComponent(orderId)}?accessToken=${encodeURIComponent(token)}`;

const fmt = (amount, currency = 'AUD') =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: currency || 'AUD' }).format(amount || 0);

const firePurchaseTracking = (order) => {
  try { metaPurchase(order); } catch { /* own once-per-order guard; never breaks the page */ }
  const key = `gtm_pushed_${order._id}`;
  try {
    if (sessionStorage.getItem(key)) return; // already tracked (refresh)
  } catch {
    // ignore
  }
  try {
    trackEvent('purchase', { orderId: order._id, cartValue: order.grandTotal });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      transaction_id: order.orderNumber || order._id,
      value: order.grandTotal,
      currency: order.currency || 'AUD',
      items: (order.items || []).map((i) => ({ item_name: i.name, price: i.price, quantity: i.quantity })),
    });
    sessionStorage.setItem(key, 'true');
  } catch (e) {
    console.error('Analytics push error:', e);
  }
};

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState(null);
  const { clearCart } = useCart();
  const clearCartRef = useRef(clearCart);
  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);

  // Never trust orderId alone — the access token issued at checkout authorises this lookup.
  const orderId = searchParams.get('orderId') || searchParams.get('reference') || readStorage(LAST_ORDER_ID_KEY);
  const accessToken = searchParams.get('accessToken') || readStorage(LAST_ORDER_TOKEN_KEY);
  // loading | paid | processing | failed | error | missing
  const [phase, setPhase] = useState(() => (orderId && accessToken ? 'loading' : 'missing'));

  useEffect(() => {
    if (!orderId || !accessToken) return undefined;

    let cancelled = false;
    let timer = null;
    let polls = 0;

    const onPaid = async (ord) => {
      setPhase('paid');
      firePurchaseTracking(ord);
      try {
        localStorage.removeItem('solatie_cart');
        if (clearCartRef.current) clearCartRef.current();
      } catch {
        // non-critical
      }
      // Optional: full order details (shipping/contact) when the order API returns them for this token.
      try {
        const res = await apiService.getOrderById(withToken(orderId, accessToken));
        const data = await res.json();
        if (!cancelled && res.ok && data?.data?.order) setDetails(data.data.order);
      } catch {
        // non-critical
      }
    };

    const poll = async () => {
      polls += 1;
      try {
        const res = await apiService.syncOrderWithTagada(withToken(orderId, accessToken));
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 404 || res.status === 403) {
            setPhase('error');
            return;
          }
          throw new Error(data?.message || 'Sync failed');
        }
        const ord = data?.data?.order;
        if (ord) setOrder(ord);
        const status = ord?.paymentStatus;
        if (status === 'paid' || status === 'partially_refunded') {
          await onPaid(ord);
          return;
        }
        if (status === 'failed' || status === 'cancelled') {
          setPhase('failed');
          return;
        }
      } catch (err) {
        console.warn('Order sync attempt failed:', err);
      }
      if (cancelled) return;
      if (polls < MAX_POLLS) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setPhase('processing');
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, accessToken]);

  const paymentStatusBadge = (status) => {
    const map = {
      paid: { bg: '#dcfce7', color: '#166534', label: 'Paid' },
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
      failed: { bg: '#fef2f2', color: '#991b1b', label: 'Failed' },
      cancelled: { bg: '#fef2f2', color: '#991b1b', label: 'Cancelled' },
      partially_refunded: { bg: '#f0f9ff', color: '#075985', label: 'Partially refunded' },
      refunded: { bg: '#f0f9ff', color: '#075985', label: 'Refunded' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {s.label}
      </span>
    );
  };

  const card = { background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' };
  const primaryBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', padding: '14px', background: '#102a5c', color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '15px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 14px rgba(16, 42, 92, 0.2)',
  };
  const secondaryBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px',
    background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px',
    fontSize: '14px', fontWeight: '600', textDecoration: 'none',
  };

  const banner = (tone, Icon, title, text) => {
    const tones = {
      success: { bg: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', border: '#d1fae5', iconBg: '#dcfce7', icon: '#16a34a', title: '#14532d' },
      pending: { bg: 'linear-gradient(135deg, #fffbeb 0%, #fefce8 100%)', border: '#fde68a', iconBg: '#fef3c7', icon: '#b45309', title: '#78350f' },
      error: { bg: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', border: '#fecaca', iconBg: '#fee2e2', icon: '#dc2626', title: '#7f1d1d' },
      neutral: { bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: '#e2e8f0', iconBg: '#e2e8f0', icon: '#475569', title: '#1e293b' },
    };
    const t = tones[tone];
    return (
      <div style={{ background: t.bg, padding: '40px 40px 32px', textAlign: 'center', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ width: '64px', height: '64px', background: t.iconBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon size={32} style={{ color: t.icon }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.title, margin: '0 0 8px' }}>{title}</h1>
        <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{text}</p>
      </div>
    );
  };

  const actions = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link to="/collections/all" style={primaryBtn}>
        Continue Shopping <ArrowRight size={16} />
      </Link>
      <Link to="/" style={secondaryBtn}>Return to Home</Link>
    </div>
  );

  const orderSummary = order ? (
    <>
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order</span>
          {paymentStatusBadge(order.paymentStatus)}
        </div>
        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {order.orderNumber || order._id}
        </p>
      </div>

      {Array.isArray(order.items) && order.items.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                  {item.name || 'Product'}{item.variant ? ` — ${item.variant}` : ''}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>× {item.quantity}</span>
              </div>
              <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                {fmt((item.price || 0) * (item.quantity || 1), order.currency)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Total</span>
        <span style={{ fontSize: '20px', fontWeight: '800', color: '#0079CE' }}>{fmt(order.grandTotal, order.currency)}</span>
      </div>
    </>
  ) : null;

  const shipTo = details?.shippingAddressObj;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, "Poppins Fallback", sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
        </div>
      </header>

      <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 20px' }}>
        {phase === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 20px' }}>
            <Loader2 size={36} style={{ color: '#102a5c', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Confirming your payment...</p>
          </div>
        )}

        {phase === 'missing' && (
          <div style={card}>
            {banner('neutral', Package, 'No Order Specified',
              'We could not find a recent checkout on this device. If you completed a payment, your confirmation email contains your order details.')}
            <div style={{ padding: '32px 40px' }}>{actions}</div>
          </div>
        )}

        {phase === 'error' && (
          <div style={card}>
            {banner('neutral', Package, 'Order details unavailable',
              'We could not load this order. If you completed a payment, your confirmation email contains your order details.')}
            <div style={{ padding: '32px 40px' }}>{actions}</div>
          </div>
        )}

        {phase === 'processing' && (
          <div style={card}>
            {banner('pending', Clock, 'Payment processing',
              'Your payment is still being confirmed. This can take a few minutes — you will receive a confirmation email once it is complete. Please do not pay again.')}
            <div style={{ padding: '32px 40px' }}>
              {orderSummary}
              {actions}
            </div>
          </div>
        )}

        {phase === 'failed' && (
          <div style={card}>
            {banner('error', XCircle, 'Payment not completed',
              'Your payment was not successful and you have not been charged for this order. Your cart has been kept so you can try again.')}
            <div style={{ padding: '32px 40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" style={primaryBtn}>Back to Shop <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        )}

        {phase === 'paid' && (
          <div style={card}>
            {banner('success', CheckCircle, 'Order Confirmed!', 'Thank you for your order. You will receive a confirmation email shortly.')}
            <div style={{ padding: '32px 40px' }}>
              {orderSummary}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0f9ff', padding: '16px 20px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #bae6fd' }}>
                <Package size={20} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: '600', margin: '0 0 4px' }}>Shipping & Handling</p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    Your order is being processed. You will receive tracking details via email once your order has shipped.
                  </p>
                </div>
              </div>

              {shipTo && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '32px', background: '#fff', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '120px', flexShrink: 0, fontSize: '13px', color: '#64748b', fontWeight: '500', paddingTop: '2px' }}>Ship to</div>
                    <div style={{ fontSize: '14px', color: '#0f172a', lineHeight: '1.6' }}>
                      {shipTo.name || ''}<br />
                      {shipTo.street1 || ''}<br />
                      {shipTo.street2 ? <>{shipTo.street2}<br /></> : null}
                      {shipTo.city || ''}, {shipTo.state || ''} {shipTo.zip || ''}<br />
                      {shipTo.country || ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', padding: '16px 20px' }}>
                    <div style={{ width: '120px', flexShrink: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Method</div>
                    <div style={{ fontSize: '14px', color: '#0f172a' }}>{details?.shippingMethodName || 'Standard Shipping'}</div>
                  </div>
                </div>
              )}

              {actions}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutSuccess;
