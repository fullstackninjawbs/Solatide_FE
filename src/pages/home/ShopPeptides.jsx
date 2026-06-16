import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productVialImage from '../../assets/homePageFirstSection.png'

const ShopPeptides = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackProducts = [
        {
            id: 1,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true
        },
        {
            id: 2,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true
        },
        {
            id: 3,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true
        },
        {
            id: 4,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true
        }
    ];

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch up to 4 featured products from API
                const response = await fetch('http://localhost:5000/api/products?limit=4');
                const result = await response.json();
                
                if (result.success && result.data && result.data.products) {
                    setProducts(result.data.products);
                } else {
                    setProducts(fallbackProducts);
                }
            } catch (error) {
                console.warn('Backend server unreachable for homepage. Using fallback products.');
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <section className="relative w-full bg-white py-16 lg:py-20 overflow-hidden">
            <div className="main-container">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                    <div className="text-left">
                        <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-3 block">
                            Featured Research Compounds
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102a5c] tracking-tight">
                            Shop Peptides
                        </h2>
                    </div>
                    <Link
                        to="/shop"
                        className="text-[#00bfef] text-sm font-extrabold hover:text-[#009bf2] transition-colors flex items-center gap-1.5 shrink-0"
                    >
                        View All Products <span className="text-base">→</span>
                    </Link>
                </div>

                {/* Product Slider Area */}
                <div className="relative w-full">
                    {/* Left Carousel Navigation Trigger */}
                    <button className="absolute -left-2 sm:-left-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-[#e0eaf5]/90 border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] font-extrabold hover:bg-[#e0eaf5] transition-all cursor-pointer focus:outline-none">
                        <span className="text-lg">←</span>
                    </button>

                    {/* Right Carousel Navigation Trigger */}
                    <button className="absolute -right-2 sm:-right-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] font-extrabold hover:bg-slate-50 transition-all cursor-pointer focus:outline-none">
                        <span className="text-lg">→</span>
                    </button>

                    {/* Cards Grid container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
                        {products.map((product) => (
                            <div
                                key={product._id || product.id}
                                className="group flex flex-col bg-white transition-all duration-300"
                            >
                                {/* Vial Graphic Container */}
                                <div className="relative w-full h-[240px] sm:h-[260px] overflow-hidden bg-[#eef2f6] rounded-[24px] flex items-center justify-center border border-slate-100/50">
                                    <img
                                        src={productVialImage}
                                        className="w-full h-full object-cover object-center scale-[1.7] translate-y-3 select-none transition-transform duration-500 group-hover:scale-[1.78]"
                                        alt={product.name}
                                    />

                                    {/* Dynamic Badges */}
                                    {product.status === 'In Stock' && (
                                        <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-1 text-[10px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                            In Stock
                                        </span>
                                    )}
                                    {product.status === 'Sold Out' && (
                                        <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#fef2f2] px-2.5 py-1 text-[10px] font-bold text-red-600 border border-red-200">
                                            Sold Out
                                        </span>
                                    )}
                                    {product.status === 'Sale' && (
                                        <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#fef3c7] px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                                            Sale
                                        </span>
                                    )}
                                    {!product.status && (
                                        <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-1 text-[10px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                            {product.inStock ? 'In Stock' : 'Sold Out'}
                                        </span>
                                    )}

                                    {/* Star Rating Badge */}
                                    <span className="absolute top-4 right-4 inline-flex items-center rounded-md bg-[#fffbeb] px-2.5 py-1 text-[10px] font-extrabold text-[#d97706] border border-[#d97706]/10">
                                        ★ {product.rating || '5.0'}
                                    </span>
                                </div>

                                {/* Text Details */}
                                <div className="flex flex-col mt-4">
                                    <h3 className="text-[15px] sm:text-base font-bold text-slate-800 text-left tracking-tight">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-base sm:text-lg font-extrabold text-[#00bfef]">
                                            {typeof product.price === 'number'
                                                ? `Rs. ${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : product.price}
                                        </span>
                                        <button 
                                            className={`h-9 w-9 rounded-full bg-[#e0eaf5]/80 text-[#1a4494] flex items-center justify-center hover:bg-[#e0eaf5] transition-all cursor-pointer focus:outline-none ${(!product.inStock && product.status === 'Sold Out') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!product.inStock && product.status === 'Sold Out'}
                                        >
                                            {/* Shopping Cart Outline SVG */}
                                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopPeptides