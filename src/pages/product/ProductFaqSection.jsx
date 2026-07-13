import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

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
        return null; // Hide the section completely if there are no FAQs
    }

    // Flatten all questions across sections to match the existing UI layout, 
    // or we could show section headers. Since the original just had a list, 
    // we'll group them by section visually if there are multiple sections.
    return (
        <div className="mt-20 max-w-[1440px] mx-auto text-left" style={{ fontFamily: 'Poppins' }}>
            {/* Header Section */}
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
                                    <div
                                        key={globalIndex}
                                        className={`border rounded-xl bg-white transition-all ${
                                            isOpen ? 'border-[#214A9E]/40 shadow-sm' : 'border-[#E8E8E8]'
                                        }`}
                                    >
                                        <button
                                            onClick={() => toggleFaq(globalIndex)}
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
                                                <p className="whitespace-pre-wrap">{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductFaqSection;
