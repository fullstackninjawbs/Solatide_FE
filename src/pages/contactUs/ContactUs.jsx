import React from 'react'
import { Link } from 'react-router-dom'

const ContactUs = () => {
    return (
        <div className="w-full bg-white min-h-screen text-slate-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Header Banner */}
            <section className="w-full py-8 text-center border-b border-slate-100">
                <div className="main-container">
                    <h1 className="text-4xl sm:text-5xl font-semibold text-[#214A9E] leading-tight">
                        Contact Us
                    </h1>
                </div>
            </section>

            <div className="main-container mx-auto pt-12 pb-24 px-4 sm:px-6">

                {/* Support & Dispatch */}
                <div className="mb-12">
                    <h2 className="text-[26px] md:text-[30px] text-slate-500 mb-3 tracking-tight">Support & Dispatch</h2>
                    <p className="text-[14px] font-bold text-slate-700 mb-4 font-sans">Melbourne, VIC, Australia</p>
                    <p className="text-[14px] text-slate-500 leading-relaxed max-w-[850px] mb-6 font-sans">
                        We aim to respond within 24 business hours during business hours, Monday to Friday (AEST). We assist with order support, shipping updates, documentation requests, restock enquiries, and general questions.
                    </p>

                    <div className="bg-[#f8fafc] border-l-[3px] border-[#00bfef] p-6 rounded-r-lg">
                        <ul className="space-y-3 text-[14px] font-sans">
                            <li>
                                <strong className="text-slate-800 font-bold">Secure Telegram:</strong> <a href="https://t.me/solatidebioscienceschannel" target="_blank" rel="noopener noreferrer" className="text-[#0079CD] hover:underline">@solatidebiosciences (t.me/solatidebioscienceschannel)</a>
                            </li>
                            <li>
                                <strong className="text-slate-800 font-bold">Email:</strong> <a href="mailto:contact@solatidebiosciences.com.au" className="text-[#0079CD] hover:underline">contact@solatidebiosciences.com.au</a>
                            </li>
                            <li>
                                <strong className="text-slate-800 font-bold">Response Time:</strong> <span className="text-slate-600">Typically within 24 hours during business hours (Monday-Friday, AEST)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* What We Can Help With */}
                <div className="mb-12">
                    <h2 className="text-[26px] md:text-[30px] text-slate-500 mb-5 tracking-tight">What We Can Help With</h2>
                    <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-slate-600 font-bold font-sans">
                        <li>Order support and shipping updates</li>
                        <li>Product availability and restock enquiries</li>
                        <li>Batch documentation and COA requests</li>
                        <li>General questions about the Solatide catalogue</li>
                        <li>Bulk and general support enquiries</li>
                    </ul>
                </div>

                {/* Business Mailing Address */}
                <div className="mb-12">
                    <h2 className="text-[26px] md:text-[30px] text-slate-500 mb-5 tracking-tight">Business Mailing Address</h2>
                    <div className="bg-[#f8fafc] p-6 rounded-lg font-sans text-[14px] text-slate-600 space-y-4">
                        <p className="leading-relaxed">
                            <span className="font-semibold text-slate-700">Solatide Biosciences</span><br />
                            Suite 329/98-100 Elizabeth Street<br />
                            Melbourne VIC 3000<br />
                            Australia
                        </p>
                        <p>
                            Online store only. No public storefront, walk-in service, or customer collection is available.
                        </p>
                        <p>
                            Email: <a href="mailto:contact@solatidebiosciences.com.au" className="text-[#0079CD] hover:underline">contact@solatidebiosciences.com.au</a>
                        </p>
                    </div>
                </div>

                {/* Compliance Notice */}
                <div className="mb-12">
                    <h2 className="text-[26px] md:text-[30px] text-slate-500 mb-5 tracking-tight">Compliance Notice</h2>
                    <p className="text-[14px] text-slate-500 mb-4 font-sans">
                        For strict legal and compliance reasons, we <strong className="text-slate-700">cannot provide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-slate-500 mb-6 font-sans">
                        <li>Dosing instructions or recommendations</li>
                        <li>Reconstitution protocols or mixing guidance</li>
                        <li>Administration methods or human-use information</li>
                        <li>Medical, therapeutic, or clinical advice</li>
                        <li>Information on use outside legitimate in-vitro research purposes</li>
                    </ul>
                    <p className="text-[14px] text-slate-500 font-sans">
                        All products are supplied strictly for <strong className="text-slate-700">research use only</strong>. For more information, please read our <Link to="/disclaimer" className="text-[#00bfef] hover:underline">Research Use Disclaimer</Link>.
                    </p>
                </div>

                {/* Useful Links */}
                <div>
                    <h2 className="text-[26px] md:text-[30px] text-slate-500 mb-5 tracking-tight">Useful Links</h2>
                    <ul className="list-disc pl-5 space-y-1.5 text-[14px] font-sans text-[#00bfef]">
                        <li><Link to="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
                        <li><Link to="/coa" className="hover:underline">COA & Lab Testing</Link></li>
                        <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
                        <li><Link to="/disclaimer" className="hover:underline">Research Use Disclaimer</Link></li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default ContactUs
