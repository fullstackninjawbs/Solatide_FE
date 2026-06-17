import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { products } from '../../data/products';
import productVialImage from '../../assets/images/homePageFirstSection.png';

const ProductSuggestionsSection = ({ currentProduct }) => {
    const scrollContainerRef = useRef(null);

    // Get 5 products, excluding the current product
    const suggestedProducts = products.filter(p => p.id !== currentProduct.id).slice(0, 6);

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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-wider uppercase block mb-1">
                        More Products
                    </span>
                    <h2 className="text-3xl sm:text-[36px] font-semibold text-[#1E1E1E]">
                        You may also like:
                    </h2>
                </div>
                <Link
                    to="/shop"
                    className="text-[#008fe2] hover:text-[#007cc5] text-[14px] font-bold flex items-center gap-1.5 transition-colors focus:outline-none"
                >
                    <span>View All Product</span>
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
                            key={product.id}
                            className="w-[280px] sm:w-[310px] shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:border-slate-200/60 snap-start flex flex-col group/card"
                        >
                            {/* Product Image Link */}
                            <Link
                                to={`/product/${product.id}`}
                                className="relative overflow-hidden bg-[#eef2f6] rounded-[18px] flex items-center justify-center border border-slate-100/50 w-full h-[240px] block"
                            >
                                <img
                                    src={product.image || productVialImage}
                                    className="object-cover object-center scale-[1.7] select-none transition-transform duration-500 group-hover/card:scale-[1.78] translate-y-3"
                                    alt={product.name}
                                />

                                {/* Badges */}
                                {product.inStock ? (
                                    <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-0.5 text-[9px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[#fef2f2] px-2.5 py-0.5 text-[9px] font-bold text-red-600 border border-red-200">
                                        Sold Out
                                    </span>
                                )}

                                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-extrabold text-[#d97706] shadow-sm">
                                    <Star className="h-3 w-3 fill-[#d97706] stroke-[#d97706]" />
                                    <span>{product.rating || '5.0'}</span>
                                </span>
                            </Link>

                            {/* Info */}
                            <div className="flex flex-col flex-grow text-left mt-4 justify-between">
                                 <div>
                                     <h3 className="text-[16px] font-bold text-[#1E1E1E] tracking-tight leading-snug">
                                         <Link to={`/product/${product.id}`} className="hover:text-[#00bfef] transition-colors line-clamp-2">
                                             {product.name}
                                         </Link>
                                     </h3>
                                 </div>
                                 <div className="flex items-center justify-between mt-4">
                                     <span className="text-[18px] sm:text-[20px] font-extrabold text-[#00bfef]">
                                         {product.price}
                                     </span>
                                     <button className={`h-11 w-11 rounded-full bg-[#edf4ff] text-[#214A9E] flex items-center justify-center hover:bg-[#214A9E] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none shadow-sm ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
