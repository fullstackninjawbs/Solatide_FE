import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronDown, FileText, Info, Lock, ShoppingBag } from 'lucide-react';
import Logo from '../../components/Logo';
import DiscountCodeBox from '../../components/checkout/DiscountCodeBox';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/api';
import { trackEvent, getVisitorContext } from '../../utils/analytics';
import { getCheckoutAttributionPayload } from '../../utils/attribution';
import { COUNTRIES, AU_STATES } from '../../utils/countries';

/**
 * Our own checkout (bank transfer / PayID). Shopify-style one page: contact, delivery, payment
 * method (by country), order summary. The server re-checks everything (prices, stock, method for
 * the country) and creates the order "Awaiting payment"; payment details are shown only after that.
 */

export const BANK_ORDER_KEY = 'solatide_bank_order';

const METHOD_COPY = {
  payid: {
    title: 'PayID — Australia Only',
    text: 'Available for Australian customers only. After clicking Complete order, your PayID details and payment instructions will be shown on the next page.',
  },
  bank_transfer: {
    title: 'Bank Transfer — Australia Only',
    text: 'Available for Australian customers only. After clicking Complete order, your bank transfer details and payment instructions will be shown on the next page.',
  },
  international_bank_transfer: {
    title: 'International Bank Transfer',
    text: 'For customers outside Australia. After clicking Complete order, your international bank transfer details and payment instructions will be shown on the next page.',
  },
};

const money = (n) => `A$${(Number(n) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.]/g, '')) : Number(v);
  return Number.isFinite(n) ? n : 0;
};
// "Default Title" (Shopify placeholder) and titles repeating the product name are not shown
const variantLabel = (item) => {
  const t = item.selectedVariant?.title || item.selectedVariant?.name || '';
  return t && !/^default title$/i.test(t.trim()) && t.trim().toLowerCase() !== String(item.name || '').trim().toLowerCase() ? t : '';
};
const imageOf = (item) => item.image || (typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url) || '';
const newRequestId = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch { /* fall through */ }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

const EMPTY = { email: '', firstName: '', lastName: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', phone: '' };

function validate(f, country) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'Enter your first name';
  if (!f.lastName.trim()) e.lastName = 'Enter your last name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (!/^\+?[0-9 ()-]{6,30}$/.test(f.phone.trim()) || f.phone.replace(/\D/g, '').length < 6) e.phone = 'Enter a valid phone number';
  if (!f.street1.trim()) e.street1 = 'Enter your address';
  if (!f.city.trim()) e.city = country === 'AU' ? 'Enter your suburb' : 'Enter your city';
  if (country === 'AU') {
    if (!f.state) e.state = 'Select a state';
    if (!/^\d{4}$/.test(f.zip.trim())) e.zip = 'Enter a 4-digit postcode';
  } else if (!f.zip.trim()) {
    e.zip = 'Enter a postal code';
  }
  return e;
}

const inputCls = (err) =>
  `w-full h-[48px] px-4 rounded-xl border bg-white text-[14.5px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
    err ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-[#0079CE] focus:ring-[#0079CE]/15'
  }`;

const Err = ({ text }) => (text ? <span className="mt-1 flex items-center gap-1 text-[12.5px] text-red-600"><AlertCircle size={12} />{text}</span> : null);

const Summary = ({ cartItems, subtotal, shipping, total, discount, discountBox }) => {
  const count = cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_4px_20px_-10px_rgba(16,42,92,0.12)]">
      <h2 className="text-[18px] font-semibold text-[#102a5c]">Order Summary <span className="text-[14px] text-slate-500">({count} item{count === 1 ? '' : 's'})</span></h2>
      <ul className="mt-4 divide-y divide-slate-100">
        {cartItems.map((item) => (
          <li key={item.cartItemId} className="flex items-center gap-4 py-4">
            <div className="w-14 h-14 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
              {imageOf(item) ? <img src={imageOf(item)} alt="" className="w-full h-full object-contain" /> : <ShoppingBag size={18} className="text-slate-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#102a5c] leading-snug">{item.name}{variantLabel(item) ? ` — ${variantLabel(item)}` : ''}</p>
              <p className="text-[13px] text-slate-500">Quantity: {item.quantity}</p>
            </div>
            <p className="text-[14px] text-slate-900 shrink-0">{money(num(item.price) * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 pt-4 border-t border-slate-100">{discountBox}</div>
      <dl className="mt-4 space-y-2.5 text-[14px]">
        <div className="flex justify-between"><dt className="text-slate-700">Subtotal</dt><dd className="text-slate-900">{money(subtotal)}</dd></div>
        {discount && <div className="flex justify-between"><dt className="text-slate-700">Discount <span className="text-slate-500">({discount.code})</span></dt><dd className="text-emerald-700">−{money(discount.amount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-slate-700">Shipping</dt><dd className="text-slate-900">{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
        <div className="flex justify-between items-baseline pt-3">
          <dt className="text-[16px] font-semibold text-[#102a5c]">Total (AUD)</dt>
          <dd className="text-[22px] font-bold text-[#102a5c]">{money(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[12px] text-slate-500">All prices are in AUD and include GST where applicable.</p>
    </div>
  );
};

const BankCheckout = ({ config }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY);
  const [country, setCountry] = useState('AU');
  const [chosenMethod, setMethod] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorTick, setErrorTick] = useState(0);
  const [discount, setDiscount] = useState(null); // { code, amount, label } from the server
  const requestId = useRef(newRequestId());

  // After a failed submit, bring the first invalid field into view (once React has rendered it)
  useEffect(() => {
    if (!errorTick) return;
    const first = document.querySelector('[data-field-error="true"]');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errorTick]);

  useEffect(() => {
    if (cartItems.length > 0) trackEvent('begin_checkout', { cartValue: cartTotalPrice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useMemo(() => (country === 'AU' ? config.methods.AU : config.methods.international) || [], [country, config]);
  // A method chosen for another country (AU ↔ international switch) no longer counts
  const method = methods.includes(chosenMethod) ? chosenMethod : '';

  const subtotal = Math.round(cartTotalPrice * 100) / 100;
  const shipping = country === 'AU'
    ? (config.shipping.freeThresholdAU > 0 && subtotal >= config.shipping.freeThresholdAU ? 0 : config.shipping.AU)
    : config.shipping.international;
  const total = Math.round((subtotal - (discount?.amount || 0) + shipping) * 100) / 100;
  const checkoutItems = cartItems.map((i) => ({
    productId: i._id || i.product || i.id,
    variantId: i.selectedVariant?._id || undefined,
    quantity: Math.min(100, Math.max(1, Math.floor(Number(i.quantity) || 1))),
  }));

  const set = (k) => (ev) => {
    const v = ev.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onCountry = (ev) => {
    setCountry(ev.target.value);
    setForm((f) => ({ ...f, state: '' }));
    setErrors((e) => ({ ...e, state: undefined, zip: undefined }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    setSubmitError('');
    const e = validate(form, country);
    if (!method) e.method = 'Select a payment method';
    setErrors(e);
    if (Object.keys(e).length) {
      setErrorTick((n) => n + 1);
      return;
    }
    setSubmitting(true);
    try {
      const visitor = await getVisitorContext().catch(() => undefined);
      const res = await apiService.placeBankOrder({
        checkoutRequestId: requestId.current,
        items: checkoutItems,
        customer: { email: form.email, firstName: form.firstName, lastName: form.lastName, phone: form.phone },
        shippingAddress: { company: form.company, street1: form.street1, street2: form.street2, city: form.city, state: form.state, zip: form.zip, country },
        paymentMethod: method,
        discountCode: discount?.code || undefined,
        attribution: getCheckoutAttributionPayload(),
        visitor,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setSubmitError(data?.message || 'Something went wrong placing your order. Please try again.');
        setSubmitting(false);
        return;
      }
      const { orderId, accessToken, grandTotal } = data.data;
      // Prices are re-checked on the server; tell the customer if the total changed since the cart was filled
      const priceChanged = Number.isFinite(Number(grandTotal)) && Math.abs(Number(grandTotal) - total) > 0.009;
      try { localStorage.setItem(BANK_ORDER_KEY, JSON.stringify({ orderId, accessToken, priceChanged })); } catch { /* private mode */ }
      clearCart();
      navigate(`/checkout/payment/${orderId}?accessToken=${encodeURIComponent(accessToken)}`, { replace: true });
    } catch {
      setSubmitError('We could not reach the store. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const header = (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Logo />
        <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#102a5c]"><Lock size={15} className="text-[#0079CE]" />Secure Checkout</span>
      </div>
    </header>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white font-['Poppins','Poppins_Fallback',sans-serif]">
        {header}
        <main className="max-w-md mx-auto px-5 py-20 text-center">
          <ShoppingBag size={36} className="mx-auto text-slate-300" />
          <h1 className="mt-4 text-[24px] font-semibold text-[#102a5c]">Your cart is empty</h1>
          <Link to="/collections/all" className="mt-6 inline-block bg-gradient-to-r from-[#00ACEE] to-[#0079CD] text-white text-[15px] font-semibold px-6 py-3 rounded-xl">Continue shopping</Link>
        </main>
      </div>
    );
  }

  const fp = (k) => ({ value: form[k], onChange: set(k), className: inputCls(errors[k]), 'data-field-error': errors[k] ? 'true' : undefined });
  const shippingName = country === 'AU' ? (shipping === 0 ? 'Free shipping' : 'Express shipping') : 'International express shipping';

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Poppins','Poppins_Fallback',sans-serif]">
      {header}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:items-start">
        {/* Order summary: right column on desktop, above the form on mobile */}
        <aside className="mb-6 lg:mb-0 lg:order-2 lg:sticky lg:top-6"><Summary {...{ cartItems, subtotal, shipping, total, discount }} discountBox={<DiscountCodeBox items={checkoutItems} email={form.email.trim()} applied={discount} onChange={setDiscount} />} /></aside>

        <form noValidate onSubmit={submit} className="lg:order-1">
          <div className="flex gap-3 rounded-2xl border border-[#0079CE]/15 bg-[#0079CE]/[0.06] px-5 py-4">
            <Info size={22} className="shrink-0 mt-0.5 text-[#0079CE]" />
            <div className="text-[13.5px] leading-relaxed text-slate-600">
              <p className="text-[15px] font-semibold text-[#102a5c]">Pay by PayID or bank transfer.</p>
              <p>Complete your order below and choose how you'd like to pay.</p>
              <p>Your payment details will be shown on the next page and emailed to you.</p>
              <p>Your order will be processed once payment is received.</p>
            </div>
          </div>

          <h1 className="mt-7 text-[28px] font-semibold text-[#102a5c]">Checkout</h1>
          <p className="mt-1 text-[14px] text-slate-600">Enter your contact and delivery details, then choose a payment method.</p>

          <h2 className="mt-6 text-[15px] font-semibold text-[#102a5c]">Contact Information</h2>
          <div className="mt-3 grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block"><span className="sr-only">First name</span><input autoComplete="given-name" placeholder="First name *" {...fp('firstName')} /><Err text={errors.firstName} /></label>
              <label className="block"><span className="sr-only">Last name</span><input autoComplete="family-name" placeholder="Last name *" {...fp('lastName')} /><Err text={errors.lastName} /></label>
            </div>
            <label className="block"><span className="sr-only">Email address</span><input type="email" autoComplete="email" placeholder="Email address *" {...fp('email')} /><Err text={errors.email} /></label>
            <label className="block"><span className="sr-only">Phone number</span><input type="tel" autoComplete="tel" placeholder="Phone number *" {...fp('phone')} /><Err text={errors.phone} /></label>
          </div>

          <h2 className="mt-6 text-[15px] font-semibold text-[#102a5c]">Delivery Address</h2>
          <div className="mt-3 grid gap-3">
            <label className="block relative">
              <span className="sr-only">Country</span>
              <select value={country} onChange={onCountry} autoComplete="country" className={`${inputCls(false)} appearance-none`}>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </label>
            <label className="block"><span className="sr-only">Company</span><input autoComplete="organization" placeholder="Company (optional)" {...fp('company')} /></label>
            <label className="block"><span className="sr-only">Address line 1</span><input autoComplete="address-line1" placeholder="Address line 1 *" {...fp('street1')} /><Err text={errors.street1} /></label>
            <label className="block"><span className="sr-only">Address line 2</span><input autoComplete="address-line2" placeholder="Address line 2 (optional)" {...fp('street2')} /></label>
            <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr] gap-3">
              <label className="block"><span className="sr-only">{country === 'AU' ? 'Suburb' : 'City'}</span><input autoComplete="address-level2" placeholder={country === 'AU' ? 'Suburb *' : 'City *'} {...fp('city')} /><Err text={errors.city} /></label>
              {country === 'AU' ? (
                <label className="block relative">
                  <span className="sr-only">State</span>
                  <select autoComplete="address-level1" {...fp('state')} className={`${inputCls(errors.state).replace('text-slate-900', form.state ? 'text-slate-900' : 'text-slate-400')} appearance-none`}>
                    <option value="">State *</option>
                    {AU_STATES.map((st) => <option key={st.code} value={st.code} className="text-slate-900">{st.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-[23px] -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <Err text={errors.state} />
                </label>
              ) : (
                <label className="block"><span className="sr-only">State / region</span><input autoComplete="address-level1" placeholder="State / region" {...fp('state')} /></label>
              )}
              <label className="block"><span className="sr-only">Postcode</span><input autoComplete="postal-code" inputMode={country === 'AU' ? 'numeric' : 'text'} placeholder={country === 'AU' ? 'Postcode *' : 'Postal code *'} {...fp('zip')} /><Err text={errors.zip} /></label>
            </div>
          </div>

          <h2 className="mt-6 text-[15px] font-semibold text-[#102a5c]">Shipping Method</h2>
          <div className="mt-3 rounded-xl border border-[#0079CE]/40 bg-white px-4 py-3.5 flex justify-between text-[14px]">
            <span className="text-slate-900">{shippingName}</span>
            <span className="font-semibold text-[#102a5c]">{shipping === 0 ? 'Free' : money(shipping)}</span>
          </div>

          <h2 className="mt-6 text-[15px] font-semibold text-[#102a5c]">Payment Method</h2>
          <div className="mt-3">
            {methods.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-[14px] text-amber-800">We can't take orders for delivery to this country at the moment. Please contact us.</div>
            ) : (
              <div className={`rounded-xl border bg-white overflow-hidden ${errors.method ? 'border-red-400' : 'border-slate-200'}`} data-field-error={errors.method ? 'true' : undefined} role="radiogroup" aria-label="Payment method">
                {methods.map((m, i) => {
                  const selected = method === m;
                  return (
                    <label key={m} className={`block cursor-pointer transition ${i > 0 ? 'border-t border-slate-100' : ''} ${selected ? 'bg-[#0079CE]/[0.06]' : 'bg-white hover:bg-slate-50'}`}>
                      <div className="flex items-start gap-3 px-4 py-4">
                        <input type="radio" name="paymentMethod" value={m} checked={selected} onChange={() => { setMethod(m); setErrors((e) => ({ ...e, method: undefined })); }} className="mt-1 h-4 w-4 accent-[#0079CE]" />
                        <span>
                          <span className="block text-[14.5px] font-medium text-[#102a5c]">{METHOD_COPY[m].title}</span>
                          {selected && <span className="block mt-1.5 text-[13px] leading-relaxed text-slate-600">{METHOD_COPY[m].text}</span>}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
            <Err text={errors.method} />
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-[#00ADEE]/20 bg-[#00ADEE]/[0.07] px-5 py-4">
            <FileText size={22} className="shrink-0 mt-0.5 text-[#0079CE]" />
            <div className="text-[13.5px] leading-relaxed text-slate-600">
              <p className="font-semibold text-[#102a5c]">No payment is taken on this page.</p>
              <p>After clicking Complete order, your PayID or bank transfer details will be shown on the next page and emailed to you.</p>
            </div>
          </div>

          {submitError && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 flex gap-2"><AlertCircle size={18} className="shrink-0 mt-0.5" />{submitError}</div>}

          <button type="submit" disabled={submitting || methods.length === 0} className="mt-5 inline-flex items-center bg-gradient-to-r from-[#00ACEE] to-[#0079CD] hover:brightness-105 justify-center gap-2 text-white text-[15px] font-semibold whitespace-nowrap transition-all duration-200 w-full h-[52px] rounded-xl shadow-[0_6px_18px_-6px_rgba(0,121,205,0.55)] disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Placing order" /> : 'Complete order'}
          </button>
          <p className="mt-3 text-center text-[12.5px] leading-relaxed text-slate-500">
            By completing your order, you confirm that the order details above are correct.<br />
            Your order will be processed once payment has been received.
          </p>
        </form>
      </main>
    </div>
  );
};

export default BankCheckout;
