import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Copy, Check, AlertTriangle, Clock, XCircle, Mail, Lock, ShoppingBag } from 'lucide-react';
import Logo from '../../components/Logo';
import { apiService } from '../../services/api';
import { countryName } from '../../utils/countries';
import { BANK_ORDER_KEY } from './BankCheckout';

/**
 * /checkout/payment/:orderId?accessToken=… — "Order confirmed — payment required".
 * Shows the selected method's payment details (from the server, for this order only) with copy
 * buttons, the ORDER NUMBER ONLY warning, and the order summary. Also linked from the email.
 */

const aud = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(n) || 0);
const CARD = 'bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(16,42,92,0.12)]';
const BTN = 'inline-block bg-gradient-to-r from-[#00ACEE] to-[#0079CD] hover:brightness-105 text-white text-[15px] font-semibold px-7 py-3 rounded-xl shadow-[0_6px_18px_-6px_rgba(0,121,205,0.55)] transition';

// What goes on the clipboard: no spaces for BSB / account number / IBAN, plain number for the amount
const copyValue = (field, order) => {
  if (field.key === 'amount') return Number(order.grandTotal || 0).toFixed(2);
  if (field.key === 'bsb' || field.key === 'accountNumber' || field.key === 'iban') return field.value.replace(/\s+/g, '');
  return field.value;
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

const CopyButton = ({ text, label }) => {
  const [state, setState] = useState('idle');
  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    setTimeout(() => setState('idle'), 1800);
  };
  return (
    <button type="button" onClick={onClick} aria-label={`Copy ${label}`} className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-[13px] font-semibold transition ${state === 'copied' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-[#0079CE]/25 bg-[#0079CE]/[0.06] text-[#0079CE] hover:bg-[#0079CE]/[0.12]'}`}>
      {state === 'copied' ? <><Check size={14} />Copied</> : state === 'failed' ? 'Select & copy' : <><Copy size={14} />Copy</>}
    </button>
  );
};

const Shell = ({ children, wide = false }) => (
  <div className="min-h-screen bg-[#f7f9fc] font-['Poppins','Poppins_Fallback',sans-serif]">
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Logo />
        <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#102a5c]"><Lock size={15} className="text-[#0079CE]" />Secure Checkout</span>
      </div>
    </header>
    <main className={`${wide ? 'max-w-6xl' : 'max-w-xl'} mx-auto px-4 sm:px-6 py-6 sm:py-8`}>{children}</main>
  </div>
);

const readStored = (orderId) => {
  try {
    const s = JSON.parse(localStorage.getItem(BANK_ORDER_KEY) || 'null');
    return s && s.orderId === orderId ? s : null;
  } catch {
    return null;
  }
};

const BankPayment = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const stored = readStored(orderId);
  const accessToken = params.get('accessToken') || stored?.accessToken;
  const [state, setState] = useState(accessToken ? { phase: 'loading' } : { phase: 'missing' });

  useEffect(() => {
    if (!accessToken) return undefined;
    let alive = true;
    apiService.getBankOrder(orderId, accessToken)
      .then(async (r) => ({ ok: r.ok, body: await r.json().catch(() => ({})) }))
      .then(({ ok, body }) => {
        if (!alive) return;
        if (ok && body?.success && body.data?.order) setState({ phase: 'ready', ...body.data });
        else setState({ phase: 'missing' });
      })
      .catch(() => alive && setState({ phase: 'error' }));
    return () => { alive = false; };
  }, [orderId, accessToken]);

  if (state.phase === 'loading') {
    return <Shell><div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-slate-200 border-t-[#0079CE] rounded-full animate-spin" aria-label="Loading order" /></div></Shell>;
  }
  if (state.phase !== 'ready') {
    return (
      <Shell>
        <div className={`${CARD} p-8 text-center`}>
          <h1 className="text-[22px] font-semibold text-[#102a5c]">{state.phase === 'error' ? 'We could not load your order' : 'Order not found'}</h1>
          <p className="mt-2 text-[14px] text-slate-600">{state.phase === 'error' ? 'Please check your connection and refresh the page.' : 'Please use the link in your order email to view your payment details.'}</p>
          <Link to="/" className={`mt-6 ${BTN}`}>Back to store</Link>
        </div>
      </Shell>
    );
  }

  const { order, payment } = state;
  const paid = ['paid', 'partially_refunded'].includes(order.paymentStatus);
  const cancelled = order.paymentStatus === 'cancelled' || order.status === 'cancelled';
  const ref = order.orderNumber;
  const ship = order.shippingAddressObj || {};
  const count = (order.lineItems || []).reduce((s, li) => s + (Number(li.quantity) || 0), 0);

  return (
    <Shell wide>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:items-start">
        <div>
          {/* Status banner */}
          {paid ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 sm:px-6 py-5 flex gap-4">
              <CheckCircle2 size={28} className="text-emerald-600 shrink-0" />
              <div>
                <h1 className="text-[24px] sm:text-[26px] font-semibold text-[#102a5c] leading-tight">Payment received</h1>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-600">Thank you — your payment for order #{ref} has been received and your order is being processed.</p>
              </div>
            </div>
          ) : cancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 px-5 sm:px-6 py-5 flex gap-4">
              <XCircle size={28} className="text-red-600 shrink-0" />
              <div>
                <h1 className="text-[24px] sm:text-[26px] font-semibold text-[#102a5c] leading-tight">This order was cancelled</h1>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-600">Order #{ref} has been cancelled. If you have already paid, please contact us with your order number.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#0079CE]/15 bg-[#0079CE]/[0.06] px-5 sm:px-6 py-5 flex gap-4">
              <CheckCircle2 size={28} className="text-[#0079CE] shrink-0" />
              <div>
                <h1 className="text-[24px] sm:text-[26px] font-semibold text-[#102a5c] leading-tight">Order confirmed — payment required</h1>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-600">Your order has been received successfully. Please complete your payment using the details below. Your order will be processed once payment has been received and matched to your order.</p>
              </div>
            </div>
          )}

          {!paid && !cancelled && payment && (
            <>
              {stored?.priceChanged && (
                <p className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-[14px] text-sky-900">Prices were updated since you added items to your cart. Please pay the amount shown below.</p>
              )}
              {/* Amount + reference */}
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div className={`${CARD} p-5`}>
                  <p className="text-[13px] font-medium text-slate-500">Amount to pay</p>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <p className="text-[26px] font-bold text-[#102a5c] leading-none">{aud(order.grandTotal)} <span className="text-[13px] font-medium text-slate-500">AUD</span></p>
                    <CopyButton text={Number(order.grandTotal || 0).toFixed(2)} label="amount" />
                  </div>
                </div>
                <div className={`${CARD} p-5`}>
                  <p className="text-[13px] font-medium text-slate-500">Payment reference</p>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <p className="text-[26px] font-bold text-[#102a5c] leading-none tracking-wide break-all">{ref}</p>
                    <CopyButton text={ref} label="reference" />
                  </div>
                </div>
              </div>

              {/* Pay within N days (same text as the email) */}
              {order.paymentDueNotice && (
                <p className="mt-5 flex gap-2.5 rounded-2xl border border-[#0079CE]/15 bg-[#0079CE]/[0.06] px-5 py-3.5 text-[14px] font-semibold leading-relaxed text-[#102a5c]">
                  <Clock size={18} className="shrink-0 mt-0.5 text-[#0079CE]" />{order.paymentDueNotice}
                </p>
              )}

              {/* ORDER NUMBER ONLY */}
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 sm:px-6 py-5 flex gap-3">
                <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-bold tracking-wide text-amber-900">IMPORTANT — ORDER NUMBER ONLY</p>
                  {(payment.warning || []).map((t) => <p key={t} className="mt-1.5 text-[14px] leading-relaxed text-amber-900">{t}</p>)}
                </div>
              </div>

              {/* Payment details for the selected method */}
              <div className={`mt-5 ${CARD}`}>
                <h2 className="px-5 sm:px-6 pt-5 text-[18px] font-semibold text-[#102a5c]">{payment.label}</h2>
                <dl className="px-5 sm:px-6 py-2 divide-y divide-slate-100">
                  {payment.fields.map((f) => (
                    // Phones: label above the value; wider screens: label | value | copy in one row
                    <div key={f.key} className="py-3.5 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[10rem_minmax(0,1fr)_auto] items-center gap-x-3">
                      <dt className="text-[13px] sm:text-[14px] text-slate-500">{f.label}</dt>
                      <dd className="col-start-1 sm:col-start-2 sm:row-start-1 mt-0.5 sm:mt-0 text-[14px] sm:text-[15px] font-semibold text-[#102a5c] [overflow-wrap:anywhere]">{f.value}</dd>
                      {f.copy && <div className="col-start-2 row-start-1 row-span-2 sm:col-start-3 sm:row-span-1"><CopyButton text={copyValue(f, order)} label={f.label} /></div>}
                    </div>
                  ))}
                </dl>
                {(payment.notes || []).map((n) => <p key={n} className="mx-5 sm:mx-6 mb-5 rounded-xl border border-[#00ADEE]/20 bg-[#00ADEE]/[0.07] px-4 py-3 text-[13px] leading-relaxed text-slate-600">{n}</p>)}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500">
                {order.customerEmail && <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#0079CE]" />These details were also emailed to {order.customerEmail}.</span>}
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#0079CE]" />Status: Awaiting payment</span>
              </div>
            </>
          )}
        </div>

        {/* Order summary: right column on desktop, below on mobile */}
        <aside className="mt-6 lg:mt-0 lg:sticky lg:top-6">
          <div className={`${CARD} p-5 sm:p-6`}>
            <h2 className="text-[18px] font-semibold text-[#102a5c]">Order #{ref} <span className="text-[14px] font-normal text-slate-500">({count} item{count === 1 ? '' : 's'})</span></h2>
            <ul className="mt-2 divide-y divide-slate-100">
              {(order.lineItems || []).map((li, i) => (
                <li key={`${li.title}-${i}`} className="flex items-center gap-4 py-4">
                  <div className="w-14 h-14 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                    {li.productImageUrl ? <img src={li.productImageUrl} alt="" className="w-full h-full object-contain" /> : <ShoppingBag size={18} className="text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#102a5c] leading-snug">{li.title}{li.variantTitle ? ` — ${li.variantTitle}` : ''}</p>
                    <p className="text-[13px] text-slate-500">Quantity: {li.quantity}</p>
                  </div>
                  <p className="text-[14px] text-slate-900 shrink-0">{aud(li.subtotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-2 pt-4 border-t border-slate-100 space-y-2.5 text-[14px]">
              <div className="flex justify-between"><dt className="text-slate-700">Subtotal</dt><dd className="text-slate-900">{aud(order.subtotal)}</dd></div>
              {Number(order.discountAmount) > 0 && <div className="flex justify-between"><dt className="text-slate-700">Discount{order.couponCode ? <span className="text-slate-500"> ({order.couponCode})</span> : ''}</dt><dd className="text-emerald-700">−{aud(order.discountAmount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-slate-700">{order.shippingMethodName || 'Shipping'}</dt><dd className="text-slate-900">{Number(order.shippingAmount) > 0 ? aud(order.shippingAmount) : 'Free'}</dd></div>
              <div className="flex justify-between items-baseline pt-3">
                <dt className="text-[16px] font-semibold text-[#102a5c]">Total (AUD)</dt>
                <dd className="text-[22px] font-bold text-[#102a5c]">{aud(order.grandTotal)}</dd>
              </div>
            </dl>
            {(ship.name || ship.city) && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-[14px] text-slate-600">
                <p className="font-semibold text-[#102a5c]">Shipping to</p>
                <p className="mt-0.5">{ship.name}</p>
                <p>{[ship.city, ship.state].filter(Boolean).join(' ')}{ship.country ? `, ${countryName(ship.country)}` : ''}</p>
              </div>
            )}
          </div>
          <div className="mt-5 text-center"><Link to="/collections/all" className={`${BTN} w-full`}>Continue shopping</Link></div>
        </aside>
      </div>
    </Shell>
  );
};

export default BankPayment;
