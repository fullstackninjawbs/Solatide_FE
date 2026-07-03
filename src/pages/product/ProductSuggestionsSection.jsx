import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { products } from '../../data/products';
import productVialImage from '../../assets/images/homePageFirstSection.webp';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';

const ProductSuggestionsSection = ({ currentProduct }) => {
    const scrollContainerRef = useRef(null);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await apiService.getProducts('limit=7');
                const result = await response.json();
                if (result.success && result.data && result.data.products) {
                    // Filter out current product
                    const filtered = result.data.products.filter(
                        p => p._id !== currentProduct._id && p.id !== currentProduct.id
                    ).slice(0, 5);
                    setSuggestedProducts(filtered);
                } else {
                    const fallback = products.filter(p => p.id !== currentProduct.id).slice(0, 5);
                    setSuggestedProducts(fallback);
                }
            } catch (error) {
                console.warn('Backend suggestions API unreachable. Using static fallback.');
                const fallback = products.filter(p => p.id !== currentProduct.id).slice(0, 5);
                setSuggestedProducts(fallback);
            }
        };

        if (currentProduct) {
            fetchSuggestions();
        }
    }, [currentProduct]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <div className="mt-20 max-w-[1440px] mx-auto text-left relative" style={{ fontFamily: 'Poppins' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 mb-8">
                <div>
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-wider uppercase block mb-1">
                        More Products
                    </span>
                    <h2 className="text-3xl sm:text-[36px] leading-tight font-semibold text-[#1E1E1E]">
                        You may also like:
                    </h2>
                </div>
                <Link
                    to="/shop"
                    className="text-[#008fe2] hover:text-[#007cc5] text-[14px] font-bold flex items-center gap-1.5 transition-colors focus:outline-none mt-2 sm:mt-0"
                >
                    <span className="whitespace-nowrap">View All Product</span>
                    <span className="text-[16px]">→</span>
                </Link>
            </div>

            {/* Slider container */}
            <div className="relative group">
                {/* Left Arrow Button */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] rounded-full bg-white border border-[#E8E8E8] shadow-md hover:bg-slate-50 text-[#6A6A6A] hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Horizontal Scrollable Row */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {suggestedProducts.map(product => (
                        <div
                            key={product._id || product.id}
                            className="w-[280px] sm:w-[310px] shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:border-slate-200/60 snap-start flex flex-col group/card"
                        >
                            {/* Product Image Link */}
                            <Link
                                to={`/product/${product.id || product._id}`}
                                className={`relative overflow-hidden ${product.imageUrl || product.image ? 'bg-white border border-slate-100/60' : 'bg-[#eef2f6]'} rounded-[18px] flex items-center justify-center w-full h-[240px] block`}
                            >
                                <img
                                    src={product.imageUrl || product.image || productVialImage}
                                    className={product.imageUrl || product.image
                                        ? `object-contain w-full h-full p-3 select-none transition-transform duration-500 group-hover/card:scale-105`
                                        : `object-cover object-center scale-[1.7] select-none transition-transform duration-500 group-hover/card:scale-[1.78] translate-y-3`
                                    }
                                    alt={product.name}
                                />

                                {/* Badges */}
                                {product.inStock ? (
                                    <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#eaf7ee] to-[#f0fdf4] px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-[12px] font-bold tracking-wide uppercase text-[#16a34a] border border-[#16a34a]/20 shadow-sm whitespace-nowrap">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16a34a] animate-pulse shrink-0"></div>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#fef2f2] to-[#fff5f5] px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-[12px] font-bold tracking-wide uppercase text-red-600 border border-red-200 shadow-sm whitespace-nowrap">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 animate-pulse shrink-0"></div>
                                        Sold Out
                                    </span>
                                )}

                                <span className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 inline-flex items-center gap-0.5 sm:gap-1.5 rounded-md bg-[#fef3c7]/90 backdrop-blur-sm px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-[13px] font-extrabold text-[#92400e] border border-[#f59e0b]/30 shadow-sm whitespace-nowrap">
                                    <Star className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 fill-[#f59e0b] stroke-[#f59e0b]" />
                                    <span>{product.rating || '5.0'}</span>
                                </span>
                            </Link>

                            {/* Info */}
                            <div className="flex flex-col flex-grow text-left mt-4 justify-between">
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#1E1E1E] tracking-tight leading-snug">
                                        <Link to={`/product/${product.id || product._id}`} className="hover:text-[#00bfef] transition-colors line-clamp-2">
                                            {product.name}
                                        </Link>
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[18px] sm:text-[20px] font-extrabold text-[#00bfef]">
                                        {formatPrice(product.price)}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            addToCart(product, 1);
                                        }}
                                        className={`h-11 w-11 rounded-full bg-[#edf4ff] text-[#214A9E] flex items-center justify-center hover:bg-[#214A9E] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none shadow-sm ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    onClick={scrollRight}
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] rounded-full bg-white border border-[#E8E8E8] shadow-md hover:bg-slate-50 text-[#6A6A6A] hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProductSuggestionsSection;
