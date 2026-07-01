import React from 'react';
import { Link } from 'react-router-dom';

const CompoundDatabase = () => {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
            <div className="main-container">
                <h1 className="text-3xl md:text-[38px] font-bold text-center text-[#214A9E] mb-10 tracking-tight">
                    Research Compound Database
                </h1>

                {/* Top Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#214A9E] p-5 mb-14">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All compounds listed in this database are intended strictly for in-vitro laboratory research purposes only. These materials are not intended for human consumption, medical treatment, veterinary use, or any therapeutic application. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read our full disclaimer</Link>.
                    </p>
                </div>

                {/* Introduction to Research Compounds */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">Introduction to Research Compounds</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        <p>This research compound database is a central reference point for the main peptide and compound categories represented across the Solatide Biosciences catalogue. Its purpose is to help researchers understand how different compounds relate to one another conceptually — whether by receptor class, pathway category, experimental role, or broader research theme.</p>
                        <p>All compounds listed are manufactured to research-grade specifications and are intended exclusively for use in controlled laboratory environments under appropriate institutional oversight.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-14">
                        <Link to="/shop" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Browse All Products</Link>
                        <Link to="/research-resource" className="border border-[#214A9E] text-[#214A9E] px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">Research Library</Link>
                    </div>
                </div>

                {/* GLP-1 Related Research Compounds */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">GLP-1 Related Research Compounds</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">GLP-1 (glucagon-like peptide-1) receptor agonists represent a major category of research compounds used to investigate metabolic regulation, insulin secretion, and appetite control mechanisms in laboratory models. <Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">Learn more about GLP-1 receptor research.</Link></p>

                    <div className="space-y-5 mb-6">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">GLP-1 AGONIST</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Semaglutide</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A long-acting GLP-1 receptor agonist extensively studied in metabolic research. Its structural modifications enable extended half-life and sustained receptor activation in experimental models.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/semaglutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Research Overview</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">DUAL GLP-1/GIP AGONIST</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Tirzepatide</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A dual GLP-1/GIP receptor agonist used in laboratory research to investigate coordinated incretin receptor activation and integrated metabolic responses.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/tirzepatide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Research Overview</Link>
                            </div>
                        </div>
                    </div>
                    <Link to="/shop?category=metabolic" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors inline-block shadow-sm">Shop GLP-1 & Metabolic Peptides</Link>
                </div>

                {/* Triple Agonist Research Compounds */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">Triple Agonist Research Compounds</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">Triple agonist peptides simultaneously activate GLP-1, GIP, and glucagon receptors, providing unique research tools for investigating multi-receptor interactions and integrated metabolic regulation. These compounds enable researchers to study receptor crosstalk, synergistic effects, and coordinated metabolic pathway activation that cannot be investigated using single-receptor agonists.</p>

                    <div className="space-y-5 mb-6">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">TRIPLE GLP-1/GIP/GLUCAGON AGONIST</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Retatrutide</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A prominent triple agonist peptide used in laboratory research. Based on the GIP sequence with specific modifications, retatrutide demonstrates balanced activity at GLP-1, GIP, and glucagon receptors. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Research Overview</Link>
                                <Link to="/research-insight/what-is-retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is Retatrutide?</Link>
                                <Link to="/research-insight/retatrutide-vs-semaglutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">vs Semaglutide</Link>
                            </div>
                        </div>
                    </div>
                    <Link to="/shop?category=agonist" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors inline-block shadow-sm">Shop Triple Agonist Peptides</Link>
                </div>

                {/* Combination Research Blends */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">Combination Research Blends</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">Pre-blended research materials combine two or more compounds in a fixed ratio, enabling investigators to study dual-pathway receptor interactions within a single experimental framework. These materials reduce preparation variability and support reproducibility in combination-model research designs.</p>

                    <div className="space-y-5">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">GLP-1 + AMYLIN COMBINATION</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">CagriSema</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A pre-blended lyophilised research material combining Cagrilintide and Semaglutide in a 1:1 ratio (5mg:5mg per 10mg vial). Used in laboratory models examining concurrent GLP-1 receptor agonism and amylin receptor agonism, with particular relevance to dual-pathway metabolic signalling research and receptor crosstalk investigations. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/cagrisema" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Research Overview</Link>
                                <Link to="/research-insight/cagrisema-comparison" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Comparison Guide</Link>
                                <Link to="/research-insight/dual-receptor" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Dual-Receptor Article</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">AMYLIN RECEPTOR AGONIST</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Cagrilintide</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">An amylin receptor agonist studied as an emerging metabolic research compound. Used in combination research designs alongside GLP-1 agonists to investigate dual-pathway receptor activation and complementary metabolic signalling.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/cagrilintide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Research Overview</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metabolic Research Compounds */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">Metabolic Research Compounds</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">Metabolic research compounds encompass peptides and molecules used to investigate energy regulation, glucose metabolism, lipid processing, and metabolic signalling pathways in laboratory settings.</p>

                    <div className="space-y-5 mb-6">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">NNMT INHIBITOR - SMALL MOLECULE</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">5-Amino-1MQ</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A small-molecule research compound studied as a selective inhibitor of nicotinamide N-methyltransferase (NNMT) in preclinical laboratory models. NNMT sits at the intersection of NAD-related metabolism and one-carbon methylation pathways, making 5-Amino-1MQ a relevant tool for researchers investigating cellular energy expenditure, methyl-group flux, and downstream metabolic signalling. Supplied as a solid compound, independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/product/5-amino-1mq" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">View Product</Link>
                                <Link to="/research-insight/nnmt" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">NNMT Research Article</Link>
                            </div>
                        </div>
                    </div>
                    <Link to="/shop?category=metabolic" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors inline-block shadow-sm">Shop Metabolic Compounds</Link>
                </div>

                {/* Repair & Recovery Peptides */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-3">Repair & Recovery Peptides</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">Repair and recovery peptides are studied for their potential roles in cellular repair mechanisms, tissue response pathways, and recovery-related signalling in laboratory models. <Link to="/peptides-guide" className="text-[#3390ec] hover:underline">View the complete research peptides guide</Link>.</p>

                    <div className="space-y-5 mb-6">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">REPAIR PEPTIDE</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">BPC-157</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Body protection compound studied for its roles in cellular repair mechanisms and tissue response pathways in laboratory models. One of the most widely referenced repair peptides in in-vitro research. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/bpc-157" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is BPC-157?</Link>
                                <Link to="/research-insight/bpc-tb-comparison" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">BPC-157 vs TB-500</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">REPAIR PEPTIDE</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">TB-500 (Thymosin Beta-4 Fragment)</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A thymosin beta-4 fragment studied for cell migration and recovery signalling in laboratory models. Frequently used alongside BPC-157 in comparative and combination research designs. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/tb-500" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is TB-500?</Link>
                                <Link to="/research-insight/bpc-tb-comparison" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">BPC-157 vs TB-500</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-2.5">COPPER PEPTIDE - DERMAL RESEARCH</span>
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">GHK-Cu</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">A copper peptide complex investigated in skin biology research, matrix remodelling studies, and cosmetic science applications. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/research-insight/ghk-cu" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is GHK-Cu?</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/shop?category=repair" className="border border-[#214A9E] bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Shop Repair Peptides</Link>
                        <Link to="/shop?category=dermal" className="border border-[#214A9E] text-[#214A9E] px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Shop Dermal Peptides</Link>
                    </div>
                </div>

                {/* Research Applications Grid */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Research Applications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Receptor Binding Studies</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Research compounds are used in receptor binding assays to characterise affinity, selectivity, and functional outcomes of receptor activation — fundamental to understanding cellular communication and signal transduction.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Metabolic Pathway Investigation</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Laboratory investigations employ research compounds to study glucose homeostasis, lipid metabolism, energy expenditure, and metabolic flexibility in experimental models.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Signalling Pathway Analysis</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Research compounds enable detailed investigation of intracellular signalling cascades, including cAMP/PKA, PI3K/Akt, and MAPK/ERK pathways. <Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">Read about GLP-1 receptor pathways</Link>.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Comparative Research</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Comparative studies using different research compounds help elucidate structure-activity relationships, receptor selectivity profiles, and functional outcomes. <Link to="/research-insight/retatrutide-vs-semaglutide" className="text-[#3390ec] hover:underline">Retatrutide vs Semaglutide comparison</Link>.</p>
                        </div>
                    </div>
                </div>

                {/* Quality Standards Grid */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Quality Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Purity Verification</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">All Solatide Biosciences compounds are independently third-party tested to &gt;99% purity, verified by HPLC analysis and mass spectrometry. <Link to="/coa" className="text-[#3390ec] hover:underline">Learn more</Link>.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Certificate of Analysis</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Each compound batch is accompanied by a COA documenting purity, identity confirmation, and analytical testing results. Published on each product page where available.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Batch Consistency</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Quality control procedures verify batch-to-batch consistency through analytical testing, ensuring reproducible research outcomes across experimental runs.</p>
                        </div>
                        <div className="bg-[#f8fafc] p-6 rounded-sm border-t-[3px] border-[#214A9E]">
                            <h4 className="font-bold text-[#150F3A] text-[13.5px] mb-2.5">Storage & Handling</h4>
                            <p className="text-[12.5px] text-slate-600 leading-[1.8]">Most peptides: store at -20°C or -80°C, lyophilised, protected from light and moisture. Small molecules (e.g. 5-Amino-1MQ): room temperature, cool dry location.</p>
                        </div>
                    </div>
                </div>

                {/* Shop by Research Category Grid */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Shop by Research Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Link to="/shop?category=metabolic" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">GLP-1 & Metabolic Peptides</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">Semaglutide, Tirzepatide, Retatrutide & more</p>
                        </Link>
                        <Link to="/shop?category=tissue" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">Tissue & Cellular Research</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">BPC-157, TB-500 & repair peptides</p>
                        </Link>
                        <Link to="/shop?category=dermal" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">Dermal & Pigmentation</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">GHK-Cu & copper peptide complexes</p>
                        </Link>
                        <Link to="/shop?category=solutions" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">Research Solutions</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">Supporting compounds & tool materials</p>
                        </Link>
                        <Link to="/bundles" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">Bundles</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">Multi-compound research sets</p>
                        </Link>
                        <Link to="/shop" className="bg-[#f0f4fa] p-5 rounded-sm border border-slate-100 hover:border-[#214A9E] transition-colors block">
                            <h4 className="font-bold text-[#150F3A] text-[12px] mb-1.5 leading-snug">All Products</h4>
                            <p className="text-[11px] text-slate-500 leading-snug">Browse the full Solatide catalogue</p>
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Quick Links</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/research-resource" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-blue-500 font-bold">📚</span> Research Library
                        </Link>
                        <Link to="/peptides-guide" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-purple-500 font-bold">🧪</span> Peptides Guide
                        </Link>
                        <Link to="/calculator" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-green-500 font-bold">✓</span> Concentration Calculator
                        </Link>
                        <Link to="/coa" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-blue-400 font-bold">📄</span> COA & Lab Testing
                        </Link>
                        <Link to="/faq" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-red-500 font-bold">?</span> FAQ
                        </Link>
                        <Link to="/contact" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-blue-500 font-bold">✉</span> Contact Us
                        </Link>
                        <Link to="/research-use" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-yellow-500 font-bold">⚠</span> Research Use Disclaimer
                        </Link>
                    </div>
                </div>

                <div className="bg-[#F0F5FB] border-l-[3px] border-[#214A9E] p-5">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All compounds are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications. <Link to="/research-use" className="text-[#3390ec] hover:underline">Full disclaimer</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompoundDatabase;
