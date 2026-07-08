import React from 'react'
import { Link } from 'react-router-dom'
import heroImageWebp from '../../assets/images/homePageFirstSection.webp'
import mobileHeroImageWebp from '../../assets/images/mobile_products_img.webp'
import purityIcon from '../../assets/icons/solatide_purity_chromatogram_icon_e95d6e5c-40f0-440a-ac91-2ad346664e9f.png'
import traceableIcon from '../../assets/icons/solatide_lot_traceable_vial_to_coa_icon_0d8282ae-ba91-4634-913a-5832b47dffaf.png'
import reportsIcon from '../../assets/icons/solatide_document_magnifying_glass_icon_185ab8bb-75b3-431a-a4e7-93e99f0a4488.png'


const HeroSection = () => {
    return (

        <section className="relative w-full overflow-hidden bg-white flex flex-col sm:flex-row items-stretch sm:items-center min-h-[640px] sm:min-h-[700px] lg:min-h-[860px] pt-0 md:pt-[110px] lg:pt-[130px] pb-[60px] sm:pb-[80px]">
            <div className="absolute inset-0 z-0 hidden lg:block">
                <img
                    src={heroImageWebp}
                    className="w-full h-full object-cover object-[72%_center] xl:object-center select-none pointer-events-none"
                    alt="Solatide Biosciences – Research Grade Peptides"
                    draggable={false}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                />

            </div>
            {/* Mobile Hero Image (Zero margins, touches header and side edges, hidden on sm and above) */}
            <div className="lg:hidden w-full overflow-hidden shrink-0 relative z-10">
                <img
                    src={mobileHeroImageWebp}
                    className="w-full h-auto object-cover"
                    alt="Solatide Biosciences – Research Grade Peptides"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                />
            </div>

            <div className="main-container w-full relative z-10 mt-6 sm:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">

                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left relative z-10">

                        <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] xl:text-[48px] font-bold tracking-tight text-[#1a4494] leading-[1.12] mb-5">
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
                                to="/view-document"
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

                        {/* Features Container */}
                        <div className="mt-8 w-full lg:w-fit max-w-full">
                            <div className="flex flex-col sm:flex-row items-stretch justify-start gap-2.5 xl:gap-3">

                                {/* Feature 1 */}
                                <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-2 pr-3.5 xl:p-2.5 xl:pr-4 flex items-center gap-2.5">
                                    <img src={purityIcon} alt="Purity Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] xl:text-[15px] font-semibold text-[#00ACEE] tracking-tight whitespace-nowrap leading-none mb-[4px]">
                                            ≥99% Purity Standard
                                        </span>
                                        <span className="text-[11px] xl:text-[12px] text-slate-600 font-medium whitespace-nowrap leading-none">
                                            HPLC-UV/LC-MS + Endotoxin
                                        </span>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-2 pr-3.5 xl:p-2.5 xl:pr-4 flex items-center gap-2.5">
                                    <img src={traceableIcon} alt="Traceable Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] xl:text-[15px] font-semibold text-[#00ACEE] tracking-tight whitespace-nowrap leading-none mb-[4px]">
                                            Lot-Traceable Vials
                                        </span>
                                        <span className="text-[11px] xl:text-[12px] text-slate-600 font-medium whitespace-nowrap leading-none">
                                            Vial-to-COA Verified
                                        </span>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-2 pr-3.5 xl:p-2.5 xl:pr-4 flex items-center gap-2.5">
                                    <img src={reportsIcon} alt="Reports Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] xl:text-[15px] font-semibold text-[#00ACEE] tracking-tight whitespace-nowrap leading-none mb-[4px]">
                                            Verifiable Reports
                                        </span>
                                        <span className="text-[11px] xl:text-[12px] text-slate-600 font-medium whitespace-nowrap leading-none">
                                            Third-Party Results
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="hidden lg:block lg:col-span-5 xl:col-span-5" aria-hidden="true" />

                </div>
            </div>
        </section>
    )
}

export default HeroSection