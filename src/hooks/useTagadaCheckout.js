import { useState } from 'react';
import { apiService } from '../services/api';
import { getCheckoutAttributionPayload } from '../utils/attribution';
import { getVisitorContext } from '../utils/analytics';

// localStorage keys shared with CheckoutSuccess.jsx
export const LAST_ORDER_ID_KEY = 'solatide_last_order_id';
// Read by OrderStatus.jsx as well.
export const LAST_ORDER_TOKEN_KEY = 'lastOrderAccessToken';

/** Server-side resolution needs the product, the selected variant and an integer quantity. */
const toCheckoutItem = (item) => {
  const variant = item.selectedVariant || null;
  const quantity = Math.min(100, Math.max(1, Math.floor(Number(item.quantity) || 1)));
  return {
    productId: item._id || item.product || item.id,
    variantId: variant?._id || undefined,
    tagadaVariantId: variant?.tagadaVariantId || undefined,
    quantity,
  };
};

export const useTagadaCheckout = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const initiateCheckout = async (items) => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      if (!items || items.length === 0) {
        throw new Error('No items provided for checkout.');
      }

      const checkoutItems = items.map(toCheckoutItem);

      // 1) Create a placeholder order. Tagada collects shipping & email securely.
      const orderRes = await apiService.createOrder({
        products: checkoutItems.map((i) => ({
          product: i.productId,
          variant: i.variantId,
          tagadaVariantId: i.tagadaVariantId,
          quantity: i.quantity,
        })),
        shippingAddress: 'Provided via TagadaPay',
        customerEmail: '',
        customerName: '',
        paymentMethod: 'tagada',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      const createdOrder = orderData.data?.order || {};
      const orderId = createdOrder._id;
      const createToken = createdOrder.publicAccessToken || orderData.data?.publicAccessToken || orderData.data?.accessToken || orderData.publicAccessToken;

      // 2) Initiate Tagada Checkout Session — the server re-resolves variants, prices and stock.
      const attribution = getCheckoutAttributionPayload();
      const visitor = await getVisitorContext(); // analytics session + location (never blocks > 2.5 s)
      const payRes = await apiService.createTagadaPayment({
        orderId,
        accessToken: createToken,
        items: checkoutItems,
        attribution,
        visitor,
      });
      const payData = await payRes.json();

      if (!payRes.ok) throw new Error(payData.message || 'TagadaPay checkout initiation failed');

      // 3) Redirect to Tagada Hosted Checkout Page
      if (payData.checkoutUrl) {
        // Persist orderId + access token so the success page can sync/fetch this order only.
        try {
          localStorage.setItem(LAST_ORDER_ID_KEY, orderId);
          const token = payData.accessToken || createToken;
          if (token) localStorage.setItem(LAST_ORDER_TOKEN_KEY, token);
        } catch {
          // Storage unavailable (private mode) — success page will show the generic state.
        }
        window.location.href = payData.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from TagadaPay');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
      setIsCheckingOut(false);
    }
  };

  return { initiateCheckout, isCheckingOut, checkoutError, setCheckoutError };
};
