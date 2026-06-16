import React from 'react'
import WhySolatideImage from '../../assets/images/WhySolatideImage.png'
import RetatrutideMad from '../../assets/images/RetatrutideMad.png'
import CommonButton from '../../components/CommonBtn'

const WhySolatide = () => {
    return (
        <section className="w-full bg-[#F5F8FC] py-16 md:py-24">
            <div className="main-container">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-8">
                    <div className="w-full lg:w-[35%] flex flex-col text-left">
                        <span className="text-[14px] font-semibold text-[#00ADEE] mb-2 block">Why Solatide</span>
                        <h2 className="text-[32px] md:text-[48px] lg:text-[54px] font-anek font-bold text-[#1D1D1F] leading-[1.15] tracking-[0px] mb-6">
                            Why Choose
                            <br />
                            <span className="text-[#1a4494]">Solatide</span>
                            <br />
                            Biosciences?
                        </h2>

                        <div className="space-y-4 text-[15px] text-[#4B5563] leading-[1.6] max-w-[500px]">
                            <p>
                                Solatide Biosciences focuses on delivering research compounds with clarity, consistency, and transparent documentation. Each product is supported by independent third-party analytical documentation.
                            </p>
                            <p>
                                Our approach is designed to simplify sourcing for research customers by maintaining clear standards, reliable global dispatch, and responsive support channels. Every step is aligned with a research-use-only framework, ensuring both compliance and confidence in product selection.
                            </p>
                        </div>

                        <div className="mt-8">
                            <CommonButton
                                title="Shop Now"
                                width="w-[165px]"
                                className="bg-[#00ADEE] bg-none hover:bg-[#0098d1]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-[28%] shrink-0">
                        <div className="rounded-[24px] rounded-br-[120px] overflow-hidden shadow-md aspect-[0.72] w-full h-full border border-white/40">
                            <img src={WhySolatideImage} alt="Scientists in lab" className="w-full h-full object-cover select-none" />
                        </div>
                    </div>

                    <div className="w-full lg:w-[28%] flex flex-col gap-8">
                        <div className="rounded-[20px] overflow-hidden shadow-sm border border-slate-100/30 aspect-[1.48] bg-white p-6 flex items-center justify-center">
                            <img src={RetatrutideMad} alt="Retatrutide 10mg Vial" className="max-h-full object-contain select-none" />
                        </div>

                        <ul className="flex flex-col gap-3 text-[14.5px] font-semibold text-[#0AD6ED]">
                            <li className="flex items-start gap-2">
                                <span className="text-[#0AD6ED] text-lg leading-none mt-[-1px]">•</span>
                                <a href="#" className="underline hover:text-[#008bdb] transition-colors">Third-party documentation where available</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0AD6ED] text-lg leading-none mt-[-1px]">•</span>
                                <a href="#" className="underline hover:text-[#008bdb] transition-colors">Reliable global dispatch</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0AD6ED] text-lg leading-none mt-[-1px]">•</span>
                                <a href="#" className="underline hover:text-[#008bdb] transition-colors">Fast international dispatch</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0AD6ED] text-lg leading-none mt-[-1px]">•</span>
                                <a href="#" className="underline hover:text-[#008bdb] transition-colors">Support via Telegram and email</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhySolatide