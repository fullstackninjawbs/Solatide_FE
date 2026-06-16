import React, { useRef } from 'react'

const Testimonials = () => {
    const scrollRef = useRef(null)

    const testimonials = [
        {
            id: 1,
            quote: '"The peptide quality is consistently high, and the detailed batch documentation gives us complete confidence in our research. Solatide Biosciences has become our go-to source."',
            name: 'Purvi Chopra',
            role: 'Biotech Researcher',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            rating: 5
        },
        {
            id: 2,
            quote: '"Fast delivery, transparent testing reports, and reliable product consistency. It’s rare to find this level of professionalism in the research peptide space."',
            name: 'Anita Patel',
            role: 'Lab Director',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
            rating: 5
        },
        {
            id: 3,
            quote: '"We\'ve tested multiple suppliers, but Solatide stands out in terms of quality control and transparency. Their documentation is extremely helpful."',
            name: 'Purvi Chopra',
            role: 'Research Analyst',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
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

    return (
        <section className="w-full bg-white py-16 lg:py-20 overflow-hidden">
            <div className="main-container">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
                    <div className="text-left">
                        <span className="text-[#00ADEE] text-[14px] font-semibold mb-2 block">Testimonials</span>
                        <h2 className="text-[32px] md:text-[44px] font-anek font-bold text-[#1D1D1F] leading-tight">
                            Trusted by <span className="text-[#1a4494]">World-Class</span> Researchers
                        </h2>
                    </div>
                    {/* Carousel Nav Arrows */}
                    <div className="flex gap-3 shrink-0">
                        <button 
                            onClick={() => handleScroll('left')} 
                            className="h-10 w-10 rounded-full border border-slate-100 shadow-sm flex items-center justify-center text-[#1a4494] font-extrabold hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
                        >
                            <span className="text-lg">←</span>
                        </button>
                        <button 
                            onClick={() => handleScroll('right')} 
                            className="h-10 w-10 rounded-full border border-[#00ADEE] flex items-center justify-center text-[#00ADEE] font-extrabold hover:bg-[#DEF5FF]/30 transition-all cursor-pointer focus:outline-none"
                        >
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 w-full relative z-10 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((t) => (
                        <div 
                            key={t.id}
                            className="snap-start shrink-0 w-[90%] sm:w-[48%] lg:w-[calc(33.33%-16px)] flex flex-col justify-between bg-white border border-[#EBEBEB] rounded-[20px] p-6 lg:p-8 text-left shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div>
                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <span key={i} className="text-[#FFB800] text-[18px]">★</span>
                                    ))}
                                </div>
                                {/* Quote */}
                                <p className="text-[14.5px] lg:text-[15px] text-[#4B5563] leading-[1.6] mb-6">
                                    {t.quote}
                                </p>
                            </div>

                            <div>
                                {/* Divider Line */}
                                <div className="w-full h-[1px] bg-slate-100 mb-5"></div>
                                {/* Reviewer Profile */}
                                <div className="flex items-center gap-3.5">
                                    <img 
                                        src={t.avatar} 
                                        alt={t.name} 
                                        className="h-11 w-11 rounded-full object-cover select-none border border-slate-100" 
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{t.name}</span>
                                        <span className="text-[12.5px] font-medium text-slate-500 mt-0.5">{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials