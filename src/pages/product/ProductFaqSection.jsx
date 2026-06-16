import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductFaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqItems = [
        {
            question: 'Are these products for human consumption?',
            answer: (
                <span>
                    No. All compounds sold by Solatide Biosciences are supplied strictly for in-vitro laboratory and analytical research use only. They are not intended for human or veterinary consumption, and we make no therapeutic, diagnostic, or clinical claims.{' '}
                    <Link to="/about" className="text-[#214A9E] underline font-semibold hover:text-[#008fe2]">
                        read our full Research Use Disclaimer
                    </Link>.
                </span>
            )
        },
        {
            question: 'What does "lyophilised" mean?',
            answer: 'Lyophilisation is a complex freeze-drying process that removes water from a biological or chemical sample while preserving its molecular structure. We supply our peptides as lyophilised powders because it vastly increases their stability and structural integrity during transit and storage.'
        },
        {
            question: 'What is reconstitution?',
            answer: (
                <span>
                    Reconstitution is a standard laboratory technique where lyophilised (freeze-dried) powder is dissolved in a suitable solvent to create a liquid solution for analytical testing. This process is commonly employed in research laboratories when working with peptide reference standards, proteins, and other biomolecules that are supplied in lyophilised form for stability during storage and transport. The choice of solvent, concentration, and handling procedures are determined by the specific requirements of each research protocol and analytical method. Common laboratory solvents include{' '}
                    <Link to="/shop" className="text-[#214A9E] underline font-semibold hover:text-[#008fe2]">
                        Bacteriostatic Water
                    </Link>. Solatide Biosciences does not provide reconstitution protocols or procedural guidance, as our products are supplied strictly as analytical reference standards for in-vitro research purposes.
                </span>
            )
        },
        {
            question: 'Can I return a product if I change my mind?',
            answer: (
                <span>
                    No. Due to the highly sensitive nature of lyophilised research compounds, we strictly do not accept returns or offer refunds for "change of mind" or buyer's remorse. Once a product leaves our facility, we can no longer verify its environmental exposure or structural integrity. All sales of laboratory reagents are final.{' '}
                    <Link to="/about" className="text-[#214A9E] underline font-semibold hover:text-[#008fe2]">
                        Read our Refund & Returns Policy
                    </Link>.
                </span>
            )
        },
        {
            question: 'Are Certificates of Analysis (COAs) available?',
            answer: (
                <span>
                    Yes, batch-specific Certificates of Analysis and purity reports are publicly available for our products. They are displayed directly on individual product pages and on our dedicated{' '}
                    <Link to="/about" className="text-[#214A9E] underline font-semibold hover:text-[#008fe2]">
                        COA document library
                    </Link>.
                </span>
            )
        },
        {
            question: 'How should I store my research compounds?',
            answer: 'Before reconstitution (while still in lyophilised powder form), vials should be stored away from direct sunlight. For long-term preservation of molecular integrity, we recommend storing lyophilised vials in a designated laboratory freezer at -20°C. For short-term storage, a designated laboratory refrigerator at 2°C to 8°C is acceptable.'
        },
        {
            question: 'How long does shipping take?',
            answer: 'Orders are typically processed and dispatched within 1-2 business days of order confirmation and payment clearance. Please note that during peak periods or due to stock availability, processing times may extend to 5-10 business days.'
        },
        {
            question: 'How do I contact support?',
            answer: 'For all support enquiries, please contact us via Telegram at @solatidebiosciences or email us at contact@solatidebiosciences.com.au'
        },
        {
            question: 'What does the COA include?',
            answer: (
                <span>
                    Our batch documentation is provided by independent third-party laboratories and may include HPLC purity percentage and compound identity confirmation via LC-MS. Some information within reports — including certain batch identifiers — may be redacted. Where available, endotoxin testing results are included in the batch documentation. Sterility testing is not part of our standard batch documentation.{' '}
                    <Link to="/about" className="text-[#214A9E] underline font-semibold hover:text-[#008fe2]">
                        View our COA document library
                    </Link>.
                </span>
            )
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mt-20 max-w-[1440px] mx-auto text-left px-4 sm:px-0" style={{ fontFamily: 'Poppins' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
                <div>
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-wider uppercase block mb-1">
                        FAQ
                    </span>
                    <h2 className="text-3xl sm:text-[36px] font-semibold text-[#1E1E1E]">
                        Key Questions
                    </h2>
                </div>
                <Link
                    to="/about"
                    className="text-[#214A9E] hover:underline text-[14px] font-semibold"
                >
                    For complete information, see our full FAQ page
                </Link>
            </div>

            {/* Accordions */}
            <div className="space-y-4">
                {faqItems.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`border rounded-xl bg-white transition-all ${
                                isOpen ? 'border-[#214A9E]/40 shadow-sm' : 'border-[#E8E8E8]'
                            }`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] sm:text-[16px] transition-colors text-left ${
                                    isOpen ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'
                                }`}
                            >
                                <span>{item.question}</span>
                                <svg
                                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-250 ${
                                        isOpen ? 'rotate-180 text-[#214A9E]' : ''
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            {isOpen && (
                                <div className="px-6 pb-6 pt-1 border-t border-slate-100/50 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductFaqSection;
