import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductCategories = ({ isHome = false, selectedCategory = 'all-products' }) => {
    // Accordion open/close state
    const [openAccordions, setOpenAccordions] = useState({
        'featured': true,
        'overview': false,
        'types': false,
        'resources': false
    });

    const toggleAccordion = (section) => {
        setOpenAccordions(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const categories = [
        {
            id: 1,
            title: 'Metabolic Pathway Research',
            description: 'Compounds selected for metabolic pathway research and related studies',
            path: '/shop?category=metabolic-pathway',
            icon: '/g3327 (1).png'
        },
        {
            id: 2,
            title: 'Tissue & Cellular Research',
            description: 'Research compounds studied in recovery and tissue-response models',
            path: '/shop?category=tissue-cellular',
            icon: '/Frame.png'
        },
        {
            id: 3,
            title: 'Dermal & Pigmentation Research',
            description: 'Peptides used in dermal and pigmentation-focused research environments',
            path: '/shop?category=dermal-pigmentation',
            icon: '/Group.png'
        },
        {
            id: 4,
            title: 'Research Solutions',
            description: 'Supporting compounds and materials for laboratory-based research',
            path: '/shop?category=research-solutions',
            icon: '/Frame (1).png'
        }
    ];

    const categoryDetails = {
        'metabolic-pathway': {
            name: 'Metabolic Pathway Research',
            description: 'Metabolic research peptides for laboratory investigation of glucose homeostasis, energy regulation, and incretin receptor pathways. This collection includes selective Metabolic receptor agonists, dual Metabolic/GIP agonists, triple agonist peptides, amylin receptor research compounds, small-molecule metabolic research tools, and laboratory reconstitution solvents used to study metabolic signalling, receptor crosstalk, and integrated pathway regulation in experimental models.',
            featuredTitle: 'Featured Research Compounds',
            featured: [
                'Retatrutide — Triple-agonist (Metabolic, GIP, glucagon receptors). Used in multi-receptor pathway and integrated metabolic signalling research.',
                'Semaglutide — Selective Metabolic receptor agonist. Used in comparative incretin signalling studies.',
                'Tirzepatide — Dual Metabolic/GIP agonist. Used in receptor crosstalk and pathway comparison models.',
                'Cagrilintide — long-acting amylin analogue for adjacent metabolic signalling investigations',
                'Semaglutide — Selective Metabolic receptor agonist. Used in comparative incretin signalling studies.'
            ],
            overview: 'In-vitro testing of metabolic pathways focuses on glucose transporter translocation, insulin receptor signaling cascades, and G-protein coupled receptor (GPCR) activation. These compounds serve as control standards to map enzyme kinetics and physiological regulation.',
            types: 'Selective GIP/GLP-1 receptor agonists, triple receptor agonists (GLP-1/GIP/Glucagon), and amylin receptor antagonists in sterile lyophilized form.',
            resources: 'Refer to the Solatide Peptide Reconstitution Database, HPLC/MS Spectral library, and peer-reviewed journals on molecular endocrinology.'
        },
        'tissue-cellular': {
            name: 'Tissue & Cellular Research',
            description: 'Tissue & Cellular Research peptides for laboratory investigation of tissue repair mechanisms, cellular recovery pathways, and regenerative processes. This collection includes peptides used to study wound healing cascades, angiogenesis, growth factor signalling, and extracellular matrix remodelling in experimental models. Research applications include tissue repair studies, cellular migration assays, angiogenesis research, actin-binding investigations, and growth factor pathway analysis. All compounds are supplied as analytical reference standards for in-vitro laboratory use only.',
            featuredTitle: 'Featured Research Compounds',
            featured: [
                'BPC-157: Pentadecapeptide commonly discussed in tissue-response and angiogenesis research',
                'TB-500: Thymosin beta-4 fragment used in migration and actin-associated pathway studies',
                'BPC-157 + TB-500 blend: Combined-format research compound for comparative pathway investigation'
            ],
            overview: 'Cellular repair assays investigate cell migration speed, extracellular matrix deposition, and growth factor gene upregulation. Laboratory models utilize these peptides to map tissue regeneration pathways.',
            types: 'Repair pentadecapeptides (BPC-157), thymosin fragments (TB-500), and custom research blends.',
            resources: 'Review third-party analytical reports, laboratory cell culture manuals, and literature databases on cellular biology.'
        },
        'dermal-pigmentation': {
            name: 'Dermal & Pigmentation Research',
            description: 'Dermal and pigmentation research peptides for laboratory investigation of melanocortin receptor pathways, copper-peptide complexes, and cellular signalling mechanisms. This collection includes compounds used to study MC1R, MC3R, MC4R, and MC5R receptor activation, melanogenesis pathways, growth factor signalling, and collagen synthesis regulation in experimental models. Research applications include melanocortin receptor binding assays, pigmentation mechanism studies, copper-dependent biological processes, extracellular matrix remodelling, and cellular differentiation research. All compounds are supplied as analytical reference standards for in-vitro laboratory use only.',
            featuredTitle: 'Featured Research Compounds',
            featured: [
                'Melanotan II (MT2): Cyclic heptapeptide analogue of α-MSH for melanocortin receptor research',
                'GHK-Cu: Copper-complexed tripeptide for growth factor and collagen synthesis studies'
            ],
            overview: 'Dermal studies focus on melanocortin receptor kinetics, copper-mediated cellular processes, and collagen synthesis pathways in simulated skin tissue models.',
            types: 'Synthetic melanocyte-stimulating hormone analogs (Melanotan II) and copper-complexed signaling tripeptides (GHK-Cu).',
            resources: 'Consult peer-reviewed studies on skin cellular biology, HPLC validation datasets, and reconstitution protocols.'
        },
        'research-solutions': {
            name: 'Research Solutions',
            description: 'Laboratory support materials and research solutions for peptide handling, preparation, and storage. This collection includes sterile solvents, reconstitution materials, and laboratory essentials required for working with lyophilised research compounds in controlled experimental settings. Essential for peptide reconstitution, working solution preparation, and maintaining sterility in multi-dose applications. All materials undergo rigorous quality control testing to ensure sterility, purity, and laboratory-grade standards.',
            featuredTitle: 'Featured Laboratory Materials:',
            featured: [
                'Bacteriostatic Water: Sterile water with 0.9% benzyl alcohol preservative for peptide reconstitution'
            ],
            overview: 'Maintaining sterile conditions during reconstitution is essential for laboratory trial reproducibility. These materials provide high-purity preservation solvents to prevent chemical degradation.',
            types: 'Bacteriostatic Water for Injection USP (0.9% benzyl alcohol preservative) and sterile laboratory reagents.',
            resources: 'Check Solatide Reconstitution Calculator guides, safety data sheets (SDS), and storage temperature guidelines.'
        }
    };

    const isSpecificCategory = !isHome && selectedCategory !== 'all-products' && categoryDetails[selectedCategory];
    const details = isSpecificCategory ? categoryDetails[selectedCategory] : null;

    return (
        <section className="relative w-full bg-[#f4f7fa] py-12 lg:py-16 overflow-hidden">
            <div className={isHome ? "main-container" : "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"}>

                {/* Specific Category View */}
                {isSpecificCategory ? (
                    <div className="text-left max-w-none mb-12">
                        <span className="text-[#00bfef] text-[13px] sm:text-[15px] font-extrabold tracking-widest uppercase mb-3 block text-left">
                            Research Catalogue
                        </span>
                        <h2 className="text-3xl sm:text-[40px] font-semibold text-[#1E1E1E] text-left tracking-tight leading-tight mb-8" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                            {details.name}
                        </h2>

                        <p className="text-[#6A6A6A] text-[16px] leading-[1.7] w-full text-left mb-12" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                            {details.description}
                        </p>

                        {/* Accordions */}
                        <div className="w-full space-y-4">
                            {/* Accordion 1: Featured Compounds */}
                            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion('featured')}
                                    className="w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] text-[#214A9E] focus:outline-none"
                                >
                                    <span>{details.featuredTitle}</span>
                                    <svg className={`w-4 h-4 text-[#214A9E] transition-transform duration-200 ${openAccordions.featured ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {openAccordions.featured && (
                                    <div className="px-6 pb-6 pt-1 border-t border-slate-100/50 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                        <ul className="space-y-3">
                                            {details.featured.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                                    <span>
                                                        {item}
                                                        {item.includes('GHK-Cu') && (
                                                            <Link to="/coa" className="text-[#00bfef] hover:underline font-semibold ml-1.5">
                                                                Learn more about GHK-Cu
                                                            </Link>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 2: Research Overview */}
                            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion('overview')}
                                    className="w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] text-[#214A9E] focus:outline-none"
                                >
                                    <span>Research Overview</span>
                                    <svg className={`w-4 h-4 text-[#214A9E] transition-transform duration-200 ${openAccordions.overview ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {openAccordions.overview && (
                                    <div className="px-6 pb-6 pt-1 border-t border-slate-100/50 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                        <p className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                            <span>{details.overview}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 3: Included Compound Types */}
                            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion('types')}
                                    className="w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] text-[#214A9E] focus:outline-none"
                                >
                                    <span>Included Compound Types</span>
                                    <svg className={`w-4 h-4 text-[#214A9E] transition-transform duration-200 ${openAccordions.types ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {openAccordions.types && (
                                    <div className="px-6 pb-6 pt-1 border-t border-slate-100/50 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                        <p className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                            <span>{details.types}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Accordion 4: Related Research Resources */}
                            <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion('resources')}
                                    className="w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] text-[#214A9E] focus:outline-none"
                                >
                                    <span>Related Research Resources</span>
                                    <svg className={`w-4 h-4 text-[#214A9E] transition-transform duration-200 ${openAccordions.resources ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {openAccordions.resources && (
                                    <div className="px-6 pb-6 pt-1 border-t border-slate-100/50 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                        <p className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                            <span>{details.resources}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Link */}
                        <div className="text-left mt-12">
                            <p className="text-[#214A9E] font-semibold text-[16px]" style={{ fontFamily: 'Poppins' }}>
                                New to research peptides? View our <Link to="/about" className="text-[#1E1E1E] underline hover:opacity-80">Research Peptides Guide</Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Default Browse Catalogue Grid View */
                    <div className="w-full">
                        {/* Section Header */}
                        <div className={isHome ? "text-center max-w-3xl mx-auto mb-16" : "text-left max-w-none mb-12"}>
                            <span className="text-[#00E5FF] text-[14px] font-weight-600 font-semibold font-['Poppins',sans-serif] tracking-widest uppercase mb-3 block">
                                {isHome ? "Product Categories" : "Research Category"}
                            </span>
                            {isHome ? (
                                <h2 className="text-[48px] font-weight-600 font-semibold text-[#102a5c] tracking-tight font-['Anek_Telugu',sans-serif]">
                                    Shop by <span className="text-[#1a4494]">Research</span> Category
                                </h2>
                            ) : (
                                <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-[#1E1E1E] tracking-tight leading-tight mb-8" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                                    Browse the Full Research Catalogue
                                </h2>
                            )}

                            {!isHome && (
                                <div className="space-y-6 text-[#6A6A6A] text-[16px] leading-[1.6] max-w-none" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                                    <p>
                                        This page brings together the full Solatide Biosciences research catalogue in one view, including metabolic research peptides, repair-focused compounds, dermal research peptides, and laboratory support materials. It is designed as a broad navigation page rather than a single-topic research guide.
                                    </p>
                                    <p>
                                        This page brings together the full Solatide Biosciences research catalogue in one view, including metabolic research peptides, repair-focused compounds, dermal research peptides, and laboratory support materials. It is designed as a broad navigation page rather than a single-topic research guide.
                                    </p>
                                    <p>
                                        Where a topic-specific page is more useful than a broad catalogue view, the site's overview pages and comparison resources provide more structured scientific context.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Categories Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-none">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-[24px] p-8 border border-[#E8E8E8] shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left"
                                >
                                    <div>
                                        {/* Icon Pill Container */}
                                        <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/60 flex items-center justify-center mb-6 shrink-0">
                                            <img src={category.icon} alt={category.title} className="h-6 w-6 object-contain" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-semibold text-[#1E1E1E] mb-3" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                                            {category.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[15px] text-[#6A6A6A] leading-relaxed mb-6" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                                            {category.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Horizontal Divider Line */}
                                        <div className="w-full border-t border-[#E8E8E8] mb-5"></div>

                                        {/* Shop Pill Button */}
                                        <Link
                                            to={category.path}
                                            className="inline-flex items-center justify-center rounded-lg bg-[#e0eaf5]/85 text-[#214A9E] px-5 py-2 text-xs font-bold hover:bg-[#e0eaf5] transition-colors cursor-pointer w-auto"
                                            style={{ fontFamily: 'Poppins' }}
                                        >
                                            Shop
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Guide Link */}
                        {!isHome && (
                            <div className="text-left">
                                <p className="text-[#214A9E] font-semibold text-[16px]" style={{ fontFamily: 'Poppins' }}>
                                    New to research peptides? View our <Link to="/about" className="text-[#1E1E1E] underline hover:opacity-80">Research Peptides Guide</Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </section>
    )
}

export default ProductCategories
