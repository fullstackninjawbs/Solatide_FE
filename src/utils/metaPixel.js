/**
 * metaPixel.js — Meta Pixel (browser) + relay to the Conversions API (server), deduplicated.
 *
 * - Off unless the API says so: GET /api/meta/config → { enabled, pixelId }. The Pixel ID and the
 *   on/off switch live in the server .env (META_TRACKING_ENABLED, META_PIXEL_ID), so enabling
 *   needs no frontend rebuild. The CAPI access token never reaches the browser.
 * - Every event goes to the Pixel with an eventID AND (except Purchase) to POST /api/meta/events
 *   with the same event_id; the server forwards it to CAPI and Meta keeps one of the pair.
 *   Purchase is sent by the server when the payment is confirmed (event_id purchase_<orderId>);
 *   the success page only adds the browser half with that same id.
 * - Never runs during prerender, in the admin, or for bots. Never throws, never blocks the page.
 * - content_id = variant SKU, else product SKU, else product id (same rule as Server
 *   src/domain/metaCapi.ts), currency AUD.
 */
import { API_URL } from '../services/api';
import { isAutomatedVisitor } from './analytics';

const CONFIG_URL = `${API_URL}/api/meta/config`;
const EVENTS_URL = `${API_URL}/api/meta/events`;
const CONFIG_CACHE_KEY = 'meta_cfg';
const CONFIG_TTL_MS = 5 * 60 * 1000;
const SCRIPT_TIMEOUT_MS = 4000;
const CURRENCY = 'AUD';

let state = 'idle'; // idle | loading | ready | off
let pixelId = null;
let pending = []; // events fired before the config/script were ready

const isPrerendering = () => typeof window !== 'undefined' && window.__PRERENDER__ === true;
const appRole = import.meta.env.VITE_APP_ROLE || 'all';

function eligible() {
  try {
    if (typeof window === 'undefined' || isPrerendering()) return false;
    if (appRole === 'admin' || window.location.pathname.startsWith('/admin')) return false;
    return !isAutomatedVisitor();
  } catch {
    return false;
  }
}

const newEventId = (prefix) => {
  try {
    if (crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  } catch { /* fall through */ }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
};

const readCookie = (name) => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : undefined;
  } catch {
    return undefined;
  }
};

/** Meta browser ids for CAPI matching: _fbp, and _fbc (or one built from ?fbclid=). */
export function getMetaBrowserIds() {
  const fbp = readCookie('_fbp');
  let fbc = readCookie('_fbc');
  if (!fbc) {
    try {
      const fbclid = new URLSearchParams(window.location.search).get('fbclid');
      if (fbclid && /^[A-Za-z0-9_-]{8,500}$/.test(fbclid)) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch { /* ignore */ }
  }
  return { fbp, fbc };
}

async function readConfig() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CONFIG_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.at < CONFIG_TTL_MS) return cached;
  } catch { /* ignore */ }
  const res = await fetch(CONFIG_URL, { credentials: 'omit' });
  const cfg = await res.json();
  const out = { enabled: !!cfg?.enabled && /^\d{5,20}$/.test(String(cfg?.pixelId || '')), pixelId: cfg?.pixelId || null, at: Date.now() };
  try { sessionStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(out)); } catch { /* ignore */ }
  return out;
}

/** Meta's standard loader (fbq stub + fbevents.js), injected only when tracking is enabled. */
function loadPixelScript(id) {
  return new Promise((resolve) => {

    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; t.onload = () => resolve(true); t.onerror = () => resolve(false);
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Only the events sent below — no automatic button-click / page-metadata events
    window.fbq('set', 'autoConfig', false, id);
    window.fbq('init', id);
    setTimeout(() => resolve(false), SCRIPT_TIMEOUT_MS); // blocked by an ad blocker → relay still works
  });
}

function start() {
  if (state !== 'idle') return;
  state = 'loading';
  readConfig()
    .then(async (cfg) => {
      if (!cfg.enabled) { state = 'off'; pending = []; return; }
      pixelId = cfg.pixelId;
      await loadPixelScript(pixelId); // wait so _fbp exists for the relayed events
      state = 'ready';
      const queued = pending; pending = [];
      queued.forEach(send);
    })
    .catch(() => { state = 'off'; pending = []; });
}

function relay(name, eventId, params) {
  try {
    const { fbp, fbc } = getMetaBrowserIds();
    const body = JSON.stringify({ event_name: name, event_id: eventId, event_source_url: window.location.href, custom_data: params, fbp, fbc });
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon && navigator.sendBeacon(EVENTS_URL, blob)) return;
    fetch(EVENTS_URL, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true, credentials: 'omit' }).catch(() => {});
  } catch { /* tracking never breaks the page */ }
}

function send(evt) {
  try {
    if (typeof window.fbq === 'function') window.fbq('track', evt.name, evt.params, { eventID: evt.eventId });
  } catch { /* ignore */ }
  if (evt.relay) relay(evt.name, evt.eventId, evt.params);
}

/** Track a standard event (Pixel + CAPI relay with the same event_id). Returns the event_id. */
export function metaTrack(name, params = {}, { eventId, relay: doRelay = true } = {}) {
  if (!eligible()) return null;
  const evt = { name, params, eventId: eventId || newEventId(name.toLowerCase()), relay: doRelay };
  if (state === 'ready') send(evt);
  else if (state !== 'off') { pending.push(evt); start(); }
  return evt.eventId;
}

// ─── Ecommerce helpers ──────────────────────────────────────────────────────

const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.]/g, '')) : Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
};

/** Same rule as the server: variant SKU, else product SKU, else product id. */
export function metaContentId(product, variant) {
  const sku = String(variant?.sku || product?.sku || '').trim();
  return sku || String(product?._id || product?.id || '');
}

export const metaPageView = () => metaTrack('PageView');

export function metaViewContent(product, variant) {
  if (!product) return null;
  const id = metaContentId(product, variant);
  const price = num(variant?.price ?? product.price);
  return metaTrack('ViewContent', {
    content_ids: [id], content_type: 'product', content_name: product.name,
    contents: [{ id, quantity: 1, item_price: price }], value: price, currency: CURRENCY,
  });
}

export function metaAddToCart(product, variant, quantity = 1) {
  if (!product) return null;
  const id = metaContentId(product, variant);
  const price = num(variant?.price ?? product.price);
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  return metaTrack('AddToCart', {
    content_ids: [id], content_type: 'product', content_name: product.name,
    contents: [{ id, quantity: qty, item_price: price }], value: num(price * qty), currency: CURRENCY,
  });
}

/** Cart items as stored by CartContext ({ ...product, selectedVariant, quantity, price }). */
export function metaInitiateCheckout(cartItems) {
  const contents = (cartItems || []).map((i) => ({
    id: metaContentId(i, i.selectedVariant),
    quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
    item_price: num(i.selectedVariant?.price ?? i.price),
  })).filter((c) => c.id);
  if (!contents.length) return null;
  return metaTrack('InitiateCheckout', {
    content_ids: [...new Set(contents.map((c) => c.id))], content_type: 'product', contents,
    num_items: contents.reduce((s, c) => s + c.quantity, 0),
    value: num(contents.reduce((s, c) => s + c.item_price * c.quantity, 0)), currency: CURRENCY,
  });
}

const PURCHASE_KEY = 'meta_purchases';

/**
 * Browser half of Purchase, once per order on this device. The server sends the CAPI half with
 * the same event_id (purchase_<orderId>), so this is never relayed.
 * `order` = the public order view (grandTotal, metaContents).
 */
export function metaPurchase(order) {
  if (!order?._id) return null;
  let sent = [];
  try { sent = JSON.parse(localStorage.getItem(PURCHASE_KEY) || '[]'); } catch { /* ignore */ }
  if (Array.isArray(sent) && sent.includes(String(order._id))) return null;
  const contents = Array.isArray(order.metaContents) ? order.metaContents : [];
  const id = metaTrack('Purchase', {
    content_ids: [...new Set(contents.map((c) => c.id))], content_type: 'product', contents,
    num_items: contents.reduce((s, c) => s + (Number(c.quantity) || 1), 0),
    value: num(order.grandTotal ?? order.totalAmount), currency: CURRENCY,
  }, { eventId: `purchase_${order._id}`, relay: false });
  if (id) {
    try { localStorage.setItem(PURCHASE_KEY, JSON.stringify([...(Array.isArray(sent) ? sent : []), String(order._id)].slice(-20))); } catch { /* ignore */ }
  }
  return id;
}
