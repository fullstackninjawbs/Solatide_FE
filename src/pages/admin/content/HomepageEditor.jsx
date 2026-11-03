import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, ImageUp, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import builtInDesktopImage from '../../../assets/images/homePageFirstSection.webp';
import builtInMobileImage from '../../../assets/images/mobile_products_img.webp';

const STOREFRONT = import.meta.env.VITE_STOREFRONT_URL || '';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ICONS = [
  { value: 'none', label: 'No icon' },
  { value: 'au_flag', label: 'Australian flag' },
  { value: 'card_logos', label: 'Card logos (Visa, Mastercard, Apple Pay)' },
];

const input = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy focus:border-brand-navy outline-none text-[14px]';
const card = 'bg-white rounded-[16px] shadow-sm border border-slate-200 p-6 space-y-5';
const secondaryBtn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 disabled:opacity-50';

const Counter = ({ value, max }) => (
  <span className={`text-[12px] ${value.length > max ? 'text-red-600' : 'text-slate-400'}`}>{value.length}/{max}</span>
);

/** One hero image slot: preview, upload, back to the built-in image. */
const ImageField = ({ label, hint, image, builtIn, aspect, onChange }) => {
  const toast = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return toast.error('Please choose a JPG, PNG or WebP image.');
    if (file.size > MAX_UPLOAD_BYTES) return toast.error('The image is larger than 10 MB. Please choose a smaller file.');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiService.uploadAdminHomepageImage(form);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.data?.image) throw new Error(data?.message || 'Upload failed');
      onChange(data.data.image);
      toast.success('Image uploaded. Click “Save changes” to publish it.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-slate-700">{label}</span>
        <span className="text-[12px] text-slate-500">{image ? `Custom image · ${image.width} × ${image.height}px` : 'Built-in image'}</span>
      </div>
      <div className={`relative w-full ${aspect} rounded-xl overflow-hidden border border-slate-200 bg-slate-50`}>
        <img src={image?.url || builtIn} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <p className="text-[12px] text-slate-500">{hint}</p>
      <div className="flex flex-wrap gap-2">
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <button type="button" className={secondaryBtn} disabled={uploading} onClick={() => fileRef.current?.click()}>
          <ImageUp className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload new image'}
        </button>
        {image && (
          <button type="button" className={secondaryBtn} disabled={uploading} onClick={() => onChange(null)}>
            <RotateCcw className="h-4 w-4" /> Use built-in image
          </button>
        )}
      </div>
    </div>
  );
};

const HomepageEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getAdminHomepage();
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.data?.content) throw new Error(data?.message || 'Could not load the homepage content');
        const { hero, announcement } = data.data.content;
        setForm({ hero, announcement });
        setSaved({ hero, announcement });
        setLimits(data.data.limits);
      } catch (err) {
        setLoadError(err.message);
      }
    })();
  }, []);

  const dirty = form && saved && JSON.stringify(form) !== JSON.stringify(saved);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (loadError) return <p className="text-[14px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-left">{loadError}</p>;
  if (!form || !limits) return <p className="text-[14px] text-slate-500 text-left">Loading…</p>;

  const setHero = (patch) => setForm((f) => ({ ...f, hero: { ...f.hero, ...patch } }));
  const setAnnouncement = (patch) => setForm((f) => ({ ...f, announcement: { ...f.announcement, ...patch } }));
  const messages = form.announcement.messages;
  const setMessage = (i, patch) => setAnnouncement({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) });
  const moveMessage = (i, dir) => {
    const next = [...messages];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setAnnouncement({ messages: next });
  };

  const headlineLines = form.hero.headline.split('\n').length;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await apiService.updateAdminHomepage(form);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.data?.content) throw new Error(data?.message || 'Could not save the homepage');
      const { hero, announcement } = data.data.content;
      setForm({ hero, announcement });
      setSaved({ hero, announcement });
      toast.success(data.message || 'Homepage saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6 text-left font-sans pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Homepage</h2>
          <p className="text-slate-500 text-[14px]">The images and text at the top of the homepage, and the announcement bar above the menu on every page. The live site updates a few minutes after you save.</p>
        </div>
        {STOREFRONT && (
          <a href={STOREFRONT} target="_blank" rel="noreferrer" className={`${secondaryBtn} whitespace-nowrap shrink-0`}>
            <ExternalLink className="h-4 w-4" /> View homepage
          </a>
        )}
      </div>

      {/* Hero */}
      <section className={card} aria-labelledby="hero-heading">
        <h3 id="hero-heading" className="text-lg font-bold text-slate-800">Hero section</h3>

        <label className="block space-y-1">
          <span className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-700">Headline</span>
            <Counter value={form.hero.headline} max={limits.headline} />
          </span>
          <textarea className={input} rows={3} value={form.hero.headline} maxLength={limits.headline} onChange={(e) => setHero({ headline: e.target.value })} required />
          <span className={`text-[12px] ${headlineLines > limits.headlineLines ? 'text-red-600' : 'text-slate-500'}`}>
            Press Enter to start a new line on the site (at most {limits.headlineLines} lines). With two or more lines, the last line is shown in blue.
          </span>
        </label>

        <label className="block space-y-1">
          <span className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-700">Paragraph</span>
            <Counter value={form.hero.subtext} max={limits.subtext} />
          </span>
          <textarea className={input} rows={4} value={form.hero.subtext} maxLength={limits.subtext} onChange={(e) => setHero({ subtext: e.target.value })} required />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-700">Main button <span className="font-normal text-slate-400">(goes to the shop)</span></span>
              <Counter value={form.hero.primaryButtonText} max={limits.buttonText} />
            </span>
            <input className={input} value={form.hero.primaryButtonText} maxLength={limits.buttonText} onChange={(e) => setHero({ primaryButtonText: e.target.value })} placeholder="Shop Research Peptides" />
          </label>
          <label className="block space-y-1">
            <span className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-700">Second button <span className="font-normal text-slate-400">(goes to the COA Library)</span></span>
              <Counter value={form.hero.secondaryButtonText} max={limits.buttonText} />
            </span>
            <input className={input} value={form.hero.secondaryButtonText} maxLength={limits.buttonText} onChange={(e) => setHero({ secondaryButtonText: e.target.value })} placeholder="View COAs" />
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <label className="inline-flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 mt-0.5 accent-brand-navy" checked={form.hero.showBadge} onChange={(e) => setHero({ showBadge: e.target.checked })} />
            <span className="text-[14px] text-slate-700">
              <span className="font-semibold">Show the PepFinder card</span>
              <span className="block text-[12px] text-slate-500">PepFinder&apos;s official badge (live rating, updates by itself) with the text below, under the buttons. Links go to your PepFinder page.</span>
            </span>
          </label>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${form.hero.showBadge ? '' : 'opacity-60'}`}>
            {[
              ['badgeTitle', 'Card title', 'Ranked #1 Australian Supplier'],
              ['badgeSubtitle', 'Card subtitle', 'Independent supplier ranking'],
              ['badgeLinkText', 'Link text', 'View ranking'],
            ].map(([field, label, placeholder]) => (
              <label key={field} className="block space-y-1">
                <span className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-slate-700">{label}</span>
                  <Counter value={form.hero[field]} max={limits[field]} />
                </span>
                <input className={input} value={form.hero[field]} maxLength={limits[field]} onChange={(e) => setHero({ [field]: e.target.value })} placeholder={placeholder} />
              </label>
            ))}
          </div>
        </div>

        <label className="block space-y-1">
          <span className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-700">Disclaimer <span className="font-normal text-slate-400">(small text at the bottom)</span></span>
            <Counter value={form.hero.disclaimer} max={limits.disclaimer} />
          </span>
          <input className={input} value={form.hero.disclaimer} maxLength={limits.disclaimer} onChange={(e) => setHero({ disclaimer: e.target.value })} placeholder="For laboratory research only. Not for human use." />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
          <ImageField
            label="Desktop image"
            hint="Shown on computers (wider than 1024px). Landscape, at least 1672 × 941px. The headline sits on the left, so keep that side calm and put the products on the right."
            image={form.hero.desktopImage}
            builtIn={builtInDesktopImage}
            aspect="aspect-[16/9]"
            onChange={(desktopImage) => setHero({ desktopImage })}
          />
          <ImageField
            label="Mobile & tablet image"
            hint="Shown on phones and tablets, above the headline. Portrait, about 644 × 803px; the text below sits on a lilac background (#e4dbf8), so a matching image background blends in."
            image={form.hero.mobileImage}
            builtIn={builtInMobileImage}
            aspect="aspect-[4/5]"
            onChange={(mobileImage) => setHero({ mobileImage })}
          />
        </div>

        <label className="block space-y-1">
          <span className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-700">Image description <span className="font-normal text-slate-400">(for Google and screen readers)</span></span>
            <Counter value={form.hero.imageAlt} max={limits.imageAlt} />
          </span>
          <input className={input} value={form.hero.imageAlt} maxLength={limits.imageAlt} onChange={(e) => setHero({ imageAlt: e.target.value })} placeholder="e.g. Solatide research peptide vials" />
        </label>
      </section>

      {/* Announcement bar */}
      <section className={card} aria-labelledby="announcement-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 id="announcement-heading" className="text-lg font-bold text-slate-800">Announcement bar</h3>
            <p className="text-[13px] text-slate-500">The strip above the menu. With more than one message, they rotate every 10 seconds.</p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
            <input type="checkbox" className="h-4 w-4 accent-brand-navy" checked={form.announcement.enabled} onChange={(e) => setAnnouncement({ enabled: e.target.checked })} />
            <span className="text-[14px] font-semibold text-slate-700">Show on the site</span>
          </label>
        </div>

        <div className={`space-y-3 ${form.announcement.enabled ? '' : 'opacity-60'}`}>
          {messages.map((m, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <span className="text-[12px] font-semibold text-slate-400 w-5 shrink-0">{i + 1}.</span>
              <input className={`${input} sm:flex-1`} value={m.text} maxLength={limits.messageText} onChange={(e) => setMessage(i, { text: e.target.value })} placeholder="Message text" aria-label={`Message ${i + 1}`} required />
              <select className={`${input} sm:w-64 bg-white`} value={m.icon} onChange={(e) => setMessage(i, { icon: e.target.value })} aria-label={`Icon for message ${i + 1}`}>
                {ICONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex gap-1 shrink-0">
                <button type="button" className="p-2 text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-30" disabled={i === 0} onClick={() => moveMessage(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" className="p-2 text-slate-500 hover:text-slate-800 rounded-lg disabled:opacity-30" disabled={i === messages.length - 1} onClick={() => moveMessage(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" className="p-2 text-slate-500 hover:text-red-600 rounded-lg disabled:opacity-30" disabled={messages.length === 1} onClick={() => setAnnouncement({ messages: messages.filter((_, j) => j !== i) })} aria-label="Remove message"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {messages.length < limits.messages && (
            <button type="button" className={secondaryBtn} onClick={() => setAnnouncement({ messages: [...messages, { text: '', icon: 'none' }] })}>
              <Plus className="h-4 w-4" /> Add message
            </button>
          )}
        </div>
      </section>

      {/* Save bar */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur border border-slate-200 rounded-[16px] shadow-sm px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
        {error && <p className="text-[13px] text-red-600 mr-auto" role="alert">{error}</p>}
        {!error && dirty && <p className="text-[13px] text-amber-700 mr-auto">You have unsaved changes.</p>}
        {dirty && (
          <button type="button" className={secondaryBtn} disabled={saving} onClick={() => { setForm(saved); setError(''); }}>Discard</button>
        )}
        <AdminPrimaryButton type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save changes'}</AdminPrimaryButton>
      </div>
    </form>
  );
};

export default HomepageEditor;
