import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { trackEvent } from '../utils/analytics';

const DeferredTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // If the user is actively on the success page, the success page handles tracking natively.
    // We do not want to double-fire if both are running.
    if (location.pathname.includes('/checkout/success')) {
      return;
    }

    const checkDeferredTracking = async () => {
      const orderId = localStorage.getItem('solatide_last_order_id');
      if (!orderId) return;

      try {
        // Silently ask the backend for the order status
        const res = await apiService.getOrderById(orderId);
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
                country: ord.shippingAddress?.country || ord.tagadaShipping?.address?.countryCode || undefined,
              });

              // 2. GTM DataLayer
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'purchase',
                transaction_id: ord._id,
                value: ord.grandTotal || ord.totalAmount,
                currency: 'AUD',
                attribution_source: ord.attribution?.firstTouch?.source || 'Deferred / Unknown',
                attribution_channel: ord.attribution?.firstTouch?.channel || 'deferred',
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
            localStorage.removeItem('solatide_last_order_id');
          } else if (ord.paymentStatus === 'failed') {
            // If it failed, just clear it out so we stop checking.
            localStorage.removeItem('solatide_last_order_id');
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
