import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, ExternalLink, ArrowRight, X } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import Pagination from '../../../components/Pagination';

const STOREFRONT = import.meta.env.VITE_STOREFRONT_URL || '';

const SOURCE_LABEL = { auto: 'Automatic', manual: 'Manual', import: 'Imported' };
const SOURCE_STYLE = {
  auto: 'bg-blue-50 text-blue-700',
  manual: 'bg-violet-50 text-violet-700',
  import: 'bg-slate-100 text-slate-600',
};
const TARGET_WARNING = {
  not_public: { text: 'Target not public', title: 'The new URL is a draft, archived or inactive item — visitors get a 404 there.', style: 'bg-amber-50 text-amber-700' },
  missing: { text: 'Target not found', title: 'No product, collection or page exists at the new URL — visitors get a 404 there.', style: 'bg-red-50 text-red-700' },
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

/** Add / edit dialog. Editing never changes the old URL (disable it and add a new one instead). */
const RedirectDialog = ({ initial, onClose, onSaved }) => {
  const toast = useToast();
  const isEdit = !!initial?._id;
  const [form, setForm] = useState({
    fromPath: initial?.fromPath || '',
    toPath: initial?.toPath || '',
    statusCode: initial?.statusCode === 302 ? 302 : 301,
    note: initial?.note || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { toPath: form.toPath, statusCode: form.statusCode, note: form.note };
      const res = isEdit
        ? await apiService.updateAdminRedirect(initial._id, payload)
        : await apiService.createAdminRedirect({ ...payload, fromPath: form.fromPath });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Could not save the redirect');
      toast.success(data?.message || 'Redirect saved');
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy focus:border-brand-navy outline-none text-[14px] font-mono';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit redirect' : 'Add redirect'}>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{isEdit ? 'Edit redirect' : 'Add redirect'}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold text-slate-700">Old URL</span>
          {isEdit ? (
            <p className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[14px] font-mono text-slate-600">{form.fromPath}</p>
          ) : (
            <input className={`${input} mt-1`} value={form.fromPath} onChange={(e) => setForm({ ...form, fromPath: e.target.value })} placeholder="/products/old-name" required autoFocus />
          )}
          <span className="text-[12px] text-slate-500">The URL visitors or Google still use. A path on this site, starting with “/”.</span>
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold text-slate-700">New URL</span>
          <input className={`${input} mt-1`} value={form.toPath} onChange={(e) => setForm({ ...form, toPath: e.target.value })} placeholder="/products/new-name" required autoFocus={isEdit} />
          <span className="text-[12px] text-slate-500">Where they should land. On-site paths only (no other websites).</span>
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold text-slate-700">Type</span>
          <select className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-[14px]" value={form.statusCode} onChange={(e) => setForm({ ...form, statusCode: Number(e.target.value) })}>
            <option value={301}>301 — Permanent (recommended: moves Google ranking to the new URL)</option>
            <option value={302}>302 — Temporary</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold text-slate-700">Note <span className="font-normal text-slate-400">(optional)</span></span>
          <input className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-[14px]" value={form.note} maxLength={500} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. product discontinued, old Shopify link" />
        </label>

        {error && <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-[14px] font-semibold hover:bg-slate-50">Cancel</button>
          <AdminPrimaryButton type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add redirect'}</AdminPrimaryButton>
        </div>
      </form>
    </div>
  );
};

const RedirectList = () => {
  // Page, page size, search and filters live in the URL (same pattern as Pages / Orders)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const urlQ = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'all';
  const status = searchParams.get('status') || 'all';

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlQ);
  // ?new=1&from=/products/x opens the dialog pre-filled (e.g. from an archived product)
  const [dialog, setDialog] = useState(() => (searchParams.get('new') ? { fromPath: searchParams.get('from') || '' } : null));
  const debounceRef = useRef(null);

  const toast = useToast();
  const confirm = useConfirm();
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  });

  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setSearchTerm(urlQ);
  }

  useEffect(() => {
    if (searchTerm === urlQ) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchTerm.trim()) next.set('q', searchTerm.trim());
      else next.delete('q');
      next.set('page', '1');
      setSearchParams(next);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, urlQ, searchParams, setSearchParams]);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (urlQ) params.set('q', urlQ);
      if (source !== 'all') params.set('source', source);
      if (status !== 'all') params.set('status', status);
      const res = await apiService.getAdminRedirects(params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch redirects');
      setRows(data?.data?.redirects || []);
      setTotal(data?.total ?? 0);
    } catch (err) {
      toastRef.current.error(err.message || 'Failed to fetch redirects');
    } finally {
      setLoading(false);
    }
  }, [page, limit, urlQ, source, status]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (newPage, newLimit) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    next.set('limit', String(newLimit));
    setSearchParams(next);
  };

  const closeDialog = () => {
    setDialog(null);
    if (searchParams.get('new')) {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      next.delete('from');
      setSearchParams(next, { replace: true });
    }
  };

  const toggleActive = async (r) => {
    const enabling = !r.active;
    const ok = await confirm({
      title: enabling ? 'Enable redirect?' : 'Disable redirect?',
      description: enabling
        ? `${r.fromPath} will redirect to ${r.toPath} again.`
        : `${r.fromPath} will stop redirecting (visitors get a 404 unless a page exists there). The redirect is kept and can be enabled again.`,
      confirmLabel: enabling ? 'Enable' : 'Disable',
      cancelLabel: 'Cancel',
      variant: enabling ? 'primary' : 'warning',
    });
    if (!ok) return;
    try {
      const res = await apiService.updateAdminRedirect(r._id, { active: enabling });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Could not update the redirect');
      toast.success(enabling ? 'Redirect enabled' : 'Redirect disabled');
      fetchRows();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Redirects</h2>
          <p className="text-slate-500 text-[14px]">Old URLs that send visitors (and Google) to a new URL. Created automatically when a product, collection or page URL changes; add your own for old links.</p>
        </div>
        <AdminPrimaryButton className="gap-2 whitespace-nowrap shrink-0" onClick={() => setDialog({})}>
          <Plus className="h-4 w-4" />
          Add redirect
        </AdminPrimaryButton>
      </div>

      <div className="bg-white p-4 rounded-[16px] shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search old URL, new URL or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy focus:border-brand-navy outline-none text-[14px]"
            aria-label="Search redirects"
          />
        </div>
        <select value={source} onChange={(e) => setFilter('source', e.target.value)} aria-label="Filter by type" className="px-4 py-2 border border-slate-300 rounded-lg bg-white min-w-[150px] text-[14px]">
          <option value="all">All types</option>
          <option value="auto">Automatic</option>
          <option value="manual">Manual</option>
          <option value="import">Imported</option>
        </select>
        <select value={status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Filter by status" className="px-4 py-2 border border-slate-300 rounded-lg bg-white min-w-[140px] text-[14px]">
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[13px] font-bold text-slate-600">
                <th className="py-4 px-6 whitespace-nowrap">Old URL → New URL</th>
                <th className="py-4 px-4 whitespace-nowrap">Type</th>
                <th className="py-4 px-4 whitespace-nowrap">Status</th>
                <th className="py-4 px-4 whitespace-nowrap text-right">Hits</th>
                <th className="py-4 px-4 whitespace-nowrap">Last hit</th>
                <th className="py-4 px-4 whitespace-nowrap">Updated</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0079CD]"></div>Loading redirects...</div>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="7" className="py-12 text-center text-slate-500">No redirects found.</td></tr>
              ) : rows.map((r) => {
                const warn = r.active ? TARGET_WARNING[r.targetStatus] : null;
                return (
                  <tr key={r._id} className={`hover:bg-slate-50/50 transition-colors ${r.active ? '' : 'opacity-60'}`}>
                    <td className="py-3 px-6">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
                        <a href={`${STOREFRONT}${r.fromPath}`} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-brand-blue inline-flex items-center gap-1" title="Open the old URL">
                          {r.fromPath}<ExternalLink className="h-3 w-3" />
                        </a>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-label="redirects to" />
                        <span className="text-slate-900 font-semibold">{r.toPath}</span>
                        {warn && <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${warn.style}`} title={warn.title}>{warn.text}</span>}
                      </div>
                      {r.note && <p className="text-[12px] text-slate-400 mt-0.5">{r.note}</p>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${SOURCE_STYLE[r.source] || ''}`}>{SOURCE_LABEL[r.source] || r.source}</span>
                      <span className="ml-1.5 text-[11px] text-slate-400">{r.statusCode}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${r.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{r.active ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">{r.hits || 0}</td>
                    <td className="py-3 px-4 text-slate-500 text-[13px] whitespace-nowrap">{fmtDate(r.lastHitAt)}</td>
                    <td className="py-3 px-4 text-slate-500 text-[13px] whitespace-nowrap">{fmtDate(r.updatedAt)}</td>
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      <button onClick={() => setDialog(r)} className="p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors" title="Edit redirect" aria-label={`Edit redirect from ${r.fromPath}`}>
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => toggleActive(r)} className={`ml-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors ${r.active ? 'text-amber-700 hover:bg-amber-50' : 'text-green-700 hover:bg-green-50'}`}>
                        {r.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && rows.length > 0 && <Pagination page={page} limit={limit} total={total} onPageChange={handlePageChange} />}
      </div>

      {dialog && <RedirectDialog initial={dialog} onClose={closeDialog} onSaved={() => { closeDialog(); fetchRows(); }} />}
    </div>
  );
};

export default RedirectList;
