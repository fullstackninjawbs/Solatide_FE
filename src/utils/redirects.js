import { API_URL } from '../services/api';

/**
 * Ask the server whether an old URL now lives somewhere else (Redirects list: automatic 301s
 * after a URL change, imported legacy URLs, manual redirects). Used by the 404 screens for links
 * clicked inside the site — direct visits are already 301'd by nginx before the app loads.
 *
 * Returns an internal path ("/products/new?x=1") or null. Never throws.
 */
export async function lookupRedirect(pathWithQuery) {
  try {
    const res = await fetch(`${API_URL}/api/redirects/resolve?format=json&path=${encodeURIComponent(pathWithQuery)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const to = data && data.found ? data.to : null;
    // Internal paths only (the server guarantees this too)
    return typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') ? to : null;
  } catch {
    return null;
  }
}
