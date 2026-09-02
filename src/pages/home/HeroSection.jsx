import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import heroImageWebp from '../../assets/images/homePageFirstSection.webp'
import mobileHeroImageWebp from '../../assets/images/mobile_products_img.webp'
import purityIconWeb from '../../assets/icons/solatide_purity_chromatogram_icon_e95d6e5c-40f0-440a-ac91-2ad346664e9f.webp'
import traceableIconWeb from '../../assets/icons/solatide_lot_traceable_vial_to_coa_icon_0d8282ae-ba91-4634-913a-5832b47dffaf.webp'
import reportsIconWeb from '../../assets/icons/solatide_document_magnifying_glass_icon_185ab8bb-75b3-431a-a4e7-93e99f0a4488.webp'

import purityIcon from '../../assets/icons/solatide-icon-purity-identity.svg'
import traceableIcon from '../../assets/icons/solatide-icon-lot-specific-coa.svg'
import reportsIcon from '../../assets/icons/solatide-icon-independent-analysis.svg'
import { useEffect } from 'react'

const MobileEvidenceSection = () => (
    <section
        className="w-full overflow-hidden text-white border-t-[3px] border-[#10b9dc] lg:hidden opacity-0 animate-fade-in-up rounded-b-[24px]"
        style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 220, 0.17), transparent 48%), #062d5c',
            animationDelay: '300ms',
            fontFamily: '"Poppins", system-ui, sans-serif'
        }}
    >
        <div className="pt-[14px] px-[12px] pb-[16px]">
            <p className="flex items-center gap-[7px] mx-[4px] mb-[12px] text-[#8fdced] text-[11px] leading-none tracking-[0.11em] uppercase font-medium">
                <span className="w-[6px] h-[6px] flex-none rounded-full bg-[#10b9dc]"></span>
                Analytical evidence
            </p>
            <div className="grid grid-cols-3">
                <div className="grid min-w-0 px-[4px] min-[360px]:px-[7px] text-center" style={{ gridTemplateRows: 'max-content max-content max-content', rowGap: '7px' }}>
                    <img className="block w-[46px] h-[46px] min-[360px]:w-[56px] min-[360px]:h-[56px] mx-auto object-contain" src={purityIcon} alt="" aria-hidden="true" />
                    <h3 className="self-start m-0 text-white text-[11px] min-[360px]:text-[13px] leading-[1.23] font-medium">Purity &amp;<br />Identity</h3>
                    <p className="self-start m-0 text-[#c4dbea] text-[10px] min-[360px]:text-[11px] leading-[1.28] font-normal">HPLC-UV purity<br />LC-MS identity</p>
                </div>
                <div className="grid min-w-0 px-[4px] min-[360px]:px-[7px] text-center border-l border-[rgba(200,224,239,0.18)]" style={{ gridTemplateRows: 'max-content max-content max-content', rowGap: '7px' }}>
                    <img className="block w-[46px] h-[46px] min-[360px]:w-[56px] min-[360px]:h-[56px] mx-auto object-contain" src={traceableIcon} alt="" aria-hidden="true" />
                    <h3 className="self-start m-0 text-white text-[11px] min-[360px]:text-[13px] leading-[1.23] font-medium">Lot-Specific<br />COA</h3>
                    <p className="self-start m-0 text-[#c4dbea] text-[10px] min-[360px]:text-[11px] leading-[1.28] font-normal">Matched to the<br />vial lot</p>
                </div>
                <div className="grid min-w-0 px-[4px] min-[360px]:px-[7px] text-center border-l border-[rgba(200,224,239,0.18)]" style={{ gridTemplateRows: 'max-content max-content max-content', rowGap: '7px' }}>
                    <img className="block w-[46px] h-[46px] min-[360px]:w-[56px] min-[360px]:h-[56px] mx-auto object-contain" src={reportsIcon} alt="" aria-hidden="true" />
                    <h3 className="self-start m-0 text-white text-[11px] min-[360px]:text-[13px] leading-[1.23] font-medium">Independent<br />Analysis</h3>
                    <p className="self-start m-0 text-[#c4dbea] text-[10px] min-[360px]:text-[11px] leading-[1.28] font-normal">Third-party reports</p>
                </div>
            </div>
        </div>

        <div className="relative pt-[13px] px-[18px] pb-[15px] border-t border-[rgba(143,220,237,0.35)] text-center" style={{ background: 'linear-gradient(90deg, rgba(16, 185, 220, 0.18), transparent 28%, transparent 72%, rgba(16, 185, 220, 0.18)), #0a3c73' }}>
            <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[88px] h-[3px] rounded-full bg-[#10b9dc]"></div>
            <span className="block mb-[6px] text-[#8fdced] text-[11px] leading-none tracking-[0.13em] uppercase font-medium">Contaminant analysis</span>
            <strong className="block text-white text-[14px] min-[360px]:text-[16px] leading-[1.2] tracking-[-0.02em] font-medium">Fentanyl + Endotoxin Testing</strong>
        </div>
    </section>
);


const FeatureCards = () => (
    <div className="flex flex-col sm:flex-row items-stretch justify-center lg:justify-start gap-2.5 xl:gap-3">
        {/* Feature 1 */}
        <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-2 pr-3.5 xl:p-2.5 xl:pr-4 flex items-center gap-2.5">
            <img src={purityIconWeb} alt="Purity Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
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
            <img src={traceableIconWeb} alt="Traceable Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
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
            <img src={reportsIconWeb} alt="Reports Icon" className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0" />
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
);

const HeroSection = () => {
    return (

        <section className="relative w-full overflow-hidden bg-white flex flex-col lg:flex-row items-stretch lg:items-center min-h-0 lg:min-h-[860px] pt-0 lg:pt-[130px] pb-0 lg:pb-[80px]">
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

            {/* Mobile Hero Image & Content Wrapper */}
            <div className="flex flex-col lg:block w-full relative z-10 flex-1">

                {/* Mobile Background Image */}
                <div className="w-full md:hidden relative z-10">
                    <img
                        src={mobileHeroImageWebp}
                        className="w-full h-auto object-contain select-none pointer-events-none"
                        alt="Solatide Biosciences – Research Grade Peptides"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                    />
                </div>

                {/* Tablet Dedicated Layout (768px - 1023px) */}
                <div className="hidden md:flex lg:hidden flex-col w-full relative z-10 flex-1">
                    {/* Tablet Specific Background Image */}
                    <div className="w-full relative z-10">
                        <img
                            src={mobileHeroImageWebp}
                            className="w-full h-auto object-contain select-none pointer-events-none"
                            alt="Solatide Biosciences"
                            loading="eager"
                            fetchPriority="high"
                        />
                    </div>

                    {/* Text Content sitting below bottles */}
                    <div className="flex flex-col justify-end w-full relative z-20 pb-0 pt-8 bg-[#e4dbf8] -mt-2">
                        <div className="main-container w-full flex flex-col items-center text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <h1 className="text-[38px] font-bold tracking-tight text-[#1a4494] leading-[1.15] mb-5 max-w-[650px]">
                                Your Trusted Source For<br />Research Grade Peptides.
                            </h1>
                            <p className="text-[16px] text-[#475569] font-medium leading-relaxed mb-6 w-[90%] max-w-[600px]">
                                Solatide Biosciences delivers research grade peptides and laboratory solutions for researchers who demand purity, consistency, and results.
                            </p>
                            <div className="flex flex-row items-center justify-center gap-4 mb-2">
                                <Link to="/shop" className="inline-flex items-center bg-gradient-to-r from-[#00ACEE] to-[#0079CD] justify-center gap-2 text-white font-semibold w-[210px]" style={{ height: '46px', borderRadius: '9999px', fontSize: '15px' }}>
                                    Shop Peptides →
                                </Link>
                                <Link to="/view-document" className="inline-flex items-center justify-center gap-2 bg-transparent font-bold text-[#1a4494] hover:bg-slate-50 transition-all border w-[210px]" style={{ height: '46px', borderRadius: '9999px', fontSize: '15px', borderColor: '#007DD0' }}>
                                    <FileText size={18} strokeWidth={2.5} /> View Documents →
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile/Desktop Content Section */}
                <div className="md:hidden lg:flex flex-col justify-start w-full relative z-20 pb-0 pt-6 lg:pb-0 lg:pt-0 bg-[#e4dbf8] lg:bg-transparent -mt-2">
                    <div className="main-container w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">

                            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left relative z-20 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                                <h1 className="text-[24px] min-[360px]:text-[28px] sm:text-[42px] lg:text-[48px] xl:text-[48px] font-bold tracking-tight text-[#1a4494] leading-[1.12] mb-3 sm:mb-5">
                                    Your Trusted Source For<br />Research Grade Peptides.
                                </h1>

                                <p className="text-[12px] min-[360px]:text-[13px] sm:text-[14px] lg:text-[16px] text-[#475569] font-medium leading-relaxed mb-3 sm:mb-4 w-[95%] sm:w-[90%]">
                                    Solatide Biosciences delivers research grade peptides and
                                    laboratory solutions for researchers who demand purity,
                                    consistency, and results.
                                </p>
                                <div className="flex flex-col sm:flex-row items-start gap-2 min-[360px]:gap-2.5 sm:gap-3.5 mb-2 lg:mb-8">

                                    <Link
                                        to="/shop"
                                        className="h-[40px] min-[360px]:h-[46px] inline-flex items-center bg-gradient-to-r from-[#00ACEE] to-[#0079CD] justify-center gap-2 text-white font-semibold whitespace-nowrap transition-all duration-200 w-full sm:w-[210px]"
                                        style={{
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
                                        className="h-[40px] min-[360px]:h-[46px] inline-flex items-center justify-center gap-2 bg-transparent font-bold text-[#1a4494] hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 whitespace-nowrap border w-full sm:w-[210px]"
                                        style={{
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            borderColor: '#007DD0',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <FileText size={18} strokeWidth={2.5} /> View Documents →
                                    </Link>

                                </div>

                                {/* Features Container */}
                                <div className="mt-4 w-full lg:w-fit max-w-full">
                                    <div className="hidden lg:block opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                        <FeatureCards />
                                    </div>
                                </div>

                            </div>

                            <div className="hidden lg:block lg:col-span-5 xl:col-span-5" aria-hidden="true" />

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Analytical Evidence - Ends the Hero Section */}
            <div className="lg:hidden w-full relative z-30">
                <MobileEvidenceSection />
            </div>

        </section>
    )
}

export default HeroSection