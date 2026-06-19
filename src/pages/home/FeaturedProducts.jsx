import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import productVialImage from '../../assets/images/RectangleMadBackground.png'
import { products as localProducts } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackProducts = [
        { id: 1, name: 'Bacteriostatic Water 10mL', price: 'Rs. 1,400.00', rating: '5.0', inStock: true },
        { id: 2, name: 'Bacteriostatic Water 10mL', price: 'Rs. 1,400.00', rating: '5.0', inStock: true },
        { id: 3, name: 'Bacteriostatic Water 10mL', price: 'Rs. 1,400.00', rating: '5.0', inStock: true },
        { id: 4, name: 'Bacteriostatic Water 10mL', price: 'Rs. 1,400.00', rating: '5.0', inStock: true }
    ];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products?limit=8');
                const result = await response.json();
                if (result.success && result.data && result.data.products) {
                    setProducts(result.data.products);
                } else {
                    setProducts(fallbackProducts);
                }
            } catch (error) {
                console.warn('Backend featured API unreachable. Using fallback products.');
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <section className="relative w-full bg-[#f8fafc] py-12 lg:py-16 overflow-hidden">
            <div className="main-container">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case mb-3 block align-middle leading-none font-['Poppins',sans-serif]">
                        Featured Products
                    </span>
                    <h2 className="text-[48px] font-semibold text-[#1E1E1E] tracking-normal leading-none font-['Anek_Telugu',sans-serif]">
                        Best-<span className="text-[#1a4494]">Selling</span> Compounds
                    </h2>
                </div>

                {/* Product Slider Area */}
                <div className="relative w-full">
                    {/* Left Carousel Navigation Trigger */}
                    <button
                        className="featured-prev absolute -left-2 sm:-left-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] transition-all focus:outline-none hover:bg-slate-50 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Right Carousel Navigation Trigger */}
                    <button
                        className="featured-next absolute -right-2 sm:-right-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] transition-all focus:outline-none hover:bg-slate-50 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.featured-prev',
                            nextEl: '.featured-next',
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
                                    <div className="relative w-full h-[240px] sm:h-[260px] overflow-hidden bg-[#eef2f6] rounded-[20px] flex items-center justify-center">
                                        <img
                                            src={product.image || productVialImage}
                                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                            alt={product.name}
                                        />

                                        <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-1 text-[10px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                            {product.inStock ? 'In Stock' : 'Sold Out'}
                                        </span>

                                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-md bg-[#fffbeb] px-2 py-1 text-[10px] font-extrabold text-[#d97706] border border-[#d97706]/10">
                                            <Star className="h-3 w-3 fill-[#d97706] stroke-[#d97706]" />
                                            <span>{product.rating || '5.0'}</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-col mt-4 px-1.5 pb-2">
                                        <h3 className="text-[20px] font-medium text-[#1E1E1E] leading-none text-left font-['Anek_Telugu',sans-serif]">
                                            <Link to={`/product/${product.id || product._id}`} className="hover:text-[#00bfef] transition-colors">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center justify-between mt-3.5">
                                            <span className="text-[18px] font-semibold text-[#00E5FF] leading-none font-['Anek_Telugu',sans-serif]">
                                                {typeof product.price === 'number'
                                                    ? `Rs. ${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                    : product.price}
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

export default FeaturedProducts