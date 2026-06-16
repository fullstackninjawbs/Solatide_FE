import React from 'react'
import { FlaskConical, Beaker, FileText, ShieldCheck } from 'lucide-react'
import vialImage from '../../assets/images/RectangleMadBackground.png'

const QualityAssurance = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-16 lg:py-24">
            <div className="main-container">
                {/* Header Block: Left Title and Right Description */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-16 text-left">
                    <div className="max-w-xl">
                        <span className="text-[#00ADEE] text-[14px] font-semibold mb-2 block">Quality Assurance</span>
                        <h2 className="text-[32px] md:text-[44px] font-anek font-bold text-[#1D1D1F] leading-tight">
                            Structured Quality Standards
                        </h2>
                    </div>
                    <div className="max-w-xl lg:max-w-[480px]">
                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mt-1">
                            Every production batch undergoes manufacturer quality control before release. Selected products also include independent third-party analytical documentation where available. Documentation availability, scope, and format vary by product and testing cycle.
                        </p>
                    </div>
                </div>

                {/* 3-Column Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Features 1 & 2 */}
                    <div className="flex flex-col gap-12 sm:gap-16">
                        {/* High-Purity Standards */}
                        <div className="flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-xl bg-[#DEF5FF] flex items-center justify-center text-[#00ADEE] mb-4">
                                <FlaskConical className="w-6 h-6" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-2">High-Purity Standards</h3>
                            <p className="text-[14px] text-[#4B5563] leading-[1.6] max-w-[280px]">
                                Selected compounds meet a ≥99% purity standard based on available analytical data.
                            </p>
                        </div>

                        {/* Manufacturer QC */}
                        <div className="flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-xl bg-[#DEF5FF] flex items-center justify-center text-[#00ADEE] mb-4">
                                <Beaker className="w-6 h-6" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-2">Manufacturer QC</h3>
                            <p className="text-[14px] text-[#4B5563] leading-[1.6] max-w-[280px]">
                                Every production batch undergoes post-manufacturing quality control before dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Middle Column: Vial Image Container */}
                    <div className="w-full flex justify-center">
                        <div className="rounded-[24px] overflow-hidden shadow-md border border-slate-100/30 aspect-[0.85] max-w-[340px] lg:max-w-full bg-white">
                            <img src={vialImage} alt="Retatrutide 10mg Vial" className="w-full h-full object-cover select-none" />
                        </div>
                    </div>

                    {/* Right Column: Features 3 & 4 */}
                    <div className="flex flex-col gap-12 sm:gap-16">
                        {/* Third-Party Documentation */}
                        <div className="flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-xl bg-[#DEF5FF] flex items-center justify-center text-[#00ADEE] mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-2">Third-Party Documentation</h3>
                            <p className="text-[14px] text-[#4B5563] leading-[1.6] max-w-[280px]">
                                Selected products include independent analytical reports where available.
                            </p>
                        </div>

                        {/* Secure and Reliable Handling */}
                        <div className="flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-xl bg-[#DEF5FF] flex items-center justify-center text-[#00ADEE] mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D1D1F] mb-2">Secure and Reliable Handling</h3>
                            <p className="text-[14px] text-[#4B5563] leading-[1.6] max-w-[280px]">
                                Products are carefully packaged and handled to maintain integrity throughout dispatch and delivery.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default QualityAssurance