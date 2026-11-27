// Previous sessions: the same visitor's other visits (same browser only — never merged across
// devices). Clicking one opens its journey in this panel.
import { History, Loader2, ChevronRight, FileText, Eye } from 'lucide-react';
import { DeviceIcon, SourceIcon } from '../LiveIcons';
import { sourceLabel, deviceLabel } from '../liveFormat';
import { PathChip } from '../VisitorCard';
import { SectionCard, Pill } from './panelUi';
import { OUTCOME, shortDateTime, durationText, money } from './panelFormat';

function VisitRow({ visit, onOpen }) {
  const outcome = OUTCOME[visit.outcome] || OUTCOME.browsed;
  const Icon = outcome.icon;
  return (
    <li>
      <button type="button" onClick={() => onOpen(visit.sessionId)}
        className="group w-full text-left px-4 py-3.5 hover:bg-slate-50/80 focus:outline-none focus-visible:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800 flex flex-wrap items-center gap-x-2 gap-y-1">
              {shortDateTime(visit.startedAt)}
              <span className="font-medium text-slate-400">· {durationText(visit.durationSeconds)}</span>
              {visit.isLatest && <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/80">Latest visit</span>}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[12px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><SourceIcon source={visit.source} />{sourceLabel(visit.source)}</span>
              <span className="flex items-center gap-1"><DeviceIcon type={visit.device?.type} />{deviceLabel(visit.device)}{visit.device?.browser ? ` · ${visit.device.browser}` : ''}</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{visit.counts.pageViews} pages</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{visit.counts.productViews} products</span>
            </div>
            {visit.landingPage && <div className="mt-1.5"><PathChip path={visit.landingPage} /></div>}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Pill meta={outcome}><Icon className="w-3 h-3" />{outcome.label}</Pill>
            {visit.orders.length > 0
              ? <span className="text-[12px] font-semibold text-indigo-700">{visit.orders.map((o) => (o.orderNumber ? `#${o.orderNumber}` : 'Order')).join(', ')}</span>
              : visit.requestNumbers?.length ? <span className="text-[12px] font-semibold text-indigo-700">{visit.requestNumbers.join(', ')}</span>
              : visit.cart ? <span className="text-[12px] font-semibold text-slate-600">Cart {money(visit.cart.value)}</span> : null}
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue transition-colors" />
          </div>
        </div>
      </button>
    </li>
  );
}

export default function VisitsTab({ visits, onOpen, onLoadMore, loadingMore }) {
  return (
    <SectionCard
      title="Previous sessions"
      icon={History}
      right={<span className="text-[12px] font-medium text-slate-400">{visits.total} other visit{visits.total === 1 ? '' : 's'}</span>}
    >
      {visits.items.length ? (
        <>
          <ul className="divide-y divide-slate-100 -mx-5 border-t border-slate-100">
            {visits.items.map((v) => <VisitRow key={v.sessionId} visit={v} onOpen={onOpen} />)}
          </ul>
          {visits.hasMore && (
            <div className="pt-3 flex justify-center">
              <button type="button" onClick={onLoadMore} disabled={loadingMore}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60">
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load more visits
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-[13px] font-semibold text-slate-600">No other visits from this browser</p>
          <p className="text-[12px] text-slate-400 mt-0.5">Visits on other devices or browsers aren't linked, so different people are never merged.</p>
        </div>
      )}
      {visits.items.length > 0 && (
        <p className="text-[11.5px] text-slate-400 mt-3">Only visits from this same browser are shown. Visits on other devices aren't linked.</p>
      )}
    </SectionCard>
  );
}
