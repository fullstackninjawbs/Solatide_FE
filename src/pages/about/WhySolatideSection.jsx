import React from 'react'
import { Link } from 'react-router-dom'
import CommonButton from '../../components/CommonBtn'
import lab from '../../assets/images/lab.png'


const WhySolatideSection = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-12 md:py-16">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">

                    {/* Left image placeholder */}
                    <div className="w-full lg:w-[45%] shrink-0 order-1 lg:order-1 relative">
                        <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15] bg-slate-200">
                            {/* Placeholder for an image since the original site has one here */}
                            <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15]">
                                <img src={lab} alt="Scientist holding vials" className="w-full h-full object-cover select-none" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                            <span className="text-[12px] sm:text-[13px] font-bold text-[#1D1D1F] leading-none">
                                In-vitro laboratory research use only
                            </span>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center order-2 lg:order-2">
                        <span className="flex items-center gap-2 text-[16px] font-bold text-[#00adee] mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#00adee]/15 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00adee]" />
                            </div>
                            Our Commitment
                        </span>
                        <h2 className="text-[32px] md:text-[54px] font-anek font-bold text-[#1D1D1F] leading-[1.15] tracking-[0px]">
                            No Shortcuts.
                            <br />
                            <span className="text-[#1a4494]">For Your Peace of Mind.</span>
                        </h2>

                        <p className="mt-4 text-[15px] text-[#4B5563] leading-[1.6]">
                            The research peptide market is crowded with vague supplier claims and unverifiable purity statements. We don't operate that way — every purity claim we make is backed by independent third-party documentation, published openly on product pages. Every batch is subject to post-manufacturing quality control before it reaches us, with selected batches independently verified by third-party laboratories.
                        </p>

                        <p className="mt-3 text-[15px] text-[#4B5563] font-semibold leading-[1.6]">
                            Quality verification follows a rigorous process:
                            <br />
                            <span className="font-normal">Visit our <a className='text-[#1a4494] font-semibold hover:underline transition-all' href='/coa'>COA & Lab Testing</a> page for more information about our verification process.</span>
                        </p>

                        <ul className="mt-5 space-y-3 text-[15px] font-semibold text-slate-600 mb-6">
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>HPLC and mass spectrometry analysis</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Batch rejection for non-conforming material</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Independent third-party laboratory verification</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>COA documentation published on product pages</span>
                            </li>
                        </ul>

                        <p className="text-[13px] text-slate-500 italic mb-6">
                            Documentation availability, scope, and format vary by product and testing cycle.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/shop">
                                <CommonButton title="Explore Product" width="180px" showArrow={true} />
                            </Link>
                            <Link to="/coa" className="text-[#1a4494] font-bold text-[14px] hover:underline">
                                View documentation process
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WhySolatideSection
