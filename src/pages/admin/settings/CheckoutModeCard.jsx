import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../../components/admin/AdminSecondaryButton';
import { canEditPaymentSettings } from '../../../utils/canEditPaymentSettings';
import BankTransferSettingsCard from './BankTransferSettingsCard';

/**
 * Settings → Checkout: which checkout customers get when they click "Check out" (applies from their
 * next click, no redeploy), plus the bank transfer / PayID details used by that mode.
 * Modes that are not set up yet (bank details missing, processor / Pay by Bank not connected)
 * are shown but cannot be selected.
 */

const LABELS = {
  order_request: 'Order Request',
  bank_transfer: 'Manual Bank Transfer / PayID',
  external_processor: 'External Payment Processor',
  pay_by_bank: 'Pay by Bank',
  tagada: 'Previous TagadaPay checkout',
};

// TEMPORARY (display only — the server logic is unchanged): hide modes not offered yet, and show
// modes still being finished as "In progress" (not selectable). Empty these to show them again.
const HIDDEN_MODES = ['external_processor', 'pay_by_bank'];
const IN_PROGRESS_MODES = []; // LOCAL TESTING ONLY: restore ['bank_transfer'] before committing

const STATUS_BADGE = {
  in_progress: { text: 'In progress', cls: 'bg-violet-50 text-violet-700 border-violet-200' },
  live: { text: 'Live', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ready: { text: 'Ready', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  needs_setup: { text: 'Needs setup', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  not_connected: { text: 'Not connected', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const Badge = ({ kind }) => (
  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${STATUS_BADGE[kind].cls}`}>{STATUS_BADGE[kind].text}</span>
);

const CheckoutModeCard = () => {
  const [data, setData] = useState(null); // { mode, saved, options, changedAt, changedBy }
  const [chosen, setChosen] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const canEdit = canEditPaymentSettings();

  const load = useCallback(() => {
    return apiService.getCheckoutMode()
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body.message);
        setData(body.data);
        setChosen(body.data.mode);
      })
      .catch(() => toast.error('Failed to load the checkout mode'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await apiService.updateCheckoutMode(chosen);
      const body = await res.json();
      if (res.ok && body.success) {
        setData(body.data);
        setChosen(body.data.mode);
        toast.success(body.message || 'Checkout mode saved');
        setConfirming(false);
      } else if (res.status === 403) {
        toast.error('Only a super admin can change the checkout mode.');
      } else {
        toast.error(body.message || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const changed = data && chosen && chosen !== data.mode;

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Checkout</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-start gap-4">
          <div className="mt-1 text-slate-500"><ShoppingCart size={20} strokeWidth={1.5} /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14.5px] font-semibold text-slate-800">Checkout mode</h3>
            <p className="text-[14px] text-slate-500 mt-0.5">
              {data
                ? <>Customers currently use <strong className="text-slate-700">{LABELS[data.mode] || data.mode}</strong> when they click Check out.</>
                : 'Loading…'}
            </p>
            {data && !data.saved && (
              <p className="text-[12.5px] text-amber-700 mt-1">Not chosen here yet: the server settings decide. Choose a mode below to control it from this page.</p>
            )}
            {data?.changedAt && (
              <p className="text-[12.5px] text-slate-400 mt-1">Last changed {new Date(data.changedAt).toLocaleString('en-AU')}{data.changedBy ? ` by ${data.changedBy}` : ''}</p>
            )}
          </div>
        </div>

        {data && (
          <div role="radiogroup" aria-label="Checkout mode" className="divide-y divide-slate-100">
            {data.options.filter((o) => !HIDDEN_MODES.includes(o.id)).map((o) => {
              const isLive = data.mode === o.id;
              const inProgress = IN_PROGRESS_MODES.includes(o.id) && !isLive;
              const selectable = canEdit && o.status === 'ready' && !inProgress;
              const selected = chosen === o.id;
              return (
                <label key={o.id} className={`flex items-start gap-3 px-5 py-4 transition ${selectable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-70'} ${selected ? 'bg-brand-blue/[0.04]' : ''}`}>
                  <input
                    type="radio"
                    name="checkoutMode"
                    value={o.id}
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => setChosen(o.id)}
                    className="mt-1 h-4 w-4 accent-brand-blue"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-slate-800">{o.label}</span>
                      <Badge kind={isLive ? 'live' : inProgress ? 'in_progress' : o.status} />
                    </span>
                    <span className="block text-[13px] text-slate-500 mt-0.5">{o.description}</span>
                    {inProgress
                      ? <span className="block text-[12.5px] text-violet-700 mt-1">Being finished and tested — available soon.</span>
                      : canEdit && !selectable && o.hint && <span className="block text-[12.5px] text-amber-700 mt-1">{o.hint}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {data && (
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            {canEdit ? (
              <>
                <p className="text-[12.5px] text-slate-500">Takes effect from the customer's next Check out — no redeploy needed.</p>
                <AdminPrimaryButton onClick={() => setConfirming(true)} disabled={!changed || saving}>Save</AdminPrimaryButton>
              </>
            ) : (
              <p className="text-[12.5px] text-amber-700">View only — only a Super Admin can change the checkout mode.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        {/* Bank details change whether "Manual Bank Transfer / PayID" can be selected */}
        <BankTransferSettingsCard checkoutMode={data?.mode} onSaved={load} />
      </div>

      {confirming && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900">Switch checkout?</h2>
            <p className="mt-2 text-[14px] text-slate-600">
              Customers will use <strong>{LABELS[chosen]}</strong> instead of <strong>{LABELS[data.mode] || data.mode}</strong> from their next Check out.
              Orders and requests already placed are not affected.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <AdminSecondaryButton onClick={() => setConfirming(false)}>Cancel</AdminSecondaryButton>
              <AdminPrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Switch checkout'}</AdminPrimaryButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CheckoutModeCard;
