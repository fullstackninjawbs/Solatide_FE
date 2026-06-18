import React from 'react'
import drImage from '../../assets/images/drImage.png'
import CommonButton from '../../components/CommonBtn'

const AboutUs = () => {
    return (
        <div className="w-full bg-white min-h-screen">
            {/* Banner Section */}
            <section className="w-full bg-[#F0F5FB] py-16 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        About Us
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] max-w-[650px] mx-auto">
                        Learn more about Solatide Biosciences, our compliance-first approach, and our commitment to providing consistent research-grade compounds.
                    </p>
                </div>
            </section>

            {/* Who We Are Details */}
            <section className="w-full bg-white py-12 md:py-16">
                <div className="main-container">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                        <div className="w-full lg:w-[45%] flex flex-col text-left justify-center order-2 lg:order-1">
                            <span className="text-[16px] font-bold text-[#1a4494] mb-3 block">Who We Are</span>

                            <h2 className="text-[32px] md:text-[54px] font-anek font-bold text-[#1D1D1F] leading-[1.15] tracking-[0px]">
                                Built on Science.
                                <br />
                                <span className="text-[#1a4494]">Driven by Trust.</span>
                            </h2>

                            <p className="mt-4 text-[15px] text-[#4B5563] leading-[1.6]">
                                Solatide Biosciences is an Australian-operated research supplier focused on documented quality, independent third-party verification where available, and clear support for laboratory-use compounds.
                            </p>

                            <p className="mt-3 text-[15px] text-[#4B5563] leading-[1.6]">
                                We specialise in premium lyophilised peptides with transparent documentation, available third-party verification for selected products and batches, and consistent quality standards. Our focus is simple: provide analytical-grade research materials with documented purity data, clear compliance positioning, and professional presentation.
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
                                    <span>Batch-specific CoA documentation</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>In-house analytical chemistry team</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#1a4494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                    </svg>
                                    <span>ISO 9001:2015 accredited processes</span>
                                </li>
                            </ul>

                            <div className="mt-8">
                                <CommonButton
                                    title="Explore Product"
                                    width="200px"
                                    showArrow={true}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-[45%] shrink-0 order-1 lg:order-2">
                            <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15]">
                                <img src={drImage} alt="Scientist holding vials" className="w-full h-full object-cover select-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutUs
