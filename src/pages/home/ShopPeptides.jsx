import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import productVialImage from '../../assets/images/homePageFirstSection.webp'
import { products as localProducts } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ShopPeptides = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackProducts = localProducts;

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await apiService.getProducts('limit=12');
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
        <section className="relative w-full py-12 lg:py-16 overflow-hidden">
            <div className="main-container">
                <div className="text-center mb-10">
                    <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case mb-3 block align-middle leading-none font-['Poppins',sans-serif]">
                        Featured Research Compounds
                    </span>
                    <h2 className="text-[48px] font-bold text-[#1E1E1E] tracking-normal leading-none font-['Anek_Telugu',sans-serif]">
                        Shop Peptides
                    </h2>
                </div>

                <div className="relative w-full">
                    <button
                        className="shop-prev absolute -left-2 sm:-left-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] transition-all focus:outline-none hover:bg-slate-50 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        className="shop-next absolute -right-2 sm:-right-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] transition-all focus:outline-none hover:bg-slate-50 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.shop-prev',
                            nextEl: '.shop-next',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        className="w-full relative z-10 !pb-4"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id || product.id} className="!h-auto">
                                <div
                                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                                    className="group flex flex-col h-full bg-white transition-all duration-300 border border-slate-100 rounded-[28px] p-2.5 sm:p-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.1)] cursor-pointer"
                                >
                                    <div className={`relative w-full h-[240px] sm:h-[260px] overflow-hidden ${product.imageUrl || product.image ? 'bg-white border border-slate-100/60' : 'bg-[#eef2f6]'} rounded-[20px] flex items-center justify-center`}>
                                        <img
                                            src={product.imageUrl || product.image || productVialImage}
                                            className={product.imageUrl || product.image
                                                ? `object-contain w-full h-full p-3 select-none transition-transform duration-500 group-hover:scale-105`
                                                : `w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105`
                                            }
                                            alt={product.name}
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
                                            {product.inStock && product.status !== 'Sale' && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#eaf7ee] to-[#f0fdf4] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#16a34a] border border-[#16a34a]/20 shadow-sm whitespace-nowrap">
                                                    <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-[#16a34a] animate-pulse shrink-0"></div>
                                                    In Stock
                                                </span>
                                            )}
                                            {!product.inStock && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#fef2f2] to-[#fff5f5] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-red-600 border border-red-200 shadow-sm whitespace-nowrap">
                                                    <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-red-600 shrink-0"></div>
                                                    Sold Out
                                                </span>
                                            )}
                                            {product.inStock && product.status === 'Sale' && (
                                                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-amber-700 border border-amber-200 shadow-sm whitespace-nowrap">
                                                    Sale
                                                </span>
                                            )}
                                        </div>

                                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center gap-0.5 sm:gap-1 rounded-md bg-[#fef3c7]/90 backdrop-blur-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-[#92400e] border border-[#f59e0b]/30 shadow-sm z-10">
                                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#f59e0b] stroke-[#f59e0b]" />
                                            <span>{(product.ratingCount > 0 || product.reviewsCount > 0) ? product.rating : '0'}</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-col justify-between flex-grow mt-4 px-1.5 pb-2">
                                        <h3 className="text-[20px] font-medium text-[#1E1E1E] leading-tight text-left font-['Anek_Telugu',sans-serif] mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-3.5">
                                            <span className="text-[18px] font-semibold text-[#00E5FF] leading-none font-['Anek_Telugu',sans-serif]">
                                                {formatPrice(product.price)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product, 1);
                                                }}
                                                className={`h-11 w-11 rounded-full bg-[#f0f5fb] text-[#1a4494] flex items-center justify-center hover:bg-[#1a4494] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!product.inStock}
                                            >
                                                <ShoppingCart className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-center mt-10">
                    <Link
                        to="/shop"
                        className="bg-gradient-to-r from-[#00ACEE] to-[#0079CD] hover:opacity-90 text-white text-[14px] font-semibold py-3.5 px-8 rounded-full transition-all shadow-md flex items-center gap-2 shrink-0 tracking-wide"
                    >
                        View All Products <span className="text-base leading-none">→</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ShopPeptides