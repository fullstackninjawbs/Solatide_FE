import React from 'react';
import { Link } from 'react-router-dom';

const CoaBanner = () => {
    return (
        <div className="w-full bg-white min-h-screen pt-20 pb-20 font-sans">
            <div className="main-container mx-auto px-4 sm:px-6">

                {/* Header */}
                <h1 className="text-center text-[34px] sm:text-[40px] font-bold text-[#214A9E] mb-6">
                    COA & Lab Testing
                </h1>

                <hr className="border-slate-300 mb-10" />

                {/* Independent Third-Party Laboratory Documentation */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Independent Third-Party Laboratory Documentation
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75] mb-4">
                        Solatide Biosciences provides selected product-level laboratory documentation for certain products to support research transparency. Documentation is sourced from independent analytical laboratories and varies by product and batch.
                    </p>
                    <ul className="list-disc pl-5 text-[14.5px] text-slate-600 leading-[1.75] space-y-1">
                        <li>Selected product-level third-party verification</li>
                        <li>Identity and purity confirmation where available</li>
                        <li>Clear supporting documentation displayed on product pages</li>
                        <li>Greater transparency for research planning</li>
                    </ul>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Our Approach to Third-Party Documentation */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Our Approach to Third-Party Documentation
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75] mb-4">
                        Where third-party documentation is published, it reflects our preference for high-purity material and our commitment to providing supporting data for research reference. Published documentation displays key analytical data including purity results, product identity, and date of analysis.
                    </p>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Full laboratory reports are not published in unredacted form. We do not make exaggerated claims about "pharmaceutical grade" or guaranteed purity without evidence, and we let the available analytical data speak for itself.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Manufacturer Quality Control Testing */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Manufacturer Quality Control Testing
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75] mb-4">
                        Every production batch undergoes post-manufacturing quality control by the manufacturer before dispatch. This includes HPLC-UV purity testing, LC-MS identity confirmation, and purity assessment as standard, and may additionally include residual solvent testing, sterility reports where available, endotoxin testing where available, amino acid analysis, and other internal release checks depending on the product and batch. These manufacturer QC records are not available for external request.
                    </p>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Not every batch undergoes independent third-party testing in addition to manufacturer QC. Where third-party documentation is available, it is published on the relevant product page.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Which Laboratories May Appear in Our Documentation */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Which Laboratories May Appear in Our Documentation
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Documentation may include reports from independent laboratories such as Freedom Diagnostics, Janoshik, Chromate or other relevant analytical laboratories, depending on the product, batch and testing cycle. Not every laboratory is used for every product or every batch.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* What Documentation May Include */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        What Documentation May Include
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75] mb-4">
                        Depending on the product and batch, available third-party analytical documentation may include one or more of the following:
                    </p>
                    <ul className="list-disc pl-5 text-[14.5px] text-slate-600 leading-[1.75] space-y-1 mb-4">
                        <li><strong>Purity analysis:</strong> Detailed purity results with exact percentages, typically ≥99%</li>
                        <li><strong>Identity confirmation:</strong> Verified compound identity through LC-MS identity confirmation</li>
                        <li><strong>Quantity verification:</strong> Confirmed net peptide content</li>
                        <li><strong>Endotoxin testing where available:</strong> Where completed for the relevant product and batch</li>
                        <li><strong>Sterility reports where available:</strong> Where completed for the relevant product and batch</li>
                        <li><strong>Testing methodology:</strong> Analytical methods used (e.g. HPLC-UV purity testing, LC-MS identity confirmation, endotoxin testing where available)</li>
                        <li><strong>Date of analysis:</strong> When testing was performed</li>
                        <li><strong>Independent laboratory verification:</strong> Batch-specific documentation and chemist signature</li>
                    </ul>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75] italic">
                        The presence of one type of third-party report should not be interpreted as confirmation that every possible test panel was performed for that batch. Specific test panels are only provided where available for the relevant product and batch.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* How to Access Documentation */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        How to Access Documentation
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Where available, documentation is displayed on the relevant product page and should be reviewed before purchase. Documentation availability, scope and format vary by product, batch and testing cycle. If a product page does not display a specific report, customers should not assume that the same testing panel has been completed for that batch.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Packaging and Image Disclaimer */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Packaging and Image Disclaimer
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Product images, vial photographs, and documentation images displayed on the website are representative only. Cap colour, stopper colour, vial shape, label layout, and other cosmetic packaging details may vary by batch, supplier update, manufacturer changes, or laboratory sample presentation. Customers should rely on the product title, labelled quantity, batch reference, and supplied documentation rather than cosmetic packaging details alone.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Understanding Purity Results */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Understanding Purity Results
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        Purity percentages represent the proportion of the target compound in the sample. Products selected for website presentation reflect Solatide Biosciences' preference for high-purity material based on available documentation. Higher purity supports more reliable analytical work and experimental consistency in laboratory research.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Research Use Only */}
                <section className="mb-10">
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Research Use Only
                    </h2>
                    <p className="text-[14.5px] text-slate-600 leading-[1.75]">
                        All products sold by Solatide Biosciences are supplied strictly for in-vitro laboratory and analytical research purposes only. Third-party analytical documentation is provided for research reference and compound verification purposes. Nothing in this documentation constitutes medical, clinical, therapeutic, diagnostic, or veterinary advice or approval.
                    </p>
                </section>

                <hr className="border-slate-300 my-10" />

                {/* Related Resources */}
                <section>
                    <h2 className="text-[24px] font-bold text-[#214A9E] mb-4">
                        Related Resources
                    </h2>
                    <ul className="list-disc pl-5 text-[14.5px] text-[#00E5FF] leading-[2] font-semibold space-y-1">
                        <li><Link to="/contact-us" className="hover:underline hover:text-[#00c9e0] transition-colors">Contact Us</Link></li>
                        <li><Link to="/faq" className="hover:underline hover:text-[#00c9e0] transition-colors">FAQ</Link></li>
                        <li><Link to="/peptides-guide" className="hover:underline hover:text-[#00c9e0] transition-colors">Research Peptides Guide</Link></li>
                        <li><Link to="/compound-database" className="hover:underline hover:text-[#00c9e0] transition-colors">Research Compound Database</Link></li>
                    </ul>
                </section>

            </div>
        </div>
    );
};

export default CoaBanner;
