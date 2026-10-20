import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { getRouteData, sameData, toCardDto } from '../utils/routeData';

// Retries while the skeleton is shown, before giving up (API restarting, brief outage).
const RETRY_DELAYS_MS = [1500, 3500];

// Product list embedded by prerender.js (card DTOs) for the given API key, or null.
const getEmbeddedList = (key) => {
    const body = getRouteData(key);
    return body && body.success && body.data && Array.isArray(body.data.products) ? body.data.products.map(toCardDto) : null;
};

/**
 * Product list for a home-page slider.
 * - Fresh load of "/": starts from the prerendered list (same markup as the HTML Google sees), then
 *   refreshes in the background; on API errors the prerendered list simply stays.
 * - In-site navigation to "/" (no prerendered list): `loading` until the API answers, retrying
 *   twice; `failed` only if every attempt failed and there is nothing to show.
 */
export default function useHomeProducts(query) {
    const key = `/api/products?${query}`;
    const [products, setProducts] = useState(() => getEmbeddedList(key) || []);
    const [loading, setLoading] = useState(() => !getEmbeddedList(key));
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        let timer;
        const fetchProducts = async (retry) => {
            try {
                const response = await apiService.getProducts(query);
                const result = await response.json();
                if (!response.ok || !result.success || !result.data || !Array.isArray(result.data.products)) throw new Error(`HTTP ${response.status}`);
                if (cancelled) return;
                // Background refresh: only re-render when the list actually changed.
                const fresh = result.data.products.map(toCardDto);
                setProducts((prev) => (sameData(prev, fresh) ? prev : fresh));
                setFailed(false);
                setLoading(false);
            } catch {
                if (cancelled) return;
                if (retry < RETRY_DELAYS_MS.length) {
                    timer = setTimeout(() => fetchProducts(retry + 1), RETRY_DELAYS_MS[retry]);
                    return;
                }
                console.warn('Backend server unreachable for homepage products.');
                setFailed(true);
                setLoading(false);
            }
        };
        fetchProducts(0);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [query, attempt]);

    const retry = useCallback(() => { setFailed(false); setLoading(true); setAttempt((n) => n + 1); }, []);

    return { products, loading: loading && products.length === 0, failed: failed && products.length === 0, retry };
}
