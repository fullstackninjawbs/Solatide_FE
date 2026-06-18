import React, { useState } from 'react';

const ShopFaq = () => {
    const [openIndices, setOpenIndices] = useState([]);

    const toggleIndex = (index) => {
        if (openIndices.includes(index)) {
            setOpenIndices(openIndices.filter(i => i !== index));
        } else {
            setOpenIndices([...openIndices, index]);
        }
    };

    const faqs = [
        {
            question: "Are These Products For Human Consumption?",
            answer: "No. All compounds are supplied strictly for in-vitro laboratory and analytical research use only. They are not intended for human or veterinary consumption, and we make no therapeutic, diagnostic, or clinical claims."
        },
        {
            question: "What Are My Responsibilities As A Buyer?",
            answer: "Buyers are solely responsible for ensuring lawful use, proper handling, and compliance with all local, state, federal, and international regulations regarding import, possession, and use of research compounds."
        },
        {
            question: "Where Can I Learn More About Specific Peptides?",
            answer: "Product pages, research category pages, and available analytical documentation provide compound-specific information where available. Solatide does not provide human-use, dosing, therapeutic, or medical guidance."
        },
        {
            question: "What Does \"Lyophilised\" Mean?",
            answer: "Lyophilisation is a freeze-drying process that removes water from a sample while preserving its molecular structure. We supply peptides as lyophilised powders because it increases stability and structural integrity during transit and storage."
        }
    ];

    return (
        <section className="w-full bg-[#f8fafc] py-20 lg:py-24 text-left">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <span className="text-[#00bfef] text-[13px] sm:text-[15px] font-extrabold tracking-widest uppercase mb-3 block">
                        FAQ
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold tracking-tight leading-tight" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                        <span className="text-[#1E1E1E]">Frequently Asked </span>
                        <span className="text-[#214A9E]">Questions</span>
                    </h2>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Disclaimer Card */}
                    <div className="col-span-1 lg:col-span-4 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8E8E8] shadow-sm">
                        <h3 className="text-xl font-bold text-[#1E1E1E] mb-4 leading-snug" style={{ fontFamily: 'Poppins' }}>
                            Research-use clarity before ordering.
                        </h3>
                        <p className="text-[14px] text-[#6A6A6A] leading-[1.6] mb-6" style={{ fontFamily: 'Poppins' }}>
                            These answers cover intended use, online batch verification, documentation, dispatch, and research supply responsibilities.
                        </p>
                        <div className="bg-[#F4F8FD] border border-[#E0EFFE] rounded-[16px] p-5">
                            <p className="text-[13px] text-[#1E1E1E] leading-[1.6]" style={{ fontFamily: 'Poppins' }}>
                                <strong className="font-bold text-[#1E1E1E]">Research-use-only:</strong> Solatide products are supplied strictly for in-vitro laboratory research use and are not for human or veterinary consumption.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Accordion Items */}
                    <div className="col-span-1 lg:col-span-8 space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndices.includes(index);
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                                >
                                    <button
                                        onClick={() => toggleIndex(index)}
                                        className="w-full flex items-center justify-between px-6 py-5 font-bold text-[16px] text-[#1E1E1E] hover:text-[#214A9E] focus:outline-none transition-colors duration-200"
                                        style={{ fontFamily: 'Poppins' }}
                                    >
                                        <span>{faq.question}</span>
                                        <div className="h-8 w-8 rounded-full bg-[#F0F7FF] flex items-center justify-center text-[#214A9E] shrink-0 ml-4 transition-transform duration-300">
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <div className="px-6 pt-1 border-t border-slate-100 text-[14.5px] text-[#6A6A6A] leading-[1.7]" style={{ fontFamily: 'Poppins' }}>
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopFaq;
