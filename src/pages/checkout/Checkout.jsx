import useCheckoutConfig from '../../hooks/useCheckoutConfig';
import BankCheckout from './BankCheckout';
import OrderRequestCheckout from './OrderRequestCheckout';

/**
 * /checkout — the checkout chosen in Admin → Settings → Checkout mode (asked fresh on each visit):
 * Order Request or Manual Bank Transfer / PayID.
 */
const Checkout = () => {
  const { config, error } = useCheckoutConfig();
  if (config?.mode === 'order_request') return <OrderRequestCheckout config={config} />;
  if (config?.mode === 'bank_transfer') return <BankCheckout config={config} />;
  // A load error, or a mode this version of the site does not know: never guess a checkout
  if (error || config) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'Poppins, "Poppins Fallback", sans-serif', padding: 20 }}>
        <div className="text-center max-w-sm">
          <h1 className="text-[20px] font-semibold text-slate-900">We couldn't load the checkout</h1>
          <p className="mt-2 text-[14px] text-slate-600">Please check your connection and try again. Your cart is saved.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 bg-[#102a5c] text-white text-[15px] font-semibold px-6 py-3 rounded-lg">Try again</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#102a5c] rounded-full animate-spin" aria-label="Loading checkout" />
    </div>
  );
};

export default Checkout;
