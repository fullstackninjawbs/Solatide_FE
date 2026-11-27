import { useState } from 'react';
import { Search, Pause, Play, Loader2, X, ArrowUp, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { VisitorAvatar, ActionBlock, StatusPill, LocationText, PathChip } from './VisitorCard';
import { FEED_FILTERS, sourceLabel, deviceLabel, timeAgo, clockTime, displayName } from './liveFormat';
import { DeviceIcon, SourceIcon } from './LiveIcons';

/** Visitor panel: one visitor, so only when and what, as a timeline. */
function TimelineRow({ item, now, latest }) {
  return (
    <li className={`relative flex gap-4 px-5 py-3.5 ${latest ? 'bg-emerald-50/60' : ''}`}>
      <div className="w-[76px] shrink-0">
        <p className="text-[12px] font-semibold text-slate-700">{clockTime(item.at)}</p>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{latest ? 'Latest' : timeAgo(item.at, now)}</p>
      </div>
      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${latest ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`} aria-hidden="true" />
      <div className="min-w-0 flex-grow"><ActionBlock ev={item} compact /></div>
    </li>
  );
}

const MIN_PAGE_GROUP = 3;

/** Journey: runs of 3+ page views in a row become one "Viewed N pages" step (expandable). */
function groupJourney(items) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length >= MIN_PAGE_GROUP) out.push({ kind: 'pages', id: `pages-${run[0].id}`, items: run });
    else run.forEach((item) => out.push({ kind: 'item', id: item.id, item }));
    run = [];
  };
  for (const item of items) {
    if (item.type === 'page_view') run.push(item);
    else { flush(); out.push({ kind: 'item', id: item.id, item }); }
  }
  flush();
  return out;
}

function PageGroupRow({ group, now, latest }) {
  const [open, setOpen] = useState(false);
  const newest = group.items[0];
  const oldest = group.items[group.items.length - 1];
  return (
    <li className={`relative px-5 py-3.5 ${latest ? 'bg-emerald-50/60' : ''}`}>
      <div className="flex gap-4">
        <div className="w-[76px] shrink-0">
          <p className="text-[12px] font-semibold text-slate-700">{clockTime(newest.at)}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{latest ? 'Latest' : timeAgo(newest.at, now)}</p>
        </div>
        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${latest ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`} aria-hidden="true" />
        <div className="min-w-0 flex-grow">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-800 hover:text-brand-blue">
            <FileText className="w-4 h-4 text-slate-400" />
            Viewed {group.items.length} pages
            <span className="font-medium text-slate-400">· since {clockTime(oldest.at)}</span>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open && (
            <ul className="mt-2.5 space-y-1.5 border-l-2 border-slate-100 pl-3">
              {group.items.map((p) => (
                <li key={p.id} className="flex items-center gap-2 min-w-0 text-[12px]">
                  <span className="w-[62px] shrink-0 text-slate-400 font-medium">{clockTime(p.at)}</span>
                  <PathChip path={p.path || '/'} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

/** One row: when, who, what (with product/page), device/source and whether they are active now. */
function FeedRow({ item, now, status, onSelect, selected }) {
  const v = item.visitor;
  const clickable = !!v && !!onSelect;
  const Tag = clickable ? 'button' : 'div';
  return (
    <li>
      <Tag
        {...(clickable ? { type: 'button', onClick: () => onSelect(item.sessionId) } : {})}
        className={`w-full text-left grid grid-cols-1 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-x-5 gap-y-2.5 items-center px-5 py-3.5 transition-colors ${clickable ? 'hover:bg-slate-50/80 focus:outline-none focus-visible:bg-slate-50' : ''} ${selected ? 'bg-blue-50/50' : ''}`}
      >
        <div className="flex md:flex-col gap-2 md:gap-0.5">
          <span className="text-[12px] font-semibold text-slate-700">{timeAgo(item.at, now)}</span>
          <span className="text-[11px] text-slate-400 font-medium">{clockTime(item.at)}</span>
        </div>
        <div className="flex items-center gap-2.5 min-w-0">
          {v ? <VisitorAvatar visitor={v} size="w-8 h-8 text-[11px]" /> : <span className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />}
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800 truncate">{v ? displayName(v) : item.orderNumber ? `Order #${item.orderNumber}` : 'Unlinked order'}</p>
            {v && <LocationText location={v.location} className="text-[11.5px] text-slate-500" />}
          </div>
        </div>
        <ActionBlock ev={item} compact />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-slate-500 min-w-0">
          {v && <span className="flex items-center gap-1"><DeviceIcon type={v.device?.type} />{deviceLabel(v.device)}</span>}
          {v && <span className="flex items-center gap-1 min-w-0"><SourceIcon source={v.source} /><span className="truncate">{sourceLabel(v.source)}</span></span>}
          {v && <StatusPill status={status} />}
        </div>
      </Tag>
    </li>
  );
}

export default function ActivityFeed({ feed, now, statusOf, onSelect, selectedSessionId, compact = false, emptyText = 'No recorded activity yet.' }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className={`border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 ${compact ? 'px-4 py-3' : 'p-4'}`}>
        <div className={`flex gap-3 ${compact ? 'justify-between items-center' : 'flex-col sm:flex-row sm:items-center'}`}>
          {compact ? (
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Newest first</p>
          ) : (
            <label className="relative flex-grow">
              <span className="sr-only">Search activity</span>
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={feed.query}
                onChange={(e) => feed.setQuery(e.target.value)}
                placeholder="Search visitor, product, page or location…"
                className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue bg-white text-slate-700 placeholder-slate-400"
              />
            </label>
          )}
          <button
            type="button"
            onClick={feed.togglePaused}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-medium border rounded-xl transition-colors whitespace-nowrap ${feed.paused ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {feed.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {feed.paused ? 'Resume live updates' : 'Pause live updates'}
          </button>
        </div>
        {!compact && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by activity">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Show</span>
            {FEED_FILTERS.map((f) => {
              const on = feed.filterKeys.includes(f.key);
              return (
                <button key={f.key} type="button" aria-pressed={on} onClick={() => feed.toggleFilter(f.key)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition-colors ${on ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  {f.label}
                </button>
              );
            })}
            {feed.filterKeys.length > 0 && (
              <button type="button" onClick={feed.clearFilters} className="inline-flex items-center gap-1 px-2 py-1 text-[12px] font-semibold text-slate-400 hover:text-brand-blue">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {feed.paused && feed.bufferedCount > 0 && (
        <button type="button" onClick={feed.togglePaused} className="w-full flex items-center justify-center gap-1.5 py-2 text-[12.5px] font-bold text-brand-blue bg-blue-50 border-b border-blue-100 hover:bg-blue-100/70">
          <ArrowUp className="w-3.5 h-3.5" />
          {feed.bufferedCount} new {feed.bufferedCount === 1 ? 'action' : 'actions'} — resume to show
        </button>
      )}

      {feed.loading && !feed.items.length ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>
      ) : feed.items.length ? (
        <ul className="divide-y divide-slate-100">
          {compact
            // Journey: latest step highlighted while the visitor is active
            ? groupJourney(feed.items).map((entry, i) => {
              const latest = i === 0 && statusOf((entry.item || entry.items[0]).sessionId) === 'active';
              return entry.kind === 'pages'
                ? <PageGroupRow key={entry.id} group={entry} now={now} latest={latest} />
                : <TimelineRow key={entry.id} item={entry.item} now={now} latest={latest} />;
            })
            : feed.items.map((item) => (
              <FeedRow key={item.id} item={item} now={now} status={statusOf(item.sessionId)} onSelect={onSelect} selected={selectedSessionId === item.sessionId} />
            ))}
        </ul>
      ) : (
        <p className="px-4 py-12 text-center text-[13px] text-slate-400">{feed.query || feed.filterKeys.length ? 'Nothing matches these filters.' : emptyText}</p>
      )}

      {feed.hasMore && (
        <div className="px-4 py-3 border-t border-slate-100 flex justify-center bg-slate-50/50">
          <button type="button" onClick={feed.loadOlder} disabled={feed.loadingOlder}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60">
            {feed.loadingOlder && <Loader2 className="w-4 h-4 animate-spin" />} Load older activity
          </button>
        </div>
      )}
    </div>
  );
}
