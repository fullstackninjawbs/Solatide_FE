// Visitor card + the small pieces the live views share. Styling follows the admin standard: white
// cards with slate borders (as on the Analytics page stream), bordered pills (as the Orders list
// badges), uppercase event chips and blue monospace path chips.
import { Clock, ChevronRight, Package } from 'lucide-react';
import CountryFlag from '../../CountryFlag';
import { eventLabel, eventMeta, TONES, sourceLabel, deviceLabel, locationLabel, timeAgo, STATUS_META, displayName, initials } from './liveFormat';
import { DeviceIcon, SourceIcon } from './LiveIcons';

export function VisitorAvatar({ visitor, size = 'w-10 h-10 text-[13px]' }) {
  const ini = initials(visitor);
  return (
    <span
      className={`${size} shrink-0 rounded-full flex items-center justify-center font-bold ${ini ? 'bg-brand-navy text-white' : 'bg-blue-50 text-brand-blue border border-blue-100'}`}
      aria-hidden="true"
    >
      {ini || <span className="text-[10px] tracking-tight">{(visitor?.anonymousId || '#').slice(1, 3)}</span>}
    </span>
  );
}

export function StatusPill({ status }) {
  const st = STATUS_META[status] || STATUS_META.ended;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${st.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
    </span>
  );
}

export function VisitorTypePill({ isNew, long = false }) {
  if (isNew === null || isNew === undefined) return null;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${isNew ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
      {isNew ? (long ? 'New visitor' : 'New') : (long ? 'Returning visitor' : 'Returning')}
    </span>
  );
}

export function EventPill({ ev }) {
  const meta = eventMeta(ev?.type);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${TONES[meta.tone]}`}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      {eventLabel(ev)}
    </span>
  );
}

export function PathChip({ path }) {
  if (!path) return null;
  return (
    <span className="inline-block text-[11px] font-mono text-brand-blue font-semibold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100 truncate max-w-full align-middle">
      {path}
    </span>
  );
}

export function LocationText({ location, className = '' }) {
  return (
    <span className={`flex items-center gap-1.5 min-w-0 ${className}`}>
      {location?.countryCode && <CountryFlag countryCode={location.countryCode} alt="" style={{ width: '1.15em', height: '0.85em', borderRadius: 2 }} />}
      <span className="truncate">{locationLabel(location)}</span>
    </span>
  );
}

/** Latest action with product image / name / URL where recorded. */
export function ActionBlock({ ev, compact = false }) {
  const isOrder = ['order_placed', 'purchase', 'order_cancelled', 'order_refunded'].includes(ev?.type);
  const gap = compact ? 'mt-2' : 'mt-3';
  return (
    <div className="min-w-0">
      <EventPill ev={ev} />
      {ev?.productName ? (
        <div className={`flex items-center gap-2.5 ${gap}`}>
          {ev.productImage
            ? <img src={ev.productImage} alt="" width={40} height={40} loading="lazy" className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-200/80 shrink-0" />
            : <span className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-slate-400" /></span>}
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-[13px] truncate">
              {ev.productName}{ev.variantTitle ? <span className="font-medium text-slate-500"> · {ev.variantTitle}</span> : null}
            </p>
            <div className="mt-1"><PathChip path={ev.path} /></div>
          </div>
        </div>
      ) : isOrder ? (
        <p className={`${gap} text-[13px] text-slate-700`}>
          {typeof ev.value === 'number' ? <span className="font-bold text-slate-800">${ev.value.toFixed(2)}</span> : null}
          {ev.orderNumber ? <span className="text-slate-500"> · Order #{ev.orderNumber}</span> : null}
        </p>
      ) : ev?.path ? (
        <div className={gap}><PathChip path={ev.path} /></div>
      ) : null}
    </div>
  );
}

export default function VisitorCard({ card, now, selected, onSelect, windowHours = 24 }) {
  const last = card.lastEvent || { at: card.lastActivityAt };
  return (
    <button
      type="button"
      onClick={() => onSelect?.(card.sessionId)}
      aria-pressed={selected}
      className={`group text-left w-full min-w-0 p-4 rounded-xl bg-white border flex flex-col gap-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 ${selected ? 'border-brand-blue ring-2 ring-brand-blue/15 shadow-md' : 'border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-blue-300'} ${card.status === 'ended' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        <VisitorAvatar visitor={card} />
        <div className="min-w-0 flex-grow">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-bold text-slate-900 truncate group-hover:text-brand-navy">{displayName(card)}</p>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" aria-hidden="true" />{timeAgo(card.lastActivityAt, now)}</span>
          </div>
          <LocationText location={card.location} className="text-[12px] text-slate-500 mt-0.5" />
        </div>
      </div>

      <ActionBlock ev={last} />

      <div className="mt-auto pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center gap-3 text-[12px] font-medium text-slate-500 min-w-0">
          <span className="flex items-center gap-1 min-w-0"><DeviceIcon type={card.device?.type} /><span className="truncate">{deviceLabel(card.device)}</span></span>
          <span className="flex items-center gap-1 min-w-0"><SourceIcon source={card.source} /><span className="truncate">{sourceLabel(card.source)}</span></span>
          <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusPill status={card.status} />
          <VisitorTypePill isNew={card.isNewVisitor} />
          {card.recentVisitCount > 1 && (
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap" title="This card shows their latest visit">
              {card.recentVisitCount} visits in {windowHours}h
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
