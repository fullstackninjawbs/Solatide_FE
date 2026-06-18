import React from 'react'
import { Link } from 'react-router-dom'
import boxImage from '../../assets/images/Rectangle 4380.png'

const HowOrdersHandledSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[10%]">
                    
                    {/* Left image */}
                    <div className="w-full lg:w-[45%] shrink-0">
                        <div className="rounded-[20px] overflow-hidden shadow-sm border border-slate-100/30 bg-white">
                            <img src={boxImage} alt="Solatide Biosciences shipping box" className="w-full h-auto object-contain select-none" />
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="w-full lg:w-[45%] flex flex-col text-left justify-center">
                        <h2 className="text-[28px] md:text-[34px] font-bold text-[#1a4494] mb-4 font-anek leading-tight">
                            How Orders Are Handled
                        </h2>
                        
                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-4">
                            Orders are processed and dispatched from our dispatch facility. Tracking information is provided after dispatch is confirmed, and support is available via Telegram or email for order updates, documentation requests, and general enquiries.
                        </p>

                        <p className="text-[15px] text-[#4B5563] leading-[1.6] mb-5">
                            Research compounds are sensitive materials that require careful handling. We use secure laboratory packaging to protect vials during transit, with appropriate structural protection to maintain physical integrity from dispatch to delivery. Product images and vial photographs displayed on the website are representative only. Cosmetic packaging details such as cap colour, stopper colour, and label layout may vary by batch.
                        </p>

                        <p className="text-[14.5px] text-[#4B5563] leading-[1.6]">
                            For detailed shipping information, visit our <Link to="/shipping-policy" className="text-[#0AD6ED] font-semibold hover:underline">Shipping Policy</Link>.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HowOrdersHandledSection
