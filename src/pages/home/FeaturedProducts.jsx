import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import productVialImage from '../../assets/images/RectangleMadBackground.png'
import cartIcon from '../../assets/icons/cartIcon.png'

const FeaturedProducts = () => {
    const scrollRef = useRef(null)

    const products = [
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
        },
        {
            id: 5,
            name: 'Bacteriostatic Water 10mL (Extra)',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true
        }
    ];

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const offset = clientWidth * 0.75 // Scroll by 75% of the visible container width
            const scrollTo = direction === 'left' ? scrollLeft - offset : scrollLeft + offset
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    return (
        <section className="relative w-full bg-white py-16 lg:py-20 overflow-hidden">
            <div className="main-container">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                    <div className="text-left">
                        <span className="text-[#00ADEE] text-[14px] font-semibold mb-2 block">
                            Featured Products
                        </span>
                        <h2 className="text-[32px] md:text-[44px] font-anek font-bold text-[#1D1D1F] leading-tight">
                            Best-<span className="text-[#1a4494]">Selling</span> Compounds
                        </h2>
                    </div>
                    <Link
                        to="/shop"
                        className="text-[#00ADEE] text-sm font-semibold hover:text-[#008bdb] transition-colors flex items-center gap-1.5 shrink-0"
                    >
                        View All Product <span className="text-base">→</span>
                    </Link>
                </div>

                {/* Product Slider Area */}
                <div className="relative w-full">
                    {/* Left Carousel Navigation Trigger */}
                    <button
                        onClick={() => handleScroll('left')}
                        className="absolute -left-2 sm:-left-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-[#e0eaf5]/90 border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] font-extrabold hover:bg-[#e0eaf5] transition-all cursor-pointer focus:outline-none"
                    >
                        <span className="text-lg">←</span>
                    </button>

                    {/* Right Carousel Navigation Trigger */}
                    <button
                        onClick={() => handleScroll('right')}
                        className="absolute -right-2 sm:-right-5 top-[110px] sm:top-[120px] z-20 h-10 w-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-[#1a4494] font-extrabold hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
                    >
                        <span className="text-lg">→</span>
                    </button>

                    {/* Cards Flex/Slider container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 w-full relative z-10 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[calc(25%-18px)] group flex flex-col bg-white transition-all duration-300"
                            >
                                {/* Vial Graphic Container */}
                                <div className="relative w-full aspect-square overflow-hidden bg-[#eef2f6] rounded-[24px] flex items-center justify-center border border-slate-100/50">
                                    <img
                                        src={productVialImage}
                                        className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-105"
                                        alt={product.name}
                                    />

                                    {/* In Stock Badge */}
                                    <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-1 text-[10px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                        In Stock
                                    </span>

                                    {/* Star Rating Badge */}
                                    <span className="absolute top-4 right-4 inline-flex items-center rounded-md bg-[#fffbeb] px-2.5 py-1 text-[10px] font-extrabold text-[#d97706] border border-[#d97706]/10">
                                        ★ {product.rating}
                                    </span>
                                </div>

                                {/* Text Details */}
                                <div className="flex flex-col mt-4">
                                    <h3 className="text-[15px] sm:text-base font-medium text-slate-800 text-left tracking-tight">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-base text-[16px] sm:text-lg font-semibold text-[#00E5FF]">
                                            {product.price}
                                        </span>
                                        <button className="focus:outline-none hover:opacity-80 transition-opacity">
                                            <img src={cartIcon} className="h-10 w-10 object-contain" alt="Cart" />
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

export default FeaturedProducts