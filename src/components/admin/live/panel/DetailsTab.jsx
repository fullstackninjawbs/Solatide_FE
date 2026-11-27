// Visitor details: who (only what they typed in checkout / an order linked), where, which device,
// how often, how they first found the store, and their orders.
import { Link } from 'react-router-dom';
import { UserRound, MapPin, MonitorSmartphone, CalendarClock, Compass, Receipt } from 'lucide-react';
import { sourceLabel, deviceLabel, locationLabel } from '../liveFormat';
import { PathChip } from '../VisitorCard';
import { SectionCard, Row, Pill } from './panelUi';
import { dateTime, money, paymentMethodLabel, PAYMENT_STATUS } from './panelFormat';

const GEO_METHOD = { ip: 'From IP address', browser: "From the browser's time zone (approximate)" };
const UTM_LABEL = { source: 'UTM source', medium: 'UTM medium', campaign: 'UTM campaign', content: 'UTM content', term: 'UTM term' };
const CLICK_LABEL = { gclid: 'Google Ads click', fbclid: 'Facebook / Instagram click', ttclid: 'TikTok click', msclkid: 'Microsoft Ads click' };

export default function DetailsTab({ card, visitor, orders, visit }) {
  const loc = card.location;
  const utm = visit?.utm || {};
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <SectionCard title="Identity" icon={UserRound}>
        <div className="divide-y divide-slate-100">
          <Row label="Name">{visitor.identity?.name || '—'}</Row>
          <Row label="Email">{visitor.identity?.email || '—'}</Row>
          <Row label="Visitor ID"><span className="font-mono">{visitor.anonymousId}</span></Row>
          {visit?.sessionId && <Row label="Visit (session) ID"><span className="font-mono text-[12px] break-all">{visit.sessionId}</span></Row>}
          {visitor.identity?.customerId && (
            <Row label="Customer record">
              <Link to={`/admin/customers/${visitor.identity.customerId}`} className="font-bold text-brand-blue hover:underline">View customer</Link>
            </Row>
          )}
          <Row label="Known from">
            {visitor.identity ? (visitor.identity.from === 'this_visit' ? 'Checkout or order in this visit' : 'Checkout or order in an earlier visit') : 'Not identified yet'}
          </Row>
        </div>
      </SectionCard>

      <SectionCard title="Location" icon={MapPin}>
        <div className="divide-y divide-slate-100">
          <Row label="City">{loc?.city || '—'}</Row>
          <Row label="Region">{loc?.region || '—'}</Row>
          <Row label="Country">{loc?.country || 'Unknown'}</Row>
          <Row label="Detected">{loc ? GEO_METHOD[loc.method] || 'Unknown' : '—'}</Row>
        </div>
      </SectionCard>

      <SectionCard title="Device" icon={MonitorSmartphone}>
        <div className="divide-y divide-slate-100">
          <Row label="Device">{deviceLabel(card.device)}</Row>
          <Row label="Operating system">{card.device?.os || '—'}</Row>
          <Row label="Browser">{card.device?.browser || '—'}</Row>
        </div>
      </SectionCard>

      <SectionCard title="Activity" icon={CalendarClock}>
        <div className="divide-y divide-slate-100">
          <Row label="First seen">{dateTime(visitor.firstSeenAt)}</Row>
          <Row label="Last seen">{dateTime(visitor.lastSeenAt)}</Row>
          <Row label="Visits">{visitor.visitCount}</Row>
          <Row label="Orders">{orders.length}</Row>
        </div>
      </SectionCard>

      <SectionCard title="How they found the store" icon={Compass}>
        <div className="divide-y divide-slate-100">
          <Row label="First visit">{visitor.firstVisit ? sourceLabel(visitor.firstVisit.source) : '—'}</Row>
          {visitor.firstVisit?.landingPage && <Row label="First landing page"><PathChip path={visitor.firstVisit.landingPage} /></Row>}
          <Row label="This visit">{sourceLabel(card.source)}{card.source?.campaign ? ` · ${card.source.campaign}` : ''}</Row>
          {card.landingPage && <Row label="This landing page"><PathChip path={card.landingPage} /></Row>}
          <Row label="Referrer">{visit?.referrerDomain || 'None (typed in, bookmark or app)'}</Row>
          {Object.keys(UTM_LABEL).filter((k) => utm[k]).map((k) => <Row key={k} label={UTM_LABEL[k]}><span className="break-all">{utm[k]}</span></Row>)}
          {visit?.clickId && <Row label="Ad click">{CLICK_LABEL[visit.clickId] || visit.clickId}</Row>}
        </div>
      </SectionCard>

      <SectionCard title="Orders" icon={Receipt}>
        {orders.length ? (
          <ul className="divide-y divide-slate-100 -mx-1">
            {orders.map((o) => (
              <li key={o.id} className="px-1 py-2.5 flex items-center justify-between gap-3 text-[13px]">
                <div className="min-w-0">
                  <Link to={`/admin/orders/${o.id}`} className="font-bold text-brand-blue hover:underline">{o.orderNumber ? `#${o.orderNumber}` : 'Order'}</Link>
                  <p className="text-[12px] text-slate-500 mt-0.5">{dateTime(o.createdAt)} · {paymentMethodLabel(o.paymentMethod)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-bold text-slate-900">{money(o.total, o.currency)}</span>
                  <Pill meta={PAYMENT_STATUS[o.paymentStatus]}>{PAYMENT_STATUS[o.paymentStatus]?.label || o.paymentStatus}</Pill>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-slate-400 py-2">No orders from this browser yet.</p>
        )}
      </SectionCard>

      {loc && <p className="lg:col-span-2 text-[11.5px] text-slate-400 -mt-2">{locationLabel(loc)} · locations come from the visitor's IP address (no IP is stored) or, if unavailable, their browser's time zone.</p>}
    </div>
  );
}
