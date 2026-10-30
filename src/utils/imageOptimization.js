/**
 * Deliver product images at display size.
 *   - Cloudinary: f_auto,q_auto (+ w_<width>,c_limit when a width is given)
 *   - Shopify CDN (cdn.shopify.com, the older product images): ?width=<width> — Shopify resizes on its CDN
 * `width` is the largest size the image is shown at (CSS px × ~2 for high-density screens).
 * Never upscales (c_limit / Shopify only shrinks). Any other URL is returned unchanged.
 */
export const optimizeCloudinaryUrl = (url, width) => {
    if (!url || typeof url !== 'string') return url;
    const w = Number.isFinite(width) && width > 0 ? Math.round(width) : null;

    // Cloudinary
    if (url.includes('res.cloudinary.com')) {
        // If it already has f_auto or q_auto transformations, return as is
        if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
            return url;
        }

        // Inject the transformation right after /upload/
        return url.replace('/upload/', `/upload/f_auto,q_auto${w ? `,w_${w},c_limit` : ''}/`);
    }

    // Shopify CDN
    if (w && /^https:\/\/cdn\.shopify\.com\//.test(url)) {
        try {
            const u = new URL(url);
            u.searchParams.set('width', String(w));
            return u.toString();
        } catch {
            return url;
        }
    }

    return url;
};
