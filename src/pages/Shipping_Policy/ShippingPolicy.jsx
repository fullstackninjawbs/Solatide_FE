import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ShippingPolicy = () => {
    const [activeSection, setActiveSection] = useState('dispatch-tracking')

    const sections = [
        { id: 'dispatch-tracking', num: '01', title: 'Dispatch & Tracking' },
        { id: 'shipping-overview', num: '02', title: 'Shipping Overview' },
        { id: 'processing-dispatch', num: '03', title: 'Processing & Dispatch' },
        { id: 'delivery-timeframes', num: '04', title: 'Delivery Timeframes' },
        { id: 'payment-deadline', num: '05', title: 'Payment Deadline' },
        { id: 'packaging-standards', num: '06', title: 'Packaging Standards' },
        { id: 'order-tracking', num: '07', title: 'Order Tracking' },
        { id: 'customs-compliance', num: '08', title: 'Customs & Import Compliance' },
        { id: 'damaged-lost', num: '09', title: 'Damaged or Lost Parcels' },
        { id: 'undeliverable', num: '10', title: 'Undeliverable Orders' },
        { id: 'support-links', num: '11', title: 'Related Support Links' }
    ]

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('dispatch-tracking')
                return
            }

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
                setActiveSection(sections[sections.length - 1].id)
                return
            }

            for (const section of sections) {
                const el = document.getElementById(section.id)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top <= 220 && rect.bottom >= 220) {
                        setActiveSection(section.id)
                        break
                    }
                }
            }
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToId = (id) => {
        const el = document.getElementById(id)
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 120,
                behavior: 'smooth'
            })
            setActiveSection(id)
        }
    }

    return (
        <div className="w-full min-h-screen pb-20">
            {/* Header Banner */}
            <section className="w-full py-8 text-center border-b border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl sm:text-5xl font-semibold text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Shipping Policy
                    </h1>
                </div>
            </section>

            {/* Layout Wrapper */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Sticky Sidebar navigation */}
                    <aside className="hidden lg:block w-[320px] bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm shrink-0 sticky top-[90px] text-left">
                        <h3 className="text-[17px] font-semibold text-[#1E1E1E] mb-4 px-2">On this page</h3>
                        <nav className="space-y-1">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToId(sec.id)}
                                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[14.5px] transition-all ${activeSection === sec.id
                                        ? 'bg-[#F0F5FB] text-[#214A9E] font-semibold'
                                        : 'text-slate-600 hover:text-black hover:bg-slate-50 font-medium'
                                        }`}
                                >
                                    <span className={`text-[14px] shrink-0 w-5 ${activeSection === sec.id ? 'text-[#214A9E] font-bold' : 'text-[#94A3B8]'}`}>
                                        {sec.num}
                                    </span>
                                    <span className="flex-1 text-left whitespace-nowrap">{sec.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full space-y-6 text-left">

                        {/* Section 01: Dispatch & Tracking */}
                        <section id="dispatch-tracking" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Shipping Logistics
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Dispatch & Tracking
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    Orders are dispatched from <strong className="text-slate-800 font-semibold">Melbourne, VIC 3000, Australia</strong>. Orders are typically processed within 1-3 business days unless otherwise stated. Tracking information is provided after dispatch is confirmed.
                                </p>
                                <p>
                                    If there is a delay or issue with dispatch or delivery, contact support via Telegram or email for assistance.
                                </p>
                            </div>
                        </section>

                        {/* Section 02: Shipping Overview */}
                        <section id="shipping-overview" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Delivery Rates
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Shipping Overview
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    We offer <strong className="text-slate-800 font-semibold">free express shipping worldwide</strong> on all orders over $300 AUD. Orders under $300 AUD incur standard shipping charges calculated at checkout.
                                </p>
                            </div>
                        </section>

                        {/* Section 03: Processing & Dispatch */}
                        <section id="processing-dispatch" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Fulfillment Timeframes
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Processing & Dispatch
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    Orders are typically processed and dispatched within <strong className="text-slate-800 font-semibold">1-3 business days</strong> of payment confirmation. During peak periods or due to stock availability, processing may extend to 5-10 business days. You will receive tracking information via email once your order is dispatched.
                                </p>
                            </div>
                        </section>

                        {/* Section 04: Delivery Timeframes */}
                        <section id="delivery-timeframes" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Transit Duration
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Delivery Timeframes
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <ul className="list-disc pl-5 space-y-2 text-[#6A6A6A] font-medium">
                                    <li>
                                        <strong className="text-[#214A9E] font-semibold">Australia:</strong> 3-7 business days after dispatch
                                    </li>
                                    <li>
                                        <strong className="text-[#214A9E] font-semibold">International:</strong> 7-21 business days after dispatch (varies by location and customs processing)
                                    </li>
                                </ul>
                                <p className="text-sm text-slate-500 font-medium pt-1">
                                    Delivery times are estimates and may be affected by customs clearance, public holidays, carrier delays, weather events, or other circumstances beyond our control.
                                </p>
                            </div>
                        </section>

                        {/* Section 05: Payment Deadline */}
                        <section id="payment-deadline" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Inventory Allocation
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Payment Deadline
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    Orders placed using manual payment methods (PayID or bank transfer) must be paid within <strong className="text-slate-800 font-semibold">15 minutes</strong> of order placement. Unpaid orders are automatically cancelled and items returned to stock. This ensures fair inventory allocation for all customers.
                                </p>
                            </div>
                        </section>

                        {/* Section 06: Packaging Standards */}
                        <section id="packaging-standards" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Safe Transit Protocols
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Packaging Standards
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    All products are carefully packaged to ensure safe transit:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-[#6A6A6A] font-medium">
                                    <li>Secure, professional dispatch packaging</li>
                                    <li>Impact protection for glass vials during transport</li>
                                    <li>Tamper seals to prevent tampering or contamination</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 07: Order Tracking */}
                        <section id="order-tracking" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Shipment Monitoring
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Order Tracking
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    Once dispatched, you will receive an email with tracking information. Use this to monitor your shipment's progress. For order status questions, <Link to="/contact" className="text-[#00E5FF] font-semibold hover:underline">contact our team</Link>.
                                </p>
                            </div>
                        </section>

                        {/* Section 08: Customs & Import Compliance */}
                        <section id="customs-compliance" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Regulatory Guidelines
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Order Customs & Import Compliance
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <div className="text-[14.5px] leading-relaxed text-amber-900 mb-2">
                                    <span className="font-bold text-amber-950">Important:</span> It is the buyer's responsibility to ensure compliance with all local, state, federal, and international laws regarding import and possession of research compounds.
                                </div>
                                <p>
                                    Solatide Biosciences is not responsible for:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-[#6A6A6A] font-medium">
                                    <li>Customs delays or clearance issues</li>
                                    <li>Seizure or destruction of products by customs authorities</li>
                                    <li>Import duties, taxes, or fees imposed by your country</li>
                                    <li>Legal consequences arising from non-compliance with local regulations</li>
                                </ul>
                                <p>
                                    Review our <Link to="/disclaimer" className="text-[#00E5FF] font-semibold hover:underline">Research Use Disclaimer</Link> for more information about buyer responsibilities.
                                </p>
                            </div>
                        </section>

                        {/* Section 09: Damaged or Lost Parcels */}
                        <section id="damaged-lost" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Exceptions & Issues
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Damaged or Lost Parcels
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    If your order arrives damaged or does not arrive within the expected timeframe, refer to our <Link to="/returns" className="text-[#00E5FF] font-semibold hover:underline">Refunds & Returns Policy</Link>.
                                </p>
                                <p>
                                    For damaged items, contact us within 40 hours of delivery with your order number and clear photographic evidence of the damaged product and shipping box.
                                </p>
                            </div>
                        </section>

                        {/* Section 10: Undeliverable Orders */}
                        <section id="undeliverable" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Return to Sender
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Undeliverable Orders
                            </h2>
                            <div className="space-y-3 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    If a parcel is returned as undeliverable due to incorrect address information, refusal of delivery, or customs issues, we will contact you to arrange reshipment. Additional shipping fees apply for reshipment.
                                </p>
                            </div>
                        </section>

                        {/* Section 11: Related Support Links */}
                        <section id="support-links" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00E5FF] text-[15px] font-medium mb-1 block">
                                Quick Navigation
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Related Support Links
                            </h2>
                            <div className="text-[13px] leading-[1.7]">
                                <ul className="list-disc pl-5 space-y-2 text-[#6A6A6A] font-medium">
                                    <li>
                                        <Link to="/contact" className="text-[#00E5FF] hover:underline">Contact Us</Link>
                                    </li>
                                    <li>
                                        <Link to="/faq" className="text-[#00E5FF] hover:underline">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link to="/coa" className="text-[#00E5FF] hover:underline">COA & Lab Testing</Link>
                                    </li>
                                </ul>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy
