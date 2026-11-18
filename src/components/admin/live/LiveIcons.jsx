// Device and traffic-source icons for the live activity views (lucide has no brand icons).
import { Monitor, Smartphone, Tablet, Search, Megaphone, Mail, Link2, Sparkles, MousePointerClick, Globe } from 'lucide-react';

export function DeviceIcon({ type, className = 'w-3.5 h-3.5' }) {
  const Icon = type === 'mobile' ? Smartphone : type === 'tablet' ? Tablet : Monitor;
  return <Icon className={className} aria-hidden="true" />;
}

// Small brand marks for the common sources (lucide has no brand icons)
const BRAND = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6h-4C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75"/><stop offset=".5" stopColor="#D62976"/><stop offset="1" stopColor="#4F5BD5"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="#fff"/></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1877F2"/><path fill="#fff" d="M13.4 19.5v-6.3h2.1l.3-2.5h-2.4V9.1c0-.7.2-1.2 1.2-1.2h1.3V5.7c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H8.7v2.5h2.1v6.3h2.6z"/></svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#111" d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.1-2.8V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7a4.5 4.5 0 0 1-4.4-4.7z"/></svg>
  ),
};

export function SourceIcon({ source, className = 'w-3.5 h-3.5' }) {
  const name = (source?.source || '').toLowerCase();
  const brand = ['google', 'instagram', 'facebook', 'tiktok'].find((b) => name.includes(b));
  if (brand) return <span className={`inline-block shrink-0 ${className}`}>{BRAND[brand]}</span>;
  const ch = source?.channel;
  const Icon = ch === 'organic_search' ? Search
    : ch === 'paid_search' || ch === 'paid_social' || ch === 'paid_other' ? Megaphone
      : ch === 'email' ? Mail
        : ch === 'ai' ? Sparkles
          : ch === 'referral' ? Link2
            : ch === 'direct' ? MousePointerClick : Globe;
  return <Icon className={`${className} text-slate-500`} aria-hidden="true" />;
}
