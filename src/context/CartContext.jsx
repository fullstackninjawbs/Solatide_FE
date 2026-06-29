import React, { createContext, useState, useEffect, useContext } from 'react';

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
        setCartItems(prevItems => {
            // Resolve the variant if it's not explicitly provided but the product has variants
            const resolvedVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
            const variantSku = resolvedVariant?.sku || '';
            const cartItemId = resolvedVariant 
                ? `${product._id || product.id || ''}-${variantSku}` 
                : `${product._id || product.id || ''}`;

            const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
            if (existingItem) {
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
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prevItems => prevItems.filter(item => 
            item.cartItemId !== cartItemId && item.id !== cartItemId && item._id !== cartItemId
        ));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.cartItemId === cartItemId || item.id === cartItemId || item._id === cartItemId)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
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

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotalCount,
            cartTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
