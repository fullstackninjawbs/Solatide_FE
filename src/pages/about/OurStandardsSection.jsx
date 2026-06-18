import React from 'react'
import { Link } from 'react-router-dom'
import WhySolatideImage from '../../assets/images/WhySolatideImage.png'

const OurStandardsSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                    
                    {/* Left content */}
                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center order-2 lg:order-1">
                        <h2 className="text-[28px] md:text-[34px] font-bold text-[#1a4494] mb-4 font-anek leading-tight">Our Standards</h2>
                        
                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-5">
                            Where third-party documentation is published, it reflects our preference for high-purity material and transparent supporting data. Our focus is consistency, traceability, and clear supporting information rather than vague marketing claims.
                        </p>

                        <p className="text-[15px] text-[#4B5563] font-semibold leading-[1.6] mb-3">
                            Quality verification follows a rigorous process:
                        </p>

                        <ul className="space-y-3.5 text-[14.5px] text-[#4B5563] leading-[1.6] list-disc pl-5 mb-6">
                            <li>
                                Every production batch undergoes post-manufacturing quality control by the manufacturer before dispatch, which may include HPLC analysis, mass spectrometry, purity assessment, and other internal release checks
                            </li>
                            <li>
                                Batches that do not meet internal specifications are rejected and never enter our inventory
                            </li>
                            <li>
                                Selected products or batches are submitted to independent third-party laboratories for additional analytical verification
                            </li>
                            <li>
                                Where available, documentation is made available on product pages
                            </li>
                            <li>
                                Documentation availability, scope, and format vary by product and testing cycle
                            </li>
                        </ul>

                        <p className="text-[14.5px] text-[#4B5563] leading-[1.6]">
                            Visit our <Link to="/coa" className="text-[#0AD6ED] font-semibold hover:underline">COA & Lab Testing</Link> page for more information about our verification process.
                        </p>
                    </div>

                    {/* Right image */}
                    <div className="w-full lg:w-[40%] shrink-0 order-1 lg:order-2">
                        <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15]">
                            <img src={WhySolatideImage} alt="Scientist analyzing laboratory samples" className="w-full h-full object-cover select-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default OurStandardsSection
