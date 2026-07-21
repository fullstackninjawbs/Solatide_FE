import React from 'react'

const OurStandardsSection = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-16 md:py-24">
            <div className="main-container">

                {/* Header Row (2 Columns) */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start mb-12">
                    <div className="w-full lg:w-1/2 text-left">
                        <span className="flex items-center gap-2 text-[16px] font-bold text-[#00adee] mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#00adee]/15 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00adee]" />
                            </div>
                            Quality Assurance
                        </span>

                        <h2 className="text-[32px] md:text-[48px] font-bold text-[#1D1D1F] font-anek leading-[1.1] tracking-[0px]">
                            Manufacturer QC and
                            <br />
                            Release <span className="text-[#1a4494]">Standards</span>
                        </h2>
                    </div>
                    <div className="w-full lg:w-1/2 pt-2">
                        <p className="text-[14.5px] text-[#4B5563] leading-[1.6]">
                            Every production batch undergoes post-manufacturing analytical quality control before dispatch. Manufacturer QC may include HPLC-UV purity, LC-MS identity, endotoxin, sterility, amino acid analysis, and internal release checks. If required release criteria are not met, the batch is not released.
                        </p>
                    </div>
                </div>

                {/* Main Cards Row */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Left Card */}
                    <div className="w-full lg:w-1/2 bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 md:p-10 text-left flex flex-col">
                        <div className="inline-block bg-[#e0f2fe] text-[#0ea5e9] text-[11px] font-bold px-3 py-1 rounded-full mb-6 self-start uppercase tracking-wider">
                            EVERY PRODUCTION BATCH
                        </div>
                        <h3 className="text-[28px] md:text-[32px] font-bold text-[#1a4494] mb-6 leading-[1.2]">
                            Post-manufacturing QC before research release.
                        </h3>
                        <p className="text-[14.5px] text-[#6A6A6A] leading-[1.6] mb-8">
                            Each production batch is subject to post-manufacturing analytical quality control before dispatch for research supply. This creates a release checkpoint after manufacturing, rather than relying only on catalogue-level supplier claims.
                        </p>
                        <div className="bg-[#f8fafd] border border-slate-200 rounded-[12px] p-5">
                            <p className="text-[13.5px] text-[#4B5563] leading-[1.6]">
                                <span className="font-bold text-[#1D1D1F]">Release rule:</span> if required QC checks do not meet release criteria, the batch is not released for dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Right Card (List) */}
                    <div className="w-full lg:w-1/2 bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 md:p-10 text-left flex flex-col">
                        <h3 className="text-[20px] font-bold text-[#1a4494] mb-2">Manufacturer QC may include</h3>
                        <p className="text-[13px] text-[#6A6A6A] mb-6">Testing scope may vary by compound, batch, and relevant analytical requirements.</p>

                        <div className="flex flex-col gap-0 divide-y divide-slate-100">
                            {[
                                {
                                    num: '01',
                                    title: 'HPLC-UV purity testing',
                                    desc: 'Used to assess chromatographic purity for relevant compounds and tested batches.'
                                },
                                {
                                    num: '02',
                                    title: 'LC-MS identity confirmation',
                                    desc: 'Used to support compound identity confirmation where applicable.'
                                },
                                {
                                    num: '03',
                                    title: 'Endotoxin and sterility checks',
                                    desc: 'Included where relevant to the product type, batch, and available release documentation.'
                                },
                                {
                                    num: '04',
                                    title: 'Amino acid analysis',
                                    desc: 'Used where relevant to support composition or identity review for applicable peptide materials.'
                                },
                                {
                                    num: '05',
                                    title: 'Internal release checks',
                                    desc: 'Manufacturer release criteria are reviewed before materials proceed to research dispatch.'
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="text-[13px] font-bold text-[#1a4494] shrink-0 mt-0.5">{item.num}</div>
                                    <div>
                                        <h4 className="text-[14.5px] font-bold text-[#1D1D1F] mb-1">{item.title}</h4>
                                        <p className="text-[13px] text-[#6A6A6A] leading-[1.5]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 text-left">
                        <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-2">Documentation trail</h4>
                        <p className="text-[13px] text-[#6A6A6A] leading-[1.5]">Available analytical documentation is connected to the relevant product or batch for online review where available.</p>
                    </div>
                    <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 text-left">
                        <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-2">Release criteria</h4>
                        <p className="text-[13px] text-[#6A6A6A] leading-[1.5]">If required QC checks do not meet release criteria, the batch is not released for dispatch.</p>
                    </div>
                    <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 text-left">
                        <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-2">Testing scope</h4>
                        <p className="text-[13px] text-[#6A6A6A] leading-[1.5]">QC may include HPLC-UV purity, LC-MS identity, endotoxin, sterility, amino acid analysis, and internal release checks depending on the product and batch.</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default OurStandardsSection
