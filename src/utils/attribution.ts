/**
 * Attribution Utility for Solatide Custom Storefront
 */

export interface AttributionTouch {
  source: string;
  channel: string;
  sourceDomain: string;
  referrerUrl: string;
  landingPage: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  utmId?: string;

  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;

  sessionId: string;
  capturedAt: Date;
}

export interface AttributionPayload {
  firstTouch?: AttributionTouch;
  lastTouch?: AttributionTouch;
}

const COOKIE_FIRST_TOUCH = 'attribution_first_touch';
const COOKIE_LAST_TOUCH = 'attribution_last_touch';
const SESSION_ID_KEY = 'solatide_session_id';

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  let sessionId = '';
  try {
    sessionId = localStorage.getItem(SESSION_ID_KEY) || '';
  } catch (e) {}

  if (!sessionId) {
    sessionId = generateSessionId();
    try {
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    } catch (e) {}
  }
  return sessionId;
}

/**
 * Set a cookie
 */
function setCookie(name: string, value: string, days: number) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

/**
 * Get a cookie
 */
function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

/**
 * Parse URL params
 */
function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Classify Attribution based on priority rules
 */
export function classifyAttribution(input: {
  referrerUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
}): { source: string; channel: string; sourceDomain: string } {
  let { referrerUrl, utmSource, utmMedium, gclid, fbclid, ttclid, msclkid } = input;

  const s = (utmSource || '').toLowerCase();
  const m = (utmMedium || '').toLowerCase();

  let refHostname = '';
  try {
    if (referrerUrl) {
      refHostname = new URL(referrerUrl).hostname.toLowerCase();
    }
  } catch (e) {}

  // 1. Email
  if (m === 'email') {
    return { source: 'Email', channel: 'email', sourceDomain: refHostname };
  }

  // 2. Google Ads
  const isGooglePaid =
    gclid ||
    (s.includes('google') &&
      ['cpc', 'ppc', 'paid_search', 'paid'].includes(m));

  if (isGooglePaid) {
    return { source: 'Google Ads', channel: 'paid_search', sourceDomain: refHostname };
  }

  // 3. Meta (Facebook/Instagram Ads)
  const isMetaPaid =
    ((s.includes('facebook') || s.includes('instagram') || s.includes('fb') || s.includes('ig')) &&
      ['cpc', 'paid', 'paid_social'].includes(m)) ||
    (fbclid && ['cpc', 'paid', 'paid_social'].includes(m)); // Note: Just fbclid without UTMs could be organic share, but the prompt says "fbclid is present with a paid-social UTM/campaign signal". Wait, the prompt says "OR fbclid is present with a paid-social UTM/campaign signal". If fbclid is present without UTMs, we'll fall back to Facebook Organic unless m is paid. But wait, many ads drop UTMs. Let's strictly follow: fbclid + paid UTM signal. Actually, the rule says "If Meta source + utm_medium is cpc... OR fbclid is present with a paid-social UTM/campaign signal". Let's use:
  
  const hasPaidSocialSignal = ['cpc', 'paid', 'paid_social'].includes(m);
  const isMetaSource = s.includes('facebook') || s.includes('instagram') || s.includes('fb') || s.includes('ig') || s.includes('meta');

  if ((isMetaSource && hasPaidSocialSignal) || (fbclid && hasPaidSocialSignal)) {
    return { source: s.includes('instagram') || s.includes('ig') ? 'Instagram Ads' : 'Facebook Ads', channel: 'paid_social', sourceDomain: refHostname };
  }

  // 4. TikTok Ads
  const isTikTokPaid = ttclid || (s.includes('tiktok') && hasPaidSocialSignal);
  if (isTikTokPaid) {
    return { source: 'TikTok Ads', channel: 'paid_social', sourceDomain: refHostname };
  }

  // 5. Microsoft Ads (Bing)
  if (msclkid || (s.includes('bing') && hasPaidSocialSignal)) {
    return { source: 'Microsoft Ads', channel: 'paid_search', sourceDomain: refHostname };
  }

  // Organic Search (Google / Bing / Yahoo)
  const isSearchEngine =
    s.includes('google') ||
    refHostname.includes('google.') ||
    s.includes('bing') ||
    refHostname.includes('bing.com') ||
    s.includes('yahoo') ||
    refHostname.includes('yahoo.com');

  if (isSearchEngine) {
    let sourceName = 'Organic Search';
    if (s.includes('google') || refHostname.includes('google.')) sourceName = 'Google Organic';
    if (s.includes('bing') || refHostname.includes('bing.com')) sourceName = 'Bing Organic';
    if (s.includes('yahoo') || refHostname.includes('yahoo.com')) sourceName = 'Yahoo Organic';
    return { source: sourceName, channel: 'organic_search', sourceDomain: refHostname };
  }

  // Organic Social (Meta)
  if (refHostname.includes('facebook.com') || refHostname.includes('instagram.com') || (fbclid && !hasPaidSocialSignal)) {
    let sourceName = 'Facebook Organic';
    if (refHostname.includes('instagram.com')) sourceName = 'Instagram Organic';
    return { source: sourceName, channel: 'organic_social', sourceDomain: refHostname };
  }

  // Organic Social (TikTok)
  if (refHostname.includes('tiktok.com') || (s.includes('tiktok') && !hasPaidSocialSignal)) {
    return { source: 'TikTok', channel: 'organic_social', sourceDomain: refHostname };
  }

  // ChatGPT
  if (refHostname.includes('chatgpt.com') || s.includes('chatgpt')) {
    return { source: 'ChatGPT', channel: 'referral', sourceDomain: refHostname };
  }

  // Other UTM Source
  if (s) {
    // If it has a source but didn't match known engines/socials
    let chan = m || 'referral';
    return { source: utmSource || 'Unknown Source', channel: chan, sourceDomain: refHostname };
  }

  // Generic Referral
  if (refHostname && !refHostname.includes(window.location.hostname)) {
    return { source: 'Another website/referral', channel: 'referral', sourceDomain: refHostname };
  }

  // Direct / Unknown
  return { source: 'Direct / Unknown', channel: 'direct', sourceDomain: '' };
}

/**
 * Capture attribution on page load
 */
export function captureAttribution() {
  const params = getUrlParams();
  
  const utmSource = params.get('utm_source') || undefined;
  const utmMedium = params.get('utm_medium') || undefined;
  const utmCampaign = params.get('utm_campaign') || undefined;
  const utmContent = params.get('utm_content') || undefined;
  const utmTerm = params.get('utm_term') || undefined;
  const utmId = params.get('utm_id') || undefined;

  const gclid = params.get('gclid') || undefined;
  const fbclid = params.get('fbclid') || undefined;
  const ttclid = params.get('ttclid') || undefined;
  const msclkid = params.get('msclkid') || undefined;

  const referrerUrl = document.referrer || '';
  const landingPage = window.location.href;
  const sessionId = getSessionId();

  // If no external signals, we don't necessarily update last touch
  // unless we want to track every page view. The rules say:
  // "update when a new external/UTM/click-ID visit occurs"
  const hasExternalSignal = !!(
    utmSource ||
    gclid || fbclid || ttclid || msclkid ||
    (referrerUrl && !referrerUrl.includes(window.location.hostname))
  );

  const { source, channel, sourceDomain } = classifyAttribution({
    referrerUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    gclid,
    fbclid,
    ttclid,
    msclkid
  });

  const currentTouch: AttributionTouch = {
    source,
    channel,
    sourceDomain,
    referrerUrl,
    landingPage,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    utmId,
    gclid,
    fbclid,
    ttclid,
    msclkid,
    sessionId,
    capturedAt: new Date()
  };

  const storedFirst = getCookie(COOKIE_FIRST_TOUCH) || (typeof localStorage !== 'undefined' ? localStorage.getItem(COOKIE_FIRST_TOUCH) : null);
  
  // 1. First Touch
  if (!storedFirst) {
    const dataStr = JSON.stringify(currentTouch);
    setCookie(COOKIE_FIRST_TOUCH, dataStr, 90);
    try { localStorage.setItem(COOKIE_FIRST_TOUCH, dataStr); } catch (e) {}
  } else {
    // Check if the stored first touch is "Direct / Unknown" and we now have a better signal.
    try {
      const parsedFirst = JSON.parse(storedFirst);
      if (parsedFirst.source === 'Direct / Unknown' && hasExternalSignal) {
        // Overwrite the weak "Direct / Unknown" with the new strong signal
        const dataStr = JSON.stringify(currentTouch);
        setCookie(COOKIE_FIRST_TOUCH, dataStr, 90);
        try { localStorage.setItem(COOKIE_FIRST_TOUCH, dataStr); } catch (e) {}
      }
    } catch (e) {}
  }

  // 2. Last Touch
  if (hasExternalSignal || (!getCookie(COOKIE_LAST_TOUCH) && typeof localStorage !== 'undefined' && !localStorage.getItem(COOKIE_LAST_TOUCH))) {
    const dataStr = JSON.stringify(currentTouch);
    setCookie(COOKIE_LAST_TOUCH, dataStr, 90);
    try { localStorage.setItem(COOKIE_LAST_TOUCH, dataStr); } catch (e) {}
  }
}

/**
 * Retrieve current payload for API
 */
export function getCheckoutAttributionPayload(): AttributionPayload {
  let firstTouch: AttributionTouch | undefined = undefined;
  let lastTouch: AttributionTouch | undefined = undefined;

  try {
    const firstStr = getCookie(COOKIE_FIRST_TOUCH) || localStorage.getItem(COOKIE_FIRST_TOUCH);
    if (firstStr) firstTouch = JSON.parse(firstStr);

    const lastStr = getCookie(COOKIE_LAST_TOUCH) || localStorage.getItem(COOKIE_LAST_TOUCH);
    if (lastStr) lastTouch = JSON.parse(lastStr);
  } catch (e) {
    console.error('Error parsing attribution data', e);
  }

  return { firstTouch, lastTouch };
}
