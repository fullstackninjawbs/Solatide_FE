import React from 'react'

const WhatMakesUsDifferentSection = () => {
    return (
        <section className="w-full bg-white py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Title & Intro */}
                <div className="text-center max-w-[1440px] mx-auto mb-12">
                    <h2 className="text-[28px] md:text-[34px] font-bold text-[#1a4494] mb-4 font-anek leading-tight">
                        What Makes Us Different
                    </h2>
                    <p className="text-[15px] text-[#6A6A6A] leading-[1.65] font-normal">
                        We compete on documentation quality, not price. While other suppliers may offer cheaper alternatives, we focus on documented quality, transparent testing where available, and professional presentation. Our customers choose Solatide because they value evidence over promises.
                    </p>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1440px] mx-auto mt-8">

                    {/* What we not do */}
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2.5 mb-5">
                            <svg className="w-6 h-6 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#EF4444" />
                                <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="text-[16px] font-semibold text-[#4B5563]">
                                What we not do
                            </h3>
                        </div>
                        <ul className="space-y-4 text-[14.5px] text-[#6A6A6A] leading-[1.6] list-disc pl-5">
                            <li>
                                We do not make exaggerated purity claims.
                            </li>
                            <li>
                                We do not use vague language about "pharmaceutical grade" or "99.9% pure" without backing it up.
                            </li>
                        </ul>
                    </div>

                    {/* What we do */}
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2.5 mb-5">
                            <svg className="w-6 h-6 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#10B981" />
                                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="text-[16px] font-semibold text-[#4B5563]">
                                What we do
                            </h3>
                        </div>
                        <ul className="space-y-4 text-[14.5px] text-[#6A6A6A] leading-[1.6] list-disc pl-5">
                            <li>
                                We do not make exaggerated purity claims.
                            </li>
                            <li>
                                We do not use vague language about "pharmaceutical grade" or "99.9% pure" without backing it up.
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default WhatMakesUsDifferentSection
