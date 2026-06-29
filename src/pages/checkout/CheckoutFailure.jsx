import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Logo from '../../components/Logo';

const CheckoutFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('reference') || '';
  const reason = searchParams.get('reason') || '';

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '520px', margin: '48px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {/* Error Banner */}
          <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', padding: '40px 40px 32px', textAlign: 'center', borderBottom: '1px solid #fecdd3' }}>
            <div style={{ width: '64px', height: '64px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <XCircle size={32} style={{ color: '#dc2626' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#7f1d1d', margin: '0 0 8px' }}>Payment Unsuccessful</h1>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
              Your payment could not be processed. Don't worry — no charges were made and your cart items are still saved.
            </p>
          </div>

          {/* Details */}
          <div style={{ padding: '32px 40px' }}>
            {reason && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '24px', border: '1px solid #fca5a5' }}>
                <strong>Reason:</strong> {reason}
              </div>
            )}

            {orderId && (
              <div style={{ background: '#f8fafc', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Reference</span>
                <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', margin: '4px 0 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>{orderId}</p>
              </div>
            )}

            <div style={{ background: '#fffbeb', padding: '16px 20px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #fde68a' }}>
              <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                <strong>Common reasons for payment failure:</strong>
              </p>
              <ul style={{ fontSize: '13px', color: '#78716c', margin: '8px 0 0', paddingLeft: '20px', lineHeight: 1.8 }}>
                <li>Insufficient funds on the card</li>
                <li>Card issuer declined the transaction</li>
                <li>Incorrect card details entered</li>
                <li>3D Secure authentication was not completed</li>
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/checkout"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '14px',
                  background: '#102a5c', color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700', textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(16, 42, 92, 0.2)',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={16} /> Try Again
              </Link>
              <Link
                to="/shop"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '14px',
                  background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowLeft size={14} /> Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;
