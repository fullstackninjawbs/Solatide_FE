import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Country, State } from 'country-state-city';
import { apiService } from '../../services/api';
import Logo from '../../components/Logo';

// ─── Card brand icons ─────────────────────────────────────────────────────────
const CardIcons = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    {/* Visa */}
    <div style={{ width: '32px', height: '20px', background: '#1a1f71', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontSize: '8px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.5px' }}>VISA</span>
    </div>
    {/* Mastercard */}
    <div style={{ width: '32px', height: '20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eb001b' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f79e1b', marginLeft: '-5px' }} />
    </div>
    {/* Amex */}
    <div style={{ width: '32px', height: '20px', background: '#2557d6', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontSize: '7px', fontWeight: '800', letterSpacing: '-0.3px' }}>AMEX</span>
    </div>
  </div>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px', fontFamily: 'inherit' }}>{children}</h3>
);

const SectionSub = ({ children }) => (
  <p style={{ fontSize: '12px', color: '#5a6a7a', margin: '0 0 14px' }}>{children}</p>
);

// ─── Input ────────────────────────────────────────────────────────────────────
const Input = ({ id, type = 'text', placeholder, value, onChange, required, style: extra = {} }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d0d7de',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1a1a1a',
      outline: 'none',
      background: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      ...extra,
    }}
  />
);

// ─── Select ───────────────────────────────────────────────────────────────────
const Select = ({ id, value, onChange, children, style: extra = {} }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d0d7de',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1a1a1a',
      outline: 'none',
      background: '#fff',
      cursor: 'pointer',
      fontFamily: 'inherit',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      paddingRight: '32px',
      ...extra,
    }}
  >
    {children}
  </select>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice } = useCart();

  // Contact
  const [email, setEmail] = useState('');
  const [emailMarketing, setEmailMarketing] = useState(false);

  // Delivery
  const [country, setCountry] = useState('AU');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [diffBilling, setDiffBilling] = useState(false);

  // Shipping
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // ── Shipping rates ──────────────────────────────────────────────────────────
  const SHIPPING_RATES = {
    express: { label: 'Express Shipping', price: 60 },
    standard: { label: 'Standard Shipping', price: 40 },
  };

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = cartTotalPrice;
  const shippingCost = SHIPPING_RATES[shippingMethod].price;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discount;

  // ── Native Wallet (Apple Pay / Google Pay) ─────────────────────────
  const triggerNativeWallet = async () => {
    try {
      if (!window.PaymentRequest) {
        alert("Native wallet (Apple Pay/Google Pay) is not supported on this browser.");
        return;
      }

      const supportedInstruments = [
        {
          supportedMethods: 'https://apple.com/apple-pay',
          data: {
            version: 3,
            merchantIdentifier: 'merchant.com.solatide',
            merchantCapabilities: ['supports3DS'],
            supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
            countryCode: 'AU',
          },
        },
        {
          supportedMethods: 'https://google.com/pay',
          data: {
            environment: 'TEST',
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: { merchantName: 'Solatide Biosciences' },
            allowedPaymentMethods: [{
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: { gateway: 'example', gatewayMerchantId: 'exampleGatewayMerchantId' }
              }
            }]
          }
        }
      ];

      const details = {
        total: { label: 'Solatide Biosciences', amount: { currency: 'AUD', value: total.toString() } },
      };

      const request = new PaymentRequest(supportedInstruments, details);
      
      const canMakePayment = await request.canMakePayment();
      if (!canMakePayment) {
        alert("Apple Pay / Google Pay is not set up or available on this device.");
        return;
      }

      const response = await request.show();
      // Handle the token and send it to your TagadaPay backend
      console.log('Payment Token:', response.details);
      await response.complete('success');
      alert("Native Payment successful (Sandbox). Token generated!");
      
    } catch (err) {
      console.error(err);
      if (err.name !== 'AbortError') {
        alert('Wallet failed: ' + err.message);
      }
    }
  };

  const fmt = (amount) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

  // ── Format card number with spaces ─────────────────────────────────────────
  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiry = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + '/' + raw.slice(2);
    setExpiry(raw);
  };

  // ── Discount apply ──────────────────────────────────────────────────────────
  const handleApplyDiscount = () => {
    if (discountCode.trim() === '') return;
    // TODO: validate against backend
    setDiscountError('Invalid promotion code');
    setDiscountApplied(false);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }
    if (!termsAccepted) { setError('Please accept the terms and conditions.'); return; }

    setLoading(true);
    try {
      // 1) Create order
      const orderRes = await apiService.createOrder({
        products: cartItems.map((item) => ({ product: item._id, quantity: item.quantity ?? 1 })),
        shippingAddress: `${address}${apt ? ', ' + apt : ''}, ${city}, ${stateProvince} ${postcode}, ${country}`,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        paymentMethod: paymentMethod === 'card' ? 'tagada' : paymentMethod,
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      const orderId = orderData.data.order._id;

      if (paymentMethod === 'card') {
        // 2) Create TagadaPay payment
        const payRes = await apiService.createTagadaPayment({
          orderId, cardNumber: cardNumber.replace(/\s/g, ''), expiry, cvc
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.message || 'Payment failed');

        if (payData.checkoutUrl) {
          setRedirecting(true);
          setTimeout(() => { window.location.href = payData.checkoutUrl; }, 1200);
        } else {
          navigate(`/order-confirmation?orderId=${orderId}`);
        }
      } else {
        navigate(`/order-confirmation?orderId=${orderId}&method=${paymentMethod}`);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Redirect overlay ────────────────────────────────────────────────────────
  if (redirecting) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e5e5e5', borderTopColor: '#102a5c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px' }}>Redirecting to TagadaPay…</h3>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Please do not close or refresh this tab</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontSize: '14px', color: '#1a1a1a' }} className="font-sans">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { border-color: #0079CE !important; box-shadow: 0 0 0 3px rgba(0,121,206,0.1); }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: '1px solid #e8e8e8', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
        <div style={{ width: '120px' }} />
        <Logo asColumn={true} className="flex flex-col items-center gap-0" />
        <button
          id="checkout-back-btn"
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: '13px', color: '#5a6a7a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', width: '120px', justifyContent: 'flex-end' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Go to Shop
        </button>
      </header>

      {/* ── BODY ── */}
      <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '0', minHeight: 'calc(100vh - 73px)' }}>

        {/* ── LEFT: FORM ── */}
        <div style={{ padding: '32px 48px 48px 0', borderRight: '1px solid #e8e8e8' }}>

          {/* Express Checkout */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginBottom: '10px' }}>Express Checkout</p>
            <button
              type="button"
              onClick={triggerNativeWallet}
              style={{ width: '100%', padding: '13px', background: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.8 0 663.1 0 541.8c0-195.7 127.3-299.2 253.4-299.2 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99zM554.1 201.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600', letterSpacing: '0.01em' }}>Pay</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
              <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.05em' }}>OR CONTINUE BELOW</span>
              <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="checkout-form">

            {/* ── Contact ── */}
            <section style={{ marginBottom: '28px' }}>
              <SectionHeading>Contact</SectionHeading>
              <SectionSub>We'll use this information to send you updates about your order.</SectionSub>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle} htmlFor="co-email">Email</label>
                <Input id="co-email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#555' }}>
                <input type="checkbox" checked={emailMarketing} onChange={e => setEmailMarketing(e.target.checked)} style={{ accentColor: '#102a5c', width: '14px', height: '14px' }} />
                Email me with news and offers
              </label>
            </section>

            <Divider />

            {/* ── Delivery ── */}
            <section style={{ margin: '28px 0' }}>
              <SectionHeading>Delivery</SectionHeading>
              <SectionSub>Where should we deliver your order?</SectionSub>

              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle} htmlFor="co-country">Country</label>
                <Select id="co-country" value={country} onChange={e => { setCountry(e.target.value); setStateProvince(''); }}>
                  <option value="">Select Country...</option>
                  {Country.getAllCountries().map(c => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </Select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={labelStyle} htmlFor="co-first">First Name</label>
                  <Input id="co-first" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="co-last">Last Name</label>
                  <Input id="co-last" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle} htmlFor="co-address">Address</label>
                <Input id="co-address" placeholder="123 Main Street" value={address} onChange={e => setAddress(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle} htmlFor="co-apt">Apartment, suite, etc.</label>
                <Input id="co-apt" placeholder="Apt. Suite, etc. (optional)" value={apt} onChange={e => setApt(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={labelStyle} htmlFor="co-city">City</label>
                  <Input id="co-city" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="co-state">State / Province</label>
                  <Select id="co-state" value={stateProvince} onChange={e => setStateProvince(e.target.value)}>
                    <option value="">Select State/Province...</option>
                    {State.getStatesOfCountry(country).map(s => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="co-post">Postal Code</label>
                  <Input id="co-post" placeholder="2000" value={postcode} onChange={e => setPostcode(e.target.value)} required />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle} htmlFor="co-phone">Phone</label>
                <Input id="co-phone" type="tel" placeholder="+1 (555) 123 4567" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#555', marginTop: '4px' }}>
                <input type="checkbox" checked={diffBilling} onChange={e => setDiffBilling(e.target.checked)} style={{ accentColor: '#102a5c', width: '14px', height: '14px' }} />
                My billing address is different from my shipping address
              </label>
            </section>

            <Divider />

            {/* ── Shipping Method ── */}
            <section style={{ margin: '28px 0' }}>
              <SectionHeading>Shipping Method</SectionHeading>
              <SectionSub>Choose how you'd like to receive your order.</SectionSub>

              {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                <label
                  key={key}
                  id={`shipping-${key}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 14px', marginBottom: '8px',
                    border: `1px solid ${shippingMethod === key ? '#0079CE' : '#d0d7de'}`,
                    borderRadius: '6px', cursor: 'pointer',
                    background: shippingMethod === key ? '#f0f6ff' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: `2px solid ${shippingMethod === key ? '#0079CE' : '#ccc'}`,
                      background: shippingMethod === key ? '#0079CE' : '#fff',
                      boxShadow: shippingMethod === key ? 'inset 0 0 0 3px #fff' : 'none',
                      flexShrink: 0,
                    }} />
                    <input type="radio" name="shipping" value={key} checked={shippingMethod === key}
                      onChange={() => setShippingMethod(key)} style={{ display: 'none' }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>{rate.label}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>A${rate.price}.00</span>
                </label>
              ))}
            </section>

            <Divider />

            {/* ── Payment ── */}
            <section style={{ margin: '28px 0' }}>
              <SectionHeading>Payment</SectionHeading>
              <SectionSub>All transactions are secure and encrypted.</SectionSub>

              {/* Card Payments option */}
              <div style={{
                border: `1px solid ${paymentMethod === 'card' ? '#0079CE' : '#d0d7de'}`,
                borderRadius: paymentMethod === 'card' ? '6px 6px 0 0' : '6px',
                overflow: 'hidden', marginBottom: paymentMethod === 'card' ? '0' : '8px',
              }}>
                <label
                  id="pay-card-label"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', cursor: 'pointer', background: paymentMethod === 'card' ? '#f0f6ff' : '#fff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: `2px solid ${paymentMethod === 'card' ? '#0079CE' : '#ccc'}`,
                      background: paymentMethod === 'card' ? '#0079CE' : '#fff',
                      boxShadow: paymentMethod === 'card' ? 'inset 0 0 0 3px #fff' : 'none', flexShrink: 0,
                    }} />
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')} style={{ display: 'none' }} id="pay-card" />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Card Payments</span>
                  </div>
                  <CardIcons />
                </label>

                {/* Card fields — expanded when card is selected */}
                {paymentMethod === 'card' && (
                  <div style={{ padding: '14px', borderTop: '1px solid #d0d7de', background: '#fff' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={labelStyle} htmlFor="co-card">Card Number</label>
                      <Input id="co-card" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumber} style={{ letterSpacing: '0.08em', fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={labelStyle} htmlFor="co-expiry">Expiry</label>
                        <Input id="co-expiry" placeholder="MM/YY" value={expiry} onChange={handleExpiry} style={{ fontFamily: 'monospace' }} />
                      </div>
                      <div>
                        <label style={labelStyle} htmlFor="co-cvc">CVC</label>
                        <Input id="co-cvc" placeholder="123" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ fontFamily: 'monospace' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Apple Pay option */}
              <label
                id="pay-applepay-label"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '13px 14px', cursor: 'pointer',
                  border: `1px solid ${paymentMethod === 'applepay' ? '#0079CE' : '#d0d7de'}`,
                  borderRadius: '6px', background: paymentMethod === 'applepay' ? '#f0f6ff' : '#fff',
                  marginTop: '8px',
                }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${paymentMethod === 'applepay' ? '#0079CE' : '#ccc'}`,
                  background: paymentMethod === 'applepay' ? '#0079CE' : '#fff',
                  boxShadow: paymentMethod === 'applepay' ? 'inset 0 0 0 3px #fff' : 'none', flexShrink: 0,
                }} />
                <input type="radio" name="payment" value="applepay" checked={paymentMethod === 'applepay'}
                  onChange={() => setPaymentMethod('applepay')} style={{ display: 'none' }} id="pay-applepay" />
                <svg width="18" height="18" viewBox="0 0 814 1000" fill="#1a1a1a"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.8 0 663.1 0 541.8c0-195.7 127.3-299.2 253.4-299.2 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99zM554.1 201.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Apple Pay</span>
              </label>
            </section>

            {/* ── Terms ── */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#555', marginBottom: '24px', lineHeight: 1.5 }}>
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                style={{ accentColor: '#102a5c', width: '14px', height: '14px', marginTop: '1px', flexShrink: 0 }} />
              I accept the <span style={{ color: '#0079CE', textDecoration: 'underline', cursor: 'pointer' }}>terms and conditions</span> and <span style={{ color: '#0079CE', textDecoration: 'underline', cursor: 'pointer' }}>privacy policy</span>
            </label>

            {/* ── Submit ── */}
            <button
              id="checkout-complete-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading ? '#6b7a8d' : 'linear-gradient(90deg, #00ADEE 0%, #0079CE 100%)',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em', transition: 'box-shadow 0.15s',
                boxShadow: loading ? 'none' : '0 6px 20px -4px rgba(0, 121, 206, 0.40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              {loading
                ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Processing…</>
                : 'Complete Purchase'
              }
            </button>
          </form>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <aside style={{ padding: '32px 0 48px 40px', position: 'sticky', top: '73px', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 20px' }}>Order summary</h3>

          {/* Line items */}
          {cartItems.length === 0
            ? <p style={{ fontSize: '13px', color: '#999' }}>Your cart is empty.</p>
            : cartItems.map((item) => (
              <div key={item.cartItemId || item._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '56px', height: '56px', border: '1px solid #e8e8e8', borderRadius: '6px', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.images?.[0] || item.image
                      ? <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '22px' }}>📦</span>}
                  </div>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#888', color: '#fff', borderRadius: '50%', width: '19px', height: '19px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.quantity ?? 1}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', lineHeight: 1.3 }}>{item.name}</div>
                  {item.selectedVariant && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.selectedVariant.name || item.selectedVariant.sku}</div>}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', flexShrink: 0 }}>
                  {fmt((item.price ?? 0) * (item.quantity ?? 1))}
                </div>
              </div>
            ))
          }

          {/* Discount code */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <input
              id="discount-code-input"
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={e => { setDiscountCode(e.target.value); setDiscountError(''); }}
              style={{ flex: 1, padding: '9px 12px', border: `1px solid ${discountError ? '#dc2626' : '#d0d7de'}`, borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              id="discount-apply-btn"
              type="button"
              onClick={handleApplyDiscount}
              style={{ padding: '9px 16px', background: '#fff', border: '1px solid #d0d7de', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Apply
            </button>
          </div>
          {discountError && <p style={{ fontSize: '12px', color: '#dc2626', margin: '4px 0 12px' }}>{discountError}</p>}

          {/* Totals */}
          <div style={{ borderTop: '1px solid #e8e8e8', marginTop: '16px', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#555' }}>Subtotal · {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
              <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '600' }}>{fmt(subtotal)}</span>
            </div>
            {discountApplied && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#16a34a' }}>Discount</span>
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>−{fmt(discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#555' }}>Shipping</span>
              <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '600' }}>A${shippingCost}.00</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>Total</span>
              <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>AUD</span>
            </div>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>{fmt(total)}</span>
          </div>

          {/* Security note */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#aaa', fontSize: '11px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Secure checkout — SSL encrypted
          </div>
        </aside>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '4px' };
const Divider = () => <div style={{ height: '1px', background: '#e8e8e8' }} />;

export default Checkout;
