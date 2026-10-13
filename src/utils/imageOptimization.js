const isCloudinary = (url) => url.includes('res.cloudinary.com') && url.includes('/upload/');
const isShopifyCdn = (url) => url.includes('cdn.shopify.com');

/**
 * Optimised URL for a Cloudinary / Shopify CDN image.
 * - Cloudinary: f_auto,q_auto (WebP/AVIF + automatic quality), plus w_<width>,c_limit when a
 *   width is given (never upscales).
 * - Shopify CDN: ?width=<width> when a width is given.
 * Other URLs (local assets, data URIs) are returned unchanged.
 */
export const optimizeCloudinaryUrl = (url, width) => {
    if (!url || typeof url !== 'string') return url;
    const w = width ? Math.round(width) : 0;

    if (isCloudinary(url)) {
        const resize = w ? `w_${w},c_limit` : '';
        // Already has f_auto/q_auto: only chain the resize step in front of it
        if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
            return resize ? url.replace('/upload/', `/upload/${resize}/`) : url;
        }
        return url.replace('/upload/', `/upload/${resize ? resize + ',' : ''}f_auto,q_auto/`);
    }

    if (w && isShopifyCdn(url) && !/[?&]width=/.test(url)) {
        return `${url}${url.includes('?') ? '&' : '?'}width=${w}`;
    }

    return url;
};

/**
 * srcset for a Cloudinary / Shopify CDN image so the browser picks the smallest file that is
 * sharp for the rendered size and screen density. undefined for other URLs (plain src is used).
 */
export const responsiveImageSrcSet = (url, widths = [240, 360, 480, 640]) => {
    if (!url || typeof url !== 'string' || !(isCloudinary(url) || isShopifyCdn(url))) return undefined;
    return widths.map((w) => `${optimizeCloudinaryUrl(url, w)} ${w}w`).join(', ');
};

/**
 * sizes for product card images. The (square) product shot sits in a 240px / 260px-tall box with
 * object-contain, so its rendered size is bounded by that height, not by the card width.
 */
export const PRODUCT_CARD_SIZES = '(max-width: 639px) 240px, 260px';
/** Shop grid: 2 columns on phones (~134px image); from sm up bounded by its 280–320px-tall box. */
export const SHOP_GRID_SIZES = '(max-width: 639px) 40vw, 320px';
