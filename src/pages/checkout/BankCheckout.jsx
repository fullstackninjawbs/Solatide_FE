import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Lock, ShoppingBag, AlertCircle } from 'lucide-react';
import Logo from '../../components/Logo';
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

const aud = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(n) || 0);
const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.]/g, '')) : Number(v);
  return Number.isFinite(n) ? n : 0;
};
// "Default Title" is Shopify's placeholder for single-variant products: not shown
const variantLabel = (item) => {
  const t = item.selectedVariant?.title || item.selectedVariant?.name || '';
  return t && !/^default title$/i.test(t.trim()) ? t : '';
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (!f.firstName.trim()) e.firstName = 'Enter a first name';
  if (!f.lastName.trim()) e.lastName = 'Enter a last name';
  if (!f.street1.trim()) e.street1 = 'Enter an address';
  if (!f.city.trim()) e.city = country === 'AU' ? 'Enter a suburb' : 'Enter a city';
  if (country === 'AU') {
    if (!f.state) e.state = 'Select a state / territory';
    if (!/^\d{4}$/.test(f.zip.trim())) e.zip = 'Enter a 4-digit postcode';
  } else if (!f.zip.trim()) {
    e.zip = 'Enter a postal code';
  }
  if (!/^\+?[0-9 ()-]{6,30}$/.test(f.phone.trim()) || f.phone.replace(/\D/g, '').length < 6) e.phone = 'Enter a valid phone number';
  return e;
}

const inputCls = (err) =>
  `w-full h-[50px] px-3.5 rounded-lg border bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
    err ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-[#0079CE] focus:ring-[#0079CE]/15'
  }`;

const Field = ({ label, error, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="sr-only">{label}</span>
    {children}
    {error && <span className="mt-1 flex items-center gap-1 text-[13px] text-red-600"><AlertCircle size={13} />{error}</span>}
  </label>
);

const Summary = ({ cartItems, subtotal, shipping, total, gst, country }) => (
  <div>
    <ul className="space-y-4">
      {cartItems.map((item) => (
        <li key={item.cartItemId} className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
              {imageOf(item) ? <img src={imageOf(item)} alt="" className="w-full h-full object-contain" /> : <ShoppingBag size={20} className="text-slate-300" />}
            </div>
            <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 rounded-full bg-slate-600 text-white text-[12px] font-semibold flex items-center justify-center">{item.quantity}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-slate-900 leading-snug">{item.name}</p>
            {variantLabel(item) && <p className="text-[13px] text-slate-500">{variantLabel(item)}</p>}
          </div>
          <p className="text-[14px] text-slate-900 shrink-0">{aud(num(item.price) * item.quantity)}</p>
        </li>
      ))}
    </ul>
    <dl className="mt-6 space-y-2.5 text-[14px]">
      <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd className="text-slate-900">{aud(subtotal)}</dd></div>
      <div className="flex justify-between">
        <dt className="text-slate-600">Shipping</dt>
        <dd className="text-slate-900">{shipping == null ? <span className="text-slate-500">Enter shipping address</span> : shipping === 0 ? 'Free' : aud(shipping)}</dd>
      </div>
      <div className="flex justify-between items-baseline pt-3">
        <dt className="text-[17px] font-semibold text-slate-900">Total</dt>
        <dd className="text-[22px] font-semibold text-slate-900"><span className="text-[12px] font-normal text-slate-500 mr-1.5">AUD</span>{aud(total)}</dd>
      </div>
      {country === 'AU' && gst > 0 && <p className="text-[13px] text-slate-500">Including {aud(gst)} in GST</p>}
    </dl>
  </div>
);

const BankCheckout = ({ config }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY);
  const [country, setCountry] = useState('AU');
  const [chosenMethod, setMethod] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [errorTick, setErrorTick] = useState(0);
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
  const total = Math.round((subtotal + shipping) * 100) / 100;
  const gst = country === 'AU' ? Math.round((total / 11) * 100) / 100 : 0;

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
        items: cartItems.map((i) => ({
          productId: i._id || i.product || i.id,
          variantId: i.selectedVariant?._id || undefined,
          quantity: Math.min(100, Math.max(1, Math.floor(Number(i.quantity) || 1))),
        })),
        customer: { email: form.email, firstName: form.firstName, lastName: form.lastName, phone: form.phone },
        shippingAddress: { company: form.company, street1: form.street1, street2: form.street2, city: form.city, state: form.state, zip: form.zip, country },
        paymentMethod: method,
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white font-['Poppins','Poppins_Fallback',sans-serif]">
        <header className="border-b border-slate-200 py-4"><div className="max-w-5xl mx-auto px-5 flex justify-center"><Logo className="h-14" /></div></header>
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <ShoppingBag size={36} className="mx-auto text-slate-300" />
          <h1 className="mt-4 text-[22px] font-semibold text-slate-900">Your cart is empty</h1>
          <Link to="/collections/all" className="mt-6 inline-block bg-[#102a5c] text-white text-[15px] font-semibold px-6 py-3 rounded-lg">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const fe = (k) => errors[k];
  const fieldProps = (k) => ({ value: form[k], onChange: set(k), className: inputCls(fe(k)), 'data-field-error': fe(k) ? 'true' : undefined });

  return (
    <div className="min-h-screen bg-white font-['Poppins','Poppins_Fallback',sans-serif]">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Logo className="h-12 sm:h-14" />
          <Link to="/collections/all" className="text-[14px] text-[#0079CE] hover:underline">Continue shopping</Link>
        </div>
      </header>

      {/* Mobile: collapsible order summary */}
      <div className="lg:hidden border-b border-slate-200 bg-slate-50">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} className="w-full max-w-xl mx-auto px-5 py-4 flex items-center justify-between text-[14px] text-[#0079CE]">
          <span className="flex items-center gap-2"><ShoppingBag size={16} />{summaryOpen ? 'Hide' : 'Show'} order summary {summaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
          <span className="text-[17px] font-semibold text-slate-900">{aud(total)}</span>
        </button>
        {summaryOpen && <div className="max-w-xl mx-auto px-5 pb-6"><Summary {...{ cartItems, subtotal, shipping, total, gst, country }} /></div>}
      </div>

      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_420px]">
        <form noValidate onSubmit={submit} className="px-5 sm:px-8 lg:pr-12 py-8 lg:py-10 max-w-xl w-full mx-auto lg:mx-0 lg:ml-auto">
          {/* Contact */}
          <section>
            <h2 className="text-[20px] font-semibold text-slate-900 mb-3">Contact</h2>
            <Field label="Email" error={fe('email')}>
              <input type="email" autoComplete="email" placeholder="Email" {...fieldProps('email')} />
            </Field>
          </section>

          {/* Delivery */}
          <section className="mt-8">
            <h2 className="text-[20px] font-semibold text-slate-900 mb-3">Delivery</h2>
            <div className="space-y-3">
              <label className="block relative">
                <span className="absolute left-3.5 top-2 text-[12px] text-slate-500">Country/Region</span>
                <select value={country} onChange={onCountry} autoComplete="country" className="w-full h-[54px] pt-4 px-3.5 rounded-lg border border-slate-300 bg-white text-[15px] text-slate-900 outline-none focus:border-[#0079CE] focus:ring-2 focus:ring-[#0079CE]/15 appearance-none">
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" error={fe('firstName')}><input autoComplete="given-name" placeholder="First name" {...fieldProps('firstName')} /></Field>
                <Field label="Last name" error={fe('lastName')}><input autoComplete="family-name" placeholder="Last name" {...fieldProps('lastName')} /></Field>
              </div>
              <Field label="Company"><input autoComplete="organization" placeholder="Company (optional)" {...fieldProps('company')} /></Field>
              <Field label="Address" error={fe('street1')}><input autoComplete="address-line1" placeholder="Address" {...fieldProps('street1')} /></Field>
              <Field label="Apartment"><input autoComplete="address-line2" placeholder="Apartment, suite, etc. (optional)" {...fieldProps('street2')} /></Field>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                <Field label={country === 'AU' ? 'Suburb' : 'City'} error={fe('city')}><input autoComplete="address-level2" placeholder={country === 'AU' ? 'Suburb' : 'City'} {...fieldProps('city')} /></Field>
                {country === 'AU' ? (
                  <Field label="State/territory" error={fe('state')}>
                    <div className="relative">
                      <select autoComplete="address-level1" {...fieldProps('state')} className={`${inputCls(fe('state'))} appearance-none ${form.state ? '' : 'text-slate-400'}`}>
                        <option value="">State/territory</option>
                        {AU_STATES.map((st) => <option key={st.code} value={st.code} className="text-slate-900">{st.name}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </Field>
                ) : (
                  <Field label="State / region"><input autoComplete="address-level1" placeholder="State / region (optional)" {...fieldProps('state')} /></Field>
                )}
                <Field label="Postcode" error={fe('zip')}><input autoComplete="postal-code" inputMode={country === 'AU' ? 'numeric' : 'text'} placeholder={country === 'AU' ? 'Postcode' : 'Postal code'} {...fieldProps('zip')} /></Field>
              </div>
              <Field label="Phone" error={fe('phone')}><input type="tel" autoComplete="tel" placeholder="Phone" {...fieldProps('phone')} /></Field>
            </div>
          </section>

          {/* Shipping method */}
          <section className="mt-8">
            <h2 className="text-[17px] font-semibold text-slate-900 mb-3">Shipping method</h2>
            <div className="rounded-lg border border-[#0079CE] bg-[#0079CE]/5 px-4 py-3.5 flex justify-between text-[14px]">
              <span className="text-slate-900">{country === 'AU' ? (shipping === 0 ? 'Free shipping' : 'Standard shipping') : 'International shipping'}</span>
              <span className="font-semibold text-slate-900">{shipping === 0 ? 'Free' : aud(shipping)}</span>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-8">
            <h2 className="text-[20px] font-semibold text-slate-900 mb-1">Payment</h2>
            <p className="text-[13px] text-slate-500 mb-3 flex items-center gap-1.5"><Lock size={13} />Payment details are shown after you complete your order.</p>
            {methods.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 text-[14px] text-amber-800">We can't take orders for delivery to this country at the moment. Please contact us.</div>
            ) : (
              <div className={`rounded-lg border overflow-hidden ${fe('method') ? 'border-red-400' : 'border-slate-300'}`} data-field-error={fe('method') ? 'true' : undefined} role="radiogroup" aria-label="Payment method">
                {methods.map((m, i) => {
                  const selected = method === m;
                  return (
                    <label key={m} className={`block cursor-pointer ${i > 0 ? 'border-t border-slate-200' : ''} ${selected ? 'bg-[#0079CE]/5' : 'bg-white'}`}>
                      <div className="flex items-start gap-3 px-4 py-4">
                        <input type="radio" name="paymentMethod" value={m} checked={selected} onChange={() => { setMethod(m); setErrors((e) => ({ ...e, method: undefined })); }} className="mt-1 h-4 w-4 accent-[#0079CE]" />
                        <span>
                          <span className="block text-[15px] font-medium text-slate-900">{METHOD_COPY[m].title}</span>
                          {selected && <span className="block mt-1.5 text-[13px] leading-relaxed text-slate-600">{METHOD_COPY[m].text}</span>}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
            {fe('method') && <p className="mt-1 flex items-center gap-1 text-[13px] text-red-600"><AlertCircle size={13} />{fe('method')}</p>}
          </section>

          {submitError && (
            <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 flex gap-2"><AlertCircle size={18} className="shrink-0 mt-0.5" />{submitError}</div>
          )}

          <button type="submit" disabled={submitting || methods.length === 0} className="mt-6 w-full h-[56px] rounded-lg bg-[#102a5c] hover:bg-[#0d2255] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[17px] font-semibold transition flex items-center justify-center gap-2">
            {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Placing order" /> : 'Complete order'}
          </button>
          <p className="mt-4 text-[12px] text-slate-500 text-center">All prices in AUD{country === 'AU' ? ', including GST' : ''}.</p>
        </form>

        {/* Desktop: order summary */}
        <aside className="hidden lg:block bg-slate-50 border-l border-slate-200 px-10 py-10 min-h-[calc(100vh-81px)]">
          <div className="sticky top-10"><Summary {...{ cartItems, subtotal, shipping, total, gst, country }} /></div>
        </aside>
      </div>
    </div>
  );
};

export default BankCheckout;
