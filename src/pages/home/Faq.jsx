import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "Are Your Products Intended For Human Use?",
            answer: "No. All products sold by Solatide Biosciences are strictly positioned for in-vitro laboratory and analytical research use only. They are not intended for human consumption, therapeutic, or diagnostic purposes under any circumstances."
        },
        {
            question: "Do You Provide Certificates Of Analysis?",
            answer: "Yes. We provide independent, third-party analytical documentation (such as HPLC and MS reports) where available to verify the purity and identity of our research compounds."
        },
        {
            question: "How Are Orders Processed?",
            answer: "Orders are processed swiftly through our secure compliance-first network. You will receive email tracking updates once your dispatch has been verified and shipped."
        },
        {
            question: "Do You Ship Internationally?",
            answer: "Yes. We offer reliable global dispatch and fast international shipping to research facilities worldwide. Delivery times and shipping fees will vary depending on your location."
        },
        {
            question: "What Is Reconstitution?",
            answer: "Reconstitution is the laboratory process of adding a sterile solvent (like Bacteriostatic Water) to a lyophilized peptide powder to dissolve it into a liquid solution ready for research testing."
        },
        {
            question: "Can I Request Additional Information?",
            answer: "Absolutely. If you have questions about bulk pricing, custom synthesis, or require analytical document copies, please reach out to us via Telegram or email support."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="w-full bg-[#F5F8FC] py-16 lg:py-20 text-left">
            <div className="main-container max-w-[1024px]">
                {/* Header */}
                <div className="mb-10">
                    <span className="text-[#00ADEE] text-[14px] font-semibold mb-2 block uppercase tracking-wider">FAQ</span>
                    <h2 className="text-[32px] md:text-[44px] font-anek font-bold text-[#1D1D1F] leading-tight">
                        Frequently Asked <span className="text-[#1a4494]">Questions</span>
                    </h2>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
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
                                    <span className="text-[15px] sm:text-[16px] font-bold text-slate-800 leading-snug">
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
        </section>
    )
}

export default Faq