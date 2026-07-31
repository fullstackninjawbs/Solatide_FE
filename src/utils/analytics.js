/**
 * analytics.js — Lightweight, fire-and-forget storefront event tracker.
 *
 * Rules:
 *  - Never throws. Never blocks. Never breaks the app.
 *  - Uses navigator.sendBeacon (non-blocking) with fetch fallback.
 *  - Generates and persists a sessionId in localStorage.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const ENDPOINT = `${API_URL}/api/analytics/events`;

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

export function getSessionId() {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return generateUUID(); // Private browsing fallback
  }
}

function detectClientCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Asia/Colombo') || tz.includes('Asia/Kathmandu') || tz.includes('Asia/Karachi')) return 'India';
    if (tz.includes('Australia') || tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane') || tz.includes('Perth')) return 'Australia';
    if (tz.includes('America') || tz.includes('US/') || tz.includes('New_York') || tz.includes('Los_Angeles')) return 'United States';
    if (tz.includes('Europe/London')) return 'United Kingdom';
    if (tz.includes('Canada') || tz.includes('Toronto') || tz.includes('Vancouver')) return 'Canada';
    
    const lang = (navigator.language || '').toUpperCase();
    if (lang.includes('IN')) return 'India';
    if (lang.includes('AU')) return 'Australia';
    if (lang.includes('US')) return 'United States';
    if (lang.includes('GB') || lang.includes('UK')) return 'United Kingdom';
    if (lang.includes('CA')) return 'Canada';
  } catch {}
  return 'India';
}

// ─── Event Tracker ────────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 * @param {string} eventType - One of: page_view, product_view, add_to_cart, begin_checkout, purchase
 * @param {object} metadata  - Optional: { productId, orderId, country, cartValue, page }
 */
export function trackEvent(eventType, metadata = {}) {
  try {
    const payload = JSON.stringify({
      sessionId: getSessionId(),
      eventType,
      timestamp: new Date().toISOString(),
      country: metadata.country || detectClientCountry(),
      ...metadata,
    });

    // sendBeacon is non-blocking and survives page unloads
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(ENDPOINT, blob);
      if (sent) return;
    }

    // Fetch fallback (keepalive = survives page close)
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {}); // swallow silently
  } catch {
    // Never propagate analytics errors
  }
}
