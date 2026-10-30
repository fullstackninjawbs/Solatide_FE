import { useState } from 'react';
import { AlertCircle, Tag, X } from 'lucide-react';
import { apiService } from '../../services/api';

/**
 * Discount code field for our checkout pages (Bank Transfer and Order Request). "Apply" asks the
 * server, which checks the code against the cart with the hub's rules; the order / request is
 * recalculated again on the server when it is placed, so this is only a preview.
 *
 *   applied: { code, amount, label } | null     onChange(applied | null)
 *   items:   [{ productId, variantId, quantity }]   email: optional (one-per-customer codes)
 */
const DiscountCodeBox = ({ items, email, applied, onChange }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    const c = code.trim();
    if (!c || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await apiService.previewDiscount({ code: c, items, email: email || undefined });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.success && body.data) {
        onChange(body.data);
        setCode('');
      } else {
        setError(body.message || "This discount code isn't valid.");
      }
    } catch {
      setError('Could not check the code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
        <span className="flex items-center gap-2 min-w-0 text-[13.5px] text-emerald-800">
          <Tag size={15} className="shrink-0" />
          <span className="font-semibold truncate">{applied.code}</span>
          <span className="text-emerald-700">· {applied.label}</span>
        </span>
        <button type="button" onClick={() => onChange(null)} className="shrink-0 inline-flex items-center gap-1 text-[12.5px] font-medium text-emerald-800 hover:underline" aria-label={`Remove discount code ${applied.code}`}>
          <X size={13} />Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Discount code</span>
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); if (error) setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }}
            placeholder="Discount code"
            autoComplete="off"
            autoCapitalize="characters"
            maxLength={64}
            className={`w-full h-[44px] px-3.5 rounded-xl border bg-white text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${error ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-[#0079CE] focus:ring-[#0079CE]/15'}`}
          />
        </label>
        <button
          type="button"
          onClick={apply}
          disabled={!code.trim() || busy}
          className="shrink-0 h-[44px] px-4 rounded-xl border border-[#0079CE]/30 bg-[#0079CE]/[0.06] text-[14px] font-semibold text-[#0079CE] hover:bg-[#0079CE]/[0.12] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {busy ? <span className="inline-block w-4 h-4 border-2 border-[#0079CE]/30 border-t-[#0079CE] rounded-full animate-spin align-middle" aria-label="Checking code" /> : 'Apply'}
        </button>
      </div>
      {error && <p role="alert" className="mt-1.5 flex items-start gap-1 text-[12.5px] text-red-600"><AlertCircle size={13} className="shrink-0 mt-[2px]" />{error}</p>}
    </div>
  );
};

export default DiscountCodeBox;
