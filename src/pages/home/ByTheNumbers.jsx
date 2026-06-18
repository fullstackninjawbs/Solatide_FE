import React from 'react'
import { Link } from 'react-router-dom'

const ByTheNumbers = () => {
    return (
        <section className="relative w-full bg-[#f4f7fa] py-12 lg:py-16 overflow-hidden">
            <div className="main-container">
                {/* Header Block */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-12 text-left">
                    <div className="w-full lg:w-1/2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div>
                            <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case align-middle leading-none font-['Poppins',sans-serif]">
                                Product Categories
                            </span>
                        </div>
                        <h2 className="text-[36px] sm:text-[48px] font-semibold text-[#1E1E1E] leading-[1.1] tracking-tight font-['Anek_Telugu',sans-serif]">
                            Browse by <span className="text-[#1a4494]">Research</span><br />Focus
                        </h2>
                    </div>
                    <div className="w-full lg:w-[45%] flex items-end pb-2">
                        <p className="text-[14px] text-[#4B5563] leading-[1.6]">
                            <span className="font-bold text-[#1E1E1E]">Start with the research area, then choose the relevant product.</span> Browse research-use compounds and laboratory support materials by research focus.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between text-left relative overflow-hidden group transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#EAF7FD] flex items-center justify-center text-[#00ADEE] shrink-0 border border-[#EAF7FD]/50 shadow-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.56M20 3v5h-5.586" />
                                    </svg>
                                </div>
                                <span className="text-[28px] font-black text-[#D6E0EC]">01</span>
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-3 leading-tight">Metabolic Pathway Research</h3>
                            <p className="text-[12.5px] text-[#6B7280] leading-[1.6] mb-6">
                                Research compounds selected for GLP-1, GIP, glucagon, amylin, and related pathway-focused studies.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">Retatrutide</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">Tirzepatide</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">Cagrilintide</span>
                            </div>
                        </div>
                        <Link to="/shop" className="inline-flex items-center justify-center bg-[#EAF7FD] text-[#00ADEE] font-bold text-[12px] px-5 py-2.5 rounded-full hover:bg-[#00ADEE] hover:text-white transition-colors self-start shadow-sm mt-4">
                            Shop
                        </Link>
                        {/* Hover Blue Bottom Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-transparent group-hover:bg-[#1a4494] transition-colors"></div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between text-left relative overflow-hidden group transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#EAF7FD] flex items-center justify-center text-[#00ADEE] shrink-0 border border-[#EAF7FD]/50 shadow-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10V21m0-11a5 5 0 015-5h2m-7 5a5 5 0 00-5-5H7" />
                                    </svg>
                                </div>
                                <span className="text-[28px] font-black text-[#D6E0EC]">02</span>
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-3 leading-tight">Tissue & Cellular Research</h3>
                            <p className="text-[12.5px] text-[#6B7280] leading-[1.6] mb-6">
                                Peptides and compounds for cellular-response, tissue-model, and laboratory pathway research environments.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">BPC-157</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">TB-500</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">SS-31</span>
                            </div>
                        </div>
                        <Link to="/shop" className="inline-flex items-center justify-center bg-[#EAF7FD] text-[#00ADEE] font-bold text-[12px] px-5 py-2.5 rounded-full hover:bg-[#00ADEE] hover:text-white transition-colors self-start shadow-sm mt-4">
                            Shop
                        </Link>
                        {/* Hover Blue Bottom Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-transparent group-hover:bg-[#1a4494] transition-colors"></div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between text-left relative overflow-hidden group transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#EAF7FD] flex items-center justify-center text-[#00ADEE] shrink-0 border border-[#EAF7FD]/50 shadow-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6L12 3L20 6L12 9L4 6Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 11L12 14L20 11" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16L12 19L20 16" />
                                    </svg>
                                </div>
                                <span className="text-[28px] font-black text-[#D6E0EC]">03</span>
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-3 leading-tight">Dermal & Pigmentation Research</h3>
                            <p className="text-[12.5px] text-[#6B7280] leading-[1.6] mb-6">
                                Materials selected for copper peptide, pigmentation, and dermal-model research workflows.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">GHK-Cu</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">KPV</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">5-Amino-1MQ</span>
                            </div>
                        </div>
                        <Link to="/shop" className="inline-flex items-center justify-center bg-[#EAF7FD] text-[#00ADEE] font-bold text-[12px] px-5 py-2.5 rounded-full hover:bg-[#00ADEE] hover:text-white transition-colors self-start shadow-sm mt-4">
                            Shop
                        </Link>
                        {/* Hover Blue Bottom Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-transparent group-hover:bg-[#1a4494] transition-colors"></div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between text-left relative overflow-hidden group transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#EAF7FD] flex items-center justify-center text-[#00ADEE] shrink-0 border border-[#EAF7FD]/50 shadow-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 3h12m-3 0v4l4 9.5a1.5 1.5 0 01-1.38 2.08H6.38A1.5 1.5 0 015 16.5L9 7V3" />
                                        <path d="M9 11h3m-3 3h5" />
                                    </svg>
                                </div>
                                <span className="text-[28px] font-black text-[#D6E0EC]">04</span>
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-3 leading-tight">Laboratory Support</h3>
                            <p className="text-[12.5px] text-[#6B7280] leading-[1.6] mb-6">
                                Diluents, calculators, documentation pages, and support materials for laboratory research workflows.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">Bac Water</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">COA Reports</span>
                                <span className="bg-[#F0F7FF] text-[#1a4494] text-[10.5px] font-bold px-2.5 py-1 rounded-md">Calculator</span>
                            </div>
                        </div>
                        <Link to="/shop" className="inline-flex items-center justify-center bg-[#EAF7FD] text-[#00ADEE] font-bold text-[12px] px-5 py-2.5 rounded-full hover:bg-[#00ADEE] hover:text-white transition-colors self-start shadow-sm mt-4">
                            Shop
                        </Link>
                        {/* Hover Blue Bottom Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-transparent group-hover:bg-[#1a4494] transition-colors"></div>
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="bg-white border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] rounded-[16px] px-6 py-4 flex items-center justify-start gap-3 mt-8">
                    <svg className="w-5 h-5 text-[#1a4494] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-[12px] text-[#4B5563] text-left leading-[1.5]">
                        <span className="font-bold text-[#1E1E1E]">Research-use-only:</span> categories are organised by laboratory research focus and do not imply therapeutic, diagnostic, veterinary, cosmetic, dosing, injection, or human-use applications.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default ByTheNumbers