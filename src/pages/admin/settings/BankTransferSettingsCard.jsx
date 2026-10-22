import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Landmark, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../../components/admin/AdminSecondaryButton';

/**
 * Settings → "Bank transfer & PayID checkout": the store's own checkout (no card processor).
 * When on, the storefront checkout shows PayID / Bank Transfer (Australia) or International Bank
 * Transfer, and the payment details below are shown to the customer after they place an order.
 */

const EMPTY = {
  enabled: false, accountName: '', bankName: '', bsb: '', accountNumber: '', payId: '', swiftBic: '',
  shippingFeeAU: '', shippingFeeInternational: '', freeShippingThresholdAU: '', internationalEnabled: true,
  unpaidCancelDays: 3, notifyAdminOnOrder: true,
};

const Text = ({ label, hint, value, onChange, placeholder, type = 'text' }) => (
  <label className="block">
    <span className="block text-[13px] font-medium text-slate-700 mb-1">{label}</span>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} step={type === 'number' ? '0.01' : undefined} min={type === 'number' ? '0' : undefined} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-[14px] outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
    {hint && <span className="block mt-1 text-[12px] text-slate-500">{hint}</span>}
  </label>
);

const Toggle = ({ label, hint, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-blue" />
    <span>
      <span className="block text-[14px] font-medium text-slate-800">{label}</span>
      {hint && <span className="block text-[12.5px] text-slate-500">{hint}</span>}
    </span>
  </label>
);

const BankTransferSettingsCard = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    apiService.getBankTransferSettings()
      .then((res) => res.json())
      .then((body) => { if (alive && body.success) setData(body.data); })
      .catch(() => toast.error('Failed to load bank transfer settings'));
    return () => { alive = false; };
  }, []);

  const s = data?.settings;
  const live = data?.checkout?.mode === 'bank_transfer';

  const openModal = () => {
    // Edit what is saved in the database; values that only come from the server .env are shown as hints
    const saved = data?.saved || {};
    const pick = (k) => (saved[k] === undefined || saved[k] === null ? EMPTY[k] : saved[k]);
    setForm(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, pick(k)])));
    setOpen(true);
  };
  const envHint = (k) => (s && s[k] && !(data?.saved || {})[k] ? `Currently from the server .env: ${s[k]}` : undefined);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      for (const k of ['shippingFeeAU', 'shippingFeeInternational', 'freeShippingThresholdAU']) {
        payload[k] = payload[k] === '' || payload[k] == null ? 0 : Number(payload[k]);
      }
      payload.unpaidCancelDays = payload.unpaidCancelDays === '' || payload.unpaidCancelDays == null ? 3 : Number(payload.unpaidCancelDays);
      const res = await apiService.updateBankTransferSettings(payload);
      const body = await res.json();
      if (res.ok && body.success) {
        setData(body.data);
        if (body.warning) toast(body.warning, { icon: '⚠️' });
        else toast.success('Bank transfer settings saved');
        setOpen(false);
      } else if (res.status === 403) {
        toast.error('Only a super admin can change the payment settings.');
      } else {
        toast.error(body.message || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const summary = !s
    ? 'Loading…'
    : live
      ? `On · ${[s.payId && 'PayID', s.bsb && 'Bank Transfer', data.checkout.methods.international.length && 'International'].filter(Boolean).join(', ')}`
      : s.enabled ? 'Switched on, but payment details are incomplete' : 'Off — checkout uses TagadaPay';

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Checkout</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button onClick={openModal} disabled={!s} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left group">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-slate-500 group-hover:text-slate-700"><Landmark size={20} strokeWidth={1.5} /></div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-slate-800 flex items-center gap-2">
                Bank transfer & PayID checkout
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${live ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{live ? 'Live' : 'Off'}</span>
              </h3>
              <p className="text-[14px] text-slate-500 mt-0.5">{summary}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Bank transfer & PayID checkout</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 p-4">
                <Toggle label="Use this checkout on the website" hint="Customers place the order on the website and pay by PayID / bank transfer. Turn off to go back to TagadaPay." checked={form.enabled} onChange={set('enabled')} />
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-3">Payment details shown to customers</h3>
                <p className="text-[12.5px] text-slate-500 mb-3">The account name must match the bank's records exactly (banks warn customers when it does not).</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Text label="Account name" hint={envHint('accountName')} value={form.accountName} onChange={set('accountName')} placeholder="Solatide Biosciences" />
                  <Text label="Bank" hint={envHint('bankName')} value={form.bankName} onChange={set('bankName')} placeholder="Commonwealth Bank of Australia" />
                  <Text label="BSB" hint={envHint('bsb')} value={form.bsb} onChange={set('bsb')} placeholder="067 873" />
                  <Text label="Account number" hint={envHint('accountNumber')} value={form.accountNumber} onChange={set('accountNumber')} placeholder="2248 6439" />
                  <Text label="PayID" hint={envHint('payId') || 'Leave empty to hide the PayID option.'} value={form.payId} onChange={set('payId')} placeholder="pay@yourdomain.com" />
                  <Text label="SWIFT / BIC" hint={envHint('swiftBic') || 'Needed for International Bank Transfer.'} value={form.swiftBic} onChange={set('swiftBic')} placeholder="CTBAAU2S" />
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-3">Shipping charged at checkout (AUD, incl. GST)</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Text type="number" label="Australia" value={form.shippingFeeAU} onChange={set('shippingFeeAU')} placeholder="0.00" />
                  <Text type="number" label="Free in Australia from" hint="0 = never free" value={form.freeShippingThresholdAU} onChange={set('freeShippingThresholdAU')} placeholder="0.00" />
                  <Text type="number" label="International" value={form.shippingFeeInternational} onChange={set('shippingFeeInternational')} placeholder="0.00" />
                </div>
                <div className="mt-3">
                  <Toggle label="Accept international orders" hint="Off: customers outside Australia can't place an order." checked={form.internationalEnabled} onChange={set('internationalEnabled')} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Text type="number" label="Cancel unpaid orders after (days)" hint="Releases the reserved stock. Runs only when the cancellation schedule is enabled on the server." value={form.unpaidCancelDays} onChange={set('unpaidCancelDays')} placeholder="3" />
                <div className="pt-6">
                  <Toggle label="Email me each new order" hint="Sent to the admin notification address, so you know to check the bank." checked={form.notifyAdminOnOrder} onChange={set('notifyAdminOnOrder')} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <AdminSecondaryButton onClick={() => setOpen(false)}>Cancel</AdminSecondaryButton>
              <AdminPrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</AdminPrimaryButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BankTransferSettingsCard;
