import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/api';
import Logo from '../../components/Logo';
import { ArrowLeft, Lock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartTotalPrice;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  // Shipping cost will be calculated and added natively by TagadaPay at checkout
  const total = subtotal - discount;

  const handleApplyDiscount = () => {
    if (discountCode.trim() === '') return;
    setDiscountError('Invalid promotion code');
    setDiscountApplied(false);
  };

  const fmt = (amount) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // 1) Create a placeholder order. Tagada collects shipping & email securely.
      const orderRes = await apiService.createOrder({
        products: cartItems.map((item) => ({ product: item._id, quantity: item.quantity ?? 1 })),
        shippingAddress: 'Provided via TagadaPay',
        customerEmail: '',
        customerName: '',
        paymentMethod: 'tagada',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      const orderId = orderData.data.order._id;

      // 2) Initiate Tagada Checkout Session
      const payRes = await apiService.createTagadaPayment({ orderId });
      const payData = await payRes.json();
      
      if (!payRes.ok) throw new Error(payData.message || 'TagadaPay checkout initiation failed');

      // 3) Redirect to Tagada Hosted Checkout Page
      if (payData.checkoutUrl) {
        window.location.href = payData.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from TagadaPay');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>
      {/* ── HEADER ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Logo />
          <Link to="/cart" style={{ position: 'absolute', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Return to Cart
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          
          <div style={{ padding: '32px 40px', borderBottom: '1px solid #f1f1f1' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#102a5c', margin: '0 0 8px', textAlign: 'center' }}>Checkout Summary</h1>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', margin: 0 }}>Review your items before proceeding to secure payment.</p>
          </div>

          <div style={{ padding: '32px 40px' }}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', border: '1px solid #f87171' }}>
                {error}
              </div>
            )}

            {/* Line items */}
            {cartItems.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', padding: '20px 0' }}>Your cart is empty.</p>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '64px', height: '64px', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.images?.[0] || item.image ? (
                          <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '24px' }}>📦</span>
                        )}
                      </div>
                      <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#102a5c', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                        {item.quantity ?? 1}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', lineHeight: 1.4 }}>{item.name}</div>
                      {item.selectedVariant && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.selectedVariant.name || item.selectedVariant.sku}</div>}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', flexShrink: 0 }}>
                      {fmt((item.price ?? 0) * (item.quantity ?? 1))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Discount code */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={e => { setDiscountCode(e.target.value); setDiscountError(''); }}
                style={{ flex: 1, padding: '12px 16px', border: `1px solid ${discountError ? '#dc2626' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#f9fafb' }}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                style={{ padding: '0 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#4b5563', cursor: 'pointer', transition: 'all 0.2s hover:bg-gray-50' }}
              >
                Apply
              </button>
            </div>
            {discountError && <p style={{ fontSize: '12px', color: '#dc2626', margin: '4px 0 16px' }}>{discountError}</p>}

            {/* Totals */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{fmt(subtotal)}</span>
              </div>
              {discountApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#10b981' }}>Discount</span>
                  <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>−{fmt(discount)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px dashed #cbd5e1', margin: '16px 0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Amount Due</span>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Shipping calculated at checkout</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#0079CE' }}>{fmt(total)}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '6px' }}>AUD</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '32px' }}>
              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                style={{
                  width: '100%', padding: '16px',
                  background: loading || cartItems.length === 0 ? '#94a3b8' : '#102a5c',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: '700', cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: loading || cartItems.length === 0 ? 'none' : '0 4px 14px rgba(16, 42, 92, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}
              >
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Redirecting to TagadaPay...</>
                ) : (
                  <>Checkout with TagadaPay <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></>
                )}
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '12px' }}>
              <Lock size={14} />
              You will be redirected to TagadaPay's secure checkout page to enter your shipping and payment details.
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
