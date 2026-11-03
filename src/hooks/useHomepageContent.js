import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { getRouteData, sameData } from '../utils/routeData';

/**
 * Homepage hero + announcement bar, edited in Hub → Content → Homepage.
 *
 * - Prerendered pages embed the API payload (every route: the header uses it), so the first
 *   render already shows the saved content and hydration matches the HTML.
 * - Header and hero share one request; later mounts (in-site navigation) reuse its result.
 * - Without embedded data (dev server, pages that weren't prerendered) `ready` is false until the
 *   API answers, so callers can hold back hero images/text instead of flashing the built-in ones.
 *   API down or slower than FALLBACK_AFTER_MS: the built-in defaults below are shown.
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

const FALLBACK_AFTER_MS = 3000;

const initial = () => {
    const known = latest || toContent(getRouteData(HOMEPAGE_KEY));
    return { content: known || HOMEPAGE_DEFAULTS, ready: Boolean(known) };
};

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
    const [state, setState] = useState(initial);

    useEffect(() => {
        let cancelled = false;
        // API too slow: stop waiting and show the built-in content (fresh content still replaces it)
        const timer = setTimeout(() => {
            setState((prev) => (prev.ready ? prev : { ...prev, ready: true }));
        }, FALLBACK_AFTER_MS);
        fetchContent().then((fresh) => {
            if (cancelled) return;
            clearTimeout(timer);
            setState((prev) => {
                const content = fresh && !sameData(prev.content, fresh) ? fresh : prev.content;
                return content === prev.content && prev.ready ? prev : { content, ready: true };
            });
        });
        return () => { cancelled = true; clearTimeout(timer); };
    }, []);

    return { ...state.content, ready: state.ready };
}

/** Cloudinary delivery URL resized for the slot, in WebP/AVIF where supported. */
export const cloudinarySized = (url, width) =>
    (typeof url === 'string' && url.includes('/image/upload/')
        ? url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
        : url);
