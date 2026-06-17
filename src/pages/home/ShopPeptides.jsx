import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import productVialImage from '../../assets/images/homePageFirstSection.png'

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

                <div className="relative w-full">
                    <button className="absolute -left-2 sm:-left-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer focus:outline-none">
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button className="absolute -right-2 sm:-right-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer focus:outline-none">
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
                        {products.map((product) => (
                            <div
                                key={product._id || product.id}
                                className="group flex flex-col bg-white transition-all duration-300"
                            >
                                <div className="relative w-full h-[240px] sm:h-[260px] overflow-hidden bg-[#eef2f6] rounded-[24px] flex items-center justify-center border border-slate-100/50">
                                    <img
                                        src={productVialImage}
                                        className="w-full h-full object-cover object-center scale-[1.7] translate-y-3 select-none transition-transform duration-500 group-hover:scale-[1.78]"
                                        alt={product.name}
                                    />

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

                                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-md bg-[#fffbeb] px-2 py-1 text-[10px] font-extrabold text-[#d97706] border border-[#d97706]/10">
                                        <Star className="h-3 w-3 fill-[#d97706] stroke-[#d97706]" />
                                        <span>{product.rating || '5.0'}</span>
                                    </span>
                                </div>

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
                                            className={`h-11 w-11 rounded-full bg-[#e0eaf5]/80 text-[#1a4494] flex items-center justify-center hover:bg-[#1a4494] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none ${(!product.inStock && product.status === 'Sold Out') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!product.inStock && product.status === 'Sold Out'}
                                        >
                                            <ShoppingCart className="h-5 w-5" />
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