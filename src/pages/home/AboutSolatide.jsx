import React from 'react'
import { Link } from 'react-router-dom'
import drImage from '../../assets/images/drImage.png'

export default function AboutSolatide() {
    return (
        <section className="w-full bg-[#F5F8FC] py-12 md:py-16">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-[8%]">

                    <div className="w-full lg:w-[45%] shrink-0 relative">
                        <div className="rounded-[24px] overflow-hidden shadow-lg border border-slate-100/30 aspect-[4/3] sm:aspect-[1.1] lg:aspect-[1.05]">
                            <img src={drImage} alt="Laboratory machine setup" className="w-full h-full object-cover select-none" />
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white rounded-full px-4 py-2.5 shadow-md flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00ADEE]"></div>
                            <span className="text-[12px] sm:text-[13px] font-bold text-[#1E1E1E] leading-none">
                                In-vitro laboratory research use only
                            </span>
                        </div>
                    </div>

                    <div className="w-full lg:w-[50%] flex flex-col text-left justify-center pt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case align-middle leading-none font-['Poppins',sans-serif]">
                                About Solatide
                            </span>
                        </div>

                        <h2 className="text-[36px] sm:text-[48px] font-semibold text-[#1E1E1E] leading-[1.1] tracking-tight font-['Anek_Telugu',sans-serif] mb-6">
                            Built on Science.<br />
                            <span className="text-[#1a4494]">Driven by Trust.</span>
                        </h2>

                        <div className="space-y-4 text-[15px] text-[#4B5563] leading-[1.6] mb-8">
                            <p>
                                Solatide Biosciences was built to make research supply more transparent, more traceable, and easier to verify. We supply analytical reference standards, research peptides, and laboratory consumables for in-vitro laboratory research use only, with a focus on clear documentation, fair pricing, and responsible product information.
                            </p>
                            <p>
                                Our role is to help researchers source with less uncertainty: clearer compound information, accessible documentation where available, Australian dispatch, and strict research-use-only positioning across the store.
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 mb-8">
                            {[
                                {
                                    title: "Transparent research supply",
                                    desc: "with product information written around compound identity, format, research-use-only positioning, and documentation review."
                                },
                                {
                                    title: "Online documentation access",
                                    desc: "so available batch documentation can be reviewed through Solatide's COA & Lab Testing page where available."
                                },
                                {
                                    title: "Australian dispatch workflow",
                                    desc: "with orders prepared from Melbourne and tracking provided where available."
                                },
                                {
                                    title: "Fairer pricing model",
                                    desc: "designed to avoid unnecessary inflated reseller markups while maintaining documentation and QC standards."
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="mt-1 w-4.5 h-4.5 rounded-full bg-[#E0F7FA] flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-[13.5px] text-[#6B7280] leading-[1.5]">
                                        <span className="font-bold text-[#1E1E1E]">{item.title}</span> {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                to="/shop"
                                className="bg-gradient-to-r from-[#00ACEE] to-[#0079CD] text-white text-[14px] font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center gap-2 shrink-0 tracking-wide"
                            >
                                Explore Products <span>→</span>
                            </Link>
                            <Link
                                to="/coa"
                                className="text-[#1a4494] text-[14px] font-semibold py-3.5 px-4 transition-all hover:opacity-80"
                            >
                                View documentation process
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}