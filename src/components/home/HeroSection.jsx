import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/images/homePageFirstSection.png'

const HeroSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-slate-50 py-16 lg:py-28 flex items-center min-h-[640px]">
            <div className="main-container">
                <div className="absolute inset-0 z-0 hidden lg:block">
                    <img
                        src={heroImage}
                        className="w-full h-full object-cover object-center select-none"
                        alt="Solatide Biosciences Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent"></div>
                </div>

                <div className="absolute inset-0 z-0 lg:hidden opacity-10">
                    <img
                        src={heroImage}
                        className="w-full h-full object-cover"
                        alt="Solatide Biosciences Mobile Background"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col justify-center text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#102a5c] leading-[1.15] mb-6">
                                Your Trusted Source For<br />Research Grade Peptides.
                            </h1>
                            <p className="text-base sm:text-[17px] text-slate-600 leading-relaxed mb-10 max-w-xl">
                                Solatide Biosciences delivers research grade peptides and laboratory solutions for researchers who demand purity, consistency, and results.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
                                <Link
                                    to="/shop"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#009bf2] px-8 py-3.5 text-sm font-bold text-white hover:bg-sky-500 transition-colors shadow-lg shadow-sky-500/10 shrink-0"
                                >
                                    Shop Peptides →
                                </Link>
                                <Link
                                    to="/resource"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border border-sky-300 bg-white px-8 py-3.5 text-sm font-semibold text-[#009bf2] hover:bg-sky-50 transition-colors shrink-0"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Documents →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-50 text-sky-500 shrink-0">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm font-bold text-[#009bf2]">≥99% Purity Standard</span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">HPLC-UV/LC-MS + Endotoxin</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-50 text-sky-500 shrink-0">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm font-bold text-[#009bf2]">Lot-Traceable Vials</span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">Vial-to-COA Verified</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-50 text-sky-500 shrink-0">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm font-bold text-[#009bf2]">Verifiable Reports</span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">Third-Party Results</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:hidden flex justify-center mt-8">
                            <img
                                src={heroImage}
                                className="w-full max-w-[450px] h-auto object-contain rounded-2xl shadow-lg border border-slate-100"
                                alt="Solatide Vials Mobile Display"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection