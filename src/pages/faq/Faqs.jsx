import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const faqData = [
    {
        title: "Research Use & Compliance",
        items: [
            {
                id: "q1",
                question: "Are these products for human consumption?",
                answer: "<ul class='list-disc pl-5'><li class='text-[#6A6A6A] font-medium'>Bacteriostatic Water:Sterile water with 0.9% benzyl alcohol preservative for peptide reconstitution</li></ul>",
                isHtml: true
            },
            { id: "q2", question: "Do You Provide Preparation Protocols Or Application Guidance?", answer: "Content for this section will be added here." },
            { id: "q3", question: "What Are My Responsibilities As A Buyer?", answer: "Content for this section will be added here." },
            { id: "q4", question: "Where Can I Learn More About Specific Peptides?", answer: "Content for this section will be added here." }
        ]
    },
    {
        title: "Product Information & Storage",
        items: [
            {
                id: "q5",
                question: 'What does "lyophilised" mean?',
                answer: "Lyophilisation is a freeze-drying process that removes water from a sample while preserving its molecular structure. We supply peptides as lyophilised powders because it increases stability and structural integrity during transit and storage."
            },
            { id: "q6", question: "What Is Reconstitution?", answer: "Content for this section will be added here." },
            { id: "q7", question: "Why Does The Powder In My Vial Look Different From My Last Order?", answer: "Content for this section will be added here." },
            { id: "q8", question: "Do Vial Images, Cap Colours, Or Packaging Match Exactly What I Receive?", answer: "Content for this section will be added here." },
            { id: "q9", question: "How Should I Store My Research Compounds?", answer: "Content for this section will be added here." },
            { id: "q10", question: "Do You Sell Bacteriostatic Water Or Diluents?", answer: "Content for this section will be added here." }
        ]
    },
    {
        title: "Documentation & Quality",
        items: [
            {
                id: "q11",
                question: "Are Certificates of Analysis (COAs) available?",
                answer: "Yes. Selected product-level COAs or laboratory documentation may be available on relevant product pages or via our <a href='/coa' class='text-[#00E5FF] hover:underline font-medium'>COA & Lab Testing page</a>. Documentation availability, scope, and format vary by product and by testing cycle.",
                isHtml: true
            },
            { id: "q12", question: "Do Your Products Undergo Manufacturer Quality Control Testing?", answer: "Content for this section will be added here." },
            { id: "q13", question: "Do You Provide Third-Party Testing Verification?", answer: "Content for this section will be added here." },
            { id: "q14", question: "Can I Request Batch Or Lot Documentation Before My Order Is Dispatched?", answer: "Content for this section will be added here." },
            { id: "q15", question: "Can I Arrange Independent Testing Of My Order?", answer: "Content for this section will be added here." },
            { id: "q16", question: "How Can I Request Documentation Or Testing Information?", answer: "Content for this section will be added here." }
        ]
    },
    {
        title: "Orders & Shipping",
        items: [
            { id: "q17", question: "Where are orders dispatched from?", answer: "Orders are dispatched from our dispatch facility." },
            { id: "q18", question: "How Quickly Are Orders Processed?", answer: "Content for this section will be added here." },
            { id: "q19", question: "How Do I Receive Tracking Information?", answer: "Content for this section will be added here." },
            { id: "q20", question: "What Should I Do If My Order Is Delayed?", answer: "Content for this section will be added here." },
            { id: "q21", question: "How Long Do I Have To Complete Payment After Placing An Order?", answer: "Content for this section will be added here." },
            { id: "q22", question: "Do You Offer Worldwide Shipping?", answer: "Content for this section will be added here." },
            { id: "q23", question: "Will The Compound Degrade During Shipping Without Cold Packs?", answer: "Content for this section will be added here." },
            { id: "q24", question: "How Do Restock Alerts Work?", answer: "Content for this section will be added here." }
        ]
    },
    {
        title: "Refunds & Returns",
        items: [
            { id: "q25", question: "Where are orders dispatched from?", answer: "No. Due to the sensitive nature of lyophilised research compounds, we do not accept returns or offer refunds for \"change of mind\" or buyer's remorse. Once a product leaves our facility, we can no longer verify its environmental exposure or structural integrity. All sales of laboratory reagents are final, subject to your rights under applicable consumer protection laws and any other applicable non-excludable law." },
            { id: "q26", question: "What Do I Do If My Vials Arrive Damaged?", answer: "Content for this section will be added here." },
            { id: "q27", question: "Will I Get A Refund If My Package Is Seized By Customs?", answer: "Content for this section will be added here." },
            { id: "q28", question: "My Tracking Says \"Delivered\" But I Haven't Received It. Will You Refund Me?", answer: "Content for this section will be added here." }
        ]
    },
    {
        title: "Contact & Support",
        items: [
            { id: "q29", question: "How do I contact Solatide Biosciences?", answer: "Contact us via <a href='#' class='text-[#00E5FF] hover:underline font-medium'>Telegram or email</a>. We do not provide phone support. Our support team can assist with stock availability, order tracking, and damaged shipment claims.", isHtml: true }
        ]
    }
]

const Faqs = () => {
    const [openItems, setOpenItems] = useState({ q1: true, q5: true, q11: true })

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full bg-[#F0F5FB] py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        FAQ's
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        Find answers to commonly asked questions about our research compounds, ordering process, and general guidelines to support your understanding.
                    </p>
                </div>
            </section>

            <section className="w-full bg-white py-12">
                <div className="main-container mx-auto flex flex-col gap-10">

                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="text-[14px] font-semibold font-weight-600 uppercase tracking-widest text-[#00E5FF] mb-4">
                                GETTING STARTED
                            </p>
                            <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] mb-6">
                                {faqData[0].title}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {faqData[0].items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`border rounded-[8px] overflow-hidden transition-all duration-300 ${openItems[item.id] ? 'border-[#e0eaf5] bg-white shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                                        >
                                            <span className={`text-[15px] font-semibold transition-colors ${openItems[item.id] ? 'text-[#1a4494]' : 'text-[#374151]'}`}>
                                                {item.question}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-300 ${openItems[item.id] ? 'rotate-180 text-[#1a4494]' : 'text-slate-400'}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <div className={`transition-all duration-300 overflow-hidden ${openItems[item.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-4 md:px-5 pb-5 pt-0 text-[14.5px] text-[#6A6A6A] leading-relaxed">
                                                {item.isHtml ? (
                                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                                ) : (
                                                    <p>{item.answer}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {faqData.slice(1).map((section, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] mb-6">
                                {section.title}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {section.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`border rounded-[8px] overflow-hidden transition-all duration-300 ${openItems[item.id] ? 'border-[#e0eaf5] bg-white shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                                        >
                                            <span className={`text-[15px] font-semibold transition-colors ${openItems[item.id] ? 'text-[#1a4494]' : 'text-[#374151]'}`}>
                                                {item.question}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-300 ${openItems[item.id] ? 'rotate-180 text-[#1a4494]' : 'text-slate-400'}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <div className={`transition-all duration-300 overflow-hidden ${openItems[item.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-4 md:px-5 pb-5 pt-0 text-[14.5px] text-[#6A6A6A] leading-relaxed">
                                                {item.isHtml ? (
                                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                                ) : (
                                                    <p>{item.answer}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Related Support Pages */}
                    <div className="flex flex-col mt-4">
                        <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] mb-6">
                            Related Support Pages
                        </h2>

                        <div className="w-full border border-[#e0f2fe] rounded-[8px] p-6 bg-white shadow-sm">
                            <h3 className="text-[14px] font-semibold font-weight-600 text-[#1a4494] mb-4">
                                Support pages
                            </h3>
                            <ul className="space-y-3 pl-1">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#00E5FF]"></div>
                                    <Link to="/contact" className="text-[14px] text-[#00E5FF] hover:underline font-medium">Contact Us</Link>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#00E5FF]"></div>
                                    <Link to="/shipping" className="text-[14px] text-[#00E5FF] hover:underline font-medium">Shipping Policy</Link>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#00E5FF]"></div>
                                    <Link to="/coa" className="text-[14px] text-[#00E5FF] hover:underline font-medium">COA & Lab Testing</Link>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#00E5FF]"></div>
                                    <Link to="/disclaimer" className="text-[14px] text-[#00E5FF] hover:underline font-medium">Research Use Disclaimer</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Faqs