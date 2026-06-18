import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import retatrutideVial from '../../assets/images/retatrutide_vial.png';
import { products } from '../../data/products';
import ProductInfoSection from './ProductInfoSection';
import ProductReviewsSection from './ProductReviewsSection';
import ProductFaqSection from './ProductFaqSection';
import ProductSuggestionsSection from './ProductSuggestionsSection';





const ProductDetail = () => {
    const { id } = useParams();
    // Scroll to top on ID change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Fallback to Retatrutide (ID: 2) if not found
    const product = products.find(p => p.id === parseInt(id)) || products.find(p => p.id === 2) || products[0];

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);

    const images = [
        product.image || null,
        product.coaImage1 || null,
        product.coaImage2 || null
    ];

    const badges = [
        '≥99% Purity Standard',
        'Third-Party Documentation',
        'Endotoxin Tested',
        'Worldwide Shipping'
    ];

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    return (
        <div className="w-full bg-white py-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[14px] text-slate-500 mb-10 text-left font-medium" style={{ fontFamily: 'Poppins' }}>
                    <Link to="/" className="text-[#214A9E] hover:underline">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="text-[#214A9E] hover:underline">Shop</Link>
                    <span>/</span>
                    <span className="text-slate-700">{product.name}</span>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Image Galleries */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-5 items-start w-full">
                        {/* Thumbnails list */}
                        <div className="flex flex-row md:flex-col gap-3 shrink-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl overflow-hidden border-2 flex items-center justify-center p-1.5 transition-all bg-white ${activeTab === idx ? 'border-[#214A9E]' : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {idx === 0 ? (
                                        img ? (
                                            <img src={img} alt="Product Thumbnail" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-[#f8fafc] rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">
                                                No Img
                                            </div>
                                        )
                                    ) : (
                                        img ? (
                                            <img src={img} alt="Report Thumbnail" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-[#f8fafc] flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-[8px] font-bold p-1 text-center">
                                                <span>COA REPORT</span>
                                                <span className="text-[10px] text-[#214A9E]">✓</span>
                                            </div>
                                        )
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Main Preview Image */}
                        <div className="flex-grow bg-white rounded-3xl border border-[#E8E8E8] p-4 flex items-center justify-center overflow-hidden h-[320px] sm:h-[450px] md:h-[580px] w-full">
                            {images[activeTab] ? (
                                <img
                                    src={images[activeTab]}
                                    alt="Product Preview"
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300"
                                />
                            ) : (
                                <div className="text-slate-300 text-sm font-medium">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Specs */}
                    <div className="lg:col-span-5 text-left flex flex-col gap-6" style={{ fontFamily: 'Poppins' }}>
                        <div>
                            {/* Category Tag */}
                            <span className="text-[#00bfef] text-[14px] sm:text-[15px] font-extrabold tracking-wide block mb-3 uppercase">
                                {product.tag || 'Dual GLP-1/GIP Receptor Agonist'}
                            </span>

                            {/* Product Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1E1E] leading-tight mb-4" style={{ fontWeight: 600 }}>
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-amber-500 text-lg">
                                    {'★★★★★'.split('').map((char, i) => (
                                        <span key={i}>{char}</span>
                                    ))}
                                </div>
                                <a href="#reviews" className="text-[14px] text-[#1E1E1E] font-semibold underline ml-1 hover:text-[#214A9E]">
                                    {product.reviewsCount || 44} Reviews
                                </a>
                            </div>

                            {/* Price */}
                            <div className="text-3xl sm:text-[36px] font-bold text-[#00bfef] mb-6">
                                {product.price}
                            </div>

                            {/* Product Description */}
                            <p className="text-[#6A6A6A] text-[15px] leading-relaxed mb-6" style={{ fontWeight: 400 }}>
                                {product.description}
                            </p>

                            {/* Badges list */}
                            <div className="flex flex-wrap gap-2.5 mb-8">
                                {badges.map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-[#edf4ff]/50 text-[#214A9E] border border-[#214A9E]/10 rounded-full px-4 py-1.5 text-xs font-semibold"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-5 mb-6">
                                <span className="text-[15px] font-semibold text-[#1E1E1E]">Quantity</span>
                                <div className="flex items-center bg-[#f4f7fa] rounded-xl px-3 py-1.5 border border-slate-200">
                                    <button
                                        onClick={decrementQty}
                                        className="text-[18px] font-bold text-slate-500 hover:text-slate-800 w-8 h-8 flex items-center justify-center focus:outline-none"
                                    >
                                        −
                                    </button>
                                    <span className="w-10 text-center font-semibold text-[15px] text-[#1E1E1E]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQty}
                                        className="text-[18px] font-bold text-slate-500 hover:text-slate-800 w-8 h-8 flex items-center justify-center focus:outline-none"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-4 w-full">
                                <button className="w-full bg-gradient-to-r from-[#0079CD] to-[#00ACEE] hover:opacity-90 text-white text-[15px] font-bold py-4 rounded-xl transition-all shadow-sm focus:outline-none">
                                    Add to cart
                                </button>
                                <button className="w-full bg-white hover:bg-slate-50 text-[#1E1E1E] text-[15px] font-bold py-4 rounded-xl border border-[#1E1E1E] transition-all focus:outline-none">
                                    Buy it Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Information Accordions Section */}
                <ProductInfoSection product={product} />

                {/* Product Reviews Section */}
                <ProductReviewsSection product={product} />

                {/* FAQ Section */}
                <ProductFaqSection />

                {/* Suggestions Section */}
                <ProductSuggestionsSection currentProduct={product} />
            </div>
        </div>
    );
};

export default ProductDetail;
