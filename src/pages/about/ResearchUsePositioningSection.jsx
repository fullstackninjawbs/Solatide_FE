import React from 'react'
import { Link } from 'react-router-dom'
import pipetteImage from '../../assets/images/Rectangle 42463.png'

const ResearchUsePositioningSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                    
                    {/* Left content */}
                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center order-2 lg:order-1">
                        <h2 className="text-[28px] md:text-[34px] font-bold text-[#1a4494] mb-4 font-anek leading-tight">
                            Research-Use Positioning
                        </h2>
                        
                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-4">
                            All products sold by Solatide Biosciences are supplied strictly for in-vitro laboratory and analytical research purposes only. We make no therapeutic, diagnostic, or clinical claims, and we do not provide information for human or veterinary use.
                        </p>

                        <p className="text-[15px] text-[#4B5563] font-semibold leading-[1.6] mb-3">
                            Our commitment to research-use compliance means:
                        </p>

                        <ul className="mt-4 space-y-3 text-[15px] font-semibold text-slate-600 mb-6">
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Zero medical, therapeutic, or health claims</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Zero human-use or veterinary-use information</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Clear in-vitro research-use positioning on all materials</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Strictly educational and scientific data</span>
                            </li>
                        </ul>

                        <p className="text-[14.5px] text-[#4B5563] leading-[1.6]">
                            Read our full <Link to="/disclaimer" className="text-[#0AD6ED] font-semibold hover:underline">Research Use Disclaimer</Link> for complete details.
                        </p>
                    </div>

                    {/* Right image */}
                    <div className="w-full lg:w-[45%] shrink-0 order-1 lg:order-2">
                        <div className="rounded-[20px] overflow-hidden shadow-sm border border-slate-100/30 bg-white">
                            <img src={pipetteImage} alt="Laboratory technician pipetting sample" className="w-full h-auto object-contain select-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResearchUsePositioningSection
