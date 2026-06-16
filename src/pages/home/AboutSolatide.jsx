import React from 'react'
import { Link } from 'react-router-dom'
import drImage from '../../assets/drImage.png'
import CommonButton from '../../components/CommonBtn'

export default function AboutSolatide() {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                    <div className="w-full lg:w-[45%] shrink-0">
                        <div className="rounded-[20px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.2] lg:aspect-[1.15]">
                            <img src={drImage} alt="Scientist holding vials" className="w-full h-full object-cover select-none" />
                        </div>
                    </div>

                    <div className="w-full lg:w-[45%] flex flex-col text-left justify-center">
                        <span className="text-[14px] font-semibold text-[#00ADEE] mb-2 block">About Solatide</span>

                        <h2 className="text-[32px] md:text-[54px] font-anek font-bold text-[#1D1D1F] leading-[1.15] tracking-[0px]">
                            Built on Science.
                            <br />
                            Driven by Trust.
                        </h2>

                        <p className="mt-3.5 text-[16px] text-[#4B5563] leading-[1.6] max-w-[520px]">
                            Solatide Biosciences operates with a focus on consistent quality standards and a compliance-first approach, ensuring all products are positioned strictly for in-vitro laboratory and analytical research use only while delivering a professional and reliable global supply experience.
                        </p>

                        <ul className="mt-5 space-y-2.5 text-[15px] font-medium text-slate-600">
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Independent third-party analytical documentation where available</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>GMP-certified manufacturing facilities</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>ISO 9001:2015 accredited processes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="flex-shrink-0 h-[18px] w-[18px] text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Strict in-vitro laboratory and analytical research-use only positioning</span>
                            </li>
                        </ul>

                        {/* <div className="mt-6">
                            <Link to="/shop" className="inline-flex items-center justify-center w-[165px] h-[44px] rounded-[14px] bg-[#00ADEE] text-sm font-bold text-white hover:bg-[#0098d1] transition-all duration-200 shadow-md shadow-[#00ADEE]/10">
                                Explore Products &rarr;
                            </Link>
                        </div> */}
                        <div className="mt-6">
                            <CommonButton
                                title="Explore Products"
                                width="200px"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}