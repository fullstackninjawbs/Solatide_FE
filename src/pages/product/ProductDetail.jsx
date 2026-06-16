import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import retatrutideVial from '../../assets/retatrutide_vial.png';
import { products } from '../../data/products';

const ProductDetail = () => {
    const { id } = useParams();
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
                    <div className="lg:col-span-7 flex gap-5 items-start">
                        {/* Thumbnails list */}
                        <div className="flex flex-col gap-4 shrink-0">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl overflow-hidden border-2 flex items-center justify-center p-1.5 transition-all bg-white ${
                                        activeTab === idx ? 'border-[#214A9E]' : 'border-slate-200 hover:border-slate-300'
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
                        <div className="flex-grow bg-white rounded-3xl border border-[#E8E8E8] p-4 flex items-center justify-center overflow-hidden h-[450px] sm:h-[580px] w-full">
                            {images[activeTab] ? (
                                <img
                                    src={images[activeTab]}
                                    alt="Product Preview"
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300"
                                />
                            ) : (
                                // Render mock HPLC only for Retatrutide (ID 2) if no image
                                product.id === 2 && activeTab !== 0 ? (
                                    <div className="w-full h-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between overflow-y-auto text-left shadow-inner">
                                        {/* Header */}
                                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                            <div>
                                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-extrabold uppercase border border-emerald-200/50">
                                                    VERIFIED PASS
                                                </span>
                                                <h4 className="text-sm font-bold text-slate-800 mt-1.5 uppercase tracking-wider">
                                                    Certificate of Analysis
                                                </h4>
                                                <p className="text-[11px] text-slate-400">HPLC & MS-Spectrometry Assay Report</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[14px] font-bold text-[#214A9E]">SOLATIDE</span>
                                                <p className="text-[8px] text-slate-400 uppercase tracking-widest">Biosciences</p>
                                            </div>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-4 my-4 text-[11px] border-b border-slate-50 pb-4">
                                            <div>
                                                <span className="text-slate-400 block">Compound:</span>
                                                <span className="font-bold text-slate-700">{product.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Lot Number:</span>
                                                <span className="font-mono font-bold text-slate-700">Lot: RT24B01</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Purity Standard:</span>
                                                <span className="font-bold text-slate-700">99.42% (HPLC Assayed)</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Expiration:</span>
                                                <span className="font-bold text-slate-700">05/2026</span>
                                            </div>
                                        </div>

                                        {/* Mini Graph / Visualization */}
                                        <div className="flex-grow bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between min-h-[120px]">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">HPLC Chromatogram Signal (220nm)</span>
                                            <div className="w-full flex-grow flex items-end relative h-[100px] border-l border-b border-slate-300 ml-4 mb-2">
                                                {/* Peak Graph Path */}
                                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                    <path
                                                        d="M 0 95 Q 20 95 30 95 T 40 95 T 50 15 T 60 95 T 70 95 T 100 95"
                                                        fill="none"
                                                        stroke="#214A9E"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className="absolute bottom-[-15px] left-[50%] translate-x-[-50%] text-[8px] text-slate-400 font-mono">5.23 min (Retatrutide Peak)</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3 flex justify-between items-center">
                                            <span>Certified by: Lead Analytical Chemist</span>
                                            <span className="font-bold text-slate-600">Solatide Quality Assurance</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-300 text-sm font-medium">No Image Available</div>
                                )
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
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#214A9E] leading-tight mb-4" style={{ fontWeight: 600 }}>
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
                            <div className="text-3xl sm:text-[36px] font-bold text-[#214A9E] mb-6">
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
                                <button className="w-full bg-[#008fe2] hover:bg-[#007cc5] text-white text-[15px] font-bold py-4 rounded-xl transition-all shadow-sm focus:outline-none">
                                    Add to cart
                                </button>
                                <button className="w-full bg-white hover:bg-slate-50 text-[#1E1E1E] text-[15px] font-bold py-4 rounded-xl border border-[#1E1E1E] transition-all focus:outline-none">
                                    Buy it Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
