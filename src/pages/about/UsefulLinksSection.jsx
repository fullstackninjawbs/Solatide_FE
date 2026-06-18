import React from 'react'
import { Link } from 'react-router-dom'

const UsefulLinksSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full border border-[#e0f2fe] rounded-[16px] p-8 bg-white shadow-sm text-left">
                    <h3 className="text-[16px] font-bold text-[#1a4494] mb-5">
                        Useful Links
                    </h3>
                    <ul className="space-y-3 pl-1">
                        <li className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0AD6ED] shrink-0"></div>
                            <Link to="/coa" className="text-[14.5px] text-[#0AD6ED] hover:underline font-semibold">
                                COA & Lab Testing
                            </Link>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0AD6ED] shrink-0"></div>
                            <Link to="/faq" className="text-[14.5px] text-[#0AD6ED] hover:underline font-semibold">
                                FAQ
                            </Link>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0AD6ED] shrink-0"></div>
                            <Link to="/shipping" className="text-[14.5px] text-[#0AD6ED] hover:underline font-semibold">
                                Shipping Policy
                            </Link>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0AD6ED] shrink-0"></div>
                            <Link to="/contact" className="text-[14.5px] text-[#0AD6ED] hover:underline font-semibold">
                                Contact Us
                            </Link>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0AD6ED] shrink-0"></div>
                            <Link to="/research-resource" className="text-[14.5px] text-[#0AD6ED] hover:underline font-semibold">
                                Research Peptides Guide
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default UsefulLinksSection
