import React from 'react'
import exporleImage from '../../assets/images/exporleImage.png'
import RetatrutideMad from '../../assets/images/RetatrutideMad.png'
import CommonButton from '../../components/CommonBtn'

const ExploreProducts = () => {
    return (
        <section
            className="w-full bg-cover bg-center py-12 lg:py-16 text-left relative flex items-center min-h-[360px] md:min-h-[400px] overflow-hidden"
            style={{ backgroundImage: `url(${exporleImage})` }}
        >
            <div className="main-container relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
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
                <div className="hidden md:flex md:w-[35%] lg:w-[25%] items-center justify-center shrink-0 pr-4 lg:pr-12 animate-fade-in">
                    <img
                        src={RetatrutideMad}
                        alt="Retatrutide 10mg Vial"
                        className="h-[260px] lg:h-[300px] object-contain select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
                    />
                </div>
            </div>
        </section>
    )
}

export default ExploreProducts