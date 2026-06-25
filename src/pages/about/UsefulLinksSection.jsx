import React from 'react'
import { Link } from 'react-router-dom'

const UsefulLinksSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-[800px] mx-auto w-full border border-[#daeeff] rounded-[12px] p-6 bg-[#f8fbff] shadow-sm text-left">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-4">
                        Useful Links
                    </h3>
                    <div className="flex flex-wrap items-center gap-[8px]">
                        <Link to="/coa" className="px-[14px] py-[5px] rounded-[20px] bg-[#EAF3FF] border border-[#c0d8f5] text-[13px] text-[#214A9E] font-medium hover:bg-[#214A9E] hover:text-white transition-colors duration-200">
                            COA & Lab Testing
                        </Link>
                        <Link to="/faq" className="px-[14px] py-[5px] rounded-[20px] bg-[#EAF3FF] border border-[#c0d8f5] text-[13px] text-[#214A9E] font-medium hover:bg-[#214A9E] hover:text-white transition-colors duration-200">
                            FAQ
                        </Link>
                        <Link to="/contact" className="px-[14px] py-[5px] rounded-[20px] bg-[#EAF3FF] border border-[#c0d8f5] text-[13px] text-[#214A9E] font-medium hover:bg-[#214A9E] hover:text-white transition-colors duration-200">
                            Contact Us
                        </Link>
                        <Link to="/shipping-policy" className="px-[14px] py-[5px] rounded-[20px] bg-[#EAF3FF] border border-[#c0d8f5] text-[13px] text-[#214A9E] font-medium hover:bg-[#214A9E] hover:text-white transition-colors duration-200">
                            Shipping Policy
                        </Link>
                        <Link to="/disclaimer" className="px-[14px] py-[5px] rounded-[20px] bg-[#EAF3FF] border border-[#c0d8f5] text-[13px] text-[#214A9E] font-medium hover:bg-[#214A9E] hover:text-white transition-colors duration-200">
                            Research Use Disclaimer
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UsefulLinksSection
