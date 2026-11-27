// Visitor slide-in panel (opened from a live card or a feed row). The dashboard stays visible behind
// a light dim; X / Escape / clicking outside closes it; selecting another visitor switches it in
// place (never a second panel). Phones: full screen. Everything updates live from the stream.
// Styling follows the admin drawers: navy gradient header, white cards on a slate background.
//
// Milestone 3: tabs (Journey / Current cart / Previous sessions / Visitor details), previous/next
// visitor (buttons or ← →, the selected tab stays), and opening one of the visitor's earlier visits
// inside the panel (with "Back"). Visits are linked by the same browser only, never merged.
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CalendarClock, Link2, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Repeat, Route, ShoppingCart, History, UserRound } from 'lucide-react';
import { VisitorAvatar, StatusPill, VisitorTypePill, LocationText, PathChip } from './VisitorCard';
import useActivityFeed from './useActivityFeed';
import { sourceLabel, deviceLabel, displayName, liveStatus } from './liveFormat';
import { DeviceIcon, SourceIcon } from './LiveIcons';
import useVisitorProfile from './panel/useVisitorProfile';
import JourneyTab from './panel/JourneyTab';
import CartTab from './panel/CartTab';
import VisitsTab from './panel/VisitsTab';
import DetailsTab from './panel/DetailsTab';
import { durationText, secondsBetween, dateTime, shortDateTime } from './panel/panelFormat';

const TABS = [
  { key: 'journey', label: 'Journey', icon: Route },
  { key: 'cart', label: 'Current cart', icon: ShoppingCart },
  { key: 'visits', label: 'Previous sessions', icon: History },
  { key: 'details', label: 'Visitor details', icon: UserRound },
];

function Fact({ icon, label, children }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 min-w-0 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{icon}{label}</p>
      <div className="mt-1.5 text-[14px] font-bold text-slate-900 break-words">{children}</div>
    </div>
  );
}

const typingInField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

export default function VisitorPanel({ sessionId, live, onClose, navIds = [], onNavigate }) {
  const [tab, setTab] = useState('journey'); // kept when switching visitors
  // The visit being shown: the one opened, or one of the visitor's earlier visits
  const [earlier, setEarlier] = useState(null); // { from: sessionId, id: sessionId } | null
  const viewId = earlier && earlier.from === sessionId ? earlier.id : sessionId;
  const isEarlierVisit = !!viewId && viewId !== sessionId;

  const liveCard = viewId ? live.cardOf(viewId) : null;
  const { profile, error, loadingMore, loadMoreVisits } = useVisitorProfile(viewId, liveCard);

  // Newest of: the profile's copy, the live card from the stream
  const shown = profile?.session || null;
  const card = liveCard && (!shown || new Date(liveCard.lastActivityAt) >= new Date(shown.lastActivityAt)) ? { ...shown, ...liveCard } : shown;
  const status = card ? liveStatus(card, live.now, live.definitions) : 'ended';

  const feed = useActivityFeed({ enabled: !!viewId, subscribeActivity: live.subscribeActivity, sessionId: viewId || '' });

  const index = navIds.indexOf(sessionId);
  const prevId = index > 0 ? navIds[index - 1] : null;
  const nextId = index >= 0 && index < navIds.length - 1 ? navIds[index + 1] : null;
  const go = useCallback((id) => { if (id && onNavigate) onNavigate(id); }, [onNavigate]);

  useEffect(() => {
    if (!sessionId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (!typingInField(e.target) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === 'ArrowLeft' && prevId) go(prevId);
        if (e.key === 'ArrowRight' && nextId) go(nextId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sessionId, onClose, prevId, nextId, go]);

  const openVisit = useCallback((id) => {
    setEarlier(id === sessionId ? null : { from: sessionId, id });
    setTab('journey');
  }, [sessionId]);

  const visitor = profile?.visitor;

  return createPortal(
    <AnimatePresence>
      {sessionId && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Visitor details and journey"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-[820px] h-full bg-slate-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f2a5e] to-[#1a3f8f] px-5 sm:px-7 pt-5 shrink-0">
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
                <div className="flex items-center gap-1 shrink-0">
                  {navIds.length > 1 && index >= 0 && (
                    <>
                      <button type="button" onClick={() => go(prevId)} disabled={!prevId} aria-label="Previous visitor" title="Previous visitor (←)"
                        className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-[12px] font-semibold text-blue-100 tabular-nums">{index + 1} / {navIds.length}</span>
                      <button type="button" onClick={() => go(nextId)} disabled={!nextId} aria-label="Next visitor" title="Next visitor (→)"
                        className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button type="button" onClick={onClose} aria-label="Close" className="text-white/60 hover:text-white p-1 ml-1 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {card && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                  {!isEarlierVisit && <StatusPill status={status} />}
                  <VisitorTypePill isNew={card.isNewVisitor} long />
                </div>
              )}
              {/* Tabs */}
              <div role="tablist" aria-label="Visitor panel sections" className="flex gap-1 mt-4 -mb-px overflow-x-auto">
                {TABS.map((t) => {
                  const on = tab === t.key;
                  const Icon = t.icon;
                  const count = t.key === 'visits' && profile ? profile.otherVisits.total : null;
                  return (
                    <button key={t.key} type="button" role="tab" aria-selected={on} onClick={() => setTab(t.key)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold rounded-t-xl whitespace-nowrap transition-colors ${on ? 'bg-slate-50 text-brand-navy' : 'text-blue-100 hover:text-white hover:bg-white/10'}`}>
                      <Icon className="w-4 h-4" />
                      {t.key === 'cart' && isEarlierVisit ? 'Cart' : t.label}
                      {count !== null && <span className={`px-1.5 rounded-md text-[11px] ${on ? 'bg-slate-200 text-slate-600' : 'bg-white/15 text-white'}`}>{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {!card ? (
                <div className="flex justify-center py-16">{error ? <p className="text-[13px] text-red-600">{error}</p> : <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />}</div>
              ) : (
                <div className="p-5 sm:p-7 space-y-6">
                  {isEarlierVisit && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-[13px]">
                      <span className="text-blue-900">Viewing another visit by this visitor · <strong>{shortDateTime(card.startedAt)}</strong></span>
                      <button type="button" onClick={() => openVisit(sessionId)} className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to the visit you opened
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Fact icon={<DeviceIcon type={card.device?.type} className="w-3.5 h-3.5" />} label="Device">
                      {deviceLabel(card.device)}{card.device?.browser ? <span className="block text-[12px] font-medium text-slate-500">{card.device.browser}</span> : null}
                    </Fact>
                    <Fact icon={<SourceIcon source={card.source} />} label="Source">
                      {sourceLabel(card.source)}{card.source?.campaign ? <span className="block text-[12px] font-medium text-slate-500">{card.source.campaign}</span> : null}
                    </Fact>
                    <Fact icon={<Link2 className="w-3.5 h-3.5" />} label="Landing page">{card.landingPage ? <PathChip path={card.landingPage} /> : '—'}</Fact>
                    <Fact icon={<Clock className="w-3.5 h-3.5" />} label="Visit duration">
                      {durationText(secondsBetween(card.startedAt, card.lastActivityAt))}
                      <span className="block text-[12px] font-medium text-slate-500">Started {shortDateTime(card.startedAt)}</span>
                    </Fact>
                    <Fact icon={<CalendarClock className="w-3.5 h-3.5" />} label="First seen">
                      {visitor ? dateTime(visitor.firstSeenAt) : '…'}
                    </Fact>
                    <Fact icon={<Repeat className="w-3.5 h-3.5" />} label="Visits">
                      {visitor ? visitor.visitCount : '…'}
                      <span className="block text-[12px] font-medium text-slate-500">From this browser</span>
                    </Fact>
                  </div>

                  <div role="tabpanel">
                    {tab === 'journey' && <JourneyTab card={card} feed={feed} live={live} />}
                    {tab === 'cart' && <CartTab card={card} checkout={profile?.session?.checkout || null} isEarlierVisit={isEarlierVisit} now={live.now} />}
                    {tab === 'visits' && (profile
                      ? <VisitsTab visits={profile.otherVisits} onOpen={openVisit} onLoadMore={loadMoreVisits} loadingMore={loadingMore} />
                      : <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>)}
                    {tab === 'details' && (profile
                      ? <DetailsTab card={card} visitor={profile.visitor} orders={profile.orders} visit={profile.visit} />
                      : <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>)}
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
