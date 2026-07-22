import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { apiService } from '../../services/api';

/*
// Original Code implementation (fetching from API)
const ProductFaqSection = () => {
    const [faqSections, setFaqSections] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await apiService.getPublicFaqs();
                const data = await response.json();
                if (data?.success) {
                    setFaqSections(data.data.faqSections);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="mt-20 max-w-[1440px] mx-auto text-center py-10 text-slate-400">
                Loading FAQs...
            </div>
        );
    }

    if (faqSections.length === 0) {
        return null;
    }

    // Return JSX...
}
*/

const productFaqs = [
    {
        question: "Are these products for human consumption?",
        answer: "No. Products sold by Solatide Biosciences are supplied strictly for in-vitro laboratory and analytical research purposes only. They are not supplied for human consumption, clinical use, therapeutic use, cosmetic use, veterinary use, or any form of administration."
    },
    {
        question: "Do you provide preparation, dosing, or application guidance?",
        answer: "No. We do not provide preparation, dosing, administration, application, or usage guidance. Our product information is limited to research-use positioning, product identification, storage, documentation, and quality-related information."
    },
    {
        question: "Are Certificates of Analysis available?",
        answer: "Yes. Certificates of Analysis are made available where applicable through our COA and documentation system. Some products may show pending documentation while updated batch records or third-party testing documentation are being processed."
    },
    {
        question: "Do your products undergo quality control?",
        answer: "Yes. Every batch undergoes a full internal quality-control panel before release. Only batches that meet our internal release criteria are made available for sale. This internal release process is separate from third-party analytical testing. Internal QC records are not publicly released. Where available, third-party testing documentation and Certificates of Analysis can be accessed through the relevant product page or COA library."
    },
    {
        question: "How should lyophilised products be stored?",
        answer: "Lyophilised products should be stored as directed on the product label and supporting documentation. Unless otherwise stated, products should be kept sealed, protected from light, and stored under appropriate cold-chain or refrigerated conditions after receipt."
    },
    {
        question: "When will my order be dispatched?",
        answer: "Orders are generally processed as quickly as possible after payment is received. Once your order has been dispatched, tracking information will be sent to the email address provided at checkout."
    }
];

const ProductFaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mt-20 max-w-[1440px] mx-auto text-left" style={{ fontFamily: 'Poppins' }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8 px-4 sm:px-0">
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
            <div className="space-y-8 px-4 sm:px-0">
                <div className="space-y-4">
                    {/* Original mapping logic commented out:
                    {faqSections.map((section, sIdx) => (
                        <div key={section._id || sIdx} className="space-y-4">
                            {faqSections.length > 1 && (
                                <h3 className="text-[18px] font-bold text-slate-800 border-b border-slate-200 pb-2">{section.name}</h3>
                            )}
                            <div className="space-y-4">
                                {section.questions.map((item, qIdx) => {
                                    const globalIndex = `${sIdx}-${qIdx}`;
                                    const isOpen = openIndex === globalIndex;
                                    return (
                                        ...
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    */}

                    {/* New static FAQs */}
                    {productFaqs.map((item, qIdx) => {
                        const isOpen = openIndex === qIdx;
                        return (
                            <div
                                key={qIdx}
                                className={`border rounded-xl bg-white transition-all ${isOpen ? 'border-[#214A9E]/40 shadow-sm' : 'border-[#E8E8E8]'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(qIdx)}
                                    className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] sm:text-[16px] transition-colors text-left ${isOpen ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'
                                        }`}
                                >
                                    <span>{item.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-180 text-[#214A9E]' : ''
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
                                        <p className="whitespace-pre-wrap">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductFaqSection;
