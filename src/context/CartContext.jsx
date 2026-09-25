import React, { createContext, useState, useEffect, useContext } from 'react';
import { trackEvent } from '../utils/analytics';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const item = window.localStorage.getItem('solatie_cart');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage for cart', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            window.localStorage.setItem('solatie_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.warn('Error setting localStorage for cart', error);
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1, selectedVariant = null) => {
        const resolvedVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
        const variantSku = resolvedVariant?.sku || '';
        const cartItemId = resolvedVariant
            ? `${product._id || product.id || ''}-${variantSku}`
            : `${product._id || product.id || ''}`;
            
        const inventoryPolicy = resolvedVariant?.inventoryPolicy || product.inventoryPolicy;
        const continueSelling = product.continueSellingWhenOutOfStock;
        const availableStock = resolvedVariant ? resolvedVariant.stockQty : product.stockQuantity;

        const existingItem = cartItems.find(item => item.cartItemId === cartItemId);
        const currentQty = existingItem ? existingItem.quantity : 0;
        
        if (inventoryPolicy !== 'continue' && !continueSelling) {
            if (currentQty + quantity > (availableStock || 0)) {
                import('react-hot-toast').then(({ toast }) => toast.error(`You can't add more than ${availableStock || 0} units to the cart`));
                return; // Do not update cart or open cart drawer
            }
        }

        setCartItems(prevItems => {
            const existingInPrev = prevItems.find(item => item.cartItemId === cartItemId);
            if (existingInPrev) {
                return prevItems.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, {
                ...product,
                quantity,
                selectedVariant: resolvedVariant,
                cartItemId,
                price: resolvedVariant ? resolvedVariant.price : product.price,
                sku: resolvedVariant ? resolvedVariant.sku : product.sku,
                image: product.imageUrl || product.image
            }];
        });
        
        setIsCartOpen(true);
        // Analytics: fire add_to_cart
        try {
            const resolvedVariantForAnalytics = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
            const price = resolvedVariantForAnalytics ? resolvedVariantForAnalytics.price : product.price;
            const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
            trackEvent('add_to_cart', {
                productId: product._id || product.id,
                productName: product.name || 'Research Compound',
                cartValue: (numericPrice || 0) * quantity,
                path: window.location.pathname
            });
        } catch { /* analytics never breaks the cart */ }
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prevItems => prevItems.filter(item =>
            item.cartItemId !== cartItemId && item.id !== cartItemId && item._id !== cartItemId
        ));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCartItems(prevItems => {
            const item = prevItems.find(i => i.cartItemId === cartItemId || i.id === cartItemId || i._id === cartItemId);
            if (item) {
                const inventoryPolicy = item.selectedVariant?.inventoryPolicy || item.inventoryPolicy;
                const continueSelling = item.continueSellingWhenOutOfStock;
                const availableStock = item.selectedVariant ? item.selectedVariant.stockQty : item.stockQuantity;

                if (inventoryPolicy !== 'continue' && !continueSelling) {
                    if (newQuantity > (availableStock || 0)) {
                        import('react-hot-toast').then(({ toast }) => toast.error(`Only ${availableStock || 0} units available in stock`));
                        return prevItems; // Prevent update
                    }
                }
            }

            return prevItems.map(i =>
                (i.cartItemId === cartItemId || i.id === cartItemId || i._id === cartItemId)
                    ? { ...i, quantity: newQuantity }
                    : i
            );
        });
    };

    const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // We parse the price string from products (e.g. "Rs. 1,400.00") into a number.
    const cartTotalPrice = cartItems.reduce((total, item) => {
        let numericPrice = item.price;
        if (typeof item.price === 'string') {
            const match = item.price.replace(/,/g, '').match(/\d+(\.\d+)?/);
            numericPrice = match ? parseFloat(match[0]) : 0;
        }
        return total + ((parseFloat(numericPrice) || 0) * item.quantity);
    }, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotalCount,
            cartTotalPrice,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
