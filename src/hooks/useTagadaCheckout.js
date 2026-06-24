import { useState } from 'react';
import { apiService } from '../services/api';

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

      // 1) Create a placeholder order. Tagada collects shipping & email securely.
      const orderRes = await apiService.createOrder({
        products: items.map((item) => ({ product: item._id, quantity: item.quantity ?? 1 })),
        shippingAddress: 'Provided via TagadaPay',
        customerEmail: '',
        customerName: '',
        paymentMethod: 'tagada',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      const orderId = orderData.data.order._id;

      // 2) Initiate Tagada Checkout Session
      const payRes = await apiService.createTagadaPayment({ orderId });
      const payData = await payRes.json();
      
      if (!payRes.ok) throw new Error(payData.message || 'TagadaPay checkout initiation failed');

      // 3) Redirect to Tagada Hosted Checkout Page
      if (payData.checkoutUrl) {
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

  return { initiateCheckout, isCheckingOut, checkoutError };
};
