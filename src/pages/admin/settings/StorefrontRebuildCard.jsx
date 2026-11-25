import { useCallback, useEffect, useState } from 'react';
import { Globe, RefreshCw, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { AdminSecondaryButton } from '../../../components/admin/AdminSecondaryButton';

/**
 * Settings → Storefront updates. The public website is prebuilt; saving products, collections,
 * COAs, FAQs, CMS pages, the homepage or approving reviews rebuilds it automatically. This card
 * shows whether the last update worked, and lets an admin start one by hand.
 */

const fmt = (d) => (d ? new Date(d).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

const readAdminRole = () => {
  try { return JSON.parse(localStorage.getItem('adminUser') || '{}')?.role || ''; } catch { return ''; }
};

export default function StorefrontRebuildCard() {
  const toast = useToast();
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const canRebuild = ['super_admin', 'admin'].includes(readAdminRole());

  // Resolves with the status, or null when it could not be loaded
  const fetchStatus = async () => {
    try {
      const res = await apiService.getStorefrontRebuildStatus();
      const data = await res.json();
      return res.ok && data.success ? data.data : null;
    } catch {
      return null;
    }
  };

  const load = useCallback(() => fetchStatus().then((s) => {
    if (s) { setStatus(s); setLoadError(false); } else setLoadError(true);
  }), []);

  useEffect(() => {
    let cancelled = false;
    fetchStatus().then((s) => {
      if (cancelled) return;
      if (s) { setStatus(s); setLoadError(false); } else setLoadError(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Poll while an update is waiting or running
  const active = !!(status?.building || status?.waiting);
  useEffect(() => {
    if (!active) return undefined;
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [active, load]);

  const rebuild = async () => {
    setRequesting(true);
    try {
      const res = await apiService.requestStorefrontRebuild();
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success(data.message || 'Website update requested');
        await load();
      } else {
        toast.error(data.message || 'Could not request a website update');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setRequesting(false);
    }
  };

  let badge;
  if (!status) badge = null;
  else if (!status.enabled) badge = <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Switched off on this server</span>;
  else if (status.building) badge = <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700"><Loader2 size={13} className="animate-spin" /> Updating now…</span>;
  else if (status.waiting) badge = <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700"><Loader2 size={13} className="animate-spin" /> Update queued</span>;
  else if (status.lastResult === 'failed') badge = <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700"><AlertTriangle size={13} /> Last update failed</span>;
  else if (status.lastResult === 'success') badge = <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={13} /> Up to date</span>;
  else badge = <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">No update recorded yet</span>;

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Website</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-start gap-4 flex-wrap">
        <div className="mt-1 text-slate-500"><Globe size={20} strokeWidth={1.5} /></div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14.5px] font-semibold text-slate-800">Storefront updates</h3>
          <p className="text-[14px] text-slate-500 mt-0.5">
            The website updates itself a few minutes after you save products, collections, batches/COAs, FAQs, pages or the homepage, or approve reviews.
          </p>
        </div>
        {badge}
      </div>

      <div className="p-5">
        {loadError && !status ? (
          <p className="text-[13px] text-red-600">Could not load the update status.</p>
        ) : !status ? (
          <p className="text-[13px] text-slate-400">Loading…</p>
        ) : (
          <>
            {status.lastResult === 'failed' && !status.building && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                The last update failed{status.consecutiveFailures > 1 ? ` (${status.consecutiveFailures} times in a row)` : ''}. The website is online and shows the version from {fmt(status.lastSuccessAt)}; newer changes are saved but not on the website yet. Try <strong>Rebuild now</strong>; if it fails again, contact the developer.
              </div>
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
              <div>
                <dt className="text-slate-500">Last successful update</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{fmt(status.lastSuccessAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Last requested</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{fmt(status.lastRequestedAt)}</dd>
                {status.lastRequestedBy && <dd className="text-[12px] text-slate-500">{status.lastRequestedBy}</dd>}
              </div>
              <div>
                <dt className="text-slate-500">Last finished</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{fmt(status.lastFinishedAt)}</dd>
              </div>
            </dl>
            {canRebuild && status.enabled && (
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <AdminSecondaryButton onClick={rebuild} disabled={requesting || status.building} className="inline-flex items-center gap-2">
                  <RefreshCw size={15} className={requesting ? 'animate-spin' : ''} /> Rebuild now
                </AdminSecondaryButton>
                <span className="text-[12px] text-slate-500">Only needed if a change is not showing on the website.</span>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
