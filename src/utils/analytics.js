/**
 * analytics.js — Lightweight, fire-and-forget storefront event tracker.
 *
 * Rules:
 *  - Never throws. Never blocks. Never breaks the app.
 *  - Uses navigator.sendBeacon (non-blocking) with fetch fallback.
 *  - Generates and persists a sessionId in localStorage.
 */

import { API_URL } from '../services/api';
import { runWhenIdle } from './runWhenIdle';
const ENDPOINT = `${API_URL}/api/analytics/events`;

// prerender.js sets window.__PRERENDER__ before any script runs: never send analytics or
// call geo APIs while pages are being captured for the static build.
const isPrerendering = () => typeof window !== 'undefined' && window.__PRERENDER__ === true;

// ─── Session ID ───────────────────────────────────────────────────────────────

const SESSION_KEY = 'slat_sid';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let memorySessionId = null;

export function getSessionId() {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    try {
      let sid = sessionStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid = generateUUID();
        sessionStorage.setItem(SESSION_KEY, sid);
      }
      return sid;
    } catch {
      if (!memorySessionId) {
        memorySessionId = generateUUID();
      }
      return memorySessionId;
    }
  }
}

// ─── Location ─────────────────────────────────────────────────────────────────
// City-level location comes from an IP lookup (ipapi.co). It is approximate by nature (mobile
// networks often resolve to the carrier's hub city), but it is the only per-visitor source.
// When it is unavailable we record only what the timezone really tells us — never a guessed city.

const LOC_KEY = 'slat_loc';
const LOC_TTL_MS = 24 * 60 * 60 * 1000; // re-check daily (visitors move / change network)
const LOC_WAIT_MS = 2500;               // max time an event waits for the lookup

let locationCache = null;
let locationPromise = null;

// Timezone -> country (and state for Australia, where zones map to states). No city: e.g. all of
// India is "Asia/Kolkata", which used to label every Indian visitor "Kolkata, West Bengal".
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
    for (const [re, country, region] of TZ_COUNTRY) {
      if (re.test(tz)) return { country, region, city: '' };
    }
  } catch {
    // fall through
  }
  return { country: 'Unknown', region: '', city: '' };
}

function readCachedLocation() {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Entries without a timestamp were written by the old tracker (cached forever): refresh them
    if (!parsed || !parsed.at || Date.now() - parsed.at > LOC_TTL_MS) return null;
    return { country: parsed.country || 'Unknown', region: parsed.region || '', city: parsed.city || '' };
  } catch {
    return null;
  }
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
  if (cached) {
    locationCache = cached;
    return locationCache;
  }
  // Two free IP-lookup providers: the second is used when the first is blocked (some ad/privacy
  // blockers block ipapi.co) or rate-limited. Each lookup gives up after 3 s.
  for (const lookup of LOCATION_PROVIDERS) {
    try {
      const loc = await lookup();
      if (loc && loc.country) {
        locationCache = { country: loc.country, region: loc.region || '', city: loc.city || '' };
        try { localStorage.setItem(LOC_KEY, JSON.stringify({ ...locationCache, at: Date.now() })); } catch { /* ignore */ }
        return locationCache;
      }
    } catch {
      // blocked / network / rate-limit: try the next provider
    }
  }
  // Not cached, so the next visit retries the lookup
  locationCache = detectLocationFromTimezone();
  return locationCache;
}

/** Start the lookup once (on the first event or after page load, whichever comes first). */
function ensureLocation() {
  if (!locationPromise) locationPromise = fetchLocationDetails().catch(() => detectLocationFromTimezone());
  return locationPromise;
}

/** Location for an event: waits briefly for the lookup so the first page view is not mislabelled. */
async function getLocation() {
  if (locationCache) return locationCache;
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), LOC_WAIT_MS));
  return (await Promise.race([ensureLocation(), timeout])) || detectLocationFromTimezone();
}

// Warm the lookup after page load/idle so it is usually ready by the first interaction —
// skipped while prerendering
if (!isPrerendering()) {
  runWhenIdle(() => { ensureLocation(); });
}

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

/**
 * Called by the 404 screens (generic, unknown CMS page, unknown product) so the page view for a
 * URL that does not exist is not recorded (crawlers probe random URLs to test 404 handling).
 */
/**
 * The visitor's analytics session and detected location — sent with the checkout so the server's
 * (trusted) purchase event belongs to this visitor's session and shows where they are.
 */
export async function getVisitorContext() {
  try {
    const loc = await getLocation();
    return { sessionId: getSessionId(), country: loc.country, region: loc.region, city: loc.city };
  } catch {
    return { sessionId: getSessionId() };
  }
}

export function markNotFound() {
  try {
    if (typeof window !== 'undefined') window.__SLAT_NOT_FOUND_PATH__ = window.location.pathname;
  } catch {
    // ignore
  }
}

const isNotFoundPage = (path) => typeof window !== 'undefined' && window.__SLAT_NOT_FOUND_PATH__ === path;

// ─── Event Tracker ────────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 * @param {string} eventType - One of: page_view, product_view, add_to_cart, begin_checkout, purchase
 * @param {object} metadata  - Optional: { productId, orderId, country, region, city, cartValue, page }
 */
// Must match Server analytics.controller.ts VALID_EVENT_TYPES / ANALYTICS_MAX_STRING (400 otherwise).
export const VALID_EVENT_TYPES = ['page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'purchase'];
const MAX_STRING = 200;
const clipStrings = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string') out[k] = v.slice(0, MAX_STRING);
    else if (k === 'cartValue') {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1000000) out[k] = v;
    } else out[k] = v;
  }
  return out;
};

const send = (payload) => {
  // sendBeacon is non-blocking and survives page unloads
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    if (navigator.sendBeacon(ENDPOINT, blob)) return;
  }
  // Fetch fallback (keepalive = survives page close)
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {}); // swallow silently
};

export function trackEvent(eventType, metadata = {}) {
  if (isPrerendering()) return;
  if (!VALID_EVENT_TYPES.includes(eventType)) return; // server rejects anything else
  if (isAutomatedVisitor()) return;
  try {
    // The page the event happened on (add_to_cart / purchase used to be recorded as "/")
    const path = metadata.path || metadata.page || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const sessionId = getSessionId();
    const startedAt = Date.now();

    (async () => {
      try {
        const loc = await getLocation();
        if (eventType === 'page_view') {
          // Give a 404 screen time to mark itself before deciding (data-driven 404s render after a fetch)
          const waited = Date.now() - startedAt;
          if (waited < 1200) await new Promise((r) => setTimeout(r, 1200 - waited));
          if (isNotFoundPage(path)) return;
        }
        // Location fields come together from one source: the caller's or the visitor lookup —
        // never a mix such as one country with another lookup's city. Purchases use the visitor
        // lookup too (where the visitor is, not the shipping address).
        const callerLoc = metadata.country ? { country: metadata.country, region: metadata.region || '', city: metadata.city || '' } : null;
        const { country, region, city } = callerLoc || loc;
        send(JSON.stringify(clipStrings({
          sessionId,
          eventType,
          timestamp: new Date().toISOString(),
          ...metadata,
          country,
          region,
          city,
          page: path,
          path,
        })));
      } catch {
        // Never propagate analytics errors
      }
    })();
  } catch {
    // Never propagate analytics errors
  }
}
