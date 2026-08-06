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

let locationCache = null;

function detectLocationFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    let country = 'Australia';
    let region = '';
    let city = '';

    if (tz.includes('Kolkata') || tz.includes('Calcutta')) {
      country = 'India';
      region = 'West Bengal';
      city = 'Kolkata';
    } else if (tz.includes('Delhi') || tz.includes('Mumbai') || tz.includes('Asia/Kolkata')) {
      country = 'India';
      region = 'Delhi';
      city = 'Delhi';
    } else if (tz.includes('Sydney')) {
      country = 'Australia';
      region = 'New South Wales';
      city = 'Sydney';
    } else if (tz.includes('Melbourne')) {
      country = 'Australia';
      region = 'Victoria';
      city = 'Melbourne';
    } else if (tz.includes('Brisbane')) {
      country = 'Australia';
      region = 'Queensland';
      city = 'Brisbane';
    } else if (tz.includes('Perth')) {
      country = 'Australia';
      region = 'Western Australia';
      city = 'Perth';
    } else if (tz.includes('Adelaide')) {
      country = 'Australia';
      region = 'South Australia';
      city = 'Adelaide';
    } else if (tz.includes('New_York')) {
      country = 'United States';
      region = 'New York';
      city = 'New York';
    } else if (tz.includes('Los_Angeles')) {
      country = 'United States';
      region = 'California';
      city = 'Los Angeles';
    } else if (tz.includes('Chicago')) {
      country = 'United States';
      region = 'Illinois';
      city = 'Chicago';
    } else if (tz.includes('London')) {
      country = 'United Kingdom';
      region = 'England';
      city = 'London';
    } else if (tz.includes('Toronto')) {
      country = 'Canada';
      region = 'Ontario';
      city = 'Toronto';
    } else if (tz.includes('Vancouver')) {
      country = 'Canada';
      region = 'British Columbia';
      city = 'Vancouver';
    } else {
      // Split timezone
      const parts = tz.split('/');
      if (parts.length > 1) {
        city = parts[1].replace('_', ' ');
      }
    }
    return { country, region, city };
  } catch {
    return { country: 'Australia', region: '', city: '' };
  }
}

// Initialize location retrieval
async function fetchLocationDetails() {
  try {
    // Check localStorage first
    const cached = localStorage.getItem('slat_loc');
    if (cached) {
      locationCache = JSON.parse(cached);
      return;
    }

    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      locationCache = {
        country: data.country_name || data.country || 'Australia',
        region: data.region || '',
        city: data.city || ''
      };
      localStorage.setItem('slat_loc', JSON.stringify(locationCache));
    } else {
      locationCache = detectLocationFromTimezone();
    }
  } catch (err) {
    locationCache = detectLocationFromTimezone();
  }
}

// Call it immediately (fire and forget)
fetchLocationDetails().catch(() => {});

// ─── Event Tracker ────────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 * @param {string} eventType - One of: page_view, product_view, add_to_cart, begin_checkout, purchase
 * @param {object} metadata  - Optional: { productId, orderId, country, cartValue, page }
 */
export function trackEvent(eventType, metadata = {}) {
  try {
    const loc = locationCache || detectLocationFromTimezone();
    const payload = JSON.stringify({
      sessionId: getSessionId(),
      eventType,
      timestamp: new Date().toISOString(),
      country: metadata.country || loc.country,
      region: metadata.region || loc.region,
      city: metadata.city || loc.city,
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
