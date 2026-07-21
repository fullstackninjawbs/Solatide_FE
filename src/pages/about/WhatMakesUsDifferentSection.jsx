import React from 'react'
import { Link } from 'react-router-dom'
import CommonButton from '../../components/CommonBtn'

const WhatMakesUsDifferentSection = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-16 md:py-24">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column */}
                    <div className="w-full lg:w-[45%] flex flex-col text-left">
                        <span className="flex items-center gap-2 text-[16px] font-bold text-[#00adee] mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#00adee]/15 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00adee]" />
                            </div>
                            Why Researchers Choose Solatide
                        </span>
                        <h2 className="text-[36px] md:text-[48px] lg:text-[54px] font-bold text-[#1D1D1F] mb-6 font-anek leading-[1.15] tracking-[0px]">
                            What We Actually Do
                            <br />
                            <span className="text-[#1a4494]">Differently</span>
                        </h2>
                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-8">
                            Most research peptide suppliers make purity claims that cannot be independently verified. Solatide operates differently — we source exclusively from GMP-certified, ISO 9001:2015 accredited manufacturers, subject selected batches to independent third-party analytical verification at laboratories including Janoshik and Chromate, and publish documentation directly on product pages. Batch records are organised by compound identity, strength, format, and batch reference — so researchers can review what they're working with before it arrives.
                        </p>

                        <div className="bg-white p-6 md:p-8 rounded-[16px] shadow-sm border border-slate-100 flex flex-col">
                            <h4 className="font-bold text-[#1D1D1F] text-[16px] mb-3">Batch documentation should be easy to verify.</h4>
                            <p className="text-[14.5px] text-[#4B5563] leading-[1.6] mb-6">
                                Available COA and laboratory documentation is organised through Solatide’s COA & Lab Testing page, helping researchers review batch information at the product or batch level where available.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-auto">
                                <Link to="/shop">
                                    <CommonButton title="Shop Now" width="160px" showArrow={true} />
                                </Link>
                                <Link to="/coa" className="text-[#1a4494] font-bold text-[14px] hover:underline">Verify batch documentation</Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-[55%]">
                        <div className="bg-white p-6 md:p-10 rounded-[20px] shadow-sm border border-slate-100 flex flex-col">
                            <h3 className="text-[22px] font-bold text-[#1D1D1F] mb-3">Built to reduce sourcing uncertainty</h3>
                            <p className="text-[14.5px] text-[#6A6A6A] leading-[1.6] mb-8">
                                A transparent research supply process starts with batch information researchers can review — not unsupported claims or supplier statements that cannot be verified.
                            </p>

                            <ul className="space-y-6 flex flex-col mb-8">
                                <li className="flex items-start gap-4">
                                    <svg className="w-[20px] h-[20px] text-[#0ea5e9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    </svg>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#1D1D1F] mb-1">Online batch verification</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-[1.5]">Available batch documentation can be reviewed through Solatide’s COA & Lab Testing page where available.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <svg className="w-[20px] h-[20px] text-[#0ea5e9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    </svg>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#1D1D1F] mb-1">We do the testing, so researchers do not have to chase it</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-[1.5]">Post-manufacturing QC and available analytical documentation help reduce reliance on supplier claims that cannot be checked.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <svg className="w-[20px] h-[20px] text-[#0ea5e9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    </svg>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#1D1D1F] mb-1">Batch-level documentation and traceability</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-[1.5]">Available analytical records are organised around compound identity, strength, format, batch references, and documentation status.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <svg className="w-[20px] h-[20px] text-[#0ea5e9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    </svg>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#1D1D1F] mb-1">Fairer research supply pricing</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-[1.5]">Solatide aims to keep research compounds accessible without unnecessary inflated reseller markups.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <svg className="w-[20px] h-[20px] text-[#0ea5e9] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    </svg>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#1D1D1F] mb-1">Research-use-only positioning</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-[1.5]">No human-use, dosing, therapeutic, cosmetic, diagnostic, or veterinary positioning across product information.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="bg-[#f8f9fc] p-4 md:p-5 rounded-[12px] border border-slate-200/60 mt-auto">
                                <p className="text-[13.5px] text-[#4B5563] leading-[1.6]">
                                    <span className="font-bold text-[#1D1D1F]">Procurement check:</span> if a supplier cannot clearly explain batch identity, testing status, documentation availability, and intended-use restrictions, that uncertainty matters.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WhatMakesUsDifferentSection
