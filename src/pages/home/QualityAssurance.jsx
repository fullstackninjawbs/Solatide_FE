import React from 'react'

const QualityAssurance = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-16 lg:py-24">
            <div className="main-container">
                
                {/* Header Block */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-12 text-left">
                    <div className="w-full lg:w-[45%]">
                        <div className="mb-3">
                            <span className="text-[#00E5FF] text-[14px] font-semibold tracking-normal normal-case align-middle leading-none font-['Poppins',sans-serif]">
                                Quality Assurance
                            </span>
                        </div>
                        <h2 className="text-[36px] sm:text-[48px] font-semibold text-[#1E1E1E] leading-[1.1] tracking-tight font-['Anek_Telugu',sans-serif]">
                            Manufacturer QC and<br/>
                            <span className="text-[#1a4494]">Release Standards</span>
                        </h2>
                    </div>
                    <div className="w-full lg:w-[55%] flex items-start lg:pt-8">
                        <p className="text-[14.5px] text-[#4B5563] leading-[1.6]">
                            Every production batch undergoes post-manufacturing analytical quality control before dispatch. Manufacturer QC may include HPLC-UV purity, LC-MS identity, endotoxin, sterility, amino acid analysis, and internal release checks. If required release criteria are not met, the batch is not released.
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
                    
                    {/* Left Card */}
                    <div className="w-full lg:w-[45%] bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col text-left">
                        <div className="mb-6 self-start bg-[#EAF7FD] text-[#00ADEE] text-[10px] font-black tracking-widest px-4 py-2 rounded-full uppercase">
                            Every Production Batch
                        </div>
                        <h3 className="text-[26px] sm:text-[32px] font-bold text-[#1D1D1F] leading-[1.2] mb-6">
                            Post-manufacturing QC before<br/>research release.
                        </h3>
                        <p className="text-[14px] text-[#4B5563] leading-[1.6] mb-6">
                            Each production batch is subject to post-manufacturing analytical quality control before dispatch for research supply. This creates a release checkpoint after manufacturing, rather than relying only on catalogue-level supplier claims.
                        </p>
                        <div className="bg-[#F5F8FC] border border-[#EAF7FD] rounded-[14px] p-5">
                            <p className="text-[13px] text-[#4B5563] leading-[1.6]">
                                <span className="font-bold text-[#1D1D1F]">Release rule:</span> if required QC checks do not meet release criteria, the batch is not released for dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="w-full lg:w-[55%] bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 text-left">
                        <div className="mb-6">
                            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1D1D1F] mb-1">
                                Manufacturer QC may include
                            </h3>
                            <p className="text-[12.5px] text-[#6B7280]">
                                Testing scope may vary by compound, batch, and relevant analytical requirements.
                            </p>
                        </div>

                        <div className="flex flex-col">
                            {[
                                {
                                    num: "01",
                                    title: "HPLC-UV purity testing",
                                    desc: "Used to assess chromatographic purity for relevant compounds and tested batches."
                                },
                                {
                                    num: "02",
                                    title: "LC-MS identity confirmation",
                                    desc: "Used to support compound identity confirmation where applicable."
                                },
                                {
                                    num: "03",
                                    title: "Endotoxin and sterility checks",
                                    desc: "Included where relevant to the product type, batch, and available release documentation."
                                },
                                {
                                    num: "04",
                                    title: "Amino acid analysis",
                                    desc: "Used where relevant to support composition or identity review for applicable peptide materials."
                                },
                                {
                                    num: "05",
                                    title: "Internal release checks",
                                    desc: "Manufacturer release criteria are reviewed before materials proceed to research dispatch."
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-6 py-6 border-t border-slate-100 first:border-0 first:pt-0 last:pb-0">
                                    <div className="text-[13px] font-extrabold text-[#1a4494] pt-0.5 shrink-0">
                                        {item.num}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-1">{item.title}</h4>
                                        <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
                        <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-2">Documentation trail</h4>
                        <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">
                            Available analytical documentation is connected to the relevant product or batch for online review where available.
                        </p>
                    </div>
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
                        <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-2">Release criteria</h4>
                        <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">
                            If required QC checks do not meet release criteria, the batch is not released for dispatch.
                        </p>
                    </div>
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
                        <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-2">Testing scope</h4>
                        <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">
                            QC may include HPLC-UV purity, LC-MS identity, endotoxin, sterility, amino acid analysis, and internal release checks depending on the product and batch.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default QualityAssurance