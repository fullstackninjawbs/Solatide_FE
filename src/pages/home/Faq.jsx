import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "Are these products for human consumption?",
            answer: "No. Solatide products are supplied strictly for in-vitro laboratory research use only. They are not for human consumption, veterinary use, therapeutic use, diagnostic use, cosmetic use, injection, or dosing."
        },
        {
            question: "What are my responsibilities as a buyer?",
            answer: "Researchers and purchasers are responsible for ensuring products are handled, stored, and used only in lawful in-vitro laboratory research settings. Products must not be used for human or veterinary consumption."
        },
        {
            question: "Where Can I Learn More About Specific Peptides?",
            answer: "Product pages, research category pages, and available analytical documentation provide compound-specific information where available. Solatide does not provide human-use, dosing, therapeutic, or medical guidance."
        },
        {
            question: "What does \"lyophilised\" mean?",
            answer: "Lyophilised means the material has been freeze-dried into a dry powder form. This is commonly used to support stability and handling for laboratory research materials."
        },
        {
            question: "Do you sell bacteriostatic water or diluents?",
            answer: "Yes. Solatide may supply laboratory support materials such as bacteriostatic water or diluents where available. These materials are supplied for research-use workflows only."
        },
        {
            question: "Where are orders dispatched from?",
            answer: "Orders are dispatched from Melbourne, Australia, with tracking where available. Dispatch timeframes may vary depending on payment confirmation, stock availability, and operational cut-off times."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="w-full bg-[#F5F8FC] py-16 lg:py-24 text-left">
            <div className="main-container">
                {/* Header */}
                <div className="mb-12">
                    <span className="text-[#00ADEE] text-[14px] font-semibold mb-2 block uppercase tracking-wider">FAQ</span>
                    <h2 className="text-[32px] md:text-[44px] font-anek font-bold text-[#1D1D1F] leading-tight">
                        Frequently Asked <span className="text-[#1a4494]">Questions</span>
                    </h2>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                    
                    {/* Left Column Card */}
                    <div className="w-full lg:w-[32%] bg-white rounded-[24px] p-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col text-left">
                        <h3 className="text-[20px] font-bold text-[#1D1D1F] leading-[1.3] mb-4">
                            Research-use clarity before ordering.
                        </h3>
                        <p className="text-[14px] text-[#4B5563] leading-[1.6] mb-6">
                            These answers cover intended use, online batch verification, documentation, dispatch, and research supply responsibilities.
                        </p>
                        <div className="bg-[#F5F8FC] border border-[#EAF7FD] rounded-[14px] p-5">
                            <p className="text-[13px] text-[#4B5563] leading-[1.6]">
                                <span className="font-bold text-[#1D1D1F]">Research-use-only:</span> Solatide products are supplied strictly for in-vitro laboratory research use and are not for human or veterinary consumption.
                            </p>
                        </div>
                    </div>

                    {/* Right Column Accordion List */}
                    <div className="w-full lg:w-[68%] space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-[16px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                                    >
                                        <span className="text-[15px] sm:text-[16px] font-semibold text-slate-800 leading-snug">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-[#1a4494] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Collapsible Answer */}
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-slate-50' : 'max-h-0'}`}
                                    >
                                        <div className="px-6 py-5 text-[14px] text-slate-600 leading-relaxed bg-[#fcfdfe]">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Faq