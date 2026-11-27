// Shared wording and icons for the live customer activity views (cards, feed, visitor panel), so a
// visitor and an action look the same everywhere. Statuses use the server's definitions
// (Server/src/services/analytics/config.ts liveStatus), passed down with every snapshot.
import {
  Eye, FileText, Layers, ShoppingCart, MinusCircle, SlidersHorizontal, CreditCard, AlertTriangle,
  Receipt, BadgeCheck, XCircle, Undo2, MousePointerClick, Send,
} from 'lucide-react';

const STAGE_LABEL = { information: 'Information', shipping: 'Shipping', payment: 'Payment' };

// tone → pill classes (same palette as the Analytics page stream and the Orders list badges)
export const TONES = {
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  red: 'bg-red-50 text-red-700 border-red-200',
};

export const EVENT_META = {
  page_view: { label: 'Page view', icon: FileText, tone: 'slate' },
  product_view: { label: 'Product view', icon: Eye, tone: 'purple' },
  variant_select: { label: 'Selected option', icon: Layers, tone: 'purple' },
  add_to_cart: { label: 'Added to cart', icon: ShoppingCart, tone: 'amber' },
  remove_from_cart: { label: 'Removed from cart', icon: MinusCircle, tone: 'amber' },
  cart_quantity_change: { label: 'Changed quantity', icon: SlidersHorizontal, tone: 'amber' },
  begin_checkout: { label: 'Started checkout', icon: CreditCard, tone: 'blue' },
  checkout_step: { label: 'Checkout step', icon: CreditCard, tone: 'blue' },
  checkout_error: { label: 'Checkout error', icon: AlertTriangle, tone: 'red' },
  order_placed: { label: 'Order placed', icon: Receipt, tone: 'indigo' },
  // Order Request checkout: the request was sent (the admin creates the order and emails payment details)
  order_request: { label: 'Order request sent', icon: Send, tone: 'indigo' },
  purchase: { label: 'Payment confirmed', icon: BadgeCheck, tone: 'green' },
  order_cancelled: { label: 'Order cancelled', icon: XCircle, tone: 'red' },
  order_refunded: { label: 'Refunded', icon: Undo2, tone: 'red' },
};

/** Label for an action, with the checkout stage where recorded. */
export function eventLabel(ev) {
  if (!ev?.type) return 'Visiting';
  if (ev.type === 'checkout_step' && ev.stage) return `Checkout: ${STAGE_LABEL[ev.stage] || ev.stage}`;
  if (ev.type === 'checkout_error' && ev.stage) return `Checkout error (${STAGE_LABEL[ev.stage] || ev.stage})`;
  if (ev.type === 'cart_quantity_change' && typeof ev.quantity === 'number') return ev.quantity > 0 ? `Quantity +${ev.quantity}` : `Quantity ${ev.quantity}`;
  return EVENT_META[ev.type]?.label || ev.type;
}
export const eventMeta = (type) => EVENT_META[type] || { label: type, icon: MousePointerClick, tone: 'slate' };

/** Filter groups for the "All activity" feed (server types per group). */
export const FEED_FILTERS = [
  { key: 'pages', label: 'Page views', types: ['page_view'] },
  { key: 'products', label: 'Product views', types: ['product_view', 'variant_select'] },
  { key: 'cart', label: 'Cart', types: ['add_to_cart', 'remove_from_cart', 'cart_quantity_change'] },
  { key: 'checkout', label: 'Checkout', types: ['begin_checkout', 'checkout_step', 'checkout_error'] },
  { key: 'orders', label: 'Orders & payments', types: ['order_placed', 'order_request', 'purchase', 'order_cancelled', 'order_refunded'] },
];

export const sourceLabel = (source) => source?.source || 'Unknown source';
export const deviceLabel = (device) => device?.label || (device?.type ? device.type[0].toUpperCase() + device.type.slice(1) : 'Unknown device');

export function locationLabel(loc) {
  if (!loc) return 'Location unknown';
  return [loc.city || loc.region, loc.country].filter(Boolean).join(', ');
}

/** "12s ago", "4m ago", "2h ago", or a date for older activity. */
export function timeAgo(iso, now) {
  if (!iso) return '';
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'Australia/Melbourne' });
}

/** Clock time in Melbourne (the store's reporting time zone). */
export const clockTime = (iso) => (iso ? new Date(iso).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: 'Australia/Melbourne' }) : '');

/** Same rule as the server: active = recent activity/heartbeat and the tab not closed/hidden since. */
export function liveStatus(p, now, definitions) {
  if (!p?.lastActivityAt) return 'ended';
  const last = new Date(p.lastActivityAt).getTime();
  const idle = now - last;
  if (idle > (definitions?.sessionTimeoutMinutes ?? 30) * 60_000) return 'ended';
  const left = p.leftAt ? new Date(p.leftAt).getTime() >= last : false;
  return !left && idle <= (definitions?.activeWindowSeconds ?? 40) * 1000 ? 'active' : 'inactive';
}

export const STATUS_META = {
  active: { label: 'Active now', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactive', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  ended: { label: 'Visit ended', dot: 'bg-slate-300', pill: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export const displayName = (v) => v?.name || v?.anonymousId || 'Visitor';
export function initials(v) {
  if (!v?.name || v.name.includes('@')) return null;
  return v.name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}
