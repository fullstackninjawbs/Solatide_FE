import React from 'react'
import exporleImage from '../../assets/images/exporleImage.png'
import CommonButton from '../../components/CommonBtn'

const ExploreProducts = () => {
    return (
        <section
            className="w-full bg-cover bg-center py-20 lg:py-24 text-left relative flex items-center min-h-[360px] md:min-h-[400px]  overflow-hidden"
            style={{ backgroundImage: `url(${exporleImage})` }}
        >
            <div className="main-container relative z-10 w-full">
                <div className="max-w-xl flex flex-col items-start">
                    <h2 className="text-[32px] md:text-[40px] font-anek font-bold text-[#1D1D1F] leading-tight mb-4">
                        Confidence in Every Batch
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-[#2D3748] leading-[1.6] mb-8 max-w-[480px]">
                        Each product is presented with structured documentation, consistent standards, and clear research-use positioning, enabling confident sourcing.
                    </p>
                    <button className="h-[46px] rounded-lg px-[36px] py-[14px] inline-flex items-center justify-center gap-[9px] bg-gradient-to-r from-[#00ADEE] to-[#0079CE] text-white font-semibold text-[14px] leading-none transition-all duration-300 hover:opacity-90 shadow-md shadow-[#00ADEE]/10">
                        <span>Explore Products</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ExploreProducts