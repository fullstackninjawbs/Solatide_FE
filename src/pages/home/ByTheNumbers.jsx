import React from 'react'

const ByTheNumbers = () => {
    return (
        <section className="relative w-full bg-[#f4f7fa] py-20 lg:py-24 overflow-hidden">
            <div className="main-container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-3 block">
                        By The Numbers
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#102a5c] leading-tight">
                        Science You Can <span className="text-[#1a4494]">Trust</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/70 text-[#1a4494] flex items-center justify-center mb-6 shrink-0">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-4xl sm:text-[40px] font-extrabold text-[#102a5c] tracking-tight mb-2">
                            ≥99%
                        </span>
                        <span className="text-xs font-bold tracking-widest text-[#1a4494] uppercase mb-4 block">
                            PURITY VERIFIED
                        </span>
                        <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                            Documented purity standards across selected compounds
                        </p>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/70 text-[#1a4494] flex items-center justify-center mb-6 shrink-0">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <span className="text-4xl sm:text-[40px] font-extrabold text-[#102a5c] tracking-tight mb-2">
                            150+
                        </span>
                        <span className="text-xs font-bold tracking-widest text-[#1a4494] uppercase mb-4 block">
                            WORLDWIDE
                        </span>
                        <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                            Research compounds dispatched globally with free shipping on orders over $300 AUD
                        </p>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/70 text-[#1a4494] flex items-center justify-center mb-6 shrink-0">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 5l-7 7m0 0l-4 4a3 3 0 01-4.243-4.243l8-8a3 3 0 014.243 0l3 3zm-7 7L6.5 9.5M14 4.5l3.5 3.5" />
                                <circle cx="16" cy="11" r="1" fill="currentColor" />
                                <circle cx="11" cy="16" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-4xl sm:text-[40px] font-extrabold text-[#102a5c] tracking-tight mb-2">
                            50K+
                        </span>
                        <span className="text-xs font-bold tracking-widest text-[#1a4494] uppercase mb-4 block">
                            THIRD-PARTY TESTED
                        </span>
                        <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                            All products supplied strictly for in vitro laboratory and analytical research use only.
                        </p>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/70 text-[#1a4494] flex items-center justify-center mb-6 shrink-0">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-4xl sm:text-[40px] font-extrabold text-[#102a5c] tracking-tight mb-2">
                            2,000+
                        </span>
                        <span className="text-xs font-bold tracking-widest text-[#1a4494] uppercase mb-4 block">
                            RESEARCH-USE ONLY
                        </span>
                        <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                            All products supplied strictly for in vitro laboratory and analytical research use only.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ByTheNumbers