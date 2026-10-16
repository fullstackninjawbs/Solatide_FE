import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';

/** Same handle format as the server (lowercase letters, numbers, single hyphens). */
const toHandle = (s) => String(s || '').toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

/**
 * Shown under the URL handle field of the product / collection / CMS page editors:
 *  - while the handle is being changed on an existing item: the old URL will redirect (301);
 *  - the old URLs that already redirect to this item, with hits and a link to manage them.
 * `base` is "/products", "/collections" or "/pages"; `originalSlug` is the handle as loaded.
 */
const UrlRedirectNotice = ({ base, originalSlug, currentSlug }) => {
  const [incoming, setIncoming] = useState([]);
  const original = toHandle(originalSlug);
  const next = toHandle(currentSlug);
  const currentPath = `${base}/${original}`;

  useEffect(() => {
    if (!original) return undefined;
    let cancelled = false;
    apiService.getAdminRedirects(new URLSearchParams({ to: currentPath, status: 'active', limit: '20' }).toString())
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setIncoming(data?.data?.redirects || []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [original, currentPath]);

  if (!original) return null; // new item: nothing to redirect yet
  const changing = next && next !== original;

  return (
    <div className="mt-2 space-y-2">
      {changing && (
        <div className="text-[12.5px] rounded-lg border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2" role="status">
          When you save, the old URL <code className="font-mono">{base}/{original}</code> will automatically redirect (301) to{' '}
          <code className="font-mono">{base}/{next}</code>, so links and Google rankings carry over.
        </div>
      )}
      {incoming.length > 0 && (
        <div className="text-[12.5px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-700">Old URLs that redirect here ({incoming.length})</span>
            <Link to={`/admin/content/redirects?q=${encodeURIComponent(currentPath)}`} className="text-brand-blue font-semibold hover:underline">Manage</Link>
          </div>
          <ul className="space-y-0.5">
            {incoming.map((r) => (
              <li key={r._id} className="flex items-center gap-1.5 font-mono text-slate-600">
                {r.fromPath}<ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" /><span className="font-sans text-slate-400">{r.hits || 0} hits</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UrlRedirectNotice;
