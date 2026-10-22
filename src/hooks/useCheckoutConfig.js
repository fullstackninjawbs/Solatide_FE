import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

// Which checkout the store uses (bank transfer / PayID or Tagada). One request per page load.
let cached = null;
let inflight = null;

export function loadCheckoutConfig() {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = apiService.getCheckoutConfig()
      .then((r) => r.json())
      .then((j) => {
        if (!j?.success || !j.data) throw new Error('config');
        cached = j.data;
        return cached;
      })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

/** { config, error } — config.mode is 'bank_transfer' or 'tagada'. */
export default function useCheckoutConfig() {
  const [config, setConfig] = useState(cached);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (cached) return undefined;
    let alive = true;
    loadCheckoutConfig().then((c) => alive && setConfig(c)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, []);
  return { config, error };
}
