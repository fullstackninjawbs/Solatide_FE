import React from 'react'
import { Link } from 'react-router-dom'
import CommonButton from '../../components/CommonBtn'
import pipetteImage from '../../assets/images/Rectangle 42463.png'

const ResearchUsePositioningSection = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">

                    {/* Left content */}
                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center order-2 lg:order-1">
                        <span className="flex items-center gap-2 text-[16px] font-bold text-[#00adee] mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#00adee]/15 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00adee]" />
                            </div>
                            About Solatide
                        </span>
                        <h2 className="text-[32px] md:text-[54px] font-bold text-[#1D1D1F] mb-4 font-anek leading-[1.15] tracking-[0px]">
                            Built on Science.
                            <br />
                            <span className="text-[#1a4494]">Research-Use Positioning</span>
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

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link to="/shop">
                                <CommonButton title="View Products" width="180px" showArrow={true} />
                            </Link>
                            <Link to="/coa" className="text-[#1a4494] font-bold text-[14px] hover:underline">
                                View documentation process
                            </Link>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="w-full lg:w-[45%] shrink-0 order-1 lg:order-2 relative">
                        <div className="rounded-[20px] overflow-hidden shadow-sm border border-slate-100/30 bg-white">
                            <img src={pipetteImage} alt="Laboratory technician pipetting sample" className="w-full h-auto object-contain select-none" />
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                            <span className="text-[12px] sm:text-[13px] font-bold text-[#1D1D1F] leading-none">
                                In-vitro laboratory research use only
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResearchUsePositioningSection
