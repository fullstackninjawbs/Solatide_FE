import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/homePageFirstSection.png'


const HexBadge = ({ children }) => (
    <span
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: 46, height: 46 }}
    >
        <svg
            viewBox="0 0 46 46"
            fill="none"
            className="absolute inset-0 w-full h-full"
        >
            <path
                d="M23 3L42 13.5V32.5L23 43L4 32.5V13.5L23 3Z"
                fill="#EDF4FF"
                stroke="#BDD6F5"
                strokeWidth="1.4"
            />
        </svg>
        <span className="relative z-10 flex items-center justify-center text-[#1a4494]">
            {children}
        </span>
    </span>
)


const FeatureCard = ({ icon, title, subtitle }) => (
    <div
        className="flex items-center gap-3.5 bg-white border border-slate-200 rounded-[100px] shadow-sm p-1.5 pr-5"
        style={{ flex: '1 1 0' }}
    >
        <HexBadge>{icon}</HexBadge>
        <div className="flex flex-col min-w-0 py-1">
            <span className="text-[13px] font-bold text-[#009bf2] leading-snug whitespace-nowrap">
                {title}
            </span>
            <span className="text-[10.5px] font-medium text-slate-400 leading-normal mt-[2px] whitespace-nowrap">
                {subtitle}
            </span>
        </div>
    </div>
)


const HeroSection = () => {
    return (

        <section className="relative w-full overflow-hidden bg-white flex items-center min-h-[760px] lg:min-h-[860px] pt-[140px] pb-[80px]">
            <div className="absolute inset-0 z-0 hidden lg:block">
                <img
                    src={heroImage}
                    className="w-full h-full object-cover object-[72%_center] xl:object-center select-none pointer-events-none"
                    alt="Solatide Biosciences – Research Grade Peptides"
                    draggable={false}
                />

            </div>

            <div className="lg:hidden absolute inset-0 z-0 bg-white/82" />

            <div className="main-container w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">

                    <div className="lg:col-span-7 flex flex-col justify-center text-left">

                        <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] xl:text-[48px] font-extrabold tracking-tight text-[#1a4494] leading-[1.12] mb-5">
                            Your Trusted Source For<br />Research Grade Peptides.
                        </h1>

                        <p className="text-[14px] lg:text-[16px] text-[#475569] font-medium leading-relaxed mb-4 w-[90%]">
                            Solatide Biosciences delivers research grade peptides and
                            laboratory solutions for researchers who demand purity,
                            consistency, and results.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-3.5 mb-8">

                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-2 text-white font-bold whitespace-nowrap transition-all duration-200"
                                style={{
                                    width: '180px',
                                    height: '46px',
                                    borderRadius: '9999px',
                                    background: '#009bf2',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px -3px rgba(0,155,242,0.40)',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)' }}
                                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
                            >
                                Shop Peptides →
                            </Link>

                            <Link
                                to="/resource"
                                className="inline-flex items-center justify-center gap-2 bg-transparent font-bold text-[#1a4494] hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 whitespace-nowrap border"
                                style={{
                                    height: '46px',
                                    borderRadius: '9999px',
                                    padding: '0 24px',
                                    fontSize: '14px',
                                    borderColor: '#C7DDF7',
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    className="shrink-0"
                                    width="15" height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Documents →
                            </Link>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">

                            <FeatureCard
                                title="≥99% Purity Standard"
                                subtitle="HPLC-UV/LC-MS + Endotoxin"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                    </svg>
                                }
                            />

                            <FeatureCard
                                title="Lot-Traceable Vials"
                                subtitle="Vial-to-COA Verified"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                }
                            />

                            <FeatureCard
                                title="Verifiable Reports"
                                subtitle="Third-Party Results"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            />

                        </div>

                    </div>

                    <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />

                </div>
            </div>

            <div className="lg:hidden absolute inset-0 z-0 opacity-[0.06]">
                <img
                    src={heroImage}
                    className="w-full h-full object-cover"
                    alt=""
                    draggable={false}
                />
            </div>

        </section>
    )
}

export default HeroSection