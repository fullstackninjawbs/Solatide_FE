import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/images/homePageFirstSection.png'
import mobileHeroImage from '../../assets/images/Gemini_Generated_Image_m88804m88804m888 1 (1).png'
import group1Icon from '../../assets/icons/Group (1).png'


const HexBadge = ({ children }) => (
    <span
        className="relative flex-shrink-0 flex items-center justify-center animate-pulse-subtle"
        style={{ width: 46, height: 46 }}
    >
        <svg
            viewBox="0 0 46 46"
            fill="none"
            className="absolute inset-0 w-full h-full"
        >
            <path
                d="M23 3L42 13.5V32.5L23 43L4 32.5V13.5L23 3Z"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.4"
            />
        </svg>
        <span className="relative z-10 flex items-center justify-center text-[#1a4494]">
            {children}
        </span>
    </span>
)


const HeroSection = () => {
    return (

        <section className="relative w-full overflow-hidden bg-white flex flex-col sm:flex-row items-stretch sm:items-center min-h-[640px] sm:min-h-[700px] lg:min-h-[860px] pt-[92px] sm:pt-[100px] md:pt-[110px] lg:pt-[130px] pb-[60px] sm:pb-[80px]">
            <div className="absolute inset-0 z-0 hidden lg:block">
                <img
                    src={heroImage}
                    className="w-full h-full object-cover object-[72%_center] xl:object-center select-none pointer-events-none"
                    alt="Solatide Biosciences – Research Grade Peptides"
                    draggable={false}
                />

            </div>

            <div className="lg:hidden absolute inset-0 z-0 bg-white" />

            {/* Mobile Hero Image (Zero margins, touches header and side edges, hidden on sm and above) */}
            <div className="sm:hidden w-full overflow-hidden shrink-0 relative z-10">
                <img
                    src={mobileHeroImage}
                    className="w-full h-auto object-cover"
                    alt="Solatide Biosciences – Research Grade Peptides"
                />
            </div>

            <div className="main-container w-full relative z-10 mt-6 sm:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">

                    <div className="lg:col-span-8 flex flex-col justify-center text-left">

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
                                className="inline-flex items-center bg-gradient-to-r from-[#00ACEE] to-[#0079CD] justify-center gap-2 text-white font-semibold whitespace-nowrap transition-all duration-200 w-full sm:w-[210px]"
                                style={{
                                    height: '46px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)' }}
                                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
                            >
                                Shop Peptides →
                            </Link>

                            <Link
                                to="/ViewDocument"
                                className="inline-flex items-center justify-center gap-2 bg-transparent font-bold text-[#1a4494] hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 whitespace-nowrap border w-full sm:w-[210px]"
                                style={{
                                    height: '46px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    borderColor: '#007DD0',
                                    flexShrink: 0,
                                }}
                            >
                                View Documents →
                            </Link>

                        </div>

                        {/* Features Container (No Box) */}
                        <div className="mt-6 w-full max-w-[760px]">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-0">

                                {/* Feature 1 */}
                                <div className="flex items-center gap-3">
                                    <HexBadge>
                                        <img src={group1Icon} alt="Shield Icon" className="w-5 h-5 object-contain" />
                                    </HexBadge>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[13.5px] sm:text-[14.5px] font-medium text-slate-800 tracking-tight whitespace-nowrap">
                                            <span className="text-[#00ACEE] font-semibold">≥99%</span> Purity Standard
                                        </span>
                                        <span className="text-[11.5px] sm:text-[12px] text-[#64748B] font-medium whitespace-nowrap mt-0.5">
                                            HPLC-UV/LC-MS + Endotoxin
                                        </span>
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden md:block w-[1.5px] h-10 bg-slate-300/80 self-center"></div>

                                {/* Feature 2 */}
                                <div className="flex items-center gap-3">
                                    <HexBadge>
                                        <img src={group1Icon} alt="Shield Icon" className="w-5 h-5 object-contain" />
                                    </HexBadge>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[13.5px] sm:text-[14.5px] font-medium text-slate-800 tracking-tight whitespace-nowrap">
                                            <span className="text-[#00ACEE] font-semibold">Lot-Traceable</span> Vials
                                        </span>
                                        <span className="text-[11.5px] sm:text-[12px] text-[#64748B] font-medium whitespace-nowrap mt-0.5">
                                            Vial-to-COA Verified
                                        </span>
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden md:block w-[1.5px] h-10 bg-slate-300/80 self-center"></div>

                                {/* Feature 3 */}
                                <div className="flex items-center gap-3">
                                    <HexBadge>
                                        <img src={group1Icon} alt="Shield Icon" className="w-5 h-5 object-contain" />
                                    </HexBadge>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[13.5px] sm:text-[14.5px] font-medium text-slate-800 tracking-tight whitespace-nowrap">
                                            <span className="text-[#00ACEE] font-semibold">Verifiable</span> Reports
                                        </span>
                                        <span className="text-[11.5px] sm:text-[12px] text-[#64748B] font-medium whitespace-nowrap mt-0.5">
                                            Third-Party Results
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

                </div>
            </div>
        </section>
    )
}

export default HeroSection