import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { getRouteData, sameData } from '../utils/routeData';

/**
 * Homepage hero + announcement bar, edited in Hub → Content → Homepage.
 *
 * - Prerendered pages embed the API payload (every route: the header uses it), so the first
 *   render already shows the saved content and hydration matches the HTML.
 * - Header and hero share one request; later mounts (in-site navigation) reuse its result.
 * - Without data (API down, page not rebuilt yet) the built-in defaults below are shown.
 *   Keep them in sync with HOMEPAGE_DEFAULTS in Server/src/services/content/siteContent.ts.
 *   Images: null = the built-in image bundled with the storefront.
 */
export const HOMEPAGE_KEY = '/api/v1/content/homepage';

export const HOMEPAGE_DEFAULTS = {
    hero: {
        headline: 'Your Trusted Source For\nResearch Grade Peptides.',
        subtext: 'Solatide Biosciences delivers research grade peptides and laboratory solutions for researchers who demand purity, consistency, and results.',
        imageAlt: 'Solatide Biosciences – Research Grade Peptides',
        desktopImage: null,
        mobileImage: null,
    },
    announcement: {
        enabled: true,
        messages: [
            { text: 'Australian owned & operated', icon: 'au_flag' },
            { text: 'Card Payments Available', icon: 'card_logos' },
        ],
    },
};

const toContent = (body) => (body?.success && body.data?.hero && body.data?.announcement
    ? { hero: body.data.hero, announcement: body.data.announcement }
    : null);

let latest = null;   // last content from the API (shared by every mount)
let inflight = null; // one request at a time

const initial = () => latest || toContent(getRouteData(HOMEPAGE_KEY)) || HOMEPAGE_DEFAULTS;

const fetchContent = () => {
    if (!inflight) {
        inflight = apiService.getPublicHomepage()
            .then((res) => res.json())
            .then((body) => {
                const content = toContent(body);
                if (content) latest = content;
                return content;
            })
            .catch(() => null)
            .finally(() => { setTimeout(() => { inflight = null; }, 0); });
    }
    return inflight;
};

export default function useHomepageContent() {
    const [content, setContent] = useState(initial);

    useEffect(() => {
        let cancelled = false;
        fetchContent().then((fresh) => {
            if (!cancelled && fresh) setContent((prev) => (sameData(prev, fresh) ? prev : fresh));
        });
        return () => { cancelled = true; };
    }, []);

    return content;
}

/** Cloudinary delivery URL resized for the slot, in WebP/AVIF where supported. */
export const cloudinarySized = (url, width) =>
    (typeof url === 'string' && url.includes('/image/upload/')
        ? url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
        : url);
