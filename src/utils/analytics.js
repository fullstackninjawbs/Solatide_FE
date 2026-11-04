/**
 * analytics.js — storefront tracking (visitors, sessions, events, checkout progress).
 *
 * Definitions (same as Server/src/services/analytics/config.ts):
 *  - Visitor: this browser, a persistent anonymous ID (localStorage). Never merged with others.
 *  - Session: one visit. New after SESSION_TIMEOUT_MS without activity, or when the visitor
 *    arrives from a new campaign (UTM tags / ad click ID).
 *  - Checkout attempt: from opening checkout until the order is submitted; kept across sessions so
 *    a visitor who comes back later resumes the same attempt.
 *
 * Rules:
 *  - Never throws, never blocks, never breaks the app.
 *  - Every event gets a unique id: the server stores it once even if it is sent twice.
 *  - Page / product views are de-duplicated per history entry (re-renders, hydration and data
 *    refreshes don't count again; going back/forward is a real new view).
 *  - Events are batched (≈1 s) and sent with sendBeacon, so leaving the page doesn't lose them.
 *  - Order placed / payment confirmed / cancellations / refunds are recorded by the server.
 */

import { API_URL } from '../services/api';
import { runWhenIdle } from './runWhenIdle';

const ENDPOINT = `${API_URL}/api/analytics/collect`;
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const PING_EVERY_MS = 60 * 1000;
// "Active now" pings only while the visitor interacted recently (not for a forgotten open tab)
const PING_IF_INTERACTED_WITHIN_MS = 2 * 60 * 1000;
const FLUSH_DELAY_MS = 1000;
const MAX_BATCH = 30;

// prerender.js sets window.__PRERENDER__ before any script runs: never send analytics or
// call geo APIs while pages are being captured for the static build.
const isPrerendering = () => typeof window !== 'undefined' && window.__PRERENDER__ === true;
const hasWindow = () => typeof window !== 'undefined';

// ─── Storage helpers ──────────────────────────────────────────────────────────

const memory = {};
const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return memory[key] ?? null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { memory[key] = value; }
  },
  getJson(key) {
    try { return JSON.parse(this.get(key) || 'null'); } catch { return null; }
  },
  setJson(key, value) { this.set(key, JSON.stringify(value)); },
};

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

// ─── Visitor ──────────────────────────────────────────────────────────────────

const VISITOR_KEY = 'slat_vid';
// The previous tracker kept one permanent ID under this key: it becomes the visitor ID, so people
// who visited before this update are recognised as returning visitors.
const LEGACY_ID_KEY = 'slat_sid';

export function getVisitorId() {
  let id = store.get(VISITOR_KEY);
  if (!id || !ID_RE.test(id)) {
    const legacy = store.get(LEGACY_ID_KEY);
    id = legacy && ID_RE.test(legacy) ? legacy : uuid();
    store.set(VISITOR_KEY, id);
  }
  return id;
}

// ─── Session ──────────────────────────────────────────────────────────────────

const SESSION_KEY = 'slat_session';
const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid'];
const UTM_PARAMS = ['source', 'medium', 'campaign', 'content', 'term'];

// Captured once per page load: only the first page of a load has a real referrer / landing URL
const pageLoad = hasWindow()
  ? (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries(UTM_PARAMS.map((k) => [k, params.get(`utm_${k}`) || undefined]).filter(([, v]) => v));
      const clickIds = Object.fromEntries(CLICK_ID_PARAMS.map((k) => [k, params.get(k) || undefined]).filter(([, v]) => v));
      const campaign = [utm.source, utm.medium, utm.campaign, ...Object.keys(clickIds).map((k) => `${k}:${clickIds[k]}`)].filter(Boolean).join('|');
      return { referrer: document.referrer || '', landingPage: window.location.pathname, utm, clickIds, campaign, used: false };
    } catch {
      return { referrer: '', landingPage: '/', utm: {}, clickIds: {}, campaign: '', used: false };
    }
  })()
  : null;

const touchMac = () => {
  try { return navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent); } catch { return false; }
};

function newSession(now) {
  // The page-load referrer / campaign belongs to the first session of this page load only; a session
  // that restarts later inside the same tab (after the inactivity timeout) is a direct return.
  const fromLoad = pageLoad && !pageLoad.used;
  if (pageLoad) pageLoad.used = true;
  return {
    id: uuid(),
    startedAt: now,
    lastActivityAt: now,
    campaign: fromLoad ? pageLoad.campaign : '',
    context: {
      landingPage: hasWindow() ? window.location.pathname : '/',
      referrer: fromLoad ? pageLoad.referrer : '',
      utm: fromLoad ? pageLoad.utm : {},
      clickIds: fromLoad ? pageLoad.clickIds : {},
      touch: touchMac(),
    },
  };
}

/** The current session, rotating it after inactivity or when a new campaign arrives. */
function currentSession({ touch = true } = {}) {
  const now = Date.now();
  let s = store.getJson(SESSION_KEY);
  const expired = !s || !ID_RE.test(s.id || '') || now - (s.lastActivityAt || 0) > SESSION_TIMEOUT_MS;
  const newCampaign = pageLoad && !pageLoad.used && pageLoad.campaign && s && pageLoad.campaign !== s.campaign;
  if (expired || newCampaign) {
    s = newSession(now);
  } else if (pageLoad && !pageLoad.used) {
    pageLoad.used = true; // continuing the same session after a reload
  }
  if (touch) s.lastActivityAt = now;
  store.setJson(SESSION_KEY, s);
  return s;
}

/** Current session ID (also sent with the checkout so the order joins this visit). */
export function getSessionId() {
  return currentSession({ touch: false }).id;
}

// ─── Location (fallback) ──────────────────────────────────────────────────────
// The server looks the location up from the IP (local GeoIP database). Until that database is
// installed, the browser's own lookup below is sent along and used instead.

const LOC_KEY = 'slat_loc';
const LOC_TTL_MS = 24 * 60 * 60 * 1000;
let locationCache = null;
let locationPromise = null;

const TZ_COUNTRY = [
  [/^Asia\/(Kolkata|Calcutta)$/, 'India', ''],
  [/^Australia\/(Sydney|ACT|Canberra|NSW)$/, 'Australia', 'New South Wales'],
  [/^Australia\/(Melbourne|Victoria)$/, 'Australia', 'Victoria'],
  [/^Australia\/(Brisbane|Queensland|Lindeman)$/, 'Australia', 'Queensland'],
  [/^Australia\/(Perth|West)$/, 'Australia', 'Western Australia'],
  [/^Australia\/(Adelaide|South)$/, 'Australia', 'South Australia'],
  [/^Australia\/(Hobart|Tasmania)$/, 'Australia', 'Tasmania'],
  [/^Australia\/(Darwin|North)$/, 'Australia', 'Northern Territory'],
  [/^Australia\//, 'Australia', ''],
  [/^Pacific\/Auckland$/, 'New Zealand', ''],
  [/^Europe\/London$/, 'United Kingdom', ''],
  [/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage)$/, 'United States', ''],
  [/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax)$/, 'Canada', ''],
  [/^Asia\/Singapore$/, 'Singapore', ''],
];

function detectLocationFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    for (const [re, country, region] of TZ_COUNTRY) if (re.test(tz)) return { country, region, city: '' };
  } catch { /* fall through */ }
  return null;
}

function readCachedLocation() {
  const parsed = store.getJson(LOC_KEY);
  if (!parsed || !parsed.at || Date.now() - parsed.at > LOC_TTL_MS) return null;
  return { country: parsed.country || '', region: parsed.region || '', city: parsed.city || '' };
}

const fetchJson = async (url) => {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), 3000) : null;
  try {
    const res = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
    return res.ok ? await res.json() : null;
  } finally {
    if (t) clearTimeout(t);
  }
};

const LOCATION_PROVIDERS = [
  async () => {
    const d = await fetchJson('https://ipapi.co/json/');
    return d && !d.error ? { country: d.country_name || d.country, region: d.region, city: d.city } : null;
  },
  async () => {
    const d = await fetchJson('https://get.geojs.io/v1/ip/geo.json');
    return d ? { country: d.country, region: d.region, city: d.city } : null;
  },
];

async function fetchLocationDetails() {
  const cached = readCachedLocation();
  if (cached) return (locationCache = cached);
  for (const lookup of LOCATION_PROVIDERS) {
    try {
      const loc = await lookup();
      if (loc && loc.country) {
        locationCache = { country: loc.country, region: loc.region || '', city: loc.city || '' };
        store.setJson(LOC_KEY, { ...locationCache, at: Date.now() });
        return locationCache;
      }
    } catch { /* blocked / network / rate-limit: try the next provider */ }
  }
  locationCache = detectLocationFromTimezone();
  return locationCache;
}

function ensureLocation() {
  if (!locationPromise) locationPromise = fetchLocationDetails().catch(() => detectLocationFromTimezone());
  return locationPromise;
}

if (hasWindow() && !isPrerendering()) runWhenIdle(() => { ensureLocation(); });

// ─── Bots & 404s ──────────────────────────────────────────────────────────────

const BOT_UA = /bot\b|crawler|spider|crawling|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|preview|facebookexternalhit|slurp|bingpreview|ahrefs|semrush|mj12|dotbot|petalbot|yandex|baidu|python-requests|curl\/|wget\//i;

function isAutomatedVisitor() {
  try {
    if (typeof navigator === 'undefined') return true;
    if (navigator.webdriver) return true; // Selenium / Puppeteer / Playwright
    return BOT_UA.test(navigator.userAgent || '');
  } catch {
    return false;
  }
}

const trackingOff = () => !hasWindow() || isPrerendering() || isAutomatedVisitor();

/**
 * Called by the 404 screens so the page view for a URL that does not exist is not recorded
 * (crawlers probe random URLs to test 404 handling).
 */
export function markNotFound() {
  try { if (hasWindow()) window.__SLAT_NOT_FOUND_PATH__ = window.location.pathname; } catch { /* ignore */ }
}
const isNotFoundPage = (path) => hasWindow() && window.__SLAT_NOT_FOUND_PATH__ === path;

// ─── Queue & sending ──────────────────────────────────────────────────────────

let queue = []; // { sessionId, context, event }
let flushTimer = null;

// Outbox: queued events are also kept in localStorage until they were sent from a live page.
// Events sent while the page closes (beacon on pagehide) stay in it, and the next page load sends
// them again — beacons are "best effort" and can be dropped during a reload. The server ignores an
// event id it already has, so a re-send never double-counts. Older than OUTBOX_MAX_AGE_MS = dropped.
const OUTBOX_KEY = 'slat_outbox';
const OUTBOX_MAX_AGE_MS = 15 * 60 * 1000;
const OUTBOX_MAX_ITEMS = 100;
const saveOutbox = (items) => {
  try {
    if (items.length) store.setJson(OUTBOX_KEY, items.slice(-OUTBOX_MAX_ITEMS));
    else localStorage.removeItem(OUTBOX_KEY);
  } catch { /* storage unavailable: events are still sent normally */ }
};
const readOutbox = () => {
  const items = store.getJson(OUTBOX_KEY);
  return Array.isArray(items) ? items.filter((it) => it && it.event && Date.now() - it.event.ts < OUTBOX_MAX_AGE_MS) : [];
};

// Sent as text/plain (JSON inside): a "simple" cross-origin request needs no CORS preflight, so
// events sent while the page is closing (sendBeacon on pagehide) are not dropped by the browser.
const send = (payload) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: payload, keepalive: true }).catch(() => {});
  } catch { /* never propagate */ }
};

/** @param {boolean} [closing] page is being hidden/unloaded: keep the events in the outbox */
function flush(closing = false) {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!queue.length) return;
  const items = queue;
  queue = [];
  saveOutbox(closing ? items : []);
  const visitorId = getVisitorId();
  const now = Date.now();
  // One request per session (a session can rotate while events wait)
  const bySession = new Map();
  for (const it of items) {
    if (!bySession.has(it.sessionId)) bySession.set(it.sessionId, { context: it.context, events: [] });
    bySession.get(it.sessionId).events.push({ ...it.event, ageMs: Math.min(OUTBOX_MAX_AGE_MS, Math.max(0, now - it.event.ts)), ts: undefined });
  }
  for (const [sessionId, { context, events }] of bySession) {
    for (let i = 0; i < events.length; i += MAX_BATCH) {
      send(JSON.stringify({ visitorId, sessionId, context: withLocation(context), events: events.slice(i, i + MAX_BATCH) }));
    }
  }
}

const withLocation = (context) => (locationCache ? { ...context, location: locationCache } : context);

function scheduleFlush() {
  if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_DELAY_MS);
}

function enqueue(type, data = {}) {
  if (trackingOff()) return;
  try {
    const session = currentSession();
    const event = { id: uuid(), type, ts: Date.now(), path: data.path || window.location.pathname, ...data };
    queue.push({ sessionId: session.id, context: session.context, event });
    saveOutbox(queue);
    scheduleFlush();
  } catch { /* never propagate */ }
}

// ─── Activity ping ("active now") ─────────────────────────────────────────────

let lastInteractionAt = Date.now();
if (hasWindow() && !isPrerendering()) {
  const markInteraction = () => { lastInteractionAt = Date.now(); };
  try {
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((t) => window.addEventListener(t, markInteraction, { passive: true }));
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
    window.addEventListener('pagehide', () => flush(true));
    // Events from the previous page that may not have been delivered (see Outbox): send them again
    if (!trackingOff()) {
      const pending = readOutbox();
      if (pending.length) {
        queue = [...pending, ...queue];
        scheduleFlush();
      } else {
        saveOutbox([]);
      }
    }
    setInterval(() => {
      if (trackingOff() || document.visibilityState !== 'visible') return;
      if (Date.now() - lastInteractionAt > PING_IF_INTERACTED_WITHIN_MS) return;
      const session = currentSession();
      send(JSON.stringify({ visitorId: getVisitorId(), sessionId: session.id, context: withLocation(session.context), ping: true }));
    }, PING_EVERY_MS);
  } catch { /* ignore */ }
}

// ─── Page & product views ─────────────────────────────────────────────────────

let lastPageKey = null;
const productViewKeys = new Set();

/**
 * Page view for a history entry. `key` = react-router location.key: the same entry is counted once
 * (re-renders / hydration), a new navigation or back/forward to another entry counts again.
 */
export function trackPageView(path, key) {
  if (trackingOff()) return;
  const k = `${key || ''}|${path}`;
  if (k === lastPageKey) return;
  lastPageKey = k;
  // Give a 404 screen time to mark itself (data-driven 404s render after a fetch)
  setTimeout(() => { if (!isNotFoundPage(path)) enqueue('page_view', { path }); }, 1200);
}

/** Product view, once per history entry and product (data refreshes don't count again). */
export function trackProductView(product, key) {
  if (trackingOff() || !product) return;
  const id = product._id || product.id;
  const k = `${key || window.location.pathname}|${id}`;
  if (productViewKeys.has(k)) return;
  productViewKeys.add(k);
  enqueue('product_view', {
    productId: id,
    productName: product.name,
    productImage: productImageOf(product),
    value: priceOf(product.price),
  });
}

export function trackVariantSelect(product, variant) {
  if (!product || !variant) return;
  enqueue('variant_select', {
    productId: product._id || product.id,
    productName: product.name,
    productImage: productImageOf(product),
    variantId: variantIdOf(variant),
    variantTitle: variantTitleOf(variant),
    value: priceOf(variant.price),
  });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

const priceOf = (p) => {
  if (typeof p === 'number') return Number.isFinite(p) ? p : undefined;
  if (typeof p === 'string') {
    const m = p.replace(/,/g, '').match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : undefined;
  }
  return undefined;
};
const productImageOf = (p) => p?.imageUrl || p?.image || p?.images?.[0]?.url || p?.images?.[0] || undefined;
const variantIdOf = (v) => (v ? String(v._id || v.id || v.sku || '') || undefined : undefined);
const variantTitleOf = (v) => (v ? v.title || v.name || [v.option1, v.option2, v.option3].filter(Boolean).join(' / ') || undefined : undefined);
const productPathOf = (p) => (p?.slug ? `/products/${p.slug}` : undefined);

/** Cart contents as the server stores them (live cart in the visitor panel). */
export function cartSnapshot(cartItems) {
  const items = (cartItems || []).slice(0, 25).map((i) => ({
    productId: i._id || i.id,
    variantId: variantIdOf(i.selectedVariant),
    name: i.name || i.title,
    variantTitle: variantTitleOf(i.selectedVariant),
    image: typeof productImageOf(i) === 'string' ? productImageOf(i) : undefined,
    path: productPathOf(i),
    quantity: i.quantity,
    unitPrice: priceOf(i.price),
  }));
  return { items };
}

/**
 * Cart change after the cart state was updated (CartContext): add_to_cart, remove_from_cart or
 * cart_quantity_change, with the item and the full cart.
 */
export function trackCartChange(type, item, quantityDelta, cartItems) {
  if (!item) return;
  const unit = priceOf(item.price);
  enqueue(type, {
    productId: item._id || item.id,
    productName: item.name || item.title,
    productImage: typeof productImageOf(item) === 'string' ? productImageOf(item) : undefined,
    variantId: variantIdOf(item.selectedVariant),
    variantTitle: variantTitleOf(item.selectedVariant),
    quantity: quantityDelta,
    value: unit !== undefined ? Math.round(unit * Math.abs(quantityDelta) * 100) / 100 : undefined,
    cart: cartSnapshot(cartItems),
  });
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

const CHECKOUT_KEY = 'slat_checkout';

/** The open checkout attempt's ID (kept until its order is submitted). */
export function getCheckoutId() {
  let c = store.getJson(CHECKOUT_KEY);
  if (!c || !ID_RE.test(c.id || '')) {
    c = { id: uuid(), stages: [] };
    store.setJson(CHECKOUT_KEY, c);
  }
  return c.id;
}

const checkoutState = () => {
  getCheckoutId();
  return store.getJson(CHECKOUT_KEY);
};

/** Checkout opened: once per attempt (refreshing the checkout page doesn't start a new one). */
export function trackBeginCheckout(cartItems) {
  if (trackingOff() || !(cartItems || []).length) return;
  const c = checkoutState();
  if (c.started) {
    // Same attempt: just record activity (and resume it if the visitor left and came back)
    enqueue('checkout_step', { checkoutId: c.id, cart: cartSnapshot(cartItems) });
    return;
  }
  c.started = true;
  store.setJson(CHECKOUT_KEY, c);
  enqueue('begin_checkout', { checkoutId: c.id, cart: cartSnapshot(cartItems) });
}

/**
 * Stage reached: 'information' (contact details entered), 'shipping' (address complete),
 * 'payment' (method chosen and Place order clicked). Each stage is sent once per attempt; contact
 * details (email / name / country) are sent so an abandoned checkout shows who it was.
 */
export function trackCheckoutStage(stage, { contact, paymentMethod, cartItems } = {}) {
  if (trackingOff()) return;
  const c = checkoutState();
  if ((c.stages || []).includes(stage)) return;
  c.stages = [...(c.stages || []), stage];
  store.setJson(CHECKOUT_KEY, c);
  enqueue('checkout_step', { checkoutId: c.id, stage, contact, paymentMethod, ...(cartItems ? { cart: cartSnapshot(cartItems) } : {}) });
}

/** Contact details changed after the stage was reached (e.g. corrected email). */
export function trackCheckoutContact(contact) {
  if (trackingOff() || !contact) return;
  const c = checkoutState();
  enqueue('checkout_step', { checkoutId: c.id, contact });
}

/** Validation / submit problem: which fields or what the server said, never what was typed. */
export function trackCheckoutError(stage, message) {
  if (trackingOff()) return;
  enqueue('checkout_error', { checkoutId: checkoutState().id, stage, error: String(message || '').slice(0, 200) });
}

/** Order submitted: the server records it; the next checkout is a new attempt. */
export function finishCheckout() {
  flush();
  store.setJson(CHECKOUT_KEY, null);
}

/**
 * IDs + detected location sent with the checkout, so the server's order events (placed, paid,
 * cancelled, refunded) join this visitor, session and checkout attempt.
 */
export async function getVisitorContext() {
  const ids = { sessionId: getSessionId(), visitorId: getVisitorId(), checkoutId: getCheckoutId() };
  try {
    flush(); // checkout progress first, so the attempt exists before the order arrives
    const loc = locationCache || (await Promise.race([ensureLocation(), new Promise((r) => setTimeout(() => r(null), 1500))]));
    return loc ? { ...ids, country: loc.country, region: loc.region, city: loc.city } : ids;
  } catch {
    return ids;
  }
}

// ─── Previous API (kept for existing callers) ─────────────────────────────────

/**
 * @deprecated use the specific helpers above. Kept so older call sites keep working:
 * page_view / product_view / add_to_cart / begin_checkout map to the new events; 'purchase' is
 * ignored (the server records order placed and payment confirmed).
 */
export const VALID_EVENT_TYPES = ['page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'purchase'];
export function trackEvent(eventType, metadata = {}) {
  if (eventType === 'page_view') return trackPageView(metadata.path || metadata.page || (hasWindow() ? window.location.pathname : '/'));
  if (eventType === 'product_view') return enqueue('product_view', { productId: metadata.productId, productName: metadata.productName, path: metadata.path });
  if (eventType === 'add_to_cart') return enqueue('add_to_cart', { productId: metadata.productId, productName: metadata.productName, value: metadata.cartValue, path: metadata.path });
  if (eventType === 'begin_checkout') return undefined; // trackBeginCheckout (needs the cart)
  return undefined;
}
