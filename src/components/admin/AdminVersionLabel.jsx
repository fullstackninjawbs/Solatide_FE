/* global __APP_VERSION__, __APP_COMMIT__ */
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

// Built in by vite.config.js from package.json + git (see CHANGELOG.md)
const ADMIN_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const ADMIN_COMMIT = typeof __APP_COMMIT__ !== 'undefined' ? __APP_COMMIT__ : 'unknown';

/**
 * Admin sidebar footer: which release is running. Admin (this bundle) and API (the backend) are
 * deployed together and should match; a difference means one of them was not deployed yet.
 */
export default function AdminVersionLabel({ compact = false }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    let alive = true;
    apiService.getBackendVersion()
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (alive && body?.success) setApi(body.data); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const mismatch = !!api && api.version !== ADMIN_VERSION;
  const title = `Admin v${ADMIN_VERSION} (${ADMIN_COMMIT})${api ? ` · API v${api.version} (${api.commit}), started ${new Date(api.startedAt).toLocaleString()}` : ''}${mismatch ? ' — versions differ: one of them is not deployed yet' : ''}`;

  if (compact) {
    return <p className={`text-center text-[10px] ${mismatch ? 'text-amber-600 font-semibold' : 'text-slate-400'}`} title={title}>v{ADMIN_VERSION}</p>;
  }
  return (
    <p className={`px-4 text-[11px] leading-snug ${mismatch ? 'text-amber-600 font-semibold' : 'text-slate-400'}`} title={title}>
      {mismatch
        ? <>Admin v{ADMIN_VERSION} · API v{api.version} — versions differ</>
        : <>v{ADMIN_VERSION} <span className="text-slate-300">·</span> {ADMIN_COMMIT}</>}
    </p>
  );
}
