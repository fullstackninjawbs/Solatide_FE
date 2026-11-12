import { useEffect, useState } from 'react';
import {
  Truck, Check, CheckCircle2, Clock, AlertTriangle, ExternalLink, Pencil, Plus, RefreshCw, ChevronDown, Printer,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../../services/api';
import { AdminPrimaryButton } from '../AdminPrimaryButton';
import { AdminSecondaryButton } from '../AdminSecondaryButton';
import { Modal } from '../feedback/Modal';

/**
 * Order page → Fulfillment: create a label OR add tracking manually, the "label pending in
 * Starshipit" state of international orders, and the tracking card (4-step timeline + carrier scans).
 * Delivery status comes from the server (GET /api/admin/order/:id/tracking), the same logic as the
 * Delivery Status column on the orders list.
 */

const STARSHIPIT_NEW_ORDERS = 'https://next.starshipit.com/orders?tab=new';

const CARRIERS = ['Australia Post', 'Other'];

// Starshipit reports Australia Post labels as e.g. "MyPostBusiness" or "eParcel": show them as Australia Post
function carrierChoice(name) {
  if (!name) return 'Australia Post';
  const c = String(name).toLowerCase();
  if (/auspost|australia ?post|mypost|eparcel|aus ?post/.test(c)) return 'Australia Post';
  return CARRIERS.includes(name) ? name : 'Other';
}
const MANUAL_STAGE_OPTIONS = [
  { value: 'label_created', label: 'Label created (not scanned yet)' },
  { value: 'in_transit', label: 'In transit' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
];

const STATUS_PILL = {
  not_shipped: { label: 'Not Shipped', cls: 'bg-slate-100 text-slate-600 border-slate-200', Icon: Clock },
  label_pending: { label: 'Label Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  label_created: { label: 'Label Created', cls: 'bg-violet-50 text-violet-700 border-violet-200', Icon: Printer },
  in_transit: { label: 'In Transit', cls: 'bg-blue-50 text-blue-700 border-blue-200', Icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', Icon: Truck },
  delayed: { label: 'Delayed', cls: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  exception: { label: 'Delivery Issue', cls: 'bg-red-50 text-red-700 border-red-200', Icon: AlertTriangle },
  returned: { label: 'Returned to Sender', cls: 'bg-red-50 text-red-700 border-red-200', Icon: AlertTriangle },
  delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
};

const INPUT = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-colors';
const LABEL = 'block text-[12.5px] font-semibold text-slate-600 mb-1.5';

function fmtWhen(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' });
  const time = date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' }).toLowerCase();
  return `${day}, ${time}`;
}

function StatusPill({ stage }) {
  const s = STATUS_PILL[stage] || STATUS_PILL.not_shipped;
  const { Icon } = s;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border whitespace-nowrap ${s.cls}`}>
      <Icon size={13} /> {s.label}
    </span>
  );
}

function ParcelDetails({ order }) {
  const w = order.shipmentWeight;
  if (!w) return null;
  return (
    <div className="mt-1.5 space-y-0.5">
      {w.totalGrams > 0 && (
        <p className="text-[12.5px] text-slate-500">
          Parcel weight sent: <span className="font-semibold text-slate-700">{w.totalGrams} g</span>
          {' '}(items {w.itemsGrams} g + {w.packageName || 'package'} {w.packageGrams} g)
        </p>
      )}
      {w.packageName && w.packageReason && (
        <p className="text-[12px] text-slate-400">Package: {w.packageName} — {w.packageReason}</p>
      )}
      {w.warnings?.length > 0 && <p className="text-[12.5px] text-amber-700">⚠ {w.warnings.join(' · ')}</p>}
    </div>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function Timeline({ milestones }) {
  const reached = milestones.reduce((acc, m, i) => (m.state !== 'pending' ? i : acc), -1);
  const delivered = milestones[3]?.state === 'done';
  const pct = reached <= 0 ? 0 : (reached / (milestones.length - 1)) * 100;
  return (
    <div className="relative pt-1">
      <div className="absolute top-[13px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200">
        <div className={`h-full transition-all duration-500 ${delivered ? 'bg-emerald-500' : 'bg-brand-blue'}`} style={{ width: `${pct}%` }} />
      </div>
      <ol className="relative grid grid-cols-4 text-center">
        {milestones.map((m) => (
          <li key={m.key} className="flex flex-col items-center px-1">
            {m.state === 'done' ? (
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                <Check size={13} strokeWidth={3} />
              </span>
            ) : m.state === 'current' ? (
              <span className="w-6 h-6 rounded-full border-2 border-brand-blue bg-white flex items-center justify-center ring-4 ring-white">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white ring-4 ring-white" />
            )}
            <p className={`text-[12.5px] font-semibold mt-2 ${m.state === 'pending' ? 'text-slate-400' : 'text-brand-navy'}`}>{m.label}</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5 min-h-[16px]">{m.state === 'pending' ? '—' : (fmtWhen(m.date) || '—')}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Add / edit tracking ─────────────────────────────────────────────────────

function TrackingModal({ isOpen, onClose, order, tracking, onSaved }) {
  const editing = Boolean(order.trackingNumber);
  const knownCarrier = carrierChoice(order.trackingCarrier);
  // Tracking currently kept up to date by Starshipit (saving here switches it to manual)
  const starshipitTracked = editing && order.trackingSource !== 'manual' && Boolean(order.starshipitOrderId);
  const currentStage = tracking?.summary?.stage || order.tracking?.stage;
  const emailAlreadySent = Boolean(order.shipmentEmailSentAt);
  const [form, setForm] = useState(() => ({
    trackingNumber: order.trackingNumber || '',
    carrier: knownCarrier,
    otherCarrier: knownCarrier === 'Other' ? (order.trackingCarrier || '') : '',
    trackingUrl: knownCarrier === 'Other' ? (order.trackingUrl || '') : '',
    // Start from the current status, so saving never moves the parcel back
    stage: MANUAL_STAGE_OPTIONS.some((o) => o.value === currentStage) ? currentStage : 'label_created',
    notifyCustomer: !emailAlreadySent,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const numberChanged = form.trackingNumber.trim() !== (order.trackingNumber || '');

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setError('');
    const trackingNumber = form.trackingNumber.trim();
    if (!trackingNumber) { setError('Enter the tracking number.'); return; }
    const carrier = form.carrier === 'Other' ? form.otherCarrier.trim() : form.carrier;
    if (!carrier) { setError('Enter the carrier name.'); return; }
    setSaving(true);
    try {
      const res = await apiService.updateAdminOrderTracking(order._id, {
        trackingNumber,
        trackingCarrier: carrier,
        trackingUrl: form.carrier === 'Other' ? form.trackingUrl.trim() : '',
        stage: form.stage,
        markFulfilled: true,
        notifyCustomer: form.notifyCustomer,
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || 'Could not save the tracking.'); return; }
      toast.success(data.message || 'Tracking saved');
      onSaved(data.data.order);
      onClose();
    } catch (err) {
      setError(err?.message || 'Network error — please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => { } : onClose} title={editing ? 'Edit tracking' : 'Add tracking manually'} maxWidth="max-w-lg">
      <form onSubmit={save} className="space-y-4">
        {starshipitTracked && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12.5px] text-amber-800 leading-relaxed">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <p>
              <span className="font-semibold">This order is tracked by Starshipit.</span> Saving switches it to manual tracking and
              Starshipit updates stop for this order. Only do this if the parcel was sent with a different label, then cancel
              the unused label in Starshipit.
            </p>
          </div>
        )}

        <p className="text-[13px] text-slate-500 leading-relaxed">
          {editing
            ? 'Correct the tracking number or update the delivery status. Tracking saved here is kept even if Starshipit reports something else.'
            : 'For a label made outside Starshipit (for example directly in Australia Post). The order is marked as fulfilled.'}
        </p>

        <div>
          <label className={LABEL} htmlFor="trk-number">Tracking number</label>
          <input id="trk-number" className={INPUT} value={form.trackingNumber} onChange={set('trackingNumber')} placeholder="e.g. 33ABC1234567" autoComplete="off" maxLength={50} autoFocus />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="trk-carrier">Carrier</label>
            <select id="trk-carrier" className={INPUT} value={form.carrier} onChange={set('carrier')}>
              {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL} htmlFor="trk-stage">Delivery status</label>
            <select id="trk-stage" className={INPUT} value={form.stage} onChange={set('stage')}>
              {MANUAL_STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {form.carrier === 'Other' && (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={LABEL} htmlFor="trk-other">Carrier name</label>
              <input id="trk-other" className={INPUT} value={form.otherCarrier} onChange={set('otherCarrier')} maxLength={60} placeholder="e.g. Carrier Name" />
            </div>
            <div>
              <label className={LABEL} htmlFor="trk-url">Tracking link <span className="font-normal text-slate-400">(optional)</span></label>
              <input id="trk-url" className={INPUT} value={form.trackingUrl} onChange={set('trackingUrl')} maxLength={500} placeholder="https://…" />
            </div>
          </div>
        )}

        <p className="text-[12px] text-slate-400 leading-relaxed">
          Starshipit can only track labels it created, so for tracking entered here you set the delivery status yourself.
        </p>

        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
          <input type="checkbox" checked={form.notifyCustomer} onChange={set('notifyCustomer')} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
          <span className="text-[13px] text-slate-700 leading-snug">
            {emailAlreadySent
              ? <>Send the shipping email again{numberChanged ? ' with the new tracking number' : ''}</>
              : <>Email the customer their tracking number <span className="text-slate-400">(shipping confirmation)</span></>}
          </span>
        </label>

        {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}

        <div className="flex justify-end gap-2.5 pt-1">
          <AdminSecondaryButton onClick={onClose} disabled={saving} className="!text-[13.5px] !py-2">Cancel</AdminSecondaryButton>
          <AdminPrimaryButton type="submit" disabled={saving} className="!text-[13.5px] !py-2">
            {saving ? 'Saving…' : editing ? 'Save tracking' : 'Add tracking'}
          </AdminPrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

// ─── Tracking card (mock-up 2) ───────────────────────────────────────────────

function TrackingCard({ order, tracking, loading, onEdit, onRefresh }) {
  const [showHistory, setShowHistory] = useState(false);
  const stage = tracking?.summary?.stage || order.delivery?.stage || 'label_created';
  const manual = (tracking?.source || order.trackingSource) === 'manual';
  const events = tracking?.events || [];
  const carrier = order.trackingCarrier || tracking?.trackingCarrier || 'Carrier';

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <Truck size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold text-brand-navy leading-tight flex items-center gap-2">
              {carrier}
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${manual ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {manual ? 'Added manually' : 'Starshipit'}
              </span>
            </p>
            {order.trackingUrl ? (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-brand-blue hover:underline inline-flex items-center gap-1 mt-0.5 break-all">
                {order.trackingNumber} <ExternalLink size={12} className="shrink-0" />
              </a>
            ) : (
              <p className="text-[13px] font-semibold text-slate-700 mt-0.5 break-all">{order.trackingNumber}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AdminSecondaryButton onClick={onEdit} className="!text-[13px] !px-3 !py-1.5">
            <Pencil size={13} /> Edit tracking
          </AdminSecondaryButton>
          <StatusPill stage={stage} />
        </div>
      </div>

      {loading && !tracking ? (
        <div className="h-[62px] rounded-xl bg-slate-50 animate-pulse" />
      ) : tracking?.milestones ? (
        <Timeline milestones={tracking.milestones} />
      ) : null}

      {stage === 'delayed' && (
        <p className="mt-4 text-[12.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          No carrier update for {tracking?.summary?.days} days. Check the parcel on the carrier's site.
        </p>
      )}
      {(stage === 'exception' || stage === 'returned') && (
        <p className="mt-4 text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {stage === 'returned' ? 'The carrier reports the parcel is being returned to sender.' : 'The carrier reported a delivery issue. Check the latest scan below or on the carrier\'s site.'}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {manual ? (
          <p className="text-[12px] text-slate-400">Live carrier updates aren't available for tracking added manually. Update the status with Edit tracking.</p>
        ) : tracking?.live ? (
          <button type="button" onClick={() => setShowHistory((v) => !v)} className="text-[12.5px] font-semibold text-slate-600 hover:text-brand-navy inline-flex items-center gap-1" disabled={!events.length}>
            {events.length ? <>Tracking history ({events.length}) <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} /></> : 'No carrier scans yet'}
          </button>
        ) : (
          <p className="text-[12px] text-slate-400">Updates arrive from Starshipit automatically.</p>
        )}
        {!manual && (
          <button type="button" onClick={onRefresh} disabled={loading} className="text-[12px] font-semibold text-slate-500 hover:text-brand-blue inline-flex items-center gap-1 disabled:opacity-50">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        )}
      </div>

      {showHistory && events.length > 0 && (
        <ol className="mt-3 space-y-2.5">
          {events.map((ev, i) => (
            <li key={`${ev.datetime}-${i}`} className="flex gap-3 text-[12.5px]">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-brand-blue' : 'bg-slate-300'}`} />
              <div>
                <p className="font-semibold text-slate-700">{ev.status || ev.details}</p>
                {ev.details && ev.status && <p className="text-slate-500">{ev.details}</p>}
                <p className="text-slate-400 text-[11.5px]">{fmtWhen(ev.datetime)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────

export default function ShipmentPanel({
  order, setOrder, isUnfulfilled, awaitingPayment, isManual, isShopifyImport, isBankOrder,
  fulfilling, onFulfill, creatingLabel, onCreateLabel, shipmentError,
}) {
  const [tracking, setTracking] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const hasTracking = Boolean(order.trackingNumber);
  const labelPending = !hasTracking && Boolean(order.starshipitOrderId);
  const orderId = order._id;
  const trackingNumber = order.trackingNumber;
  const trackingSource = order.trackingSource;
  const trackingStage = order.tracking?.stage;

  // Timeline + carrier scans; reloaded when the tracking changes or on Refresh
  useEffect(() => {
    if (!orderId || !trackingNumber) return undefined;
    let alive = true;
    apiService.getAdminOrderTracking(orderId)
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => { if (alive && ok && data.success) setTracking(data.data); })
      .catch(() => { /* the card still shows the tracking number and link */ })
      .finally(() => { if (alive) setRefreshing(false); });
    return () => { alive = false; };
  }, [orderId, trackingNumber, trackingSource, trackingStage, refreshTick]);

  const refreshTracking = () => { setRefreshing(true); setRefreshTick((t) => t + 1); };
  // Data for another tracking number (just edited) is not shown while the new one loads
  const currentTracking = tracking && tracking.trackingNumber === trackingNumber ? tracking : null;

  const paymentPending = !isManual && (order.paymentStatus === 'pending' || order.tagadaPaymentStatus === 'pending');
  const cancelled = order.status === 'cancelled' || ['cancelled', 'failed', 'refunded'].includes(order.paymentStatus);
  const shipBlocked = isShopifyImport
    ? 'Historical Shopify order: shipping labels cannot be created.'
    : cancelled ? 'This order is cancelled or refunded.'
      : paymentPending ? (isBankOrder ? 'Mark the order as paid first.' : 'Payment is pending from Tagada, refresh to update.')
        : null;
  const labelBlocked = shipBlocked || (order.addressValidation?.needsReview ? 'Please verify and correct the address before creating a shipping label.' : null);

  const onSaved = (fresh) => { setOrder(fresh); };

  return (
    <div className="flex flex-col gap-4 pt-2">
      {hasTracking ? (
        <>
          {/* Shipment summary: label + parcel details (only when there is something to show) */}
          {(order.shipmentWeight || (order.labelUrl && order.trackingSource !== 'manual') || isUnfulfilled) && (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} /> {order.trackingSource === 'manual' ? 'Tracking added manually' : `Shipment created${order.shipmentStatus ? ` (${order.shipmentStatus})` : ''}`}
                </p>
                <ParcelDetails order={order} />
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {order.labelUrl && order.trackingSource !== 'manual' && (
                  <AdminSecondaryButton href={order.labelUrl} className="!text-[13px] !px-3.5 !py-2">Download label</AdminSecondaryButton>
                )}
                {isUnfulfilled && (
                  <AdminSecondaryButton onClick={onFulfill} disabled={fulfilling || awaitingPayment} className="!text-[13px] !px-3.5 !py-2">
                    {fulfilling ? 'Updating…' : 'Mark as fulfilled'}
                  </AdminSecondaryButton>
                )}
              </div>
            </div>
          )}

          <TrackingCard order={order} tracking={currentTracking} loading={refreshing || !currentTracking} onEdit={() => setModalOpen(true)} onRefresh={refreshTracking} />
        </>
      ) : labelPending ? (
        /* International: the order is in Starshipit, the label is printed in the Starshipit dashboard */
        <div className="w-full bg-amber-50/60 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold text-brand-navy">Order created in Starshipit — label not printed yet</p>
              <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
                Print the label in the Starshipit dashboard. The tracking number syncs back here and the customer gets their
                shipping email automatically. Made the label somewhere else? Add the tracking manually.
              </p>
              <ParcelDetails order={order} />
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <AdminSecondaryButton href={STARSHIPIT_NEW_ORDERS} className="!text-[13px] !px-3.5 !py-2">
                  Open Starshipit <ExternalLink size={13} />
                </AdminSecondaryButton>
                <AdminSecondaryButton onClick={onCreateLabel} disabled={creatingLabel} className="!text-[13px] !px-3.5 !py-2">
                  <RefreshCw size={13} className={creatingLabel ? 'animate-spin' : ''} /> {creatingLabel ? 'Checking…' : 'Check Starshipit now'}
                </AdminSecondaryButton>
                <AdminPrimaryButton onClick={() => setModalOpen(true)} disabled={Boolean(shipBlocked)} className="!text-[13px] !px-4 !py-2">
                  <Plus size={14} /> Add tracking manually
                </AdminPrimaryButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Not shipped: create a label OR add tracking manually */
        <div className="flex flex-col items-end gap-2 ml-auto">
          {order.addressValidation?.needsReview && (
            <p className="text-[12px] font-medium text-red-500">⚠️ Verify address before creating label</p>
          )}
          {shipmentError && (
            <div className="flex flex-col items-end gap-1 max-w-md text-right">
              <p className="text-[12.5px] font-medium text-red-600">⚠️ {shipmentError}</p>
              <p className="text-[11.5px] text-slate-500">
                Stuck? <a href={STARSHIPIT_NEW_ORDERS} target="_blank" rel="noreferrer" className="font-semibold text-brand-blue hover:underline">Resolve it in Starshipit ↗</a> — the tracking syncs back automatically — or add the tracking manually.
              </p>
            </div>
          )}
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            <AdminSecondaryButton onClick={onFulfill} disabled={fulfilling || !isUnfulfilled || awaitingPayment} className="!text-[13px] !px-3.5 !py-2">
              {fulfilling ? 'Updating…' : 'Mark as fulfilled'}
            </AdminSecondaryButton>
            <span title={shipBlocked || ''} className={shipBlocked ? 'cursor-not-allowed' : ''}>
              <AdminSecondaryButton onClick={() => setModalOpen(true)} disabled={Boolean(shipBlocked)} className="!text-[13px] !px-3.5 !py-2">
                <Plus size={14} /> Add tracking manually
              </AdminSecondaryButton>
            </span>
            <span title={labelBlocked || ''} className={labelBlocked ? 'cursor-not-allowed' : ''}>
              <AdminPrimaryButton onClick={onCreateLabel} disabled={Boolean(labelBlocked) || creatingLabel} className="!text-[13px] !px-4 !py-2">
                {creatingLabel ? 'Generating…' : 'Create shipping label'}
              </AdminPrimaryButton>
            </span>
          </div>
          <p className="text-[11.5px] text-slate-400 text-right max-w-md leading-snug">
            Australian orders get the label and tracking straight away. International orders are created in Starshipit —
            print the label there and the tracking syncs back automatically.
          </p>
        </div>
      )}

      {modalOpen && (
        <TrackingModal isOpen onClose={() => setModalOpen(false)} order={order} tracking={currentTracking} onSaved={onSaved} />
      )}
    </div>
  );
}
