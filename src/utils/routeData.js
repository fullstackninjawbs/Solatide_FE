/**
 * Per-route initial data embedded by prerender.js.
 *
 * prerender.js captures the public GET /api/* responses a route used while it
 * was rendered in Puppeteer and embeds them (slimmed) as
 *   <script type="application/json" id="__INITIAL_ROUTE_DATA__">{"route":"/x","data":{"/api/...": {...}}}</script>
 *
 * Components read that data synchronously in their useState initialisers so the
 * very first client render produces exactly the DOM that was prerendered, which
 * lets hydrateRoot keep the prerendered nodes instead of discarding them.
 *
 * Keys are the API path + query string exactly as requested by the client
 * (e.g. "/api/products/bpc-157-10mg", "/api/products?limit=12").
 */

export const ROUTE_DATA_SCRIPT_ID = '__INITIAL_ROUTE_DATA__';

let cache = null;

const loadRouteData = () => {
    if (cache) return cache;
    cache = { route: null, data: {} };
    if (typeof document === 'undefined') return cache;
    const el = document.getElementById(ROUTE_DATA_SCRIPT_ID);
    if (!el || !el.textContent) return cache;
    try {
        const parsed = JSON.parse(el.textContent);
        if (parsed && typeof parsed === 'object' && parsed.data && typeof parsed.data === 'object') {
            cache = { route: parsed.route || null, data: parsed.data };
        }
    } catch {
        // Corrupt payload: behave as if no data was embedded (components fetch normally).
    }
    return cache;
};

/** Returns the embedded JSON body for an API key, or undefined. */
export const getRouteData = (key) => {
    const { data } = loadRouteData();
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : undefined;
};

/** True when the page is being captured by prerender.js (set via evaluateOnNewDocument). */
export const isPrerendering = () => typeof window !== 'undefined' && window.__PRERENDER__ === true;

/**
 * Fields that must never be embedded in HTML and are never rendered by the storefront.
 * Kept in sync with prerender.js (which applies the same list before embedding).
 */
export const INTERNAL_FIELDS = [
    'costPerItem',
    'tagadaSync',
    'syncStatus',
    'pendingBatchDocs',
    'slugHistory',
    'hsCode',
    'lowStockThreshold',
    'cloudinarySync',
    'tagadaProductId',
    'tagadaPriceId',
    'barcode',
    'tagadaUpdatedAt',
    '__v',
    // Reviews: never embed contact details or verification secrets.
    'email',
    'customerEmail',
    'reviewerEmail',
    'verificationToken',
    'verifyToken',
    'ipAddress',
];

const INTERNAL_SET = new Set(INTERNAL_FIELDS);

/** Recursively removes INTERNAL_FIELDS so a freshly fetched payload can be compared with embedded data. */
export const stripInternal = (value) => {
    if (Array.isArray(value)) return value.map(stripInternal);
    if (value && typeof value === 'object') {
        const out = {};
        for (const key of Object.keys(value)) {
            if (INTERNAL_SET.has(key)) continue;
            out[key] = stripInternal(value[key]);
        }
        return out;
    }
    return value;
};

/** Structural equality via JSON (payloads are plain JSON). */
export const sameData = (a, b) => {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
};

/**
 * Card DTO used for product lists (homepage sliders, collection grid, suggestions).
 * Must contain every field the card renderers AND the cart/checkout read from a
 * product added from a card. prerender.js applies the same projection.
 */
const CARD_FIELDS = [
    '_id', 'id', 'slug', 'name', 'price', 'compareAtPrice', 'image', 'imageUrl',
    'inStock', 'status', 'publishStatus', 'rating', 'ratingCount', 'reviewsCount',
    'sku', 'stockQuantity', 'stockQty', 'inventoryPolicy', 'continueSellingWhenOutOfStock',
];
const VARIANT_FIELDS = [
    '_id', 'id', 'sku', 'title', 'name', 'price', 'compareAtPrice', 'stockQty',
    'inventoryPolicy', 'continueSellingWhenOutOfStock', 'option1', 'option2', 'option3', 'tagadaVariantId',
];

const pick = (obj, fields) => {
    const out = {};
    for (const f of fields) {
        if (obj[f] !== undefined) out[f] = obj[f];
    }
    return out;
};

export const toCardDto = (p) => {
    if (!p || typeof p !== 'object') return p;
    const out = pick(p, CARD_FIELDS);
    if (Array.isArray(p.images) && p.images.length > 0) out.images = [stripInternal(p.images[0])];
    if (Array.isArray(p.variants)) out.variants = p.variants.map((v) => pick(v || {}, VARIANT_FIELDS));
    return out;
};

/** API key for a product's public reviews (shared by ProductDetail and ProductReviewsSection). */
export const reviewsKeyFor = (productId) => `/api/v1/reviews/product/${productId}?limit=100`;
