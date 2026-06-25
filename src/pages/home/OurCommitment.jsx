import React from 'react'
import { Link } from 'react-router-dom'
import drImage from '../../assets/images/drImage.png'
import CommonButton from '../../components/CommonBtn'

const OurCommitment = () => {
    return (
        <section className="w-full bg-[#F8FAFC] py-16 md:py-24">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                    
                    {/* Left Image */}
                    <div className="w-full lg:w-[45%] shrink-0 relative order-1">
                        <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.1] lg:aspect-[1.05]">
                            <img src={'https://solatidebiosciences.com.au/cdn/shop/files/Solatide_Biosciences_Lab_photo_2.4.6.5.png?v=1781299510&width=1200'} alt="Laboratory machine setup" className="w-full h-full object-cover select-none" />
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white rounded-full px-4 py-2.5 shadow-md flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00ADEE]"></div>
                            <span className="text-[12px] sm:text-[13px] font-bold text-[#1E1E1E] leading-none">
                                In-vitro laboratory research use only
                            </span>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center order-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#00E5FF]"></div>
                            <span className="text-[#00ADEE] text-[14px] font-bold tracking-normal normal-case leading-none">
                                Our Commitment
                            </span>
                        </div>

                        <h2 className="text-[36px] sm:text-[46px] font-bold text-[#1E1E1E] leading-[1.1] tracking-tight mb-6 font-anek">
                            No Shortcuts.<br />
                            <span className="text-[#1a4494]">For Your Peace of Mind.</span>
                        </h2>

                        <div className="space-y-4 text-[14px] sm:text-[15px] text-[#4B5563] leading-[1.7] mb-8">
                            <p>
                                Every batch is subject to post-manufacturing quality control before it reaches us. Selected batches are independently verified by third-party laboratories, with documentation published directly on product pages — so you can verify what you're working with before it arrives.
                            </p>
                            <p>
                                Our role is to help researchers source with less uncertainty: clearer compound information, accessible documentation where available, Australian dispatch, and strict research-use-only positioning across the store.
                            </p>
                        </div>

                        <ul className="flex flex-col gap-3 mb-8">
                            {[
                                "HPLC and mass spectrometry analysis",
                                "Batch rejection for non-conforming material",
                                "ISO 9001:2015 accredited",
                                "GMP-certified manufacturing"
                            ].map((item, index) => (
                                <li key={index} className="flex gap-3 items-center">
                                    <svg className="w-3.5 h-3.5 text-[#00ADEE] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[14px] text-[#4B5563] font-medium leading-[1.4]">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Link to="/shop">
                                <CommonButton title="Explore Products" width="180px" showArrow={true} />
                            </Link>
                            <Link to="/coa" className="text-[#1a4494] font-bold text-[14px] hover:underline px-2 py-2">
                                View documentation process
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default OurCommitment
