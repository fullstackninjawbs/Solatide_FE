import React from 'react';
import { Link } from 'react-router-dom';

const ProductInfoSection = ({ product }) => {
    return (
        <div className="w-full bg-[#f4f9fd] py-16 mt-8 font-['Poppins']">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-left">

                <div className="mb-10">
                    <h3 className="text-[13px] font-bold text-[#214A9E] mb-2">Product Overview</h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E]">
                        Understanding {product.name}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-6 flex flex-col gap-2.5">

                        {/* Box 1: Product Overview Description */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-full">
                            <div className="text-[14.5px] text-[#6A6A6A] leading-[1.8]">
                                {product.overviewHtml ? (
                                    <div
                                        className="w-full product-overview-content text-[#6A6A6A] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_p]:mb-4"
                                        dangerouslySetInnerHTML={{ __html: product.overviewHtml }}
                                    />
                                ) : (
                                    <p className="mb-4">
                                        {product.name} is a high-grade research compound. Products selected for website presentation meet Solatide Biosciences' ≥99% purity standard based on available third-party documentation. This multi-receptor activation profile makes it a valuable research tool for investigating coordinated metabolic signalling, receptor crosstalk, and integrated pathway regulation in laboratory models.
                                    </p>
                                )}

                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2 text-[12.5px] font-semibold">
                                    <Link to="/shop" className="text-[#0079CD] hover:underline">{product.name.split(' ')[0]} (vial only)</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/calculator" className="text-[#0079CD] hover:underline">Concentration Calculator</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/terms" className="text-[#0079CD] hover:underline">Research Use Disclaimer</Link>
                                </div>
                            </div>
                        </div>

                        {/* Box 2: Research Applications */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mt-6">
                            <h3 className="text-[14px] font-bold text-[#0079CD] mb-4">Research Applications</h3>
                            <div className="text-[14.5px] text-[#6A6A6A] leading-[1.8]">
                                {product.researchApplicationsHtml ? (
                                    <div
                                        className="w-full product-applications-content text-[#6A6A6A] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-2"
                                        dangerouslySetInnerHTML={{ __html: product.researchApplicationsHtml }}
                                    />
                                ) : (
                                    <ul className="list-disc pl-5 mb-4 space-y-2">
                                        <li>Triple GIP/GLP-1/glucagon receptor agonism studies</li>
                                        <li>Comparative incretin receptor pharmacology assays</li>
                                        <li>Multi-pathway metabolic signalling integration research</li>
                                        <li>Analytical concentration studies (0.1 nM to 100 nM range)</li>
                                    </ul>
                                )}

                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-6 h-full">
                        {/* Box 3: Technical Specifications */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
                            <h3 className="text-[14px] font-bold text-[#0079CD] mb-5">Technical Specifications</h3>

                            <div className="flex-grow">
                                {product.technicalSpecsTable && product.technicalSpecsTable.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="w-full">
                                            <div className="grid grid-cols-12 border-b border-slate-100 pb-3">
                                                <div className="col-span-5 text-[13.5px] font-bold text-slate-600">Technical Parameter</div>
                                                <div className="col-span-7 text-[13.5px] font-bold text-slate-600">Laboratory Specification</div>
                                            </div>

                                            <div className="flex flex-col">
                                                {product.technicalSpecsTable.map((row, idx) => {
                                                    const isPurity = row.parameter?.toLowerCase().includes('purity');

                                                    // Helper to format molecular formula subscripts
                                                    const renderSpecification = (param, spec) => {
                                                        if (param === 'Molecular Formula') {
                                                            return spec.split(/(\d+)/).map((part, i) => {
                                                                if (/^\d+$/.test(part)) return <sub key={i} className="text-[9px] leading-none relative bottom-[-0.2em] font-semibold">{part}</sub>;
                                                                return part;
                                                            });
                                                        }
                                                        return spec;
                                                    };

                                                    return (
                                                        <div key={idx} className="grid grid-cols-12 items-center border-b border-slate-100 py-3.5 last:border-0">
                                                            <div className="col-span-5 text-[13px] font-medium text-slate-600">{row.parameter}</div>
                                                            <div className="col-span-7 text-[13px] font-medium text-slate-500">
                                                                {isPurity ? (
                                                                    <span className="text-[#0079CD] font-medium hover:underline cursor-pointer">{row.specification}</span>
                                                                ) : (
                                                                    renderSpecification(row.parameter, row.specification)
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <p className="text-[11.5px] text-slate-400 leading-[1.6] font-medium mt-5 pt-1">
                                            Batch-specific third-party documentation available. Reports may include testing from independent laboratories such as Janoshik, Chromate, and Freedom Diagnostics, depending on the batch. View our <Link to="/coa" className="text-[#0079CD] hover:underline font-bold">COA & Lab Testing page</Link> for details.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-[14.5px] text-[#6A6A6A] leading-[1.8]">
                                        {product.technicalSpecs?.rawHtml || product.technicalSpecsRawHtml ? (
                                            <div className="w-full product-specs-content" dangerouslySetInnerHTML={{ __html: product.technicalSpecs?.rawHtml || product.technicalSpecsRawHtml }} />
                                        ) : (
                                            <p>
                                                Purity standard minimum of 99% verified via independent high-performance liquid chromatography (HPLC) and mass spectrometry analysis. Product is supplied as a sterile lyophilised white powder and must be stored at -20°C for long-term stability.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductInfoSection;
