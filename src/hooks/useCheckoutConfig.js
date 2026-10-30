import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

// Which checkout the store uses (Admin → Settings → Checkout mode). Kept for a few seconds only, so
// the cart's "Check out" click and the /checkout page share one request, while a mode change in
// Admin applies from the customer's next click (no reload needed).
const FRESH_MS = 15 * 1000;
let cached = null;
let cachedAt = 0;
let inflight = null;

const fresh = () => (cached && Date.now() - cachedAt < FRESH_MS ? cached : null);

export function loadCheckoutConfig() {
  const c = fresh();
  if (c) return Promise.resolve(c);
  if (!inflight) {
    inflight = apiService.getCheckoutConfig()
      .then((r) => r.json())
      .then((j) => {
        if (!j?.success || !j.data) throw new Error('config');
        cached = j.data;
        cachedAt = Date.now();
        return cached;
      })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

/** { config, error } — config.mode is 'order_request', 'bank_transfer' or 'tagada'. */
export default function useCheckoutConfig() {
  const [config, setConfig] = useState(fresh);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (config) return undefined;
    let alive = true;
    loadCheckoutConfig().then((c) => alive && setConfig(c)).catch(() => alive && setError(true));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { config, error };
}
