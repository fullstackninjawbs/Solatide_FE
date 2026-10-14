import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { trackEvent, orderLocation } from '../utils/analytics';
import { LAST_ORDER_ID_KEY, LAST_ORDER_TOKEN_KEY } from '../hooks/useTagadaCheckout';

const DeferredTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // If the user is actively on the success page, the success page handles tracking natively.
    // We do not want to double-fire if both are running.
    if (location.pathname.includes('/checkout/success')) {
      return;
    }

    const checkDeferredTracking = async () => {
      let orderId = null;
      let accessToken = null;
      try {
        orderId = localStorage.getItem(LAST_ORDER_ID_KEY);
        accessToken = localStorage.getItem(LAST_ORDER_TOKEN_KEY);
      } catch { /* storage unavailable */ }
      if (!orderId || !accessToken) return; // public order lookup requires the access token

      try {
        // Silently ask the backend for the order status
        const res = await apiService.getOrderById(`${encodeURIComponent(orderId)}?accessToken=${encodeURIComponent(accessToken)}`);
        const data = await res.json();

        if (res.ok && data.success && data.data && data.data.order) {
          const ord = data.data.order;
          
          // If the order was fully paid but GTM wasn't fired yet
          if (ord.paymentStatus === 'succeeded' || ord.paymentStatus === 'paid') {
            const hasPushed = sessionStorage.getItem(`gtm_pushed_${ord._id}`);
            
            if (!hasPushed) {
              console.log('[Deferred Tracker] Recovered a missed purchase conversion!');
              
              // 1. Internal tracking
              trackEvent('purchase', {
                orderId: ord._id,
                cartValue: ord.grandTotal || ord.totalAmount,
                ...orderLocation(ord),
              });

              // 2. GTM DataLayer
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'purchase',
                transaction_id: ord._id,
                value: ord.grandTotal || ord.totalAmount,
                currency: 'AUD',
                attribution_source: (ord.attribution?.lastTouch?.source || ord.attribution?.firstTouch?.source) || 'Deferred / Unknown',
                attribution_channel: (ord.attribution?.lastTouch?.channel || ord.attribution?.firstTouch?.channel) || 'deferred',
                items: (ord.lineItems?.length > 0 ? ord.lineItems : ord.products)?.map(p => ({
                  item_name: p.title || p.product?.name || 'Unknown Product',
                  item_id: p.sku || p.product?._id || p.product,
                  price: p.unitPrice || p.price,
                  quantity: p.quantity
                })) || []
              });
              
              // Ensure it doesn't fire again this session
              sessionStorage.setItem(`gtm_pushed_${ord._id}`, 'true');
            }

            // We successfully processed this order. Remove it from local storage so we never check it again.
            localStorage.removeItem(LAST_ORDER_ID_KEY);
            localStorage.removeItem(LAST_ORDER_TOKEN_KEY);
          } else if (ord.paymentStatus === 'failed') {
            // If it failed, just clear it out so we stop checking.
            localStorage.removeItem(LAST_ORDER_ID_KEY);
            localStorage.removeItem(LAST_ORDER_TOKEN_KEY);
          }
        }
      } catch (err) {
        console.error('[Deferred Tracker] Error checking order status:', err);
      }
    };

    // Small delay to allow the page to render first before doing background network requests
    const timeoutId = setTimeout(checkDeferredTracking, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [location.pathname]);

  return null; // This component renders nothing.
};

export default DeferredTracker;
