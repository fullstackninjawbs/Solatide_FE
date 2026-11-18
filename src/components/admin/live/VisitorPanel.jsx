// Visitor slide-in panel (opened from a live card or a feed row). The dashboard stays visible behind
// a light dim; X / Escape / clicking outside closes it; selecting another visitor switches it in
// place (never a second panel). Phones: full screen. Everything updates live from the stream.
// Styling follows the admin drawers: navy gradient header, white cards on a slate background.
// Milestone 3 adds the Journey / Current cart / Previous sessions / Visitor details tabs.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CalendarClock, Link2, Loader2, ShoppingCart, Eye, Package, CreditCard, Receipt, FileText, Activity } from 'lucide-react';
import { apiService } from '../../../services/api';
import { VisitorAvatar, StatusPill, VisitorTypePill, LocationText, PathChip } from './VisitorCard';
import ActivityFeed from './ActivityFeed';
import useActivityFeed from './useActivityFeed';
import { sourceLabel, deviceLabel, displayName, liveStatus, clockTime } from './liveFormat';
import { DeviceIcon, SourceIcon } from './LiveIcons';

const duration = (from, to) => {
  if (!from || !to) return '—';
  const s = Math.max(0, Math.round((new Date(to) - new Date(from)) / 1000));
  const m = Math.floor(s / 60);
  return m ? `${m}m ${s % 60}s` : `${s}s`;
};
const firstSeen = (iso) => (iso ? new Date(iso).toLocaleString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Australia/Melbourne' }) : '—');

function Fact({ icon, label, children }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 min-w-0 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{icon}{label}</p>
      <div className="mt-1.5 text-[14px] font-bold text-slate-900 break-words">{children}</div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
      <span className="flex items-center gap-2 text-slate-500"><Icon className="w-4 h-4 text-slate-400" />{label}</span>
      <span className="font-bold text-slate-800 text-right">{value}</span>
    </div>
  );
}

export default function VisitorPanel({ sessionId, live, onClose }) {
  const [fetched, setFetched] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiService.getLiveVisitor(sessionId);
        const json = await res.json();
        if (cancelled) return;
        if (json.success) { setFetched(json.data.visitor); setError(''); } else setError(json.message || 'Could not load this visit');
      } catch { if (!cancelled) setError('Could not load this visit'); }
    })();
    return () => { cancelled = true; };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sessionId, onClose]);

  // Newest of: the copy fetched on open, the live card from the stream
  const liveCard = sessionId ? live.cardOf(sessionId) : null;
  const shown = fetched?.sessionId === sessionId ? fetched : null;
  const card = liveCard && (!shown || new Date(liveCard.lastActivityAt) >= new Date(shown.lastActivityAt)) ? liveCard : shown;
  const status = card ? liveStatus(card, live.now, live.definitions) : 'ended';

  const feed = useActivityFeed({ enabled: !!sessionId, subscribeActivity: live.subscribeActivity, sessionId: sessionId || '' });

  return createPortal(
    <AnimatePresence>
      {sessionId && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Visitor details and journey"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-[780px] h-full bg-slate-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f2a5e] to-[#1a3f8f] px-5 sm:px-7 py-5 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-blue-200 uppercase tracking-wider">Visitor details &amp; journey</p>
                  {card ? (
                    <div className="flex items-center gap-3.5 mt-3">
                      <VisitorAvatar visitor={card} size="w-12 h-12 text-[15px] ring-2 ring-white/20" />
                      <div className="min-w-0">
                        <p className="text-xl font-bold text-white truncate">{displayName(card)}</p>
                        <LocationText location={card.location} className="text-[13px] text-blue-100 mt-0.5" />
                      </div>
                    </div>
                  ) : null}
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className="text-white/60 hover:text-white p-1 -mr-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {card && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                  <StatusPill status={status} />
                  <VisitorTypePill isNew={card.isNewVisitor} long />
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto">
              {!card ? (
                <div className="flex justify-center py-16">{error ? <p className="text-[13px] text-red-600">{error}</p> : <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />}</div>
              ) : (
                <div className="p-5 sm:p-7 space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <Fact icon={<DeviceIcon type={card.device?.type} className="w-3.5 h-3.5" />} label="Device">
                      {deviceLabel(card.device)}{card.device?.browser ? <span className="block text-[12px] font-medium text-slate-500">{card.device.browser}</span> : null}
                    </Fact>
                    <Fact icon={<SourceIcon source={card.source} />} label="Source">
                      {sourceLabel(card.source)}{card.source?.campaign ? <span className="block text-[12px] font-medium text-slate-500">{card.source.campaign}</span> : null}
                    </Fact>
                    <Fact icon={<Link2 className="w-3.5 h-3.5" />} label="Landing page">{card.landingPage ? <PathChip path={card.landingPage} /> : '—'}</Fact>
                    <Fact icon={<Clock className="w-3.5 h-3.5" />} label="Duration">{duration(card.startedAt, card.lastActivityAt)}</Fact>
                    <Fact icon={<CalendarClock className="w-3.5 h-3.5" />} label="First seen">{firstSeen(card.startedAt)}</Fact>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px] gap-5 items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <span className="p-1.5 rounded-lg bg-blue-50 text-brand-blue"><Activity className="w-4 h-4" /></span>
                        Actions in this visit
                      </h3>
                      <ActivityFeed feed={feed} now={live.now} statusOf={live.statusOf} compact emptyText="No actions recorded in this visit yet." />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                      <h3 className="text-base font-bold text-slate-900 mb-1">Session summary</h3>
                      <div className="divide-y divide-slate-100">
                        <SummaryRow icon={FileText} label="Pages viewed" value={card.counts?.pageViews ?? 0} />
                        <SummaryRow icon={Eye} label="Products viewed" value={card.counts?.productViews ?? 0} />
                        <SummaryRow icon={ShoppingCart} label="Added to cart" value={card.counts?.addToCart ?? 0} />
                        <SummaryRow icon={CreditCard} label="Checkout started" value={card.checkoutStage ? <span className="capitalize">Yes · {card.checkoutStage}</span> : 'No'} />
                        <SummaryRow icon={Receipt} label="Orders placed" value={card.orderCount ?? 0} />
                        <SummaryRow icon={Clock} label="Last activity" value={clockTime(card.lastActivityAt)} />
                      </div>
                      <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-3 flex items-center justify-between text-[13px]">
                        <span className="flex items-center gap-2 font-semibold text-slate-600"><Package className="w-4 h-4 text-slate-400" />Cart</span>
                        <span className="font-bold text-slate-900">
                          {card.cart?.itemCount ? `${card.cart.itemCount} item${card.cart.itemCount === 1 ? '' : 's'} · $${Number(card.cart.value || 0).toFixed(2)}` : 'Empty'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
