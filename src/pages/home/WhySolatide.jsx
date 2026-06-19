import React from 'react'
import { Link } from 'react-router-dom'

const WhySolatide = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-12 md:py-16">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-16">

                    <div className="w-full lg:w-[45%] flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case align-middle leading-none font-['Poppins',sans-serif]">
                                Why Solatide
                            </span>
                        </div>


                        <h2 className="text-[36px] sm:text-[48px] font-semibold text-[#1E1E1E] leading-tight font-['Anek_Telugu',sans-serif] mb-6">
                            We Do the Testing, So <br />
                            <span className="text-[#1a4494]">You Don't Have To</span>
                        </h2>


                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-8">
                            The research peptide market is crowded with vague listings, difficult-to-verify supplier claims, inflated markups, and incomplete batch documentation. Solatide is built to reduce that uncertainty with online batch verification, batch-level documentation, post-manufacturing QC, and fairer research supply pricing.
                        </p>


                        <div className="border-l-4 border-[#00ADEE] pl-5 mb-8">
                            <h3 className="text-[16px] font-bold text-[#1D1D1F] mb-2">
                                Batch documentation should be easy to verify.
                            </h3>
                            <p className="text-[14px] text-[#4B5563] leading-relaxed">
                                Available COA and laboratory documentation is organised through Solatide's COA & Lab Testing page, helping researchers review batch information at the product or batch level where available.
                            </p>
                        </div>


                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Link
                                to="/shop"
                                className="bg-gradient-to-r from-[#00ACEE] to-[#0079CD] hover:bg-[#0098d1] text-white text-[14px] font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 tracking-wide"
                            >
                                Shop Now <span>→</span>
                            </Link>
                            <Link
                                to="/ViewDocument"
                                className="text-[#1a4494] text-[14px] font-extrabold py-2 px-0 sm:py-3.5 sm:px-4 transition-all hover:opacity-80 w-full text-center sm:text-left sm:w-auto"
                            >
                                Verify batch documentation
                            </Link>
                        </div>
                    </div>

                    <div className="w-full lg:w-[50%]">
                        <div className="bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100">
                            <h3 className="text-[20px] font-bold text-[#1E1E1E] mb-3">
                                Built to reduce sourcing uncertainty
                            </h3>
                            <p className="text-[14px] text-[#6B7280] mb-8 border-b border-slate-100 pb-6">
                                A transparent research supply process starts with batch information researchers can review — not unsupported claims or supplier statements that cannot be verified.
                            </p>


                            <div className="flex flex-col">
                                {[
                                    {
                                        title: "Online batch verification",
                                        desc: "Available batch documentation can be reviewed through Solatide's COA & Lab Testing page where available."
                                    },
                                    {
                                        title: "We do the testing, so researchers do not have to chase it",
                                        desc: "Post-manufacturing QC and available analytical documentation help reduce reliance on supplier claims that cannot be checked."
                                    },
                                    {
                                        title: "Batch-level documentation and traceability",
                                        desc: "Available analytical records are organised around compound identity, strength, format, batch references, and documentation status."
                                    },
                                    {
                                        title: "Fairer research supply pricing",
                                        desc: "Solatide aims to keep research compounds accessible without unnecessary inflated reseller markups."
                                    },
                                    {
                                        title: "Research-use-only positioning",
                                        desc: "No human-use, dosing, therapeutic, cosmetic, diagnostic, or veterinary positioning across product information."
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 py-4 border-b border-slate-100 first:pt-0 last:border-0 last:pb-0">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#E0F7FA] flex items-center justify-center shrink-0">
                                            <svg className="w-3 h-3 text-[#00ADEE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[14px] font-bold text-[#1E1E1E] mb-1">{item.title}</h4>
                                            <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Procurement Check Box */}
                            <div className="mt-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-4">
                                <p className="text-[12.5px] text-[#4B5563] leading-relaxed">
                                    <span className="font-bold text-[#1E1E1E]">Procurement check:</span> If a supplier cannot clearly explain batch identity, testing status, documentation availability, and intended-use restrictions, that uncertainty matters.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WhySolatide