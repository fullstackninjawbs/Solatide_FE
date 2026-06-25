import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Testimonials = () => {
    const scrollRef = useRef(null)
    const [selectedReview, setSelectedReview] = useState(null)

    const testimonials = [
        {
            id: 1,
            quote: 'Good price, quality products. Quick dispatch confirmation, very easy and straightforward, no mucking around',
            name: 'Nicole',
            product: 'Tirzepatide 5mg',
            date: '06/06/2026',
            rating: 5
        },
        {
            id: 2,
            quote: 'Amazing results. Didn\'t have results like this from other suppliers',
            name: 'Tina',
            product: 'Semaglutide 10mg',
            date: '05/06/2026',
            rating: 5
        },
        {
            id: 3,
            quote: 'Will order again, great service and product.',
            name: 'Michael D',
            product: 'SS-31 (Elamipretide)',
            date: '03/06/2026',
            rating: 5
        },
        {
            id: 4,
            quote: 'Very fast shipping. Great packaging and documentation.',
            name: 'Mark T',
            product: 'Tirzepatide 10mg',
            date: '01/06/2026',
            rating: 5
        },
        {
            id: 5,
            quote: 'Top quality product as always.',
            name: 'Henry',
            product: 'Retatrutide 30mg',
            date: '28/05/2026',
            rating: 5
        }
    ];

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const offset = clientWidth * 0.75
            const scrollTo = direction === 'left' ? scrollLeft - offset : scrollLeft + offset
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    // Handle closing modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.id === 'modal-overlay') {
                setSelectedReview(null)
            }
        }
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <section className="w-full bg-[#F3F4F6] py-12 lg:py-16 overflow-hidden relative">
            <div className="main-container">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
                    <div className="text-left flex items-center gap-4">
                        <h2 className="text-[32px] md:text-[44px] font-bold text-[#1D1D1F] leading-tight">
                            Trusted by researchers
                        </h2>
                        <div className="hidden sm:flex items-center gap-1.5 mt-2">
                            <div className="flex text-[#008B74] text-[18px]">
                                ★★★★★
                            </div>
                            <span className="text-[14px] font-semibold text-[#4B5563]">4.88</span>
                        </div>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={() => handleScroll('left')}
                            className="h-10 w-10 rounded-full border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 font-extrabold hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
                        >
                            <span className="text-lg">←</span>
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            className="h-10 w-10 rounded-full border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 font-extrabold hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
                        >
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 w-full relative z-10 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => setSelectedReview(t)}
                            className="snap-start shrink-0 w-[280px] sm:w-[300px] flex flex-col justify-between bg-transparent border border-[#D1D5DB] rounded-[8px] p-6 text-center cursor-pointer hover:bg-white transition-colors duration-300"
                        >
                            <p className="text-[14px] text-[#374151] leading-[1.5] mb-6 line-clamp-4">
                                {t.quote}
                            </p>

                            <div className="flex flex-col items-center">
                                <div className="flex text-[#008B74] text-[20px] mb-2 tracking-widest">
                                    ★★★★★
                                </div>
                                <span className="text-[15px] font-bold text-slate-800">{t.name}</span>
                                <span className="text-[13px] font-medium text-slate-500 mt-1">{t.product}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            {selectedReview && (
                <div id="modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-[8px] w-full max-w-[600px] relative p-8 shadow-xl animate-fade-in">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedReview(null)}
                            className="absolute top-[-12px] right-[-12px] bg-[#374151] text-white w-8 h-8 rounded-md flex items-center justify-center border-2 border-white hover:bg-black transition-colors"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col text-left">
                            <div className="flex gap-1 text-[#008B74] text-[24px] mb-4">
                                ★★★★★
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#111827] font-bold text-[16px]">
                                    {selectedReview.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-[#111827]">{selectedReview.name}</span>
                                    <span className="text-[13px] text-[#6B7280]">{selectedReview.date}</span>
                                </div>
                            </div>

                            <p className="text-[16px] text-[#111827] leading-[1.6] mb-6">
                                {selectedReview.quote}
                            </p>

                            <div className="bg-[#ECFDF5]/50 border border-[#D1FAE5] rounded p-4 text-left">
                                <Link to="/shop" className="text-[14px] text-[#111827] font-medium underline underline-offset-4 hover:text-[#008B74] transition-colors">
                                    {selectedReview.product}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Testimonials