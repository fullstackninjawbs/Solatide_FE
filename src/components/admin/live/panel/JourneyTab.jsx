// Journey: every recorded step of this visit (newest first, live while they browse) + a summary.
import { Activity, FileText, Eye, ShoppingCart, CreditCard, Receipt, Clock, Package } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';
import { clockTime } from '../liveFormat';
import { STAGE_LABEL, money } from './panelFormat';

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
      <span className="flex items-center gap-2 text-slate-500"><Icon className="w-4 h-4 text-slate-400" />{label}</span>
      <span className="font-bold text-slate-800 text-right">{value}</span>
    </div>
  );
}

export default function JourneyTab({ card, feed, live }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px] gap-5 items-start">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-blue-50 text-brand-blue"><Activity className="w-4 h-4" /></span>
          Journey in this visit
        </h3>
        <ActivityFeed feed={feed} now={live.now} statusOf={live.statusOf} compact emptyText="No actions recorded in this visit yet." />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <h3 className="text-base font-bold text-slate-900 mb-1">Visit summary</h3>
        <div className="divide-y divide-slate-100">
          <SummaryRow icon={FileText} label="Pages viewed" value={card.counts?.pageViews ?? 0} />
          <SummaryRow icon={Eye} label="Products viewed" value={card.counts?.productViews ?? 0} />
          <SummaryRow icon={ShoppingCart} label="Added to cart" value={card.counts?.addToCart ?? 0} />
          <SummaryRow icon={CreditCard} label="Checkout" value={card.checkoutStage ? STAGE_LABEL[card.checkoutStage] || card.checkoutStage : 'Not started'} />
          <SummaryRow icon={Receipt} label="Orders placed" value={card.orderCount ?? 0} />
          <SummaryRow icon={Clock} label="Last activity" value={clockTime(card.lastActivityAt)} />
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-3 flex items-center justify-between text-[13px]">
          <span className="flex items-center gap-2 font-semibold text-slate-600"><Package className="w-4 h-4 text-slate-400" />Cart</span>
          <span className="font-bold text-slate-900">
            {card.cart?.itemCount ? `${card.cart.itemCount} item${card.cart.itemCount === 1 ? '' : 's'} · ${money(card.cart.value || 0)}` : 'Empty'}
          </span>
        </div>
      </div>
    </div>
  );
}
