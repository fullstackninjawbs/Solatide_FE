// Wording for the visitor panel tabs. Dates and times are always Melbourne (the store's reporting zone).
import { Eye, ShoppingCart, CreditCard, Receipt, Send } from 'lucide-react';

const MEL = 'Australia/Melbourne';

export const dateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: MEL }) : '—';

export const shortDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: MEL }) : '—';

export function durationText(seconds) {
  const s = Math.max(0, Math.round(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${m}m`;
  return m ? `${m}m ${s % 60}s` : `${s}s`;
}

export const secondsBetween = (from, to) => (from && to ? Math.max(0, (new Date(to) - new Date(from)) / 1000) : 0);

export const money = (n, currency = 'AUD') =>
  typeof n === 'number' ? new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(n) : '—';

export const PAYMENT_METHOD = {
  payid: 'PayID',
  bank_transfer: 'Bank transfer',
  international_bank_transfer: 'International bank transfer',
  manual_offline: 'Manual / offline',
  tagada: 'Card (legacy)',
  order_request: 'Order request (details emailed)',
};
export const paymentMethodLabel = (m) => (m ? PAYMENT_METHOD[m] || m.replace(/_/g, ' ') : '—');

export const STAGE_LABEL = { started: 'Opened checkout', information: 'Information', shipping: 'Shipping', payment: 'Payment' };

export const CHECKOUT_STATUS = {
  in_progress: { label: 'In progress', pill: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  abandoned: { label: 'Abandoned', pill: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  order_submitted: { label: 'Order submitted', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
};

export const OUTCOME = {
  ordered: { label: 'Ordered', icon: Receipt, pill: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' },
  requested: { label: 'Order request sent', icon: Send, pill: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' },
  checkout: { label: 'Checkout started', icon: CreditCard, pill: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  cart: { label: 'Added to cart', icon: ShoppingCart, pill: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  browsed: { label: 'Browsed', icon: Eye, pill: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export const PAYMENT_STATUS = {
  paid: { label: 'Paid', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  pending: { label: 'Awaiting payment', pill: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  failed: { label: 'Failed', pill: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', pill: 'bg-slate-100 text-slate-600 border-slate-200' },
  partially_refunded: { label: 'Partly refunded', pill: 'bg-red-50 text-red-700 border-red-200' },
  refunded: { label: 'Refunded', pill: 'bg-red-50 text-red-700 border-red-200' },
};
