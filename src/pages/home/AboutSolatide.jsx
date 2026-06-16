import React from 'react'
import { Link } from 'react-router-dom'
import drImage from '../../assets/drImage.png'

export default function AboutSolatide() {
    return (
        <section className="w-full bg-white">
            <div className="main-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left - Image */}
                    <div className="w-full">
                        <div className="rounded-[32px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] md:aspect-[1.15] lg:aspect-[1.1]">
                            <img src={drImage} alt="Scientist holding vials" className="w-full h-full object-cover select-none" />
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="flex flex-col text-left">
                        <span className="text-[15px] font-bold text-[#00bfef] mb-3">About Solatide</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#102a5c] leading-tight">
                            Built on Science.
                            <br />
                            Driven by Trust.
                        </h2>
                        <p className="mt-5 text-[14px] text-slate-500 leading-relaxed max-w-2xl">
                            Solatide Biosciences operates with a focus on consistent quality standards and a compliance-first approach, ensuring all products are positioned strictly for in-vitro laboratory and analytical research use only while delivering a professional and reliable global supply experience.
                        </p>

                        <ul className="mt-6 space-y-3.5 text-[14.5px] font-medium text-slate-600">
                            <li className="flex items-start gap-3.5">
                                <svg className="flex-shrink-0 mt-0.5 h-[19px] w-[19px] text-[#009bf2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Independent third-party analytical documentation where available</span>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <svg className="flex-shrink-0 mt-0.5 h-[19px] w-[19px] text-[#009bf2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>GMP-certified manufacturing facilities</span>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <svg className="flex-shrink-0 mt-0.5 h-[19px] w-[19px] text-[#009bf2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>ISO 9001:2015 accredited processes</span>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <svg className="flex-shrink-0 mt-0.5 h-[19px] w-[19px] text-[#009bf2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2 2 5-5" />
                                </svg>
                                <span>Strict in-vitro laboratory and analytical research-use only positioning</span>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#009bf2] px-7 py-3 text-sm font-bold text-white hover:bg-[#008bdb] transition-all duration-200 shadow-md shadow-[#009bf2]/10">
                                Explore Products &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}