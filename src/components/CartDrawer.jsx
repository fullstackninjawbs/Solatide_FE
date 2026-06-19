import React, { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { 
        isCartOpen, 
        setIsCartOpen, 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        cartTotalCount, 
        cartTotalPrice 
    } = useCart();
    const navigate = useNavigate();
    const drawerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isCartOpen, setIsCartOpen]);

    const formatPrice = (priceStr) => {
        if (typeof priceStr === 'number') {
            return priceStr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        if (typeof priceStr === 'string') {
            const match = priceStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
            const numericPrice = match ? parseFloat(match[0]) : 0;
            return numericPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return priceStr;
    };
    
    const getNumericPrice = (priceStr) => {
        if (typeof priceStr === 'string') {
            const match = priceStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
            return match ? parseFloat(match[0]) : 0;
        }
        return priceStr || 0;
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/40 z-[1000] transition-opacity backdrop-blur-[2px]" />
            )}

            {/* Slide-out Drawer */}
            <div 
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ fontFamily: 'Poppins' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-[#1E1E1E]">
                        <h2 className="text-[20px] font-semibold">Cart</h2>
                        <span className="flex items-center justify-center bg-slate-100 text-slate-500 rounded-full w-6 h-6 text-xs font-bold">
                            {cartTotalCount}
                        </span>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-slate-400 hover:text-[#1E1E1E] transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            </div>
                            <p className="font-medium text-[#1E1E1E]">Your cart is currently empty.</p>
                            <button 
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate('/shop');
                                }}
                                className="mt-2 text-[#008fe2] font-semibold hover:text-[#007cc5] transition-colors"
                            >
                                Continue shopping →
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {cartItems.map((item) => (
                                <div key={item.id || item._id} className="flex gap-4">
                                    {/* Item Image */}
                                    <div className="w-20 h-20 bg-[#f8fafc] rounded-xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden p-2">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-slate-300 text-[10px]">No Img</div>
                                        )}
                                    </div>
                                    
                                    {/* Item Details */}
                                    <div className="flex flex-col flex-1 text-left">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-[14px] font-semibold text-[#1E1E1E] leading-tight">
                                                {item.name}
                                            </h3>
                                            <span className="text-[14px] font-semibold text-[#1E1E1E] whitespace-nowrap">
                                                Rs. {formatPrice(getNumericPrice(item.price) * item.quantity)}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 mt-1">Rs. {formatPrice(item.price)}</p>
                                        
                                        {/* Actions (Qty + Trash) */}
                                        <div className="flex items-center gap-4 mt-auto pt-2">
                                            {/* Qty Selector */}
                                            <div className="flex items-center bg-[#f8fafc] rounded-lg border border-slate-200">
                                                <button 
                                                    onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-black focus:outline-none"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-6 text-center text-[13px] font-semibold text-[#1E1E1E]">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-[#008fe2] hover:text-[#007cc5] focus:outline-none"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            
                                            {/* Trash */}
                                            <button 
                                                onClick={() => removeFromCart(item.id || item._id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-slate-100 p-6 bg-white flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[15px] text-[#1E1E1E] font-medium">Estimated total</span>
                            <span className="text-[18px] font-bold text-[#1E1E1E]">Rs. {formatPrice(cartTotalPrice)}</span>
                        </div>
                        <p className="text-[13px] text-slate-500 leading-relaxed">
                            Taxes included. Discounts and shipping calculated at checkout.
                        </p>
                        <button 
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-[#008fe2] hover:bg-[#007cc5] text-white text-[15px] font-bold py-4 rounded-xl transition-all shadow-sm focus:outline-none mt-2"
                        >
                            Check out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
