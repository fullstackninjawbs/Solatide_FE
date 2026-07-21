import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../../services/api'

const Faqs = () => {
    const [faqData, setFaqData] = useState([])
    const [loading, setLoading] = useState(true)
    const [openItems, setOpenItems] = useState({})

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await apiService.getPublicFaqs();
                const data = await response.json();
                if (data?.success) {
                    setFaqData(data.data.faqSections);

                    // Optionally auto-open the first question of the first section
                    if (data.data.faqSections.length > 0 && data.data.faqSections[0].questions.length > 0) {
                        const firstQId = data.data.faqSections[0].questions[0]._id;
                        setOpenItems({ [firstQId]: true });
                    }
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center text-slate-400">
                Loading FAQs...
            </div>
        )
    }

    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full py-8 text-center border-b border-slate-100">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-bold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
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

                    {faqData.length > 0 && (
                        <div className="flex flex-col gap-8">
                            <div>
                                <p className="text-[14px] font-semibold font-weight-600 uppercase tracking-widest text-[#00E5FF] mb-4">
                                    GETTING STARTED
                                </p>
                                <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] mb-6">
                                    {faqData[0].name}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {faqData[0].questions.map((item) => (
                                        <div
                                            key={item._id}
                                            className={`border rounded-[8px] overflow-hidden transition-all duration-300 ${openItems[item._id] ? 'border-[#e0eaf5] bg-white shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleItem(item._id)}
                                                className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                                            >
                                                <span className={`text-[15px] font-semibold transition-colors ${openItems[item._id] ? 'text-[#1a4494]' : 'text-[#374151]'}`}>
                                                    {item.question}
                                                </span>
                                                <svg
                                                    className={`w-5 h-5 transition-transform duration-300 ${openItems[item._id] ? 'rotate-180 text-[#1a4494]' : 'text-slate-400'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <div className={`transition-all duration-300 overflow-hidden ${openItems[item._id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="whitespace-break-spaces px-4 md:px-5 pb-5 pt-0 text-[14.5px] text-[#6A6A6A] leading-relaxed">
                                                    {/* We assume admin might input HTML like <ul> etc. */}
                                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {faqData.slice(1).map((section, idx) => (
                        <div key={section._id || idx} className="flex flex-col">
                            <h2 className="text-[24px] font-semibold font-weight-600 text-[#214A9E] mb-6">
                                {section.name}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {section.questions.map((item) => (
                                    <div
                                        key={item._id}
                                        className={`border rounded-[8px] overflow-hidden transition-all duration-300 ${openItems[item._id] ? 'border-[#e0eaf5] bg-white shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleItem(item._id)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                                        >
                                            <span className={`text-[15px] font-semibold transition-colors ${openItems[item._id] ? 'text-[#1a4494]' : 'text-[#374151]'}`}>
                                                {item.question}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-300 ${openItems[item._id] ? 'rotate-180 text-[#1a4494]' : 'text-slate-400'}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <div className={`transition-all duration-300 overflow-hidden ${openItems[item._id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="whitespace-break-spaces px-4 md:px-5 pb-5 pt-0 text-[14.5px] text-[#6A6A6A] leading-relaxed">
                                                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
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
                                    <Link to="/shipping-policy" className="text-[14px] text-[#00E5FF] hover:underline font-medium">Shipping Policy</Link>
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