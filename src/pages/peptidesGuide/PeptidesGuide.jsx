import React from 'react';
import { Link } from 'react-router-dom';

const PeptidesGuide = () => {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
            <div className="main-container">
                <h1 className="text-3xl md:text-[38px] font-bold text-center text-[#214A9E] mb-10 tracking-tight">
                    Research Peptides Guide
                </h1>

                {/* Top Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#214A9E] p-5 mb-14">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides and compounds discussed on this page are intended strictly for in-vitro laboratory research purposes only. These materials are not intended for human consumption, medical treatment, veterinary use, or any therapeutic application. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read our full disclaimer</Link>.
                    </p>
                </div>

                {/* What Are Research Peptides */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">What Are Research Peptides?</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 mb-8 leading-[1.8]">
                        <p>Research peptides are laboratory compounds used to investigate receptor interactions, signalling pathways, cellular responses, and other controlled experimental questions in vitro. Rather than representing one single class of material, the category includes metabolic peptides, repair-oriented compounds, dermal research peptides, and related laboratory support materials used across different investigative settings.</p>
                        <p>At Solatide Biosciences, this guide provides a clear starting point for understanding how these compounds are grouped, how their research roles differ, and where to find more focused information within the broader catalogue.</p>
                        <p>Peptides typically consist of 2-50 amino acids linked by peptide bonds, distinguishing them from larger proteins. Their relatively small size and specific biological activity make them valuable for studying targeted biochemical processes without the complexity of full protein structures.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/shop" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Browse All Products</Link>
                        <Link to="/compound-database" className="border border-[#214A9E] text-[#214A9E] px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">Research Compound Database</Link>
                    </div>
                </div>

                {/* Types of Research Peptides */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Types of Research Peptides</h2>
                    <div className="space-y-5">
                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Metabolic Research Peptides</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Used to investigate energy regulation, glucose metabolism, and lipid processing in laboratory models. These compounds help researchers understand fundamental metabolic pathways and receptor signalling mechanisms, including GLP-1, GIP, and glucagon receptor pathways.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/shop?category=metabolic" className="bg-[#214A9E] text-white px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#163678] transition-colors">Shop Metabolic Peptides</Link>
                                <Link to="/research-insight/glp-1" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">GLP-1 Research Overview</Link>
                                <Link to="/research-insight/retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is Retatrutide?</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Growth Factor Peptides</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Employed in cellular research to study cell proliferation, differentiation, and tissue development. Laboratory investigations using these peptides contribute to understanding cellular growth mechanisms and regenerative processes.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/shop?category=growth" className="bg-[#214A9E] text-white px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#163678] transition-colors">Shop Tissue & Cellular Peptides</Link>
                                <Link to="/compound-database" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">View Compound Database</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Repair & Recovery Peptides</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Studied for their potential roles in cellular repair mechanisms, tissue response pathways, and recovery-related signalling in laboratory models. BPC-157 and TB-500 are among the most widely referenced compounds in this category.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/shop?category=repair" className="bg-[#214A9E] text-white px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#163678] transition-colors">Shop Repair Peptides</Link>
                                <Link to="/research-insight/bpc-157" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is BPC-157?</Link>
                                <Link to="/research-insight/tb-500" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is TB-500?</Link>
                                <Link to="/research-insight/bpc-tb-comparison" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">BPC-157 vs TB-500</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Dermal & Copper Peptides</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Investigation in skin biology research, matrix remodelling studies, and cosmetic science applications. GHK-Cu is the primary copper peptide complex studied in this context.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/shop?category=dermal" className="bg-[#214A9E] text-white px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#163678] transition-colors">Shop Dermal Peptides</Link>
                                <Link to="/research-insight/ghk-cu" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">What is GHK-Cu?</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100 p-7 rounded-sm">
                            <h3 className="text-[15px] font-bold text-[#150F3A] mb-2.5">Receptor Agonist Peptides</h3>
                            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">Bind to and activate specific cellular receptors, making them essential tools for studying receptor function, signalling cascades, and downstream cellular responses in controlled experimental settings. Multi-receptor agonists such as triple GLP-1/GIP/glucagon agonists fall within this category.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/shop?category=agonist" className="bg-[#214A9E] text-white px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#163678] transition-colors">Shop Receptor Agonists</Link>
                                <Link to="/research-insight/retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-2 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors bg-white">Retatrutide Overview</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications in Laboratory Research */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Applications in Laboratory Research</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Biochemical Pathway Studies</h4>
                            <p className="text-slate-700 leading-[1.8]">Research peptides enable scientists to map and understand complex biochemical pathways. By introducing specific peptides into laboratory models, researchers can observe how cellular systems respond, identify key regulatory points, and elucidate mechanism of action. See the <Link to="/compound-database" className="text-[#3390ec] hover:underline">Research Compound Database</Link> for a full list of available compounds by pathway.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Receptor Binding Studies</h4>
                            <p className="text-slate-700 leading-[1.8]">Peptides are frequently used in receptor binding assays to determine affinity, selectivity, and functional outcomes of receptor activation. These studies are fundamental to understanding how cells communicate and respond to external signals. The <Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">GLP-1 Research Overview</Link> covers receptor binding in the context of metabolic peptides.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Metabolic Research</h4>
                            <p className="text-slate-700 leading-[1.8]">Laboratory investigations into metabolic regulation often employ peptides that interact with metabolic pathways. Researchers use these compounds to study glucose homeostasis, energy expenditure, and nutrient processing in experimental models. Browse the <Link to="/shop?category=metabolic" className="text-[#3390ec] hover:underline">GLP-1 & Metabolic Peptides collection</Link> for available compounds.</p>
                        </div>
                    </div>
                </div>

                {/* Common Research Peptide Categories */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Common Research Peptide Categories</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">GLP-1 Receptor Agonists</h4>
                            <p className="text-slate-700 leading-[1.8]">GLP-1 (glucagon-like peptide-1) receptor agonists are extensively studied in metabolic research. These peptides activate GLP-1 receptors and are used to investigate glucose regulation, insulin secretion, and metabolic signalling pathways. Read the <Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">GLP-1 Research Overview</Link> or explore compounds including <Link to="/product/semaglutide" className="text-[#3390ec] hover:underline">Semaglutide</Link> and <Link to="/product/tirzepatide" className="text-[#3390ec] hover:underline">Tirzepatide</Link>.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Multi-Receptor Agonists</h4>
                            <p className="text-slate-700 leading-[1.8]">Dual and triple receptor agonists represent an advanced category of research peptides that interact with multiple receptor types simultaneously. These compounds are valuable for studying complex metabolic interactions and receptor crosstalk. <Link to="/product/retatrutide" className="text-[#3390ec] hover:underline">Retatrutide</Link> is a triple GLP-1/GIP/glucagon agonist — see the full <Link to="/research-insight/retatrutide" className="text-[#3390ec] hover:underline">Retatrutide Research Overview</Link>. <Link to="/product/cagrisema" className="text-[#3390ec] hover:underline">CagriSema</Link> is another dual-agonist compound with a dedicated <Link to="/research-insight/cagrisema-comparison" className="text-[#3390ec] hover:underline">comparison guide</Link>.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Selective Peptide Modulators</h4>
                            <p className="text-slate-700 leading-[1.8]">Selective peptide modulators are designed to interact with specific receptor subtypes, enabling researchers to dissect the individual contributions of different receptors within a biological system. Browse the <Link to="/compound-database" className="text-[#3390ec] hover:underline">Research Compound Database</Link> to filter by receptor target.</p>
                        </div>
                    </div>
                </div>

                {/* Peptide Synthesis & Quality */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Peptide Synthesis & Quality</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Solid-Phase Peptide Synthesis</h4>
                            <p className="text-slate-700 leading-[1.8]">Most research peptides are produced using solid-phase peptide synthesis (SPPS), a method that allows for precise control over amino acid sequence and purity. This technique enables the production of peptides with specific modifications and high reproducibility.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Purity Standards</h4>
                            <p className="text-slate-700 leading-[1.8]">Research-grade peptides undergo rigorous quality control, including HPLC analysis and mass spectrometry verification. All Solatide Biosciences peptides are independently third-party tested to &gt;99% purity. Certificates of Analysis are published on each product page where available. <Link to="/coa" className="text-[#3390ec] hover:underline">Learn more about our COA & lab testing process</Link>.</p>
                        </div>
                    </div>
                </div>

                {/* Storage & Handling Protocols */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Storage & Handling Protocols</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Storage Conditions</h4>
                            <p className="text-slate-700 leading-[1.8]">Proper storage is critical for maintaining peptide stability and integrity. Lyophilised research peptides should be stored according to institutional laboratory protocols and manufacturer specifications. Researchers should consult their laboratory's standard operating procedures for peptide storage and handling. Storage guidance is also included on individual product pages.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Handling Precautions</h4>
                            <p className="text-slate-700 leading-[1.8]">Laboratory personnel should follow standard safety protocols when handling research peptides, including use of appropriate personal protective equipment (PPE), working in designated laboratory spaces, and following institutional biosafety guidelines. If you have questions about a specific compound, <Link to="/contact" className="text-[#3390ec] hover:underline">contact our team</Link> or consult the <Link to="/faq" className="text-[#3390ec] hover:underline">FAQ</Link>.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Reconstitution</h4>
                            <p className="text-slate-700 leading-[1.8]">Lyophilised peptides require reconstitution prior to use. Use the <Link to="/calculator" className="text-[#3390ec] hover:underline">Concentration Calculator</Link> to determine the correct solvent volume for your target concentration.</p>
                        </div>
                    </div>
                </div>

                {/* Experimental Considerations */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Experimental Considerations</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Experimental Design</h4>
                            <p className="text-slate-700 leading-[1.8]">Rigorous experimental design is essential when working with research peptides. Appropriate controls — including vehicle-treated groups and positive controls — ensure that observed effects can be attributed to the peptide under investigation. Consult the <Link to="/compound-database" className="text-[#3390ec] hover:underline">Research Compound Database</Link> for compound-specific notes.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Data Analysis and Interpretation</h4>
                            <p className="text-slate-700 leading-[1.8]">Results from peptide research should be analysed using appropriate statistical methods and interpreted within the context of existing scientific literature. Reproducibility and peer review are fundamental principles of peptide research. For questions about specific compounds, <Link to="/contact" className="text-[#3390ec] hover:underline">contact us</Link>.</p>
                        </div>
                    </div>
                </div>

                {/* Regulatory & Compliance Considerations */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Regulatory & Compliance Considerations</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Research Use Only</h4>
                            <p className="text-slate-700 leading-[1.8]">Research peptides are manufactured and distributed exclusively for laboratory research purposes. These compounds are not approved for human consumption, medical treatment, or veterinary applications. Read the full <Link to="/research-use" className="text-[#3390ec] hover:underline">Research Use Disclaimer</Link>.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Institutional Oversight</h4>
                            <p className="text-slate-700 leading-[1.8]">Research involving peptides, particularly in animal models, must be conducted under appropriate institutional oversight, including IACUC approval or equivalent ethics review.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Documentation and Traceability</h4>
                            <p className="text-slate-700 leading-[1.8]">Maintaining detailed records of peptide sourcing, storage, handling, and experimental use is essential for research integrity and regulatory compliance. Solatide Biosciences publishes batch-level COA documentation where available — see the <Link to="/coa" className="text-[#3390ec] hover:underline">COA & Lab Testing page</Link>.</p>
                        </div>
                    </div>
                </div>

                {/* Emerging Areas of Peptide Research */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Emerging Areas of Peptide Research</h2>
                    <div className="space-y-7 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Multi-Agonist Peptides</h4>
                            <p className="text-slate-700 leading-[1.8]">Recent research has focused on peptides that simultaneously activate multiple receptor types, such as GLP-1/GIP/glucagon triple agonists. <Link to="/research-insight/retatrutide" className="text-[#3390ec] hover:underline">Explore retatrutide research</Link> or read the <Link to="/research-insight/cagrisema" className="text-[#3390ec] hover:underline">CagriSema Research Overview</Link> for a dual-agonist perspective. The <Link to="/research-insight/cagrilintide" className="text-[#3390ec] hover:underline">Cagrilintide Research Overview</Link> covers amylin receptor agonism as an emerging area.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Peptide Modifications</h4>
                            <p className="text-slate-700 leading-[1.8]">Chemical modifications — including PEGylation, acylation, and amino acid substitutions — are being explored to enhance peptide stability, receptor selectivity, and pharmacokinetic properties in research models.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Peptide-Based Tool Compounds</h4>
                            <p className="text-slate-700 leading-[1.8]">Researchers are developing peptides as molecular tools to probe specific biological questions, including fluorescently labelled peptides for imaging studies and biotinylated peptides for receptor identification. Browse <Link to="/shop" className="text-[#3390ec] hover:underline">Research Solutions</Link> for supporting compounds.</p>
                        </div>
                    </div>
                </div>

                {/* Explore Specific Peptides */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Explore Specific Peptides</h2>
                    <p className="text-[14px] text-slate-700 mb-6">Learn more about individual research peptides in the Solatide catalogue, or <Link to="/compound-database" className="text-[#3390ec] hover:underline">search the full compound database</Link>.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#f0f4fa] p-5 rounded-md">
                            <h4 className="font-bold text-[#150F3A] text-[15px] mb-1.5">Retatrutide</h4>
                            <p className="text-[13px] text-slate-600 leading-snug">Triple-agonist metabolic peptide</p>
                        </div>
                        <div className="bg-[#f0f4fa] p-5 rounded-md">
                            <h4 className="font-bold text-[#150F3A] text-[15px] mb-1.5">BPC-157</h4>
                            <p className="text-[13px] text-slate-600 leading-snug">Repair & recovery peptide</p>
                        </div>
                        <div className="bg-[#f0f4fa] p-5 rounded-md">
                            <h4 className="font-bold text-[#150F3A] text-[15px] mb-1.5">TB-500</h4>
                            <p className="text-[13px] text-slate-600 leading-snug">Thymosin beta-4 fragment</p>
                        </div>
                        <div className="bg-[#f0f4fa] p-5 rounded-md">
                            <h4 className="font-bold text-[#150F3A] text-[15px] mb-1.5">GHK-Cu</h4>
                            <p className="text-[13px] text-slate-600 leading-snug">Copper peptide for dermal research</p>
                        </div>
                    </div>
                </div>

                {/* Helpful Tools & Resources */}
                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-6 border-b border-slate-200 pb-3">Helpful Tools & Resources</h2>
                    <div className="flex flex-wrap gap-3">
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
                        <Link to="/about" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="text-slate-400 font-bold">ℹ</span> About Us
                        </Link>
                    </div>
                </div>

                {/* Related Research Resources */}
                <div className="mb-14 bg-white">
                    <h2 className="text-[22px] font-bold text-[#150F3A] mb-8 border-b border-slate-200 pb-3">Related Research Resources</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        <div>
                            <h4 className="font-bold text-[12px] uppercase tracking-wider text-[#150F3A] mb-5">GLP-1 & METABOLIC</h4>
                            <ul className="space-y-3.5 text-[13px]">
                                <li><Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">GLP-1 Research Overview</Link></li>
                                <li><Link to="/research-insight/retatrutide" className="text-[#3390ec] hover:underline">Retatrutide Research Overview</Link></li>
                                <li><Link to="/research-insight/semaglutide" className="text-[#3390ec] hover:underline">Semaglutide Research Overview</Link></li>
                                <li><Link to="/research-insight/tirzepatide" className="text-[#3390ec] hover:underline">Tirzepatide Research Overview</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[12px] uppercase tracking-wider text-[#150F3A] mb-5">CAGRISEMA & CAGRILINTIDE</h4>
                            <ul className="space-y-3.5 text-[13px]">
                                <li><Link to="/research-insight/cagrisema" className="text-[#3390ec] hover:underline">CagriSema Research Overview</Link></li>
                                <li><Link to="/research-insight/cagrisema-comparison" className="text-[#3390ec] hover:underline">CagriSema Comparison Guide</Link></li>
                                <li><Link to="/research-insight/cagrilintide" className="text-[#3390ec] hover:underline">Cagrilintide Research Overview</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[12px] uppercase tracking-wider text-[#150F3A] mb-5">REPAIR & RECOVERY</h4>
                            <ul className="space-y-3.5 text-[13px]">
                                <li><Link to="/research-insight/bpc-157" className="text-[#3390ec] hover:underline">What is BPC-157?</Link></li>
                                <li><Link to="/research-insight/tb-500" className="text-[#3390ec] hover:underline">What is TB-500?</Link></li>
                                <li><Link to="/research-insight/bpc-tb-comparison" className="text-[#3390ec] hover:underline">BPC-157 vs TB-500 Comparison</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[12px] uppercase tracking-wider text-[#150F3A] mb-5">CATALOGUE & DOCS</h4>
                            <ul className="space-y-3.5 text-[13px]">
                                <li><Link to="/compound-database" className="text-[#3390ec] hover:underline">Research Compound Database</Link></li>
                                <li><Link to="/coa" className="text-[#3390ec] hover:underline">COA & Lab Testing</Link></li>
                                <li><Link to="/shop" className="text-[#3390ec] hover:underline">All Products</Link></li>
                                <li><Link to="/bundles" className="text-[#3390ec] hover:underline">Bundles</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#214A9E] p-5">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications. <Link to="/research-use" className="text-[#3390ec] hover:underline">Full disclaimer</Link>.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PeptidesGuide;
