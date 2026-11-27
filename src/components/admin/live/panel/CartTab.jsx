// Current cart: what's in it now (live), and this visit's checkout attempt.
// For an earlier visit: the cart as it was when that visit ended.
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, CreditCard, AlertTriangle } from 'lucide-react';
import { timeAgo } from '../liveFormat';
import { PathChip } from '../VisitorCard';
import { SectionCard, Row, Pill } from './panelUi';
import { money, paymentMethodLabel, dateTime, STAGE_LABEL, CHECKOUT_STATUS } from './panelFormat';

export default function CartTab({ card, checkout, isEarlierVisit, now }) {
  const cart = card.cart;
  const lines = cart?.items || [];
  return (
    <div className="space-y-5">
      <SectionCard
        title={isEarlierVisit ? 'Cart at the end of this visit' : 'Current cart'}
        icon={ShoppingCart}
        right={cart?.updatedAt ? <span className="text-[12px] font-medium text-slate-400">Updated {timeAgo(cart.updatedAt, now)}</span> : null}
      >
        {cart?.itemCount ? (
          <>
            <ul className="divide-y divide-slate-100 -mx-1">
              {lines.map((l, i) => (
                <li key={`${l.name}-${l.variantTitle}-${i}`} className="flex items-center gap-3 px-1 py-3">
                  {l.image
                    ? <img src={l.image} alt="" width={48} height={48} loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200/80 shrink-0" />
                    : <span className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-slate-400" /></span>}
                  <div className="min-w-0 flex-grow">
                    <p className="text-[13px] font-bold text-slate-800 truncate">
                      {l.name || 'Product'}{l.variantTitle ? <span className="font-medium text-slate-500"> · {l.variantTitle}</span> : null}
                    </p>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      Qty {l.quantity}{typeof l.unitPrice === 'number' ? ` × ${money(l.unitPrice)}` : ''}
                    </p>
                    {l.path && <div className="mt-1"><PathChip path={l.path} /></div>}
                  </div>
                  <span className="text-[13px] font-bold text-slate-900 shrink-0">{typeof l.lineTotal === 'number' ? money(l.lineTotal) : '—'}</span>
                </li>
              ))}
            </ul>
            {lines.length === 0 && (
              <p className="text-[12px] text-slate-400 py-2">Item details weren't recorded for this cart.</p>
            )}
            <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px]">
              <span className="font-semibold text-slate-600">{cart.itemCount} item{cart.itemCount === 1 ? '' : 's'}</span>
              <span className="font-bold text-slate-900">{money(cart.value || 0)}</span>
            </div>
            <p className="text-[11.5px] text-slate-400 mt-1">Cart value before shipping and discounts, as shown in the store.</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingCart className="w-6 h-6 text-slate-300 mb-2" />
            <p className="text-[13px] font-semibold text-slate-600">Cart is empty</p>
            <p className="text-[12px] text-slate-400 mt-0.5">{isEarlierVisit ? 'Nothing was left in the cart when this visit ended.' : 'Items appear here as soon as they add them.'}</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Checkout" icon={CreditCard} right={checkout ? <Pill meta={CHECKOUT_STATUS[checkout.status]} /> : null}>
        {checkout ? (
          <div className="divide-y divide-slate-100">
            <Row label="Furthest step">{STAGE_LABEL[checkout.stage] || checkout.stage}</Row>
            <Row label="Payment method">{paymentMethodLabel(checkout.paymentMethod)}</Row>
            <Row label="Started">{dateTime(checkout.startedAt)}</Row>
            <Row label="Last activity">{dateTime(checkout.lastActivityAt)}</Row>
            {checkout.errorCount > 0 && (
              <Row label="Errors">
                <span className="inline-flex items-center gap-1 text-red-700"><AlertTriangle className="w-3.5 h-3.5" />{checkout.errorCount}{checkout.lastError ? ` · ${checkout.lastError}` : ''}</span>
              </Row>
            )}
            {checkout.orderId && (
              <Row label="Order"><Link to={`/admin/orders/${checkout.orderId}`} className="text-brand-blue hover:underline">View order</Link></Row>
            )}
          </div>
        ) : (
          <p className="text-[13px] text-slate-400 py-2">{card.checkoutStage ? 'Loading checkout…' : 'No checkout started in this visit.'}</p>
        )}
      </SectionCard>
    </div>
  );
}
