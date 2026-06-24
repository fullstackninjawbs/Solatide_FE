import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import productVialImage from '../../assets/images/homePageFirstSection.png'
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
        <section className="relative w-full bg-[#f8fafc] py-12 lg:py-16 overflow-hidden">
            <div className="main-container">
                <div className="text-center mb-10">
                    <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case mb-3 block align-middle leading-none font-['Poppins',sans-serif]">
                        Featured Research Compounds
                    </span>
                    <h2 className="text-[48px] font-semibold text-[#1E1E1E] tracking-normal leading-none font-['Anek_Telugu',sans-serif]">
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
                            <SwiperSlide key={product._id || product.id}>
                                <div 
                                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                                    className="group flex flex-col bg-white transition-all duration-300 border border-slate-100 rounded-[28px] p-2.5 sm:p-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.1)] cursor-pointer"
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

                                    <div className="flex flex-col mt-4 px-1.5 pb-2">
                                        <h3 className="text-[20px] font-medium text-[#1E1E1E] leading-none text-left font-['Anek_Telugu',sans-serif]">
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
                                                className={`h-11 w-11 rounded-full bg-[#f0f5fb] text-[#1a4494] flex items-center justify-center hover:bg-[#1a4494] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none ${(!product.inStock && product.status === 'Sold Out') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!product.inStock && product.status === 'Sold Out'}
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