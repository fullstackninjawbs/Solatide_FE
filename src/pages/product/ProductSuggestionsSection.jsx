import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import productVialImage from '../../assets/images/homePageFirstSection.webp';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import { optimizeCloudinaryUrl } from '../../utils/imageOptimization';
import { getRouteData, sameData, toCardDto } from '../../utils/routeData';

const SUGGESTIONS_KEY = '/api/products?limit=7';
const pickSuggestions = (list, currentProduct) => (list || [])
    .filter(p => p._id !== currentProduct?._id && p.id !== currentProduct?.id)
    .slice(0, 5)
    .map(toCardDto);
const getEmbeddedSuggestions = (currentProduct) => {
    const body = getRouteData(SUGGESTIONS_KEY);
    return body && body.success && body.data && Array.isArray(body.data.products)
        ? pickSuggestions(body.data.products, currentProduct)
        : null;
};

const ProductSuggestionsSection = ({ currentProduct }) => {
    const scrollContainerRef = useRef(null);
    const [suggestedProducts, setSuggestedProducts] = useState(() => getEmbeddedSuggestions(currentProduct) || []);
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await apiService.getProducts('limit=7');
                const result = await response.json();
                if (result.success && result.data && result.data.products) {
                    // Filter out current product; only update state when the list actually changed
                    const filtered = pickSuggestions(result.data.products, currentProduct);
                    setSuggestedProducts(prev => (sameData(prev, filtered) ? prev : filtered));
                }
            } catch {
                // No static/sample fallback: keep embedded suggestions (if any), otherwise show none.
                console.warn('Backend suggestions API unreachable.');
            }
        };

        if (currentProduct) {
            fetchSuggestions();
        }
    }, [currentProduct?._id, currentProduct?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="mt-20 max-w-[1440px] mx-auto text-left relative" style={{ fontFamily: 'Poppins, "Poppins Fallback", sans-serif' }}>
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
                    to="/collections/all"
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
                    aria-label="Previous suggested products"
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
                                to={`/products/${product.slug || product._id || product.id}`}
                                className={`relative overflow-hidden ${product.imageUrl || product.image ? 'bg-white border border-slate-100/60' : 'bg-[#eef2f6]'} rounded-[18px] flex items-center justify-center w-full h-[240px] block`}
                            >
                                <img
                                    src={optimizeCloudinaryUrl(product.imageUrl || product.image, 600) || productVialImage}
                                    loading="lazy"
                                    decoding="async"
                                    className={product.imageUrl || product.image
                                        ? `object-contain w-full h-full p-3 select-none transition-transform duration-500 group-hover/card:scale-105`
                                        : `object-cover object-center scale-[1.7] select-none transition-transform duration-500 group-hover/card:scale-[1.78] translate-y-3`
                                    }
                                    alt={product.name}
                                />

                                {/* Badges */}
                                {product.inStock ? (
                                    <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#eaf7ee] to-[#f0fdf4] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide text-[#16a34a] border border-[#16a34a]/20 shadow-sm whitespace-nowrap">
                                        <span className="inline-block w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-[#16a34a] animate-pulse shrink-0"></span>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#fef2f2] to-[#fff5f5] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide text-red-600 border border-red-200 shadow-sm whitespace-nowrap">
                                        <span className="inline-block w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-red-600 animate-pulse shrink-0"></span>
                                        Sold Out
                                    </span>
                                )}

                                <span className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 inline-flex items-center gap-0.5 sm:gap-1 rounded-md bg-[#fef3c7]/90 backdrop-blur-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-[#92400e] border border-[#f59e0b]/30 shadow-sm whitespace-nowrap">
                                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#f59e0b] stroke-[#f59e0b]" />
                                    <span>{(product.ratingCount > 0 || product.reviewsCount > 0) ? product.rating : '0'}</span>
                                </span>
                            </Link>

                            {/* Info */}
                            <div className="flex flex-col flex-grow text-left mt-4 justify-between">
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#1E1E1E] tracking-tight leading-snug">
                                        <Link to={`/products/${product.slug || product._id || product.id}`} className="hover:text-[#00bfef] transition-colors line-clamp-2">
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
                                        aria-label={`Add ${product.name} to cart`}
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
                    aria-label="Next suggested products"
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
