import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronDown, Hash, Package, Plus, Search, Trash2, UserCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../components/admin/AdminSecondaryButton';

/**
 * Admin → Discounts → create / edit. The hub applies discounts at our checkout:
 * code + usage limits + schedule + rules (all / any) + the order discount (percentage or fixed).
 */

const RULES = {
  cart_min_quantity: { label: 'Cart minimum quantity', help: 'The cart needs at least this many items. Products listed below do not count toward it.' },
  cart_total_min: { label: 'Cart total minimum', help: 'The items subtotal (before shipping) must be at least this amount.' },
  cart_total_max: { label: 'Cart total maximum', help: 'The items subtotal (before shipping) must be at most this amount.' },
  cart_contains_product: { label: 'Cart contains product', help: 'The cart must contain at least one of these products.' },
  excluded_products: { label: 'Excluded products', help: 'These products are never discounted (the cart needs at least one other item).' },
  max_product_quantity: { label: 'Max product quantity', help: 'No product in the cart may have more than this many units.' },
};
const RULE_ORDER = Object.keys(RULES);
const needsQty = (t) => t === 'cart_min_quantity' || t === 'max_product_quantity';
const needsAmount = (t) => t === 'cart_total_min' || t === 'cart_total_max';
const needsProducts = (t) => t === 'cart_min_quantity' || t === 'cart_contains_product' || t === 'excluded_products';

const toLocalInput = (d) => {
  if (!d) return '';
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return '';
  return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '');
const money = (n) => `A$${(Number(n) || 0).toFixed(2)}`;

function statusOf(f) {
  const now = Date.now();
  if (f.status === 'disabled') return 'disabled';
  if (f.activeTo && new Date(f.activeTo).getTime() < now) return 'expired';
  if (Number(f.maxUses) > 0 && Number(f.usesSoFar) >= Number(f.maxUses)) return 'expired';
  if (f.status === 'expired') return 'expired';
  if (f.activeFrom && new Date(f.activeFrom).getTime() > now) return 'scheduled';
  return 'active';
}
const STATUS_STYLE = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
  disabled: 'bg-red-50 text-red-600 border-red-200',
};

const Card = ({ title, subtitle, action, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
    {(title || action) && (
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {title && <h3 className="text-[16px] font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

const inputCls = 'w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15';

/** Chosen products (chips) + search to add more. value: [{ _id, name, imageUrl }] */
const ProductPicker = ({ value, onChange, help }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiService.getProducts(`${q.trim() ? `search=${encodeURIComponent(q.trim())}&` : ''}limit=20`);
        const json = await res.json();
        setResults(json.data?.products || json.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [q, open]);

  const has = (id) => value.some((p) => String(p._id) === String(id));
  const add = (p) => { if (!has(p._id)) onChange([...value, { _id: p._id, name: p.name, imageUrl: p.images?.[0]?.url || p.imageUrl || '' }]); };

  return (
    <div>
      {value.length > 0 && (
        <ul className="rounded-xl border border-slate-200 divide-y divide-slate-100 mb-2">
          {value.map((p) => (
            <li key={p._id} className="flex items-center gap-3 px-3 py-2">
              <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-contain" /> : <Package size={14} className="text-slate-400" />}
              </span>
              <span className="flex-1 min-w-0 text-[13.5px] text-slate-800 truncate">{p.name}</span>
              <button type="button" onClick={() => onChange(value.filter((x) => String(x._id) !== String(p._id)))} className="p-1.5 text-slate-400 hover:text-red-600" aria-label={`Remove ${p.name}`}><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
      )}
      {open ? (
        <div className="rounded-xl border border-slate-200 p-2">
          <div className="flex items-center gap-2 px-2">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="flex-1 h-9 text-[14px] outline-none bg-transparent" />
            <button type="button" onClick={() => { setOpen(false); setQ(''); }} className="p-1 text-slate-400 hover:text-slate-700" aria-label="Close product search"><X size={15} /></button>
          </div>
          <ul className="mt-1 max-h-60 overflow-y-auto">
            {loading && <li className="px-3 py-2 text-[13px] text-slate-400">Searching…</li>}
            {!loading && results.length === 0 && <li className="px-3 py-2 text-[13px] text-slate-400">No products found</li>}
            {!loading && results.map((p) => (
              <li key={p._id}>
                <button type="button" disabled={has(p._id)} onClick={() => add(p)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 disabled:opacity-50">
                  <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                    {p.images?.[0]?.url || p.imageUrl ? <img src={p.images?.[0]?.url || p.imageUrl} alt="" className="w-full h-full object-contain" /> : <Package size={14} className="text-slate-400" />}
                  </span>
                  <span className="flex-1 min-w-0 text-[13.5px] text-slate-800 truncate">{p.name}</span>
                  {has(p._id) && <span className="text-[12px] text-slate-400">Added</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="w-full h-10 rounded-xl border border-dashed border-slate-300 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5">
          <Plus size={15} />Add product
        </button>
      )}
      {help && <p className="mt-1.5 text-[12px] text-slate-500">{help}</p>}
    </div>
  );
};

const RuleCard = ({ rule, onChange, onRemove }) => {
  const meta = RULES[rule.type];
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <h4 className="text-[14px] font-semibold text-slate-800">{meta.label}</h4>
        <button type="button" onClick={onRemove} className="p-1.5 text-red-500 hover:text-red-700" aria-label={`Remove rule ${meta.label}`}><Trash2 size={16} /></button>
      </div>
      <div className="space-y-3">
        {needsQty(rule.type) && (
          <label className="block">
            <span className="block text-[13px] font-medium text-slate-700 mb-1">{rule.type === 'cart_min_quantity' ? 'Minimum quantity' : 'Maximum quantity per product'}</span>
            <input type="number" min="1" step="1" value={rule.quantity ?? ''} onChange={(e) => onChange({ ...rule, quantity: e.target.value })} className={inputCls} />
          </label>
        )}
        {needsAmount(rule.type) && (
          <label className="block">
            <span className="block text-[13px] font-medium text-slate-700 mb-1">{rule.type === 'cart_total_min' ? 'Minimum subtotal (A$)' : 'Maximum subtotal (A$)'}</span>
            <input type="number" min="0" step="0.01" value={rule.amount ?? ''} onChange={(e) => onChange({ ...rule, amount: e.target.value })} className={inputCls} />
          </label>
        )}
        {needsProducts(rule.type) && (
          <div>
            <span className="block text-[13px] font-medium text-slate-700 mb-1">{rule.type === 'cart_min_quantity' ? 'Excluded products' : 'Products'}</span>
            <ProductPicker
              value={rule.productDetails || []}
              onChange={(list) => onChange({ ...rule, productDetails: list })}
              help={rule.type === 'cart_min_quantity' ? 'Products in this list will not count toward the quantity requirement.' : null}
            />
          </div>
        )}
        <p className="text-[12px] text-slate-500">{meta.help}</p>
      </div>
    </div>
  );
};

const EMPTY = {
  code: '', type: 'percent', value: '', maxUses: '', perCustomerLimit: 0, usesSoFar: 0,
  activeFrom: '', activeTo: '', status: 'active', ruleMatch: 'all', rules: [],
};

const DiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ruleMenu, setRuleMenu] = useState(false);

  useEffect(() => {
    if (!isEditing) return undefined;
    let alive = true;
    apiService.getAdminDiscountById(id)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        const d = data?.data?.discount;
        if (!data.success || !d) { setError(data.message || 'Discount not found.'); return; }
        const rules = (d.rules || []).map((r) => ({ type: r.type, quantity: r.quantity ?? '', amount: r.amount ?? '', productDetails: r.productDetails || [] }));
        // Older discounts: single minimum purchase / quantity → shown (and saved) as rules
        if (Number(d.minPurchase) > 0) rules.push({ type: 'cart_total_min', amount: d.minPurchase, productDetails: [] });
        if (Number(d.minQuantity) > 0) rules.push({ type: 'cart_min_quantity', quantity: d.minQuantity, productDetails: [] });
        setForm({
          code: d.code || '',
          type: d.type || 'percent',
          value: d.value ?? '',
          maxUses: Number(d.maxUses) > 0 ? d.maxUses : '',
          perCustomerLimit: Number(d.perCustomerLimit) > 0 ? 1 : 0,
          usesSoFar: d.usesSoFar || 0,
          activeFrom: toLocalInput(d.activeFrom),
          activeTo: toLocalInput(d.activeTo),
          status: d.status === 'disabled' ? 'disabled' : 'active',
          ruleMatch: d.ruleMatch === 'any' ? 'any' : 'all',
          rules,
        });
      })
      .catch(() => alive && setError('Could not load the discount.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id, isEditing]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setRule = (i, r) => setForm((f) => ({ ...f, rules: f.rules.map((x, j) => (j === i ? r : x)) }));
  const removeRule = (i) => setForm((f) => ({ ...f, rules: f.rules.filter((_, j) => j !== i) }));
  const addRule = (type) => { setForm((f) => ({ ...f, rules: [...f.rules, { type, quantity: '', amount: '', productDetails: [] }] })); setRuleMenu(false); };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    set('code')(Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  const problems = () => {
    const p = [];
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(form.code.trim())) p.push('Enter a promotion code (letters, numbers, - or _).');
    const v = Number(form.value);
    if (!(v > 0)) p.push('Enter the discount amount.');
    if (form.type === 'percent' && v > 100) p.push('A percentage discount cannot be more than 100%.');
    if (form.maxUses !== '' && !(Number(form.maxUses) >= 1)) p.push('Usage limit must be 1 or more (or empty for unlimited).');
    if (form.activeFrom && form.activeTo && new Date(form.activeTo) <= new Date(form.activeFrom)) p.push('End date must be after the start date.');
    form.rules.forEach((r, i) => {
      const n = `Rule ${i + 1} (${RULES[r.type].label})`;
      if (needsQty(r.type) && !(Number.isInteger(Number(r.quantity)) && Number(r.quantity) >= 1)) p.push(`${n}: enter a quantity.`);
      if (needsAmount(r.type) && !(r.amount !== '' && Number(r.amount) >= 0)) p.push(`${n}: enter an amount.`);
      if ((r.type === 'cart_contains_product' || r.type === 'excluded_products') && !(r.productDetails || []).length) p.push(`${n}: add at least one product.`);
    });
    return p;
  };

  const save = async (e) => {
    e.preventDefault();
    const p = problems();
    if (p.length) { setError(p.join(' ')); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        maxUses: form.maxUses === '' ? 0 : Math.floor(Number(form.maxUses)),
        perCustomerLimit: form.perCustomerLimit ? 1 : 0,
        activeFrom: form.activeFrom ? new Date(form.activeFrom).toISOString() : null,
        activeTo: form.activeTo ? new Date(form.activeTo).toISOString() : null,
        status: form.status,
        ruleMatch: form.ruleMatch,
        rules: form.rules.map((r) => ({
          type: r.type,
          ...(needsQty(r.type) ? { quantity: Math.floor(Number(r.quantity)) } : {}),
          ...(needsAmount(r.type) ? { amount: Number(r.amount) } : {}),
          ...(needsProducts(r.type) ? { products: (r.productDetails || []).map((x) => x._id) } : {}),
        })),
        // replaced by rules
        minPurchase: 0,
        minQuantity: 0,
      };
      const res = await apiService.saveAdminDiscount(isEditing ? id : null, payload);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success(isEditing ? 'Discount saved' : 'Discount created');
        navigate('/admin/discounts');
      } else {
        setError(data.message || 'Failed to save the discount.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      setError('Error saving the discount.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete discount ${form.code}? Customers will no longer be able to use it. Past orders keep the code.`)) return;
    const res = await apiService.deleteAdminDiscount(id);
    if (res.ok || res.status === 204) { toast.success('Discount deleted'); navigate('/admin/discounts'); }
    else toast.error('Failed to delete the discount');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue" /></div>;
  }

  const status = statusOf(form);
  const valueLabel = form.value === '' ? '—' : form.type === 'percent' ? `${Number(form.value)}%` : money(form.value);

  return (
    <form onSubmit={save} noValidate className="space-y-6 text-left font-sans pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/discounts" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700" aria-label="Back to discounts"><ArrowLeft className="w-5 h-5" /></Link>
          <h2 className="text-2xl font-bold text-brand-navy">{isEditing ? form.code || 'Edit discount' : 'Create discount'}</h2>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && <AdminSecondaryButton type="button" onClick={remove}>Delete</AdminSecondaryButton>}
          <AdminPrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Save' : 'Create discount'}</AdminPrimaryButton>
        </div>
      </div>

      {error && <div role="alert" className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">{error}</div>}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-6">
          {/* Code */}
          <Card>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Promotion code</label>
            <div className="flex gap-2">
              <input value={form.code} onChange={(e) => set('code')(e.target.value.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase().slice(0, 64))} placeholder="e.g. BLACKFRIDAY2026" className={`${inputCls} uppercase`} />
              <button type="button" onClick={generateCode} className="shrink-0 h-10 px-3.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">Generate</button>
            </div>
            <p className="mt-1.5 text-[12px] text-slate-500">Customers enter this code at checkout (not case-sensitive).</p>
          </Card>

          {/* Usage limit */}
          <Card title="Usage limit" subtitle="Cap how many times this discount can be redeemed.">
            <label className="block">
              <span className="block text-[13px] font-medium text-slate-700 mb-1">Usage limit (optional)</span>
              <input type="number" min="1" step="1" value={form.maxUses} onChange={(e) => set('maxUses')(e.target.value)} placeholder="Unlimited" className={inputCls} />
            </label>
            <label className="mt-3 flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={!!form.perCustomerLimit} onChange={(e) => set('perCustomerLimit')(e.target.checked ? 1 : 0)} className="h-4 w-4 accent-brand-blue" />
              <span className="text-[13.5px] text-slate-700">Limit to one use per customer</span>
            </label>
            {isEditing && <p className="mt-3 text-[12.5px] text-slate-500">Used {form.usesSoFar} time{form.usesSoFar === 1 ? '' : 's'} so far.</p>}
          </Card>

          {/* Scheduling */}
          <Card title="Scheduling" subtitle="Both dates are optional. Leave empty for no time limit.">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[13px] font-medium text-slate-700 mb-1">Start date</span>
                <input type="datetime-local" value={form.activeFrom} onChange={(e) => set('activeFrom')(e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="block text-[13px] font-medium text-slate-700 mb-1">End date</span>
                <input type="datetime-local" value={form.activeTo} onChange={(e) => set('activeTo')(e.target.value)} className={inputCls} />
              </label>
            </div>
          </Card>

          {/* Rules */}
          <Card
            title="Rules"
            subtitle="Define conditions for this promotion to apply."
            action={(
              <div className="relative">
                <button type="button" onClick={() => setRuleMenu((o) => !o)} className="h-10 px-3.5 rounded-xl border border-slate-200 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2" aria-expanded={ruleMenu}>
                  <Plus size={15} />Add rule<ChevronDown size={15} className="text-slate-400" />
                </button>
                {ruleMenu && (
                  <ul className="absolute right-0 z-20 mt-1 w-60 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                    {RULE_ORDER.map((t) => (
                      <li key={t}><button type="button" onClick={() => addRule(t)} className="w-full text-left px-3.5 py-2 text-[13.5px] text-slate-700 hover:bg-slate-50">{RULES[t].label}</button></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          >
            <p className="text-[13px] font-medium text-slate-700 mb-2">Rule matching mode</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4" role="radiogroup" aria-label="Rule matching mode">
              {[['all', 'AND — Match all', 'The discount applies only if every condition matches.'], ['any', 'OR — Match any', 'The discount applies if at least one of the conditions matches.']].map(([v, t, d]) => (
                <button key={v} type="button" role="radio" aria-checked={form.ruleMatch === v} onClick={() => set('ruleMatch')(v)} className={`text-left rounded-xl border px-4 py-3 transition ${form.ruleMatch === v ? 'border-brand-blue ring-2 ring-brand-blue/15 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
                  <span className="block text-[14px] font-semibold text-slate-800">{t}</span>
                  <span className="block text-[12.5px] text-slate-500 mt-0.5">{d}</span>
                </button>
              ))}
            </div>
            {form.rules.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-slate-500">No rules added yet — the discount applies to any order. Add a rule to define when it should apply.</p>
            ) : (
              <div className="space-y-3">
                {form.rules.map((r, i) => <RuleCard key={i} rule={r} onChange={(x) => setRule(i, x)} onRemove={() => removeRule(i)} />)}
              </div>
            )}
          </Card>

          {/* Action */}
          <Card title="Actions" subtitle="Define what discount to apply.">
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="text-[14px] font-semibold text-slate-800 pb-3 mb-3 border-b border-slate-100">Order discount</h4>
              <span className="block text-[13px] font-medium text-slate-700 mb-1.5">Discount type</span>
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 mb-3" role="radiogroup" aria-label="Discount type">
                {[['percent', 'Percentage'], ['fixed', 'Fixed amount']].map(([v, t]) => (
                  <button key={v} type="button" role="radio" aria-checked={form.type === v} onClick={() => set('type')(v)} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition ${form.type === v ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>{t}</button>
                ))}
              </div>
              <label className="block">
                <span className="block text-[13px] font-medium text-slate-700 mb-1">{form.type === 'percent' ? 'Discount percentage' : 'Discount amount (A$)'}</span>
                <input type="number" min="0" max={form.type === 'percent' ? 100 : undefined} step={form.type === 'percent' ? '1' : '0.01'} value={form.value} onChange={(e) => set('value')(e.target.value)} className={inputCls} />
              </label>
              <p className="mt-1.5 text-[12px] text-slate-500">Taken off the items subtotal. Shipping is never discounted. One code per order.</p>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6 space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-slate-800">Summary</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border capitalize ${STATUS_STYLE[status]}`}>{status}</span>
            </div>
            <dl className="space-y-4 text-[13.5px]">
              <div>
                <dt className="text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase">Promotion code</dt>
                <dd className="mt-0.5 font-semibold text-slate-800">{form.code || 'No code yet'}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase"><CalendarDays size={13} />Schedule</dt>
                <dd className="mt-0.5 text-slate-700">{form.activeFrom || form.activeTo ? `${form.activeFrom ? fmtDate(form.activeFrom) : 'Now'} → ${form.activeTo ? fmtDate(form.activeTo) : 'No end date'}` : 'No date limit'}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase"><Hash size={13} />Usage limit</dt>
                <dd className="mt-0.5 text-slate-700">{form.maxUses ? `${form.maxUses} use${Number(form.maxUses) === 1 ? '' : 's'}` : 'Unlimited'}{isEditing ? ` · used ${form.usesSoFar}` : ''}</dd>
              </div>
              {!!form.perCustomerLimit && (
                <div>
                  <dt className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase"><UserCheck size={13} />Per customer</dt>
                  <dd className="mt-0.5 text-slate-700">Limit to one use per customer</dd>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100">
                <dt className="text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase">Rules{form.rules.length > 1 ? ` (${form.ruleMatch === 'any' ? 'any' : 'all'})` : ''}</dt>
                <dd className="mt-1">
                  {form.rules.length === 0 ? <span className="text-slate-500">No rules — applies without conditions.</span> : (
                    <ul className="space-y-1.5">
                      {form.rules.map((r, i) => (
                        <li key={i} className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md border border-slate-200 text-[12px] text-slate-700">{RULES[r.type].label}</span>
                          <span className="text-slate-500 text-[12.5px]">
                            {needsQty(r.type) && r.quantity !== '' ? `${r.type === 'cart_min_quantity' ? 'Min' : 'Max'} ${r.quantity} items` : ''}
                            {needsAmount(r.type) && r.amount !== '' ? money(r.amount) : ''}
                            {(r.type === 'cart_contains_product' || r.type === 'excluded_products') ? `${(r.productDetails || []).length} product${(r.productDetails || []).length === 1 ? '' : 's'}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <dt className="text-[11.5px] font-semibold tracking-wide text-slate-400 uppercase">Actions</dt>
                <dd className="mt-1 flex items-center gap-1.5"><span className="px-2 py-0.5 rounded-md border border-slate-200 text-[12px] text-slate-700">Order discount</span><span className="text-slate-700">{valueLabel}</span></dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-[14px] font-semibold text-slate-800 mb-2">Status</h3>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.status !== 'disabled'} onChange={(e) => set('status')(e.target.checked ? 'active' : 'disabled')} className="mt-0.5 h-4 w-4 accent-brand-blue" />
              <span>
                <span className="block text-[13.5px] text-slate-700">Enabled</span>
                <span className="block text-[12px] text-slate-500">Turn off to stop the code working without deleting it.</span>
              </span>
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default DiscountForm;
