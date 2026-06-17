import React from 'react'
import { Link } from 'react-router-dom'

const ContactUs = () => {
    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full bg-[#F0F5FB] py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Contact Us
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        Get in touch with our team for inquiries, research support, or product-related questions. We're here to provide accurate information and assist with your research needs.
                    </p>
                </div>

            </section>
            <section className="w-full bg-white py-12">
                <div className="main-container mx-auto flex flex-col gap-8">
                    <div className="flex flex-col">
                        <p className="text-[14px] font-semibold font-weight-600 uppercase tracking-widest text-[#00E5FF] mb-4">
                            GETTING STARTED
                        </p>
                        <h2 className="text-[24px] font-semibold font-weight-600 md:text-[30px] text-[#214A9E] mb-6">
                            Compliance Notice
                        </h2>

                        <p className="text-[14px] text-[#6A6A6A] font-weight-500  mb-4 font-medium">
                            For strict legal and compliance reasons, we cannot provide
                        </p>

                        <ul className="list-disc pl-5 mb-6 space-y-2 text-[14px] text-[#6A6A6A] font-weight-500  mb-4 font-medium ">
                            <li>Dosing instructions or recommendations</li>
                            <li>Reconstitution protocols or mixing guidance</li>
                            <li>Administration methods or human-use information</li>
                            <li>Medical, therapeutic, or clinical advice</li>
                            <li>Information on use outside legitimate in-vitro research purposes</li>
                        </ul>

                        <p className="text-[14px] text-[#6A6A6A] font-weight-500  mb-4 font-medium">
                            All products are supplied strictly for research use only. For more information, please read our{' '}
                            <Link to="/disclaimer" className="text-[#00E5FF] hover:underline font-medium">
                                Research Use Disclaimer
                            </Link>.
                        </p>
                    </div>

                    <div className="flex flex-col mt-2">
                        <h2 className="text-[24px] font-semibold font-weight-600 md:text-[30px] text-[#214A9E] mb-6">
                            Before You Contact Us
                        </h2>

                        <div className="w-full border border-[#e0f2fe] rounded-[8px] p-6 bg-white shadow-sm">
                            <h3 className="text-[14px] font-semibold font-weight-600 text-[#1a4494] mb-3">
                                Read this contact us
                            </h3>
                            <p className="text-[14px] font-medium font-weight-500 text-[#6A6A6A]">
                                Many common questions are answered on our{' '}
                                <Link to="/faq" className="text-[#00E5FF] hover:underline font-medium">FAQ page</Link>.
                                You may also find helpful information on our{' '}
                                <Link to="/coa" className="text-[#00E5FF] hover:underline font-medium">COA & Lab Testing</Link> page or{' '}
                                <Link to="/shipping" className="text-[#00E5FF] hover:underline font-medium">Shipping Policy</Link> page.
                            </p>
                        </div>
                    </div>

                </div>
            </section>


        </div>


    )
}

export default ContactUs
