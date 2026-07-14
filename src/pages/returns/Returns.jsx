import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const sections = [
    { id: 'research', num: '01', title: 'Research Use Products' },
    { id: 'unpaid', num: '02', title: 'Automatic Order Cancellation for Unpaid Orders' },
    { id: 'no-returns', num: '03', title: 'No Returns Policy' },
    { id: 'change-of-mind', num: '04', title: 'Change of Mind' },
    { id: 'damaged', num: '05', title: 'Damaged or Incorrect Orders' },
    { id: 'import', num: '06', title: 'Import Regulations & Customs' },
    { id: 'carrier-delays', num: '07', title: 'Carrier Delays & Non-Delivery' },
    { id: 'refuse-orders', num: '08', title: 'Right to Refuse Orders' },
    { id: 'contact', num: '09', title: 'Contact Support' },
];

const Returns = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200; // offset for fixed header

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                if (section && section.offsetTop <= scrollPosition) {
                    if (activeSection !== sections[i].id) {
                        setActiveSection(sections[i].id);
                    }
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100, // offset for fixed header
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header section */}
            <section className="w-full py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Returns & Refunds
                    </h1>

                </div>
            </section>

            {/* Main Content Layout */}
            <div className="main-container px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                {/* Sidebar Navigation */}
                <div className="hidden lg:block w-[300px] shrink-0 sticky top-32 border border-slate-200 rounded-xl bg-white p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
                    <h3 className="text-[#214A9E] font-bold text-[15px] mb-6 pl-3">On this page</h3>
                    <ul className="space-y-1 relative">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    onClick={(e) => scrollToSection(e, section.id)}
                                    className={`flex items-start gap-3.5 py-2.5 px-3 rounded-lg text-[13.5px] transition-colors ${activeSection === section.id
                                        ? 'bg-[#e6effc] text-[#214A9E] font-bold'
                                        : 'text-slate-500 hover:text-[#214A9E] hover:bg-slate-50 font-medium'
                                        }`}
                                >
                                    <span className={`text-[11px] mt-1 shrink-0 ${activeSection === section.id ? 'opacity-100' : 'opacity-50'}`}>{section.num}</span>
                                    <span className="leading-tight">{section.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="space-y-16">
                        {/* Section 1: Research Use Products */}
                        <section id="research" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Research Use Products</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Due to the sensitive nature of lyophilised research compounds, Solatide Biosciences operates under strict quality control and chain-of-custody protocols. Please review our refund and returns policy below.</p>
                            </div>
                        </section>

                        {/* Section 2: Automatic Order Cancellation for Unpaid Orders */}
                        <section id="unpaid" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Automatic Order Cancellation for Unpaid Orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Orders placed using manual payment methods (PayID or bank transfer) must be paid within <strong>15 minutes</strong> of order placement. Unpaid orders are automatically cancelled and items returned to stock. No refund is required as payment was never processed.</p>
                            </div>
                        </section>

                        {/* Section 3: No Returns Policy */}
                        <section id="no-returns" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">No Returns Policy</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>For safety, quality, and contamination reasons, we cannot accept returns on any products once they have left our facility. We cannot verify temperature stability or environmental conditions after dispatch, so all sales of laboratory reagents are final.</p>
                            </div>
                        </section>

                        {/* Section 4: Change of Mind */}
                        <section id="change-of-mind" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Change of Mind</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We do not offer refunds for buyer's remorse or change of mind. Our products are specialized research compounds supplied strictly for in-vitro laboratory use.</p>
                            </div>
                        </section>

                        {/* Section 5: Damaged or Incorrect Orders */}
                        <section id="damaged" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Damaged or Incorrect Orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>If you receive a product that is physically damaged in transit (compromised vial integrity) or you receive the incorrect item, contact us within <strong>48 hours of delivery</strong>.</p>
                                <p>You must provide:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>Your order number</li>
                                    <li>Clear photographic evidence of the damaged product</li>
                                    <li>Clear photographic evidence of the shipping box</li>
                                </ul>
                                <p>Once verified, you will receive either a full replacement or full refund (your choice). Approved refunds are processed within 7-14 business days to the original payment method.</p>
                            </div>
                        </section>

                        {/* Section 6: Import Regulations & Customs */}
                        <section id="import" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Import Regulations & Customs</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>It is the buyer's sole responsibility to ensure that purchase and importation of research compounds comply with local, state, or national regulations.</p>
                                <p>Solatide Biosciences is not liable for, and will not issue refunds for:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>Orders delayed, seized, or destroyed by customs authorities</li>
                                    <li>Orders refused due to local import regulations</li>
                                    <li>Import duties, taxes, or fees imposed by your country</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 7: Carrier Delays & Non-Delivery */}
                        <section id="carrier-delays" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Carrier Delays & Non-Delivery</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>If your order does not arrive within the expected timeframe, contact our support team. While we are not liable for standard carrier delays or incorrect delivery addresses, we will investigate missing parcels with the courier on a case-by-case basis.</p>
                            </div>
                        </section>

                        {/* Section 8: Right to Refuse Orders */}
                        <section id="refuse-orders" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Right to Refuse Orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Solatide Biosciences reserves the right to refuse or cancel any order at our discretion. If we suspect an order is intended for human consumption, clinical use, or any purpose other than legitimate in-vitro laboratory research, the order will be immediately cancelled and fully refunded.</p>
                            </div>
                        </section>

                        {/* Section 9: Contact Support */}
                        <section id="contact" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Contact Support</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>For all order enquiries, <Link to="/contact" className="text-[#38bdf8] hover:underline cursor-pointer">contact our team</Link> via Telegram or email. Please have your order number ready for faster processing.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Returns;
