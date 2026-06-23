import React, { useState, useEffect } from 'react';

// ─── Helper: mask API keys for display ───────────────────────────────────────
const maskKey = (key) => {
  if (!key || key === '****') return '';
  return key; // server already masks on GET; user enters full value on update
};

// ─── Sub-component: Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const configs = {
    idle: { bg: '#f1f5f9', color: '#64748b', label: 'Not tested' },
    loading: { bg: '#eff6ff', color: '#3b82f6', label: 'Testing…' },
    success: { bg: '#f0fdf4', color: '#16a34a', label: 'Connected ✓' },
    error: { bg: '#fef2f2', color: '#dc2626', label: 'Failed ✗' },
  };
  const cfg = configs[status] || configs.idle;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
      fontWeight: '600', background: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testStatus, setTestStatus] = useState('idle'); // idle | loading | success | error
  const [testMessage, setTestMessage] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const [form, setForm] = useState({
    tagadaEnv: 'sandbox',
    tagadaApiKeySandbox: '',
    tagadaApiKeyProd: '',
    tagadaWebhookSecret: '',
    tagadaEnabled: false,
  });

  const [showSandboxKey, setShowSandboxKey] = useState(false);
  const [showProdKey, setShowProdKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const token = () => localStorage.getItem('adminToken') || localStorage.getItem('token');

  // ── Load settings ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/tagada', {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = await res.json();
        if (data.success) {
          setForm((prev) => ({ ...prev, ...data.data }));
        }
      } catch (err) {
        console.error('Failed to load Tagada settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ── Auto-dismiss toast ─────────────────────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/tagada', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', msg: 'TagadaPay settings saved successfully' });
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  // ── Test connection ────────────────────────────────────────────────────────
  const handleTest = async () => {
    setTestStatus('loading');
    setTestMessage('');
    try {
      const res = await fetch('/api/admin/settings/tagada/test', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus('success');
        setTestMessage(data.message || 'Connection successful');
      } else {
        throw new Error(data.message || 'Connection failed');
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed — check your API key');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.loadingState}>
          <div style={s.spinner} />
          <span style={{ color: '#64748b' }}>Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Toast notification */}
      {toast && (
        <div style={{ ...s.toast, ...(toast.type === 'success' ? s.toastSuccess : s.toastError) }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h2 style={s.pageTitle}>Payment & Billing</h2>
          <p style={s.pageSub}>Configure your payment gateway credentials and preferences.</p>
        </div>
        <button id="payment-settings-save-btn" onClick={handleSave} disabled={saving} style={{
          ...s.primaryBtn, ...(saving ? s.primaryBtnDisabled : {}),
        }}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* ── TagadaPay Section ── */}
      <div style={s.card}>
        {/* Card header */}
        <div style={s.cardHeader}>
          <div style={s.gatewayBadge}>
            <span style={s.gatewayIcon}>💳</span>
            <div>
              <h3 style={s.cardTitle}>TagadaPay</h3>
              <p style={s.cardSub}>Credit / debit card payments via TagadaPay gateway</p>
            </div>
          </div>
          <div style={s.headerRight}>
            {/* Enabled toggle */}
            <label style={s.toggleRow} htmlFor="tagada-enabled-toggle">
              <span style={s.toggleLabel}>
                {form.tagadaEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <div
                id="tagada-enabled-toggle"
                role="switch"
                aria-checked={form.tagadaEnabled}
                onClick={() => handleChange('tagadaEnabled', !form.tagadaEnabled)}
                style={{
                  ...s.toggle,
                  background: form.tagadaEnabled ? '#0f4c81' : '#cbd5e1',
                }}
              >
                <div style={{
                  ...s.toggleThumb,
                  transform: form.tagadaEnabled ? 'translateX(22px)' : 'translateX(2px)',
                }} />
              </div>
            </label>
          </div>
        </div>

        <div style={s.divider} />

        {/* Environment toggle */}
        <div style={s.fieldGroup}>
          <label style={s.label}>Environment</label>
          <p style={s.fieldHint}>
            Use <strong>Sandbox</strong> for testing. Switch to <strong>Production</strong> only when go-live ready.
          </p>
          <div style={s.envToggle}>
            {['sandbox', 'prod'].map((env) => (
              <button
                key={env}
                id={`tagada-env-${env}`}
                onClick={() => handleChange('tagadaEnv', env)}
                style={{
                  ...s.envBtn,
                  ...(form.tagadaEnv === env ? s.envBtnActive : {}),
                }}
              >
                {env === 'sandbox' ? '🧪 Sandbox' : '🚀 Production'}
              </button>
            ))}
          </div>
          <div style={{
            ...s.envInfo,
            background: form.tagadaEnv === 'sandbox' ? '#fffbeb' : '#f0fdf4',
            borderColor: form.tagadaEnv === 'sandbox' ? '#fde68a' : '#bbf7d0',
          }}>
            <span style={{ fontSize: '13px', color: form.tagadaEnv === 'sandbox' ? '#92400e' : '#166534' }}>
              {form.tagadaEnv === 'sandbox'
                ? '🧪 Sandbox mode — transactions are simulated and no real charges are made'
                : '🚀 Production mode — real charges will be processed'}
            </span>
          </div>
        </div>

        {/* Sandbox API Key */}
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="tagada-sandbox-key">Sandbox API Key</label>
          <p style={s.fieldHint}>Used when environment is set to Sandbox.</p>
          <div style={s.inputWrapper}>
            <input
              id="tagada-sandbox-key"
              type={showSandboxKey ? 'text' : 'password'}
              value={form.tagadaApiKeySandbox}
              onChange={(e) => handleChange('tagadaApiKeySandbox', e.target.value)}
              placeholder="Enter sandbox API key…"
              style={s.input}
            />
            <button style={s.eyeBtn} onClick={() => setShowSandboxKey((v) => !v)} type="button">
              {showSandboxKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Production API Key */}
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="tagada-prod-key">Production API Key</label>
          <p style={s.fieldHint}>Used when environment is set to Production. Keep this secret.</p>
          <div style={s.inputWrapper}>
            <input
              id="tagada-prod-key"
              type={showProdKey ? 'text' : 'password'}
              value={form.tagadaApiKeyProd}
              onChange={(e) => handleChange('tagadaApiKeyProd', e.target.value)}
              placeholder="Enter production API key…"
              style={s.input}
            />
            <button style={s.eyeBtn} onClick={() => setShowProdKey((v) => !v)} type="button">
              {showProdKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Webhook Secret */}
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="tagada-webhook-secret">Webhook Secret</label>
          <p style={s.fieldHint}>
            Used to verify HMAC-SHA256 signatures on incoming webhook events from TagadaPay.
          </p>
          <div style={s.inputWrapper}>
            <input
              id="tagada-webhook-secret"
              type={showWebhookSecret ? 'text' : 'password'}
              value={form.tagadaWebhookSecret}
              onChange={(e) => handleChange('tagadaWebhookSecret', e.target.value)}
              placeholder="Enter webhook secret…"
              style={s.input}
            />
            <button style={s.eyeBtn} onClick={() => setShowWebhookSecret((v) => !v)} type="button">
              {showWebhookSecret ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Webhook endpoint info */}
        <div style={s.webhookInfo}>
          <div style={s.webhookHeader}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" />
            </svg>
            <strong style={{ fontSize: '13px', color: '#0f4c81' }}>Webhook Endpoint</strong>
          </div>
          <p style={{ margin: '4px 0 8px', fontSize: '12px', color: '#64748b' }}>
            Configure this URL in your TagadaPay dashboard to receive payment status events:
          </p>
          <code style={s.webhookUrl}>
            {window.location.origin.replace('5173', '5000')}/api/payments/tagada/webhook
          </code>
        </div>

        <div style={s.divider} />

        {/* Test connection */}
        <div style={s.testSection}>
          <div>
            <h4 style={s.testTitle}>Test Connection</h4>
            <p style={s.testSub}>
              Verify your current API key and environment settings by making a live request to TagadaPay.
            </p>
            {testMessage && (
              <p style={{
                margin: '6px 0 0',
                fontSize: '13px',
                color: testStatus === 'success' ? '#16a34a' : '#dc2626',
              }}>
                {testMessage}
              </p>
            )}
          </div>
          <div style={s.testRight}>
            <StatusBadge status={testStatus} />
            <button
              id="tagada-test-connection-btn"
              onClick={handleTest}
              disabled={testStatus === 'loading'}
              style={{
                ...s.testBtn,
                ...(testStatus === 'loading' ? s.testBtnDisabled : {}),
              }}
            >
              {testStatus === 'loading' ? (
                <>
                  <div style={s.miniSpinner} />
                  Testing…
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Other Payment Methods (placeholder) ── */}
      <div style={{ ...s.card, opacity: 0.6 }}>
        <div style={s.cardHeader}>
          <div style={s.gatewayBadge}>
            <span style={s.gatewayIcon}>🏦</span>
            <div>
              <h3 style={s.cardTitle}>PayID / Bank Transfer</h3>
              <p style={s.cardSub}>Manual payment processing — managed via order fulfilment</p>
            </div>
          </div>
          <span style={s.comingSoon}>Active</span>
        </div>
        <div style={s.divider} />
        <p style={{ fontSize: '13px', color: '#64748b', padding: '4px 0' }}>
          PayID and bank transfer orders are managed manually. Use the Orders dashboard to confirm payments
          and proceed with fulfilment. Auto-cancel for unpaid orders runs every 15 minutes.
        </p>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: '900px',
    position: 'relative',
  },
  loadingState: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '40px',
    color: '#64748b', fontSize: '14px',
  },
  spinner: {
    width: '20px', height: '20px',
    border: '3px solid #e2e8f0', borderTopColor: '#0f4c81',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
  toast: {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease',
  },
  toastSuccess: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  toastError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '28px', gap: '16px',
  },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' },
  pageSub: { fontSize: '14px', color: '#64748b', margin: 0 },
  primaryBtn: {
    background: 'linear-gradient(135deg, #0f4c81 0%, #1a6eb5 100%)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '10px 24px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', transition: 'opacity 0.15s', flexShrink: 0,
  },
  primaryBtnDisabled: { opacity: 0.65, cursor: 'not-allowed' },
  card: {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: '20px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    marginBottom: '20px',
  },
  cardHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: '16px',
  },
  gatewayBadge: { display: 'flex', alignItems: 'center', gap: '14px' },
  gatewayIcon: {
    fontSize: '28px', width: '48px', height: '48px',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px' },
  cardSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 },
  toggleRow: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  toggleLabel: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  toggle: {
    width: '44px', height: '24px', borderRadius: '12px',
    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
  },
  toggleThumb: {
    position: 'absolute', top: '2px', width: '20px', height: '20px',
    background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  divider: { height: '1px', background: '#f1f5f9', margin: '24px 0' },
  fieldGroup: { marginBottom: '24px' },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '700',
    color: '#374151', marginBottom: '4px',
  },
  fieldHint: { fontSize: '12px', color: '#94a3b8', margin: '0 0 10px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: {
    width: '100%', padding: '11px 44px 11px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', color: '#0f172a', background: '#fff',
    outline: 'none', fontFamily: 'monospace', letterSpacing: '0.05em',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '16px', padding: '0',
  },
  envToggle: { display: 'flex', gap: '8px', marginBottom: '10px' },
  envBtn: {
    padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
    background: '#fff', color: '#64748b', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  envBtnActive: {
    borderColor: '#0f4c81', background: '#eff6ff', color: '#0f4c81',
  },
  envInfo: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid',
    marginTop: '4px',
  },
  webhookInfo: {
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: '12px', padding: '16px', marginTop: '8px',
  },
  webhookHeader: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' },
  webhookUrl: {
    display: 'block', background: '#0f172a', color: '#7dd3fc',
    padding: '10px 14px', borderRadius: '8px', fontSize: '12px',
    letterSpacing: '0.02em', overflowX: 'auto', whiteSpace: 'nowrap',
  },
  testSection: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: '24px',
  },
  testTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  testSub: { fontSize: '13px', color: '#64748b', margin: 0 },
  testRight: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginTop: '2px' },
  testBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '9px 18px', borderRadius: '10px',
    border: '1.5px solid #0f4c81', background: '#fff',
    color: '#0f4c81', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  testBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  miniSpinner: {
    width: '14px', height: '14px',
    border: '2px solid #bfdbfe', borderTopColor: '#0f4c81',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
  comingSoon: {
    fontSize: '11px', fontWeight: '700', background: '#dcfce7',
    color: '#16a34a', padding: '4px 10px', borderRadius: '20px', flexShrink: 0,
  },
};

// Inject keyframes
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
`;
if (!document.head.querySelector('[data-payment-settings-styles]')) {
  styleEl.setAttribute('data-payment-settings-styles', '');
  document.head.appendChild(styleEl);
}

export default PaymentSettings;
