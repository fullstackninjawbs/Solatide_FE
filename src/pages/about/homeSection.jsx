import React from 'react'
import { Link } from 'react-router-dom'
import drImage from '../../assets/images/drImage.png'
import CommonButton from '../../components/CommonBtn'

const AboutUs = () => {
    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full bg-[#F5F8FC] py-12 md:py-16">
                <div className="main-container">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                        <div className="w-full lg:w-[45%] flex flex-col text-left justify-center order-2 lg:order-1">
                            <span className="text-[16px] font-bold text-[#499cec] mb-3 block">Who We Are</span>

                            <h2 className="text-[32px] md:text-[54px] font-anek font-bold text-[#1D1D1F] leading-[1.15] tracking-[0px]">
                                Built for Researchers.
                                <br />
                                <span className="text-[#1a4494]">Transparent by Design.</span>
                            </h2>

                            <p className="mt-4 text-[15px] text-[#4B5563] leading-[1.6]">
                                Solatide Biosciences was established to supply analytical reference standards, research peptides, and laboratory consumables for in-vitro research use only. We source exclusively from GMP-certified, ISO 9001:2015 accredited manufacturers, price competitively, and publish documentation openly — so researchers can verify what they're working with.
                            </p>

                            <p className="mt-3 text-[15px] text-[#4B5563] leading-[1.6]">
                                Our role is to help researchers source with less uncertainty: clearer compound information, accessible documentation where available, Australian dispatch, and strict research-use-only positioning across the store.
                            </p>

                            <ul className="mt-6 space-y-3 text-[15px] font-semibold text-slate-600">
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>GMP-certified manufacturing facilities</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>ISO 9001:2015 accredited processes</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>Competitive pricing, direct to researcher</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>Research-use-only compliance across all products</span>
                                </li>
                            </ul>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link to="/shop">
                                    <CommonButton
                                        title="Explore Product"
                                        width="180px"
                                        showArrow={true}
                                    />
                                </Link>
                                <Link to="/coa" className="text-[#1a4494] font-bold text-[14px] hover:underline">
                                    View documentation process
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-[45%] shrink-0 order-1 lg:order-2 relative">
                            <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15]">
                                <img src={drImage} alt="Scientist holding vials" className="w-full h-full object-cover select-none" />
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
        </div>
    )
}

export default AboutUs
