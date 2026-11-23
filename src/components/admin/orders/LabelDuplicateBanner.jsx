import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../../services/api';
import { AdminSecondaryButton } from '../AdminSecondaryButton';

/**
 * Order page → Fulfillment: warning when this order may have more than one shipping label
 * (set by the server: second tracking number from Starshipit, a second Starshipit order, or MyPost
 * refusing a label because one already existed). Alert only — it never changes the shipment.
 * "Mark as resolved" hides it once the team has kept the right label and refunded the rest.
 */

const MYPOST_BUSINESS = 'https://auspost.com.au/mypost-business/';
const STARSHIPIT_ORDERS = 'https://next.starshipit.com/orders?tab=printed';

const REASON_TEXT = {
  second_tracking: 'Starshipit reported more than one tracking number for this order.',
  second_starshipit_order: 'Starshipit has more than one order for this order number.',
  label_exists_elsewhere: 'Australia Post (MyPost) refused a new label because one already existed for this order.',
};

function fmt(d) {
  if (!d) return '';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function LabelDuplicateBanner({ order, setOrder }) {
  const [saving, setSaving] = useState(false);
  const dup = order?.labelDuplicate;
  if (!dup?.detectedAt) return null;

  if (dup.resolvedAt) {
    return (
      <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
        <CheckCircle2 size={13} className="text-emerald-600" />
        Possible duplicate label checked{dup.resolvedBy ? ` by ${dup.resolvedBy}` : ''}{dup.resolvedAt ? ` · ${fmt(dup.resolvedAt)}` : ''}.
      </p>
    );
  }

  const resolve = async () => {
    setSaving(true);
    try {
      const res = await apiService.resolveLabelDuplicate(order._id);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not update the order');
      setOrder((prev) => ({ ...prev, labelDuplicate: data.data?.labelDuplicate || { ...dup, resolvedAt: new Date().toISOString() } }));
      toast.success('Marked as resolved');
    } catch (err) {
      toast.error(err.message || 'Could not update the order');
    } finally {
      setSaving(false);
    }
  };

  const reasons = (dup.reasons || []).map((r) => REASON_TEXT[r] || r);
  const trackingNumbers = dup.trackingNumbers || [];
  const starshipitIds = dup.starshipitOrderIds || [];

  return (
    <div role="alert" className="w-full bg-red-50/70 border border-red-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
          <AlertTriangle size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-red-900">Possible duplicate shipping label</p>
          <ul className="mt-1 list-disc pl-4 text-[13px] text-red-800 leading-relaxed">
            {reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
          {(trackingNumbers.length > 0 || starshipitIds.length > 0) && (
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1 text-[12.5px]">
              {trackingNumbers.length > 0 && (<><dt className="text-slate-500">Tracking numbers</dt><dd className="font-mono text-slate-800 break-all">{trackingNumbers.join(', ')}</dd></>)}
              {starshipitIds.length > 0 && (<><dt className="text-slate-500">Starshipit order IDs</dt><dd className="font-mono text-slate-800 break-all">{starshipitIds.join(', ')}</dd></>)}
              <dt className="text-slate-500">First detected</dt><dd className="text-slate-800">{fmt(dup.detectedAt)}</dd>
            </dl>
          )}
          <p className="text-[13px] text-slate-700 mt-3 leading-relaxed">
            Each label is charged to MyPost Business. Keep the label that is on the parcel, then in <strong>MyPost Business</strong> request a
            refund for any unused label (search by tracking number) and archive the duplicate order in Starshipit. In Starshipit use
            <strong> Reprint label</strong> (free) — never <em>Redo shipping</em>. Nothing on this order was changed.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <AdminSecondaryButton href={MYPOST_BUSINESS} className="!text-[13px] !px-3.5 !py-2">
              MyPost Business <ExternalLink size={13} />
            </AdminSecondaryButton>
            <AdminSecondaryButton href={STARSHIPIT_ORDERS} className="!text-[13px] !px-3.5 !py-2">
              Open Starshipit <ExternalLink size={13} />
            </AdminSecondaryButton>
            <AdminSecondaryButton onClick={resolve} disabled={saving} className="!text-[13px] !px-3.5 !py-2">
              <CheckCircle2 size={13} /> {saving ? 'Saving…' : 'Mark as resolved'}
            </AdminSecondaryButton>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-2">Already voided or refunded the extra label? Just mark it as resolved.</p>
        </div>
      </div>
    </div>
  );
}
