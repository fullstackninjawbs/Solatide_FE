import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { trackCartChange } from '../utils/analytics';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initial load from localStorage AFTER initial render to ensure deterministic hydration
    useEffect(() => {
        try {
            const item = window.localStorage.getItem('solatie_cart');
            if (item) {
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            }
        } catch (error) {
            console.warn('Error reading localStorage for cart', error);
        } finally {
            setIsCartInitialized(true);
        }
    }, []);

    // Keep every open tab in sync: another tab changed the cart → take its version, so a tab
    // that was already open never shows a stale cart or saves it over the other tab's items
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key !== 'solatie_cart') return;
            try {
                const parsed = e.newValue ? JSON.parse(e.newValue) : [];
                if (Array.isArray(parsed)) setCartItems(parsed);
            } catch (error) {
                console.warn('Error syncing cart from another tab', error);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Persist to localStorage only AFTER the cart has been initialized from storage.
    // Skipped when unchanged, so a cart taken from another tab is not written back.
    useEffect(() => {
        if (!isCartInitialized) return;
        try {
            const serialized = JSON.stringify(cartItems);
            if (window.localStorage.getItem('solatie_cart') !== serialized) {
                window.localStorage.setItem('solatie_cart', serialized);
            }
        } catch (error) {
            console.warn('Error setting localStorage for cart', error);
        }
    }, [cartItems, isCartInitialized]);

    // Analytics: cart changes are sent after the cart state updated, with the real new cart. A change
    // that was refused (stock limit) leaves the quantity as it was and is not sent. Changes taken
    // over from another tab are not this tab's actions and are not sent either.
    const pendingCartEvents = useRef([]);
    const sameItem = (item, id) => item.cartItemId === id || item.id === id || item._id === id;
    useEffect(() => {
        if (!pendingCartEvents.current.length) return;
        const events = pendingCartEvents.current;
        pendingCartEvents.current = [];
        try {
            for (const e of events) {
                const now = cartItems.find(i => sameItem(i, e.cartItemId));
                const qty = now ? now.quantity : 0;
                if (qty === e.beforeQty) continue;
                trackCartChange(e.type, now || e.item, qty - e.beforeQty, cartItems);
            }
        } catch { /* analytics never breaks the cart */ }
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
            const stock = availableStock || 0;
            if (currentQty + quantity > stock) {
                if (stock === 0) {
                    toast.error(`This item is currently out of stock`);
                } else if (currentQty >= stock) {
                    toast.error(`You already have the maximum available stock (${stock}) in your cart`);
                } else {
                    toast.error(`Only ${stock} units are currently available`);
                }
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
        pendingCartEvents.current.push({ type: 'add_to_cart', cartItemId, beforeQty: currentQty });
    };

    const removeFromCart = (cartItemId) => {
        const item = cartItems.find(i => sameItem(i, cartItemId));
        if (item) pendingCartEvents.current.push({ type: 'remove_from_cart', cartItemId, beforeQty: item.quantity, item });
        setCartItems(prevItems => prevItems.filter(item =>
            item.cartItemId !== cartItemId && item.id !== cartItemId && item._id !== cartItemId
        ));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        const current = cartItems.find(i => sameItem(i, cartItemId));
        if (current && current.quantity !== newQuantity) {
            pendingCartEvents.current.push({ type: 'cart_quantity_change', cartItemId, beforeQty: current.quantity, item: current });
        }

        setCartItems(prevItems => {
            const item = prevItems.find(i => i.cartItemId === cartItemId || i.id === cartItemId || i._id === cartItemId);
            if (item) {
                const inventoryPolicy = item.selectedVariant?.inventoryPolicy || item.inventoryPolicy;
                const continueSelling = item.continueSellingWhenOutOfStock;
                const availableStock = item.selectedVariant ? item.selectedVariant.stockQty : item.stockQuantity;

                if (inventoryPolicy !== 'continue' && !continueSelling) {
                    const stock = availableStock || 0;
                    if (newQuantity > stock) {
                        if (stock === 0) {
                            toast.error(`This item is currently out of stock`);
                        } else {
                            toast.error(`Only ${stock} units are currently available`);
                        }
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
