import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Copy, Check, AlertTriangle, Clock, XCircle, Mail } from 'lucide-react';
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

// What goes on the clipboard: digits only for BSB / account number, plain number for the amount
const copyValue = (field, order) => {
  if (field.key === 'amount') return Number(order.grandTotal || 0).toFixed(2);
  if (field.key === 'bsb' || field.key === 'accountNumber') return field.value.replace(/\s+/g, '');
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
    <button type="button" onClick={onClick} aria-label={`Copy ${label}`} className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-[13px] font-medium transition ${state === 'copied' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>
      {state === 'copied' ? <><Check size={14} />Copied</> : state === 'failed' ? 'Select & copy' : <><Copy size={14} />Copy</>}
    </button>
  );
};

const Shell = ({ children }) => (
  <div className="min-h-screen bg-slate-50 font-['Poppins','Poppins_Fallback',sans-serif]">
    <header className="bg-white border-b border-slate-200"><div className="max-w-3xl mx-auto px-5 py-4 flex justify-center"><Logo className="h-12 sm:h-14" /></div></header>
    <main className="max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-10">{children}</main>
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
    return <Shell><div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-slate-200 border-t-[#102a5c] rounded-full animate-spin" aria-label="Loading order" /></div></Shell>;
  }
  if (state.phase !== 'ready') {
    return (
      <Shell>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h1 className="text-[20px] font-semibold text-slate-900">{state.phase === 'error' ? 'We could not load your order' : 'Order not found'}</h1>
          <p className="mt-2 text-[14px] text-slate-600">{state.phase === 'error' ? 'Please check your connection and refresh the page.' : 'Please use the link in your order email to view your payment details.'}</p>
          <Link to="/" className="mt-6 inline-block bg-[#102a5c] text-white text-[15px] font-semibold px-6 py-3 rounded-lg">Back to store</Link>
        </div>
      </Shell>
    );
  }

  const { order, payment } = state;
  const paid = ['paid', 'partially_refunded'].includes(order.paymentStatus);
  const cancelled = order.paymentStatus === 'cancelled' || order.status === 'cancelled';
  const ref = order.orderNumber;
  const ship = order.shippingAddressObj || {};

  return (
    <Shell>
      {/* Status banner */}
      {paid ? (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 flex gap-4">
          <CheckCircle2 size={30} className="text-emerald-600 shrink-0" />
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900">Payment received</h1>
            <p className="mt-1 text-[15px] text-slate-600">Thank you — your payment for order #{ref} has been received and your order is being processed.</p>
          </div>
        </div>
      ) : cancelled ? (
        <div className="bg-white rounded-xl border border-red-200 p-6 flex gap-4">
          <XCircle size={30} className="text-red-600 shrink-0" />
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900">This order was cancelled</h1>
            <p className="mt-1 text-[15px] text-slate-600">Order #{ref} has been cancelled. If you have already paid, please contact us with your order number.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4">
          <CheckCircle2 size={30} className="text-[#0079CE] shrink-0" />
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900">Order confirmed — payment required</h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">Your order has been received successfully. Please complete your payment using the details below. Your order will be processed once payment has been received and matched to your order.</p>
          </div>
        </div>
      )}

      {!paid && !cancelled && payment && (
        <>
          {stored?.priceChanged && (
            <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-[14px] text-sky-900">Prices were updated since you added items to your cart. Please pay the amount shown below.</p>
          )}
          {/* Amount + reference */}
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[13px] text-slate-500">Amount to pay</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-[24px] font-semibold text-slate-900">{aud(order.grandTotal)} <span className="text-[14px] font-normal text-slate-500">AUD</span></p>
                <CopyButton text={Number(order.grandTotal || 0).toFixed(2)} label="amount" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[13px] text-slate-500">Payment reference</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-[24px] font-semibold text-slate-900 tracking-wide break-all">{ref}</p>
                <CopyButton text={ref} label="reference" />
              </div>
            </div>
          </div>

          {/* ORDER NUMBER ONLY */}
          <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-5 flex gap-3">
            <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold tracking-wide text-amber-900">IMPORTANT — ORDER NUMBER ONLY</p>
              {(payment.warning || []).map((t) => <p key={t} className="mt-1.5 text-[14px] leading-relaxed text-amber-900">{t}</p>)}
            </div>
          </div>

          {/* Payment details for the selected method */}
          <div className="mt-5 bg-white rounded-xl border border-slate-200">
            <h2 className="px-5 sm:px-6 pt-5 text-[18px] font-semibold text-[#102a5c]">{payment.label}</h2>
            <dl className="px-5 sm:px-6 py-3 divide-y divide-slate-100">
              {payment.fields.map((f) => (
                <div key={f.key} className="py-3 flex items-center gap-3">
                  <dt className="w-32 sm:w-40 shrink-0 text-[14px] text-slate-500">{f.label}</dt>
                  <dd className="flex-1 min-w-0 text-[15px] font-semibold text-slate-900 break-all">{f.value}</dd>
                  {f.copy && <CopyButton text={copyValue(f, order)} label={f.label} />}
                </div>
              ))}
            </dl>
            {(payment.notes || []).map((n) => <p key={n} className="mx-5 sm:mx-6 mb-5 rounded-lg bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-600">{n}</p>)}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500">
            {order.customerEmail && <span className="flex items-center gap-1.5"><Mail size={14} />These details were also emailed to {order.customerEmail}.</span>}
            <span className="flex items-center gap-1.5"><Clock size={14} />Status: Awaiting payment</span>
          </div>
        </>
      )}

      {/* Order summary */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        <h2 className="text-[17px] font-semibold text-slate-900">Order #{ref}</h2>
        <ul className="mt-4 space-y-3">
          {(order.lineItems || []).map((li, i) => (
            <li key={`${li.title}-${i}`} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0">{li.productImageUrl && <img src={li.productImageUrl} alt="" className="w-full h-full object-contain" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-900">{li.title}</p>
                <p className="text-[13px] text-slate-500">{li.variantTitle ? `${li.variantTitle} · ` : ''}Qty {li.quantity}</p>
              </div>
              <p className="text-[14px] text-slate-900">{aud(li.subtotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[14px]">
          <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd>{aud(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-600">{order.shippingMethodName || 'Shipping'}</dt><dd>{Number(order.shippingAmount) > 0 ? aud(order.shippingAmount) : 'Free'}</dd></div>
          <div className="flex justify-between pt-2 text-[16px] font-semibold"><dt>Total</dt><dd>{aud(order.grandTotal)} AUD</dd></div>
          {Number(order.taxAmount) > 0 && <p className="text-[13px] text-slate-500">Including {aud(order.taxAmount)} in GST</p>}
        </dl>
        {(ship.name || ship.city) && (
          <div className="mt-5 pt-4 border-t border-slate-100 text-[14px] text-slate-600">
            <p className="font-medium text-slate-900">Shipping to</p>
            <p>{ship.name}</p>
            <p>{[ship.city, ship.state].filter(Boolean).join(' ')}{ship.country ? `, ${countryName(ship.country)}` : ''}</p>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[13px] text-slate-500"><Link to="/" className="text-[#0079CE] hover:underline">Continue shopping</Link></p>
    </Shell>
  );
};

export default BankPayment;
