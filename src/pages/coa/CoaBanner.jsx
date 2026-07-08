import React, { useState, useEffect } from 'react'

const sidebarItems = [
    { id: 'what-is-coa', label: 'What is a COA', number: '01' },
    { id: 'independent-third-party', label: 'Independent Third-Party', number: '02' },
    { id: 'our-approach', label: 'Our Approach', number: '03' },
    { id: 'manufacturer-quality', label: 'Manufacturer Quality', number: '04' },
    { id: 'which-laboratories', label: 'Which Laboratories', number: '05' },
    { id: 'documentation', label: 'Documentation', number: '06' },
    { id: 'access-documentation', label: 'Access Documentation', number: '08' },
    { id: 'packaging', label: 'Packaging', number: '09' },
    { id: 'purity-results', label: 'Understanding Purity Results', number: '10' },
    { id: 'research', label: 'Research', number: '11' },
]

const labCards = [
    {
        name: 'GLP-1 Receptor Agonists',
        desc: 'An independent analytical laboratory known for peptide and research compound verification',
    },
    {
        name: 'GLP-1 Receptor Agonists',
        desc: 'Sn independent analytical laboratory providing RP-HPLC purity and identity analysis',
    },
    {
        name: 'GLP-1 Receptor Agonists',
        desc: 'An independent laboratory providing purity, identity, and endotoxin testing',
    },
]

const CoaBanner = () => {
    const [activeSection, setActiveSection] = useState('what-is-coa')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
        )

        sidebarItems.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <>
            <section className="w-full pt-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-bold text-[#214A9E] leading-[1] tracking-[0px] mb-5"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        COA &amp; Lab Testing
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.6]">
                        Understanding how we validate, test, and certify every batch of research material — so you can focus on the science with complete confidence in your compounds' identity and purity.
                    </p>
                </div>
            </section>


            <section className="w-full bg-white py-10 lg:py-14">
                <div className="main-container">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 items-start">
                        <aside className="hidden lg:block w-[296px] shrink-0 sticky top-24 self-start">
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                <div className="px-5 pt-5 pb-3">
                                    <p className="text-[16px] font-medium font-weight-500 text-[#1E1E1E]">On this page</p>
                                </div>
                                <nav className="flex flex-col pb-3">
                                    {sidebarItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollTo(item.id)}
                                            className={`flex items-center gap-4 text-left px-5 py-[10px] w-full transition-colors duration-150 ${activeSection === item.id
                                                ? 'bg-[#EBF3FF] text-[#214A9E]'
                                                : 'text-[#374151] hover:bg-slate-50'
                                                }`}
                                        >
                                            <span
                                                className={`shrink-0 text-[13px] w-5 text-left ${activeSection === item.id
                                                    ? 'text-[#214A9E] font-semibold'
                                                    : 'text-[#9CA3AF] font-normal'
                                                    }`}
                                            >
                                                {item.number}
                                            </span>
                                            <span
                                                className={`text-[13.5px] whitespace-nowrap ${activeSection === item.id
                                                    ? 'font-medium font-weight-500 text-[14px] text-[#214A9E]'
                                                    : 'font-regular font-weight-400 text-[14px] text-[#6A6A6A]'
                                                    }`}
                                            >
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* RIGHT MAIN CONTENT */}
                        <div className="flex-1 min-w-0 flex flex-col gap-12">
                            <div id="what-is-coa" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 uppercase tracking-[0.12em] text-[#00E5FF] mb-2 block">Overview</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    What Is A Certificate Of Analysis?
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    A Certificate of Analysis (COA) is an official document issued by an accredited analytical laboratory that confirms a compound's identity, purity, and compliance with defined specifications. Every batch of research material we supply is accompanied by a fully traceable COA, providing researchers with the confidence needed for reproducible, reliable science.
                                </p>
                            </div>

                            <div id="independent-third-party" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Third Laboratory Documentation</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Independent Third-Party Laboratory Documentation
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75] mb-5">
                                    Solatide Biosciences provides selected product-level laboratory documentation for certain products to support research transparency. Documentation is sourced from independent analytical laboratories and varies by product and batch.
                                </p>
                                <ul className="flex flex-col gap-2.5 pl-1">
                                    {[
                                        'Selected product-level third-party verification',
                                        'Identity and purity confirmation where available',
                                        'Clear supporting documentation displayed on product pages',
                                        'Greater transparency for research planning',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#4B5563] leading-[1.7]">
                                            <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#4B5563] shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div id="our-approach" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Third-Party Documentation</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Our Approach To Third-Party Documentation
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                        Where third-party documentation is published, it reflects our preference for high-purity material and our commitment to providing supporting data for research reference. Published documentation displays key analytical data including purity results, product identity, and date of analysis.
                                    </p>
                                    <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                        Full laboratory reports are not published in unredacted form. We do not make exaggerated claims about "pharmaceutical grade" or guaranteed purity without evidence, and we let the available analytical data speak for itself.
                                    </p>
                                </div>
                            </div>

                            <div id="manufacturer-quality" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Storage Conditions</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Manufacturer Quality Control Testing
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                        Every production batch undergoes post-manufacturing quality control by the manufacturer before dispatch. This includes HPLC analysis, mass spectrometry, and purity assessment as standard, and may additionally include residual solvent testing, sterility testing, endotoxin testing, amino acid analysis, and other internal release checks depending on the product and batch. These manufacturer QC records are not available for external request.
                                    </p>
                                    <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                        Not every batch undergoes independent third-party testing in addition to manufacturer QC. Where third-party documentation is available, it is published on the relevant product page.
                                    </p>
                                </div>
                            </div>

                            <div id="which-laboratories" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Types Of Research Peptides</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Which Laboratories May Appear In Our Documentation
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75] mb-6">
                                    Available third-party documentation may include reports from independent laboratories such as:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    {labCards.map((lab, i) => (
                                        <div
                                            key={i}
                                            className="border border-slate-200 rounded-xl p-5 flex flex-col gap-2 text-center bg-white hover:border-[#C7DDF7] hover:shadow-sm transition-all duration-200"
                                        >
                                            <h4 className="text-[16px] font-weight-500 font-medium text-[#1E1E1E] leading-snug">{lab.name}</h4>
                                            <p className="text-[14px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.65]">{lab.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    The laboratory used for any given batch depends on the product, batch, and available documentation at the time of testing. Not every product will have documentation from every laboratory listed above.
                                </p>
                            </div>

                            <div id="documentation" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Documentation</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    What Documentation May Include
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75] mb-5">
                                    Depending on the product and batch, available third-party documentation may include one or more of the following:
                                </p>
                                <ul className="flex flex-col gap-2.5 pl-1 mb-6">
                                    {[
                                        'Selected product-level third-party verification',
                                        'Purity analysis: Detailed purity results with exact percentages, typically ≥99%',
                                        'Identity confirmation: Verified compound identity through analytical testing',
                                        'Quantity verification: Confirmed net peptide content',
                                        'Endotoxin testing: Where available for the relevant product and batch',
                                        'Testing methodology: Analytical methods used (e.g. RP-HPLC, HPLC-MS, LAL endotoxin assay)',
                                        'Date of analysis: When testing was performed',
                                        'Independent laboratory verification: Laboratory documentation and chemist signature',
                                        'Clear supporting documentation displayed on product pages',
                                        'Greater transparency for research planning',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#4B5563] leading-[1.7]">
                                            <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#4B5563] shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    The presence of one type of third-party report should not be interpreted as confirmation that every possible test panel was performed for that batch. Specific test panels are only provided where available for the relevant product and batch.
                                </p>
                            </div>

                            <div id="access-documentation" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Documentation</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    How To Access Documentation
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    Where available, product-level documentation is displayed on relevant product pages. Documentation availability, scope, and format vary by product and testing cycle. Exact batch- or lot-linked documentation is not guaranteed to be available prior to dispatch, and where documentation is provided, it is provided in the format published on the website or otherwise released through our standard documentation process.
                                </p>
                            </div>

                            <div id="packaging" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Packaging</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Packaging And Image Disclaimer
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    Where available, product-level documentation is displayed on relevant product pages. Documentation availability, scope, and format vary by product and testing cycle. Exact batch- or lot-linked documentation is not guaranteed to be available prior to dispatch, and where documentation is provided, it is provided in the format published on the website or otherwise released through our standard documentation process.
                                </p>
                            </div>

                            <div id="purity-results" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Purity Results</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Understanding Purity Results
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    Where available, product-level documentation is displayed on relevant product pages. Documentation availability, scope, and format vary by product and testing cycle. Exact batch- or lot-linked documentation is not guaranteed to be available prior to dispatch, and where documentation is provided, it is provided in the format published on the website or otherwise released through our standard documentation process.
                                </p>
                            </div>

                            <div id="research" className="scroll-mt-28">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Research</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Research Use Only
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75]">
                                    All products sold by Solatide Biosciences are supplied strictly for in-vitro laboratory and analytical research purposes only. Third-party documentation is provided for research reference and compound verification purposes. Nothing in this documentation constitutes medical, clinical, therapeutic, diagnostic, or veterinary advice or approval.
                                </p>
                            </div>

                            <div id="resources" className="scroll-mt-28 pb-4">
                                <span className="text-[14px] font-semibold font-weight-600 tracking-[0.12em] text-[#00E5FF] mb-2 block">Resources</span>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Related Research Resources
                                </h2>
                                <p className="text-[14px] text-[#6A6A6A] font-regular font-weight-400 leading-[1.75] mb-6">
                                    Related Research Resources: Curated materials, references, and scientific insights supporting ongoing peptide research and experimental exploration.
                                </p>
                                <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-3">
                                    {[
                                        { label: 'Contact Us', href: '/contact' },
                                        { label: 'FAQ', href: '/faq' },
                                        { label: 'Research Peptides Guide', href: '/research-peptides' },
                                        { label: 'Research Compound Database', href: '/compounds' },
                                    ].map((link) => (
                                        <div key={link.label} className="flex items-center gap-2.5 text-[14px]">
                                            <span className="text-[#00E5FF]">•</span>
                                            <a
                                                href={link.href}
                                                className="text-[#00E5FF] text-[15px] font-weight-500 hover:text-[#0090cc] underline underline-offset-2 transition-colors font-medium"
                                            >
                                                {link.label}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CoaBanner
