// Dashboard "Live customer activity": recent visitor cards, the live "online now" count and the
// "All activity" feed, which expands below on the same page. Updates arrive on their own (no
// refresh). Closing the visitor panel or collapsing the feed keeps the page where it was.
// Styling: the standard admin dashboard panel (white, slate border, 24px corners).
import { useCallback, useMemo, useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Loader2, Users } from 'lucide-react';
import useLiveActivity from './useLiveActivity';
import useActivityFeed from './useActivityFeed';
import VisitorCard from './VisitorCard';
import ActivityFeed from './ActivityFeed';
import VisitorPanel from './VisitorPanel';

export default function LiveCustomerActivity() {
  const live = useLiveActivity({ cardLimit: 6 });
  const [feedOpen, setFeedOpen] = useState(false);
  // The open visit and where it was opened from (cards or the feed): previous/next follow that list
  const [selection, setSelection] = useState(null); // { id, from: 'cards' | 'feed' }
  const selected = selection?.id || null;
  const feed = useActivityFeed({ enabled: feedOpen, subscribeActivity: live.subscribeActivity });
  const close = useCallback(() => setSelection(null), []);
  const selectFromCards = useCallback((id) => setSelection({ id, from: 'cards' }), []);
  const selectFromFeed = useCallback((id) => setSelection({ id, from: 'feed' }), []);
  const navigate = useCallback((id) => setSelection((s) => (s ? { ...s, id } : s)), []);
  const cardIds = useMemo(() => live.cards.map((c) => c.sessionId), [live.cards]);
  const feedIds = useMemo(
    () => [...new Set(feed.items.filter((i) => i.visitor && i.sessionId).map((i) => i.sessionId))],
    [feed.items]
  );
  const navIds = selection?.from === 'feed' ? feedIds : cardIds;
  const isLive = live.connection === 'live';

  return (
    <section aria-labelledby="live-activity-title" className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 id="live-activity-title" className="text-lg font-bold text-brand-navy">Live Customer Activity</h3>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                {isLive ? 'Real-time' : live.connection === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
              </span>
            </div>
            <p className="text-slate-500 text-[13px] mt-0.5">Recent customer actions in your store, from browsing to purchase.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Genuinely active visitors only (heartbeat within the active window, tab still open) */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80"
            title={`Active in the last ${live.definitions?.activeWindowSeconds ?? 40} seconds with the store open`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {live.onlineNow > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />}
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span data-live-online className="text-lg font-bold text-slate-900 leading-none">{live.loaded ? live.onlineNow : '—'}</span>
            <span className="text-[12px] font-semibold text-emerald-700 uppercase tracking-wider">Online now</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedOpen((o) => !o)}
            aria-expanded={feedOpen}
            className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-xl transition-colors ${feedOpen ? 'bg-brand-navy text-white hover:bg-brand-navyDark' : 'bg-[#0f2a5e] text-white hover:bg-[#15387a] shadow-xs'}`}
          >
            All activity {feedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!live.loaded ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>
      ) : live.cards.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[1800px]:grid-cols-6 gap-4">
          {live.cards.map((c) => (
            <VisitorCard key={c.sessionId} card={c} now={live.now} windowHours={live.windowHours} selected={selected === c.sessionId} onSelect={selectFromCards} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
          <Users className="w-6 h-6 text-slate-300 mb-2" />
          <p className="text-[13px] font-semibold text-slate-600">No visitors in the last 24 hours</p>
          <p className="text-[12px] text-slate-400 mt-0.5">New visits appear here as they happen.</p>
        </div>
      )}

      {feedOpen && (
        <div className="mt-5">
          <ActivityFeed feed={feed} now={live.now} statusOf={live.statusOf} onSelect={selectFromFeed} selectedSessionId={selected} />
        </div>
      )}

      <VisitorPanel sessionId={selected} live={live} onClose={close} navIds={navIds} onNavigate={navigate} />
    </section>
  );
}
